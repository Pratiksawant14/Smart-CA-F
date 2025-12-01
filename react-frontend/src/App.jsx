import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import PublicLayout from './components/PublicLayout'
import Home from './pages/landing/Home'
import Features from './pages/landing/Features'
import About from './pages/landing/About'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import AnalyticsPage from './pages/AnalyticsPage'
import TaxPage from './pages/TaxPage'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Smart CA...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Landing Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Auth Route */}
      <Route
        path="/login"
        element={session ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />
      <Route
        path="/auth"
        element={<Navigate to="/login" replace />}
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          session ? (
            <DashboardPage session={session} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/upload"
        element={
          session ? (
            <UploadPage session={session} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/analytics"
        element={
          session ? (
            <AnalyticsPage session={session} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/tax"
        element={
          session ? (
            <TaxPage session={session} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App