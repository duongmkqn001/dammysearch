import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthTab.css';

export default function AuthTab({ onLoginSuccess }) {
  const { login, register, isLoggedIn, currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('reader');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isRegister) {
        const result = await register(email, username, password, userType);
        if (result.success) {
          setMessage(result.message);
          setEmail('');
          setUsername('');
          setPassword('');
          setIsRegister(false);
        } else {
          setMessage('Lỗi: ' + result.error);
        }
      } else {
        // During login, don't pass userType - let the system determine it from the database
        const result = await login(email, password, null);
        if (result.success) {
          setMessage('Đăng nhập thành công!');
          setEmail('');
          setPassword('');
          // Call the callback to redirect based on user role
          if (onLoginSuccess && result.user) {
            setTimeout(() => {
              onLoginSuccess(result.user);
            }, 500);
          }
        } else {
          setMessage('Lỗi: ' + result.error);
        }
      }
    } catch (error) {
      setMessage('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn && currentUser) {
    return (
      <div className="auth-container">
        <div className="logged-in-section">
          <h2>Xin chào, {currentUser.username}!</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Loại tài khoản:</strong> {
              currentUser.user_type === 'reader' ? 'Độc Giả' :
              currentUser.user_type === 'translator' ? 'Dịch Giả' :
              currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Người Dùng'
            }</p>
            <p><strong>Vai trò:</strong> {currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Người Dùng'}</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            Đăng Xuất
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button
          className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
          onClick={() => setIsRegister(false)}
        >
          Đăng Nhập
        </button>
        <button
          className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
          onClick={() => setIsRegister(true)}
        >
          Đăng Ký
        </button>
      </div>

      <form onSubmit={handleAuth} className="auth-form">
        {isRegister && (
          <div className="form-group">
            <label>Loại tài khoản:</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              disabled={loading}
            >
              <option value="reader">Độc Giả</option>
              <option value="translator">Dịch Giả</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Nhập email của bạn"
          />
        </div>

        {isRegister && (
          <div className="form-group">
            <label>Tên người dùng:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Nhập tên người dùng"
            />
          </div>
        )}

        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Nhập mật khẩu"
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng Ký' : 'Đăng Nhập')}
        </button>

        {message && (
          <div className={`message ${message.includes('Lỗi') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

