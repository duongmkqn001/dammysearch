import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { formatTitle, formatAuthor, formatGenre, formatTag, formatContext } from '../utils/textFormatter';
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
  const [isEditingStoryUpload, setIsEditingStoryUpload] = useState(false);
  const [editedStoryUpload, setEditedStoryUpload] = useState(null);
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isEditingWork, setIsEditingWork] = useState(false);
  const [editedWork, setEditedWork] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    if (currentUser) {
      fetchAllSubmissions();
      fetchUpgradeRequests();
      fetchStoryUploads();
      fetchWorks();

      // Clean up old approved requests (older than 1 week)
      cleanupOldApprovedRequests();
    }
  }, [currentUser]);

  // Clean up old approved requests (older than 1 week)
  const cleanupOldApprovedRequests = async () => {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Delete old approved story upload requests
      const { error: uploadError } = await supabase
        .from('story_upload_requests')
        .delete()
        .eq('status', 'approved')
        .lt('updated_at', oneWeekAgo);

      if (uploadError) console.error('Error cleaning up story uploads:', uploadError);

      // Delete old approved upgrade requests
      const { error: upgradeError } = await supabase
        .from('account_upgrade_requests')
        .delete()
        .eq('status', 'approved')
        .lt('updated_at', oneWeekAgo);

      if (upgradeError) console.error('Error cleaning up upgrade requests:', upgradeError);

      // Delete old rejected requests (older than 1 week)
      const { error: rejectedUploadError } = await supabase
        .from('story_upload_requests')
        .delete()
        .eq('status', 'rejected')
        .lt('updated_at', oneWeekAgo);

      if (rejectedUploadError) console.error('Error cleaning up rejected uploads:', rejectedUploadError);

      const { error: rejectedUpgradeError } = await supabase
        .from('account_upgrade_requests')
        .delete()
        .eq('status', 'rejected')
        .lt('updated_at', oneWeekAgo);

      if (rejectedUpgradeError) console.error('Error cleaning up rejected upgrades:', rejectedUpgradeError);
    } catch (error) {
      console.error('Error in cleanup:', error);
    }
  };

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
        .select('*, user_accounts(username, email)')
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

  // Fetch all works for editing
  const fetchWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*, authors(name), genres(name)')
        .order('title', { ascending: true });

      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  };

  // Handle work status update
  const handleUpdateWorkStatus = async (workId, newStatus) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('works')
        .update({ status: newStatus })
        .eq('id', workId);

      if (error) throw error;
      alert('Cập nhật trạng thái thành công!');
      fetchWorks();
      setSelectedWork(null);
    } catch (error) {
      console.error('Error updating work status:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
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
      // Format author name
      const formattedAuthorName = formatAuthor(submission.author_name);

      // First, find or create author
      let { data: authorData, error: authorError } = await supabase
        .from('authors')
        .select('id')
        .eq('name', formattedAuthorName)
        .single();

      if (authorError && authorError.code === 'PGRST116') {
        // Author doesn't exist, create it
        const { data: newAuthor, error: createError } = await supabase
          .from('authors')
          .insert([{ name: formattedAuthorName }])
          .select()
          .single();

        if (createError) throw createError;
        authorData = newAuthor;
      } else if (authorError) {
        throw authorError;
      }

      // Create work with formatted fields
      const { data: workData, error: workError } = await supabase
        .from('works')
        .insert([{
          title: formatTitle(submission.title),
          author_id: authorData.id,
          summary: formatContext(submission.summary),
          background: formatContext(submission.background),
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

  // Save edited story upload
  const saveEditedStoryUpload = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('story_upload_requests')
        .update({
          title: editedStoryUpload.title,
          author_name: editedStoryUpload.author_name,
          summary: editedStoryUpload.summary,
          background: editedStoryUpload.background,
          main_genre: editedStoryUpload.main_genre,
          translator_editor_name: editedStoryUpload.translator_editor_name,
          is_translator_editor: editedStoryUpload.is_translator_editor,
          source_url: editedStoryUpload.source_url,
          source_platform: editedStoryUpload.source_platform
        })
        .eq('id', editedStoryUpload.id);

      if (error) throw error;

      alert('Cập nhật thành công!');
      setIsEditingStoryUpload(false);
      setEditedStoryUpload(null);
      setSelectedStoryUpload(null);
      fetchStoryUploads();
    } catch (error) {
      console.error('Error saving story upload:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle story upload approval/rejection
  const handleStoryUpload = async (uploadId, status) => {
    setLoading(true);
    try {
      const storyUpload = storyUploads.find(s => s.id === uploadId);

      // If approved, import the story into the main database
      if (status === 'approved') {
        // Format author name
        const formattedAuthorName = formatAuthor(storyUpload.author_name);

        // Find or create author
        let { data: authorData, error: authorError } = await supabase
          .from('authors')
          .select('id')
          .eq('name', formattedAuthorName)
          .single();

        if (authorError && authorError.code === 'PGRST116') {
          // Author doesn't exist, create it
          const { data: newAuthor, error: createError } = await supabase
            .from('authors')
            .insert([{ name: formattedAuthorName }])
            .select()
            .single();

          if (createError) throw createError;
          authorData = newAuthor;
        } else if (authorError) {
          throw authorError;
        }

        // Format and find or create genre
        const formattedGenre = formatGenre(storyUpload.main_genre);
        let { data: genreData, error: genreError } = await supabase
          .from('genres')
          .select('id')
          .eq('name', formattedGenre)
          .single();

        if (genreError && genreError.code === 'PGRST116') {
          // Genre doesn't exist, create it
          const { data: newGenre, error: createError } = await supabase
            .from('genres')
            .insert([{ name: formattedGenre }])
            .select()
            .single();

          if (createError) throw createError;
          genreData = newGenre;
        } else if (genreError) {
          throw genreError;
        }

        // Create work with formatted fields
        const { data: workData, error: workError } = await supabase
          .from('works')
          .insert([{
            title: formatTitle(storyUpload.title),
            author_id: authorData.id,
            summary: formatContext(storyUpload.summary),
            background: formatContext(storyUpload.background),
            status: 'ongoing'
          }])
          .select()
          .single();

        if (workError) throw workError;

        // Insert tags if any - format each tag
        if (storyUpload.tags && storyUpload.tags.length > 0) {
          const tagsData = storyUpload.tags.map(tag => ({
            work_id: workData.id,
            tag_name: formatTag(tag)
          }));

          const { error: tagsError } = await supabase
            .from('work_tags')
            .insert(tagsData);

          if (tagsError) console.error('Error inserting tags:', tagsError);
        }
      }

      // Update story upload request status
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
        <button
          className={`admin-tab-btn ${activeAdminTab === 'works' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('works')}
        >
          📖 Quản Lý Truyện
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
                  <p><strong>Dịch Giả:</strong> {selectedSubmission.translator_name || 'N/A'}</p>
                  <p><strong>Số Chương:</strong> {selectedSubmission.chapter_count || 0}</p>
                  <p><strong>Nền Tảng:</strong> {selectedSubmission.source_platform}</p>
                  <p><strong>Liên Kết:</strong> <a href={selectedSubmission.source_url} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-color)', textDecoration: 'underline'}}>{selectedSubmission.source_url}</a></p>
                  <p><strong>Tóm Tắt:</strong></p>
                  <p className="summary" style={{whiteSpace: 'pre-wrap'}}>{selectedSubmission.summary}</p>
                  <p><strong>Nền Tảng Truyện:</strong></p>
                  <p className="summary" style={{whiteSpace: 'pre-wrap'}}>{selectedSubmission.background}</p>
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
                  <td>{request.user_accounts?.username || 'N/A'}</td>
                  <td>{request.user_accounts?.email || 'N/A'}</td>
                  <td>{request.platform_name || 'N/A'}</td>
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
                <p><strong>Tên Đăng Nhập:</strong> {selectedUpgradeRequest.user_accounts?.username || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedUpgradeRequest.user_accounts?.email || 'N/A'}</p>
                <p><strong>Nền Tảng:</strong> {selectedUpgradeRequest.platform_name || 'N/A'}</p>
                <p><strong>Liên Kết:</strong> {selectedUpgradeRequest.platform_link ? <a href={selectedUpgradeRequest.platform_link} target="_blank" rel="noopener noreferrer">{selectedUpgradeRequest.platform_link}</a> : 'N/A'}</p>
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
            <div className="modal-overlay" onClick={() => {
              setSelectedStoryUpload(null);
              setIsEditingStoryUpload(false);
              setEditedStoryUpload(null);
            }}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Chi Tiết Tải Lên Truyện</h3>
                <div className="modal-body">
                  {isEditingStoryUpload ? (
                    <>
                      <div className="form-group">
                        <label>Tiêu Đề:</label>
                        <input
                          type="text"
                          value={editedStoryUpload.title}
                          onChange={(e) => setEditedStoryUpload({...editedStoryUpload, title: e.target.value})}
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label>Tác Giả:</label>
                        <input
                          type="text"
                          value={editedStoryUpload.author_name}
                          onChange={(e) => setEditedStoryUpload({...editedStoryUpload, author_name: e.target.value})}
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label>Thể Loại:</label>
                        <input
                          type="text"
                          value={editedStoryUpload.main_genre || ''}
                          onChange={(e) => setEditedStoryUpload({...editedStoryUpload, main_genre: e.target.value})}
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label>Tóm Tắt:</label>
                        <textarea
                          value={editedStoryUpload.summary || ''}
                          onChange={(e) => setEditedStoryUpload({...editedStoryUpload, summary: e.target.value})}
                          disabled={loading}
                          rows="3"
                        />
                      </div>
                      <div className="form-group">
                        <label>Bối Cảnh:</label>
                        <textarea
                          value={editedStoryUpload.background || ''}
                          onChange={(e) => setEditedStoryUpload({...editedStoryUpload, background: e.target.value})}
                          disabled={loading}
                          rows="3"
                        />
                      </div>
                      <div className="form-group">
                        <label>Nền Tảng Nguồn:</label>
                        <input
                          type="text"
                          value={editedStoryUpload.source_platform || ''}
                          onChange={(e) => setEditedStoryUpload({...editedStoryUpload, source_platform: e.target.value})}
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label>URL Nguồn:</label>
                        <input
                          type="url"
                          value={editedStoryUpload.source_url || ''}
                          onChange={(e) => setEditedStoryUpload({...editedStoryUpload, source_url: e.target.value})}
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={editedStoryUpload.is_translator_editor || false}
                            onChange={(e) => setEditedStoryUpload({...editedStoryUpload, is_translator_editor: e.target.checked})}
                            disabled={loading}
                          />
                          Là dịch giả/biên tập viên
                        </label>
                      </div>
                      {editedStoryUpload.is_translator_editor && (
                        <div className="form-group">
                          <label>Tên Dịch Giả/Biên Tập Viên:</label>
                          <input
                            type="text"
                            value={editedStoryUpload.translator_editor_name || ''}
                            onChange={(e) => setEditedStoryUpload({...editedStoryUpload, translator_editor_name: e.target.value})}
                            disabled={loading}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
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
                      {selectedStoryUpload.is_translator_editor && (
                        <p><strong>Dịch Giả/Biên Tập Viên:</strong> {selectedStoryUpload.translator_editor_name || 'N/A'}</p>
                      )}
                      <p><strong>Trạng Thái:</strong> {selectedStoryUpload.status === 'pending' ? 'Chờ xử lý' : selectedStoryUpload.status === 'approved' ? 'Phê duyệt' : 'Từ chối'}</p>
                    </>
                  )}
                </div>

                <div className="modal-actions">
                  {!isEditingStoryUpload && (
                    <div className="reason-input">
                      <label>Ghi Chú Admin:</label>
                      <textarea
                        value={storyUploadNotes}
                        onChange={(e) => setStoryUploadNotes(e.target.value)}
                        placeholder="Nhập ghi chú (tùy chọn)"
                        rows="3"
                      />
                    </div>
                  )}

                  {isEditingStoryUpload ? (
                    <>
                      <button
                        onClick={saveEditedStoryUpload}
                        className="approve-btn"
                        disabled={loading}
                      >
                        💾 Lưu Thay Đổi
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingStoryUpload(false);
                          setEditedStoryUpload(null);
                        }}
                        className="close-btn"
                        disabled={loading}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      {selectedStoryUpload.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setIsEditingStoryUpload(true);
                              setEditedStoryUpload({...selectedStoryUpload});
                            }}
                            className="edit-btn"
                            disabled={loading}
                          >
                            ✏️ Chỉnh Sửa
                          </button>
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
                        onClick={() => {
                          setSelectedStoryUpload(null);
                          setIsEditingStoryUpload(false);
                          setEditedStoryUpload(null);
                        }}
                        className="close-btn"
                      >
                        Đóng
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeAdminTab === 'works' && (
        <div className="works-section">
          <h3>Quản Lý Truyện</h3>
          <p className="section-info">Chỉnh sửa thông tin truyện trong hệ thống</p>

          {loading && <p className="loading">Đang tải...</p>}

          <div className="works-table">
            <table>
              <thead>
                <tr>
                  <th>Tiêu Đề</th>
                  <th>Tác Giả</th>
                  <th>Thể Loại</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {works.map((work) => (
                  <tr key={work.id}>
                    <td>{work.title}</td>
                    <td>{work.authors?.name || 'N/A'}</td>
                    <td>{work.genres?.name || 'N/A'}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: work.status === 'ongoing' ? '#B3E5FC' : work.status === 'completed' ? '#C8E6C9' : '#FFCCBB'
                        }}
                      >
                        {work.status === 'ongoing' ? '🔄 Đang tiến hành' : work.status === 'completed' ? '✅ Hoàn thành' : '⏸️ Tạm dừng'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedWork(work)}
                        className="action-btn"
                      >
                        Chỉnh Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedWork && (
            <div className="modal-overlay" onClick={() => setSelectedWork(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Chỉnh Sửa Truyện</h3>
                <div className="modal-body">
                  <p><strong>Tiêu Đề:</strong> {selectedWork.title}</p>
                  <p><strong>Tác Giả:</strong> {selectedWork.authors?.name || 'N/A'}</p>
                  <p><strong>Thể Loại:</strong> {selectedWork.genres?.name || 'N/A'}</p>
                  <p><strong>Trạng Thái Hiện Tại:</strong> {selectedWork.status === 'ongoing' ? '🔄 Đang tiến hành' : selectedWork.status === 'completed' ? '✅ Hoàn thành' : '⏸️ Tạm dừng'}</p>

                  <div className="form-group">
                    <label>Thay Đổi Trạng Thái:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleUpdateWorkStatus(selectedWork.id, e.target.value);
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">-- Chọn trạng thái mới --</option>
                      <option value="ongoing">🔄 Đang tiến hành</option>
                      <option value="completed">✅ Hoàn thành</option>
                      <option value="hiatus">⏸️ Tạm dừng</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={() => setSelectedWork(null)}
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

