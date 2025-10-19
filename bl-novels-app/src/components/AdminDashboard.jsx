import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [storyUploads, setStoryUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedUpgradeRequest, setSelectedUpgradeRequest] = useState(null);
  const [selectedStoryUpload, setSelectedStoryUpload] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [upgradeFilter, setUpgradeFilter] = useState('pending');
  const [storyUploadFilter, setStoryUploadFilter] = useState('pending');
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [upgradeNotes, setUpgradeNotes] = useState('');
  const [storyUploadNotes, setStoryUploadNotes] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('submissions');

  // Fetch data on mount
  useEffect(() => {
    if (currentUser) {
      fetchAllSubmissions();
      fetchUpgradeRequests();
      fetchStoryUploads();
    }
  }, [currentUser]);

  // Fetch all submissions
  const fetchAllSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('story_import_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Fetch upgrade requests
  const fetchUpgradeRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('account_upgrade_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUpgradeRequests(data || []);
    } catch (error) {
      console.error('Error fetching upgrade requests:', error);
    }
  };

  // Fetch story uploads from readers
  const fetchStoryUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('story_upload_requests')
        .select('*, user_accounts(username, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStoryUploads(data || []);
    } catch (error) {
      console.error('Error fetching story uploads:', error);
    }
  };

  // Handle upgrade request approval/rejection
  const handleUpgradeRequest = async (requestId, status) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('account_upgrade_requests')
        .update({
          status: status,
          reviewed_by: 1, // Admin ID (in production, use actual admin ID)
          reviewed_at: new Date(),
          admin_notes: upgradeNotes
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, update user role to translator
      if (status === 'approved') {
        const upgradeRequest = upgradeRequests.find(r => r.id === requestId);
        const { error: userError } = await supabase
          .from('user_accounts')
          .update({
            role: 'translator',
            user_type: 'translator'
          })
          .eq('id', upgradeRequest.user_account_id);

        if (userError) throw userError;
      }

      alert(`Yêu cầu đã được ${status === 'approved' ? 'phê duyệt' : 'từ chối'}!`);
      setUpgradeNotes('');
      setSelectedUpgradeRequest(null);
      fetchUpgradeRequests();
    } catch (error) {
      console.error('Error handling upgrade request:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update submission status
  const updateSubmissionStatus = async (submissionId, newStatus) => {
    setLoading(true);
    try {
      // Get old status
      const submission = submissions.find(s => s.id === submissionId);
      const oldStatus = submission.status;

      // Update status
      const { error: updateError } = await supabase
        .from('story_import_requests')
        .update({ status: newStatus, updated_at: new Date() })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Record status change
      const { error: historyError } = await supabase
        .from('story_status_history')
        .insert([{
          story_import_id: submissionId,
          old_status: oldStatus,
          new_status: newStatus,
          reason: statusChangeReason
        }]);

      if (historyError) throw historyError;

      alert('Cập nhật trạng thái thành công!');
      setStatusChangeReason('');
      setSelectedSubmission(null);
      fetchAllSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Approve and create work
  const approveAndCreateWork = async (submission) => {
    setLoading(true);
    try {
      // First, find or create author
      let { data: authorData, error: authorError } = await supabase
        .from('authors')
        .select('id')
        .eq('name', submission.author_name)
        .single();

      if (authorError && authorError.code === 'PGRST116') {
        // Author doesn't exist, create it
        const { data: newAuthor, error: createError } = await supabase
          .from('authors')
          .insert([{ name: submission.author_name }])
          .select()
          .single();

        if (createError) throw createError;
        authorData = newAuthor;
      } else if (authorError) {
        throw authorError;
      }

      // Create work
      const { data: workData, error: workError } = await supabase
        .from('works')
        .insert([{
          title: submission.title,
          author_id: authorData.id,
          summary: submission.summary,
          background: submission.background,
          status: 'ongoing'
        }])
        .select()
        .single();

      if (workError) throw workError;

      // Update submission status to completed
      await updateSubmissionStatus(submission.id, 'completed');
      alert('Truyện đã được thêm vào hệ thống!');
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle story upload approval/rejection
  const handleStoryUpload = async (uploadId, status) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('story_upload_requests')
        .update({
          status: status,
          admin_notes: storyUploadNotes
        })
        .eq('id', uploadId);

      if (updateError) throw updateError;

      alert(`Yêu cầu tải lên đã được ${status === 'approved' ? 'phê duyệt' : 'từ chối'}!`);
      setStoryUploadNotes('');
      setSelectedStoryUpload(null);
      fetchStoryUploads();
    } catch (error) {
      console.error('Error handling story upload:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'incoming':
        return 'Chờ xử lý';
      case 'process':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'incoming':
        return '#FFB3D9';
      case 'process':
        return '#B3E5FC';
      case 'completed':
        return '#C8E6C9';
      case 'rejected':
        return '#FFCCBB';
      default:
        return '#e0e0e0';
    }
  };

  // Filter submissions
  const filteredSubmissions = statusFilter === 'all'
    ? submissions
    : submissions.filter(s => s.status === statusFilter);

  // Filter story uploads
  const filteredStoryUploads = storyUploadFilter === 'all'
    ? storyUploads
    : storyUploads.filter(s => s.status === storyUploadFilter);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Bảng Điều Khiển Admin</h2>
        <p>Xin chào, {currentUser?.username}!</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeAdminTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('submissions')}
        >
          📤 Yêu Cầu Gửi Truyện
        </button>
        <button
          className={`admin-tab-btn ${activeAdminTab === 'story-uploads' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('story-uploads')}
        >
          📚 Tải Lên Truyện Từ Độc Giả
        </button>
        <button
          className={`admin-tab-btn ${activeAdminTab === 'upgrades' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('upgrades')}
        >
          ⬆️ Yêu Cầu Nâng Cấp
        </button>
      </div>

      {activeAdminTab === 'submissions' && (
        <>
          <div className="admin-filters">
            <label>Lọc theo trạng thái:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="incoming">Chờ xử lý</option>
              <option value="process">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          {loading && <p className="loading">Đang tải...</p>}

          <div className="submissions-table">
            <table>
              <thead>
                <tr>
                  <th>Tên Truyện</th>
                  <th>Tác Giả</th>
                  <th>Dịch Giả</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Gửi</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.title}</td>
                    <td>{submission.author_name}</td>
                    <td>{submission.translator_name || 'N/A'}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(submission.status) }}
                      >
                        {getStatusLabel(submission.status)}
                      </span>
                    </td>
                    <td>{new Date(submission.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="action-btn"
                      >
                        Chi Tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedSubmission && (
            <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{selectedSubmission.title}</h3>
                <div className="modal-body">
                  <p><strong>Tác Giả:</strong> {selectedSubmission.author_name}</p>
                  <p><strong>Thể Loại:</strong> {selectedSubmission.main_genre}</p>
                  <p><strong>Nền Tảng:</strong> {selectedSubmission.source_platform}</p>
                  <p><strong>Liên Kết:</strong> <a href={selectedSubmission.source_url} target="_blank" rel="noopener noreferrer">{selectedSubmission.source_url}</a></p>
                  <p><strong>Tóm Tắt:</strong></p>
                  <p className="summary">{selectedSubmission.summary}</p>
                  <p><strong>Nền Tảng Truyện:</strong></p>
                  <p className="summary">{selectedSubmission.background}</p>
                </div>

                <div className="modal-actions">
                  <div className="status-change">
                    <label>Thay Đổi Trạng Thái:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          updateSubmissionStatus(selectedSubmission.id, e.target.value);
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">-- Chọn trạng thái --</option>
                      <option value="incoming">Chờ xử lý</option>
                      <option value="process">Đang xử lý</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>

                  <div className="reason-input">
                    <label>Lý Do (tùy chọn):</label>
                    <textarea
                      value={statusChangeReason}
                      onChange={(e) => setStatusChangeReason(e.target.value)}
                      placeholder="Nhập lý do thay đổi trạng thái"
                      rows="3"
                    />
                  </div>

                  {selectedSubmission.status === 'process' && (
                    <button
                      onClick={() => approveAndCreateWork(selectedSubmission)}
                      className="approve-btn"
                      disabled={loading}
                    >
                      ✓ Phê Duyệt & Thêm Vào Hệ Thống
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="close-btn"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeAdminTab === 'upgrades' && (
        <div className="upgrades-section">
        <div className="upgrade-filters">
          <label>Lọc theo trạng thái:</label>
          <select value={upgradeFilter} onChange={(e) => setUpgradeFilter(e.target.value)}>
            <option value="pending">Chờ xử lý</option>
            <option value="approved">Phê duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="all">Tất cả</option>
          </select>
        </div>

        {loading && <p className="loading">Đang tải...</p>}

        <div className="upgrades-table">
          <table>
            <thead>
              <tr>
                <th>Tên Đăng Nhập</th>
                <th>Email</th>
                <th>Nền Tảng</th>
                <th>Trạng Thái</th>
                <th>Ngày Gửi</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {(upgradeFilter === 'all' ? upgradeRequests : upgradeRequests.filter(r => r.status === upgradeFilter)).map((request) => (
                <tr key={request.id}>
                  <td>{request.user_account_id}</td>
                  <td>{request.platform_name}</td>
                  <td>{request.platform_link}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </td>
                  <td>{new Date(request.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button
                      onClick={() => setSelectedUpgradeRequest(request)}
                      className="action-btn"
                    >
                      Chi Tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUpgradeRequest && (
          <div className="modal-overlay" onClick={() => setSelectedUpgradeRequest(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Yêu Cầu Nâng Cấp</h3>
              <div className="modal-body">
                <p><strong>Nền Tảng:</strong> {selectedUpgradeRequest.platform_name}</p>
                <p><strong>Liên Kết:</strong> <a href={selectedUpgradeRequest.platform_link} target="_blank" rel="noopener noreferrer">{selectedUpgradeRequest.platform_link}</a></p>
                {selectedUpgradeRequest.proof_image_url && (
                  <p><strong>Ảnh Chứng Minh:</strong> <a href={selectedUpgradeRequest.proof_image_url} target="_blank" rel="noopener noreferrer">Xem ảnh</a></p>
                )}
                <p><strong>Trạng Thái:</strong> {getStatusLabel(selectedUpgradeRequest.status)}</p>
              </div>

              <div className="modal-actions">
                <div className="reason-input">
                  <label>Ghi Chú Admin:</label>
                  <textarea
                    value={upgradeNotes}
                    onChange={(e) => setUpgradeNotes(e.target.value)}
                    placeholder="Nhập ghi chú (tùy chọn)"
                    rows="3"
                  />
                </div>

                {selectedUpgradeRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpgradeRequest(selectedUpgradeRequest.id, 'approved')}
                      className="approve-btn"
                      disabled={loading}
                    >
                      ✓ Phê Duyệt
                    </button>
                    <button
                      onClick={() => handleUpgradeRequest(selectedUpgradeRequest.id, 'rejected')}
                      className="reject-btn"
                      disabled={loading}
                    >
                      ✗ Từ Chối
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedUpgradeRequest(null)}
                  className="close-btn"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {activeAdminTab === 'story-uploads' && (
        <div className="story-uploads-section">
          <div className="admin-filters">
            <label>Lọc theo trạng thái:</label>
            <select value={storyUploadFilter} onChange={(e) => setStoryUploadFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="approved">Phê duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          {loading && <p className="loading">Đang tải...</p>}

          <div className="uploads-table">
            <table>
              <thead>
                <tr>
                  <th>Tiêu Đề</th>
                  <th>Tác Giả</th>
                  <th>Độc Giả</th>
                  <th>Thể Loại</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Tải Lên</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredStoryUploads.map((upload) => (
                  <tr key={upload.id}>
                    <td>{upload.title}</td>
                    <td>{upload.author_name}</td>
                    <td>{upload.user_accounts?.username || 'N/A'}</td>
                    <td>{upload.main_genre || 'Chưa xác định'}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: upload.status === 'pending' ? '#FFB3D9' : upload.status === 'approved' ? '#C8E6C9' : '#FFCCBB' }}
                      >
                        {upload.status === 'pending' ? 'Chờ xử lý' : upload.status === 'approved' ? 'Phê duyệt' : 'Từ chối'}
                      </span>
                    </td>
                    <td>{new Date(upload.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button
                        onClick={() => setSelectedStoryUpload(upload)}
                        className="action-btn"
                      >
                        Chi Tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedStoryUpload && (
            <div className="modal-overlay" onClick={() => setSelectedStoryUpload(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Chi Tiết Tải Lên Truyện</h3>
                <div className="modal-body">
                  <p><strong>Tiêu Đề:</strong> {selectedStoryUpload.title}</p>
                  <p><strong>Tác Giả:</strong> {selectedStoryUpload.author_name}</p>
                  <p><strong>Độc Giả:</strong> {selectedStoryUpload.user_accounts?.username} ({selectedStoryUpload.user_accounts?.email})</p>
                  <p><strong>Thể Loại:</strong> {selectedStoryUpload.main_genre || 'Chưa xác định'}</p>
                  <p><strong>Tóm Tắt:</strong> {selectedStoryUpload.summary || 'Không có'}</p>
                  <p><strong>Bối Cảnh:</strong> {selectedStoryUpload.background || 'Không có'}</p>
                  <p><strong>Nền Tảng Nguồn:</strong> {selectedStoryUpload.source_platform || 'Không có'}</p>
                  {selectedStoryUpload.source_url && (
                    <p><strong>URL Nguồn:</strong> <a href={selectedStoryUpload.source_url} target="_blank" rel="noopener noreferrer">{selectedStoryUpload.source_url}</a></p>
                  )}
                  <p><strong>Trạng Thái:</strong> {selectedStoryUpload.status === 'pending' ? 'Chờ xử lý' : selectedStoryUpload.status === 'approved' ? 'Phê duyệt' : 'Từ chối'}</p>
                </div>

                <div className="modal-actions">
                  <div className="reason-input">
                    <label>Ghi Chú Admin:</label>
                    <textarea
                      value={storyUploadNotes}
                      onChange={(e) => setStoryUploadNotes(e.target.value)}
                      placeholder="Nhập ghi chú (tùy chọn)"
                      rows="3"
                    />
                  </div>

                  {selectedStoryUpload.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStoryUpload(selectedStoryUpload.id, 'approved')}
                        className="approve-btn"
                        disabled={loading}
                      >
                        ✓ Phê Duyệt
                      </button>
                      <button
                        onClick={() => handleStoryUpload(selectedStoryUpload.id, 'rejected')}
                        className="reject-btn"
                        disabled={loading}
                      >
                        ✗ Từ Chối
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setSelectedStoryUpload(null)}
                    className="close-btn"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

