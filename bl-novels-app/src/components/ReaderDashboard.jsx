import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import StoryUploadTab from './StoryUploadTab';
import '../styles/ReaderDashboard.css';

export default function ReaderDashboard() {
  const { currentUser, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Upgrade request state
  const [upgradeForm, setUpgradeForm] = useState({
    platform_name: '',
    platform_link: '',
    proof_image_url: ''
  });
  const [upgradeRequests, setUpgradeRequests] = useState([]);

  // Fetch upgrade requests
  const fetchUpgradeRequests = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('account_upgrade_requests')
        .select('*')
        .eq('user_account_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUpgradeRequests(data || []);
    } catch (error) {
      console.error('Error fetching upgrade requests:', error);
    }
  };

  // Handle upgrade request submission
  const handleSubmitUpgradeRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!upgradeForm.platform_name || !upgradeForm.platform_link) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }

      const { data, error } = await supabase
        .from('account_upgrade_requests')
        .insert([{
          user_account_id: currentUser.id,
          platform_name: upgradeForm.platform_name,
          platform_link: upgradeForm.platform_link,
          proof_image_url: upgradeForm.proof_image_url,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      alert('Yêu cầu nâng cấp đã được gửi! Vui lòng chờ admin phê duyệt.');
      setUpgradeForm({
        platform_name: '',
        platform_link: '',
        proof_image_url: ''
      });
      fetchUpgradeRequests(currentUser.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch upgrade requests on mount
  useEffect(() => {
    if (currentUser) {
      fetchUpgradeRequests(currentUser.id);
    }
  }, [currentUser]);

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFB3D9';
      case 'approved':
        return '#C8E6C9';
      case 'rejected':
        return '#FFCCBB';
      default:
        return '#e0e0e0';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'approved':
        return 'Phê duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="reader-dashboard">
        <div className="reader-login">
          <h2>Vui lòng đăng nhập</h2>
          <p>Hãy sử dụng tab "Tài Khoản" để đăng nhập hoặc đăng ký tài khoản độc giả.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-dashboard">
      <div className="reader-header">
        <h2>Bảng Điều Khiển Độc Giả</h2>
        <div className="user-info">
          <span>Xin chào, {currentUser.username}!</span>
        </div>
      </div>

      <div className="reader-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Hồ Sơ
        </button>
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Tải Lên Truyện
        </button>
        <button
          className={`tab-btn ${activeTab === 'upgrade' ? 'active' : ''}`}
          onClick={() => setActiveTab('upgrade')}
        >
          ⬆️ Nâng Cấp Tài Khoản
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="profile-section">
          <h3>Thông Tin Tài Khoản</h3>
          <div className="profile-info">
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Tên Đăng Nhập:</strong> {currentUser.username}</p>
            <p><strong>Loại Tài Khoản:</strong> Độc Giả</p>
            <p><strong>Vai Trò:</strong> {currentUser.role === 'user' ? 'Người Dùng' : 'Dịch Giả'}</p>
            <p><strong>Trạng Thái:</strong> {currentUser.is_active ? 'Hoạt Động' : 'Không Hoạt Động'}</p>
          </div>

          <h3>Lịch Sử Yêu Cầu Nâng Cấp</h3>
          {upgradeRequests.length === 0 ? (
            <p className="no-data">Chưa có yêu cầu nâng cấp nào</p>
          ) : (
            <div className="upgrade-history">
              {upgradeRequests.map((request) => (
                <div key={request.id} className="upgrade-item">
                  <div className="upgrade-header">
                    <span className="platform">{request.platform_name}</span>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </div>
                  <p className="platform-link">
                    <a href={request.platform_link} target="_blank" rel="noopener noreferrer">
                      {request.platform_link}
                    </a>
                  </p>
                  {request.admin_notes && (
                    <p className="admin-notes"><strong>Ghi Chú Admin:</strong> {request.admin_notes}</p>
                  )}
                  <p className="date">
                    Gửi: {new Date(request.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <StoryUploadTab />
      )}

      {activeTab === 'upgrade' && (
        <div className="upgrade-section">
          <h3>Yêu Cầu Nâng Cấp Thành Dịch Giả</h3>
          <form onSubmit={handleSubmitUpgradeRequest}>
            <div className="form-group">
              <label>Nền Tảng Dịch Giả:</label>
              <input
                type="text"
                value={upgradeForm.platform_name}
                onChange={(e) => setUpgradeForm({ ...upgradeForm, platform_name: e.target.value })}
                placeholder="VD: Wattpad, AO3, etc."
                required
              />
            </div>
            <div className="form-group">
              <label>Liên Kết Nền Tảng:</label>
              <input
                type="url"
                value={upgradeForm.platform_link}
                onChange={(e) => setUpgradeForm({ ...upgradeForm, platform_link: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
            <div className="form-group">
              <label>Liên Kết Ảnh Chứng Minh (Tùy Chọn):</label>
              <input
                type="url"
                value={upgradeForm.proof_image_url}
                onChange={(e) => setUpgradeForm({ ...upgradeForm, proof_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

