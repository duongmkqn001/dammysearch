import { useState, useEffect } from 'react'
import './AdminApp.css'
import AdminDashboard from './components/AdminDashboard'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'

export default function AdminApp() {
  const { currentUser, isLoggedIn } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (currentUser && currentUser.account_type === 'admin') {
      setIsAdmin(true)
    } else if (!isLoggedIn) {
      // Redirect to main app if not logged in
      window.location.href = '/'
    } else {
      // Redirect to main app if not admin
      window.location.href = '/'
    }
  }, [currentUser, isLoggedIn])

  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h1>⛔ Truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập trang quản trị viên.</p>
        <a href="/" className="back-button">← Quay lại trang chính</a>
      </div>
    )
  }

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>⚙️ Bảng Điều Khiển Quản Trị Viên</h1>
          <div className="admin-header-actions">
            <button className="theme-switcher" onClick={toggleTheme} title={`Chuyển sang theme ${theme === 'blue-sky' ? 'Love' : 'Blue Sky'}`}>
              {theme === 'blue-sky' ? '💕 Love' : '☁️ Blue Sky'}
            </button>
            <a href="/" className="back-to-main">← Quay lại ứng dụng chính</a>
          </div>
        </div>
      </header>
      <main className="admin-main">
        <AdminDashboard />
      </main>
    </div>
  )
}

