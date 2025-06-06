import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from '@/components/pages/HomePage'
import NewTripPage from '@/components/pages/NewTripPage'
import ManageCategoriesPage from '@/components/pages/ManageCategoriesPage'
import NotFound from '@/pages/NotFound'

const App = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Router>
      <div className="min-h-screen bg-surface-100 dark:bg-surface-900">
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />} />
          <Route path="/trips/new" element={<NewTripPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />} />
          <Route path="/categories" element={<ManageCategoriesPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  )
}

export default App