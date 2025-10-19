import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'blue-sky'
    const savedTheme = localStorage.getItem('app-theme')
    return savedTheme || 'blue-sky'
  })

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('app-theme', theme)
    
    // Update document class for CSS theme switching
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'blue-sky' ? 'blossom-dawn' : 'blue-sky')
  }

  const themes = {
    'blue-sky': {
      name: '☁️ Blue Sky',
      primary: '#1E88E5',
      secondary: '#1565C0',
      accent: '#42A5F5',
      background: '#E3F2FD',
      headerBg: '#E3F2FD',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#0D47A1',
      textSecondary: '#424242',
      borderColor: '#1E88E5',
      buttonBg: '#1E88E5',
      buttonHover: '#1565C0'
    },
    'blossom-dawn': {
      name: '🌸 Blossom Dawn',
      primary: '#E91E63',
      secondary: '#C2185B',
      accent: '#F06292',
      background: '#FCE4EC',
      headerBg: '#FCE4EC',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#880E4F',
      textSecondary: '#424242',
      borderColor: '#E91E63',
      buttonBg: '#E91E63',
      buttonHover: '#C2185B'
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes, currentTheme: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  )
}

