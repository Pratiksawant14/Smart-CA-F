// src/pages/Auth.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import LightRays from '../components/LightRays' // ensure this exists
import logo from '../assets/logo.png'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        })
        if (error) throw error
        setMessage('Account created! Please check your email to verify your account.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // outer container must be relative (so absolute children are positioned to it)
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
      {/* LightRays wrapper: absolute full-screen, behind everything (-z-10) and pointer-events-none */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.2}
          lightSpread={0.9}
          rayLength={1.6}
          pulsating={true}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.06}
          distortion={0.03}
        // NOTE: do NOT pass any z-index classes here; wrapper above sets stacking
        />
      </div>

      {/* UI wrapper: relative and higher z-index so it sits above the canvas */}
      <div className="relative z-20 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img src={logo} alt="Smart CA Logo" className="h-24 mx-auto mb-4" />
            <p className="text-gray-600">AI-Powered Accounting for Freelancers</p>
          </div>

          <div className="card">
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => { setIsLogin(true); setError(null); setMessage(null) }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${isLogin ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Log In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(null); setMessage(null) }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${!isLogin ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    id="fullName" type="text" value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field" required={!isLogin} placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field" required placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field" required minLength={6} placeholder="••••••••"
                />
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
              {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : <span>{isLogin ? 'Log In' : 'Sign Up'}</span>}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">Phase 1: Core Foundation - Authentication & Transactions</p>
        </div>
      </div>
    </div>
  )
}
