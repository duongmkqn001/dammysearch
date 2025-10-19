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
    setTheme(prevTheme => prevTheme === 'blue-sky' ? 'love' : 'blue-sky')
  }

  const themes = {
    'blue-sky': {
      name: '☁️ Blue Sky',
      primary: '#00BCD4',
      secondary: '#0097A7',
      accent: '#4DD0E1',
      background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)',
      headerBg: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#00695C',
      textSecondary: '#666',
      borderColor: '#00BCD4'
    },
    'love': {
      name: '💕 Love',
      primary: '#E91E63',
      secondary: '#C2185B',
      accent: '#FF6B9D',
      background: 'linear-gradient(135deg, #FFF0F5 0%, #E0F7FA 50%, #F1F8E9 100%)',
      headerBg: 'linear-gradient(135deg, rgba(255, 192, 203, 0.4) 0%, rgba(173, 216, 230, 0.4) 100%)',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#C2185B',
      textSecondary: '#666',
      borderColor: '#E91E63'
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes, currentTheme: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  )
}

