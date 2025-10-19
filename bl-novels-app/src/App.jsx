import { useState } from 'react'
import './App.css'
import SearchTab from './components/SearchTab'
import AuthorListTab from './components/AuthorListTab'
import WorksListTab from './components/WorksListTab'
import TranslatorDashboard from './components/TranslatorDashboard'
import ReaderDashboard from './components/ReaderDashboard'
import AdminDashboard from './components/AdminDashboard'
import AuthTab from './components/AuthTab'
import { useAuth } from './context/AuthContext'

function App() {
  const [activeTab, setActiveTab] = useState('search')
  const { isLoggedIn, isAdmin } = useAuth()

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Kho lưu trữ Đam Mỹ</h1>
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
          <button
            className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            ⚙️ Admin
          </button>
        )}
      </nav>

      <main className="tab-content">
        {activeTab === 'search' && <SearchTab />}
        {activeTab === 'authors' && <AuthorListTab />}
        {activeTab === 'works' && <WorksListTab />}
        {activeTab === 'auth' && <AuthTab />}
        {activeTab === 'reader' && isLoggedIn && <ReaderDashboard />}
        {activeTab === 'translator' && isLoggedIn && <TranslatorDashboard />}
        {activeTab === 'admin' && isAdmin() && <AdminDashboard />}
      </main>
    </div>
  )
}

export default App
