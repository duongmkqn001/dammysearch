import { useState, useEffect } from 'react'
import './AdminApp.css'
import AdminDashboard from './components/AdminDashboard'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'

export default function AdminApp() {
  const { currentUser, isLoggedIn } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Add a small delay to ensure auth context is fully loaded
    const timer = setTimeout(() => {
      console.log('Admin Check - Current User:', currentUser)
      console.log('Admin Check - Is Logged In:', isLoggedIn)
      console.log('Admin Check - User Role:', currentUser?.role)

      if (currentUser && currentUser.role === 'admin') {
        setIsAdmin(true)
        setLoading(false)
      } else if (!isLoggedIn && !currentUser) {
        // Only redirect if definitely not logged in
        console.log('Not logged in, redirecting...')
        window.location.href = '/'
      } else if (currentUser && currentUser.role !== 'admin') {
        // Only redirect if logged in but not admin
        console.log('Not admin, redirecting...')
        window.location.href = '/'
      } else {
        setLoading(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [currentUser, isLoggedIn])

  if (loading) {
    return (
      <div className="admin-loading">
        <h1>⏳ Đang kiểm tra quyền truy cập...</h1>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h1>⛔ Truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập trang quản trị viên.</p>
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
          Debug: isLoggedIn={isLoggedIn ? 'true' : 'false'},
          role={currentUser?.role || 'none'},
          user_type={currentUser?.user_type || 'none'}
        </p>
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
            <button className="theme-switcher" onClick={toggleTheme} title={`Chuyển sang theme ${theme === 'blue-sky' ? 'Blossom Dawn' : 'Blue Sky'}`}>
              {theme === 'blue-sky' ? '🌸 Blossom Dawn' : '☁️ Blue Sky'}
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

