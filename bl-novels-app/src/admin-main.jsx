import React from 'react'
import ReactDOM from 'react-dom/client'
import AdminApp from './AdminApp'
import './index.css'
import './styles/themes.css'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

