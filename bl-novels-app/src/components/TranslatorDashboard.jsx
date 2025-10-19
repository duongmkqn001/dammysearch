import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/TranslatorDashboard.css';

export default function TranslatorDashboard() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Login/Register state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // Story import state
  const [storyForm, setStoryForm] = useState({
    title: '',
    author_name: '',
    summary: '',
    background: '',
    main_genre: '',
    source_url: '',
    source_platform: 'Wattpad'
  });

  // Handle login/register
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        // Register new translator account
        const { data, error } = await supabase
          .from('translator_accounts')
          .insert([{
            email,
            username,
            password_hash: btoa(password), // Simple encoding (use bcrypt in production)
            is_active: true
          }])
          .select();

        if (error) throw error;
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsRegister(false);
        setEmail('');
        setPassword('');
        setUsername('');
      } else {
        // Login
        const { data, error } = await supabase
          .from('translator_accounts')
          .select('*')
          .eq('email', email)
          .eq('password_hash', btoa(password))
          .single();

        if (error || !data) throw new Error('Email hoặc mật khẩu không đúng');

        setCurrentUser(data);
        setIsLoggedIn(true);
        setActiveTab('submissions');
        fetchSubmissions(data.id);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user submissions
  const fetchSubmissions = async (translatorId) => {
    try {
      const { data, error } = await supabase
        .from('story_import_requests')
        .select('*')
        .eq('translator_id', translatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  // Handle story submission
  const handleSubmitStory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('story_import_requests')
        .insert([{
          ...storyForm,
          translator_id: currentUser.id,
          translator_name: currentUser.username,
          status: 'incoming'
        }])
        .select();

      if (error) throw error;

      alert('Gửi truyện thành công!');
      setStoryForm({
        title: '',
        author_name: '',
        summary: '',
        background: '',
        main_genre: '',
        source_url: '',
        source_platform: 'Wattpad'
      });
      fetchSubmissions(currentUser.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('login');
    setEmail('');
    setPassword('');
  };

  // Get status badge color
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

  if (!isLoggedIn) {
    return (
      <div className="translator-dashboard">
        <div className="auth-container">
          <h2>{isRegister ? 'Đăng Ký Dịch Giả' : 'Đăng Nhập Dịch Giả'}</h2>
          <form onSubmit={handleAuth} className="auth-form">
            {isRegister && (
              <div className="form-group">
                <label>Tên Người Dùng:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Nhập tên người dùng"
                />
              </div>
            )}
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Nhập email"
              />
            </div>
            <div className="form-group">
              <label>Mật Khẩu:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
              />
            </div>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng Ký' : 'Đăng Nhập')}
            </button>
          </form>
          <p className="toggle-auth">
            {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="toggle-btn"
            >
              {isRegister ? 'Đăng Nhập' : 'Đăng Ký'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="translator-dashboard">
      <div className="dashboard-header">
        <h2>Bảng Điều Khiển Dịch Giả</h2>
        <div className="user-info">
          <span>Xin chào, {currentUser?.username}</span>
          <button onClick={handleLogout} className="logout-btn">Đăng Xuất</button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          📤 Bài Gửi Của Tôi
        </button>
        <button
          className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
          onClick={() => setActiveTab('submit')}
        >
          ➕ Gửi Truyện Mới
        </button>
      </div>

      {activeTab === 'submissions' && (
        <div className="submissions-list">
          <h3>Danh Sách Bài Gửi</h3>
          {submissions.length === 0 ? (
            <p className="no-submissions">Bạn chưa gửi truyện nào</p>
          ) : (
            <div className="submissions-grid">
              {submissions.map((submission) => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                    <h4>{submission.title}</h4>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(submission.status) }}
                    >
                      {getStatusLabel(submission.status)}
                    </span>
                  </div>
                  <p><strong>Tác Giả:</strong> {submission.author_name}</p>
                  <p><strong>Thể Loại:</strong> {submission.main_genre}</p>
                  <p><strong>Nền Tảng:</strong> {submission.source_platform}</p>
                  <p className="summary">{submission.summary}</p>
                  <p className="date">
                    Gửi: {new Date(submission.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'submit' && (
        <div className="submit-form-container">
          <h3>Gửi Truyện Mới</h3>
          <form onSubmit={handleSubmitStory} className="story-form">
            <div className="form-group">
              <label>Tên Truyện:</label>
              <input
                type="text"
                value={storyForm.title}
                onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                required
                placeholder="Nhập tên truyện"
              />
            </div>
            <div className="form-group">
              <label>Tác Giả:</label>
              <input
                type="text"
                value={storyForm.author_name}
                onChange={(e) => setStoryForm({ ...storyForm, author_name: e.target.value })}
                required
                placeholder="Nhập tên tác giả"
              />
            </div>
            <div className="form-group">
              <label>Thể Loại:</label>
              <input
                type="text"
                value={storyForm.main_genre}
                onChange={(e) => setStoryForm({ ...storyForm, main_genre: e.target.value })}
                placeholder="Nhập thể loại"
              />
            </div>
            <div className="form-group">
              <label>Tóm Tắt:</label>
              <textarea
                value={storyForm.summary}
                onChange={(e) => setStoryForm({ ...storyForm, summary: e.target.value })}
                placeholder="Nhập tóm tắt truyện"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Nền Tảng:</label>
              <select
                value={storyForm.source_platform}
                onChange={(e) => setStoryForm({ ...storyForm, source_platform: e.target.value })}
              >
                <option value="Wattpad">Wattpad</option>
                <option value="Web">Web</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Liên Kết Nguồn:</label>
              <input
                type="url"
                value={storyForm.source_url}
                onChange={(e) => setStoryForm({ ...storyForm, source_url: e.target.value })}
                placeholder="Nhập liên kết"
              />
            </div>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Đang gửi...' : 'Gửi Truyện'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

