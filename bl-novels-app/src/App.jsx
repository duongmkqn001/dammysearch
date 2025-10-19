import { useState, useEffect } from 'react'
import './App.css'
import SearchTab from './components/SearchTab'
import AuthorListTab from './components/AuthorListTab'
import WorksListTab from './components/WorksListTab'
import TranslatorDashboard from './components/TranslatorDashboard'
import ReaderDashboard from './components/ReaderDashboard'
import AdminDashboard from './components/AdminDashboard'
import AuthTab from './components/AuthTab'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'

function App() {
  const [activeTab, setActiveTab] = useState('search')
  const { isLoggedIn, isAdmin, currentUser } = useAuth()
  const { theme, toggleTheme, themes } = useTheme()

  // Auto-redirect based on user role after login
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      // Check if user is admin
      if (currentUser.role === 'admin') {
        setActiveTab('admin');
      } else if (currentUser.user_type === 'translator') {
        setActiveTab('translator');
      } else if (currentUser.user_type === 'reader') {
        setActiveTab('reader');
      }
    }
  }, [isLoggedIn, currentUser]);

  // Handle login success callback
  const handleLoginSuccess = (user) => {
    // Redirect based on user role
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else if (user.user_type === 'translator') {
      setActiveTab('translator');
    } else if (user.user_type === 'reader') {
      setActiveTab('reader');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Kho lưu trữ Đam Mỹ</h1>
          <button className="theme-switcher" onClick={toggleTheme} title={`Chuyển sang theme ${theme === 'blue-sky' ? 'Love' : 'Blue Sky'}`}>
            {theme === 'blue-sky' ? '💕 Love' : '☁️ Blue Sky'}
          </button>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Tìm Kiếm
        </button>
        <button
          className={`tab-button ${activeTab === 'authors' ? 'active' : ''}`}
          onClick={() => setActiveTab('authors')}
        >
          👥 Danh Sách Tác Giả
        </button>
        <button
          className={`tab-button ${activeTab === 'works' ? 'active' : ''}`}
          onClick={() => setActiveTab('works')}
        >
          📚 Tất Cả Tác Phẩm
        </button>
        <button
          className={`tab-button ${activeTab === 'auth' ? 'active' : ''}`}
          onClick={() => setActiveTab('auth')}
        >
          🔐 Tài Khoản
        </button>
        {isLoggedIn && (
          <>
            <button
              className={`tab-button ${activeTab === 'reader' ? 'active' : ''}`}
              onClick={() => setActiveTab('reader')}
            >
              👤 Độc Giả
            </button>
            <button
              className={`tab-button ${activeTab === 'translator' ? 'active' : ''}`}
              onClick={() => setActiveTab('translator')}
            >
              ✍️ Dịch Giả
            </button>
          </>
        )}
        {isAdmin() && (
          <a
            href="/admin.html"
            className="tab-button admin-link"
            target="_self"
          >
            ⚙️ Admin Dashboard
          </a>
        )}
      </nav>

      <main className="tab-content">
        {activeTab === 'search' && <SearchTab />}
        {activeTab === 'authors' && <AuthorListTab />}
        {activeTab === 'works' && <WorksListTab />}
        {activeTab === 'auth' && <AuthTab onLoginSuccess={handleLoginSuccess} />}
        {activeTab === 'reader' && isLoggedIn && <ReaderDashboard />}
        {activeTab === 'translator' && isLoggedIn && <TranslatorDashboard />}
      </main>
    </div>
  )
}

export default App
