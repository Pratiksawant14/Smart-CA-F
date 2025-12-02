import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { API_BASE_URL } from '../config'

export default function AnalyticsPage({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (!currentSession) {
        setError('Not authenticated')
        return
      }

      const token = currentSession.access_token

      const response = await fetch(`${API_BASE_URL}/api/analytics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics')
      }

      setAnalytics(data)
    } catch (err) {
      console.error('Analytics error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getVolatilityColor = (score) => {
    if (score < 30) return 'bg-green-500'
    if (score < 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your financial data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-primary-900">Analytics</h1>
              </div>
              <button onClick={handleSignOut} className="btn-secondary">Sign Out</button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Unavailable</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-primary-900">AI-Powered Analytics</h1>
                <p className="text-sm text-gray-600">Financial insights for {session.user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={fetchAnalytics} className="btn-secondary flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button onClick={handleSignOut} className="btn-secondary">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-primary-600">{analytics?.total_transactions || 0}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Analysis Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analytics?.analysis_date ? new Date(analytics.analysis_date).toLocaleDateString('en-IN') : 'N/A'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">AI Models Active</p>
                <p className="text-3xl font-bold text-green-600">3</p>
                <p className="text-xs text-gray-500 mt-1">Volatility • Risk • Forecast</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Income Volatility */}
        {analytics?.volatility && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Income Volatility Analysis</h2>
              <span className={`px-4 py-2 rounded-full font-semibold ${getRiskColor(analytics.volatility.risk_level)}`}>
                {analytics.volatility.risk_level} Volatility
              </span>
            </div>

            {/* Volatility Score Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Volatility Score</span>
                <span className="text-2xl font-bold text-gray-900">{analytics.volatility.score.toFixed(1)}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${getVolatilityColor(analytics.volatility.score)}`}
                  style={{ width: `${Math.min(analytics.volatility.score, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Stable</span>
                <span>Moderate</span>
                <span>Volatile</span>
              </div>
            </div>

            {/* Statistics */}
            {analytics.volatility.statistics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Average Income</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{analytics.volatility.statistics.mean?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Median Income</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{analytics.volatility.statistics.median?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Std Deviation</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{analytics.volatility.statistics.std_dev?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Data Points</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {analytics.volatility.statistics.total_months} months
                  </p>
                </div>
              </div>
            )}

            {/* Alerts */}
            {analytics.volatility.alerts && analytics.volatility.alerts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">⚠️ Alerts & Anomalies</h3>
                {analytics.volatility.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                        alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                          'bg-yellow-50 border-yellow-500'
                      }`}
                  >
                    <p className="text-sm text-gray-900">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Audit Risk */}
        {analytics?.audit_risk && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Audit Risk Assessment</h2>
              <span className={`px-4 py-2 rounded-full font-semibold ${getRiskColor(analytics.audit_risk.risk_level)}`}>
                {analytics.audit_risk.risk_level} Risk
              </span>
            </div>

            {/* Risk Meter */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Risk Score</span>
                <span className="text-2xl font-bold text-gray-900">{analytics.audit_risk.risk_score}/100</span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-6">
                <div
                  className={`h-6 rounded-full transition-all flex items-center justify-end pr-2 ${analytics.audit_risk.risk_score < 30 ? 'bg-green-500' :
                      analytics.audit_risk.risk_score < 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${Math.min(analytics.audit_risk.risk_score, 100)}%` }}
                >
                  <span className="text-white text-xs font-bold">{analytics.audit_risk.risk_score}%</span>
                </div>
              </div>
            </div>

            {/* XAI Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">AI Explanation (XAI)</h3>
                  <p className="text-sm text-blue-800 whitespace-pre-line">{analytics.audit_risk.explanation}</p>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            {analytics.audit_risk.factors && analytics.audit_risk.factors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Risk Factors</h3>
                <div className="space-y-3">
                  {analytics.audit_risk.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{factor.factor}</p>
                        <p className="text-sm text-gray-600">{factor.value}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${factor.impact === 'High' ? 'bg-red-100 text-red-800' :
                            factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {factor.impact}
                        </span>
                        <span className="text-sm font-bold text-gray-700">+{factor.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analytics.audit_risk.recommendations && analytics.audit_risk.recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">📋 Recommendations</h3>
                <ul className="space-y-2">
                  {analytics.audit_risk.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Section 3: Income Forecast */}
        {analytics?.forecast && analytics.forecast.historical && analytics.forecast.historical.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Income Forecast</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Trend: <span className="font-semibold capitalize">{analytics.forecast.trend}</span> •
                  Confidence: <span className="font-semibold">{analytics.forecast.accuracy}</span>
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold ${analytics.forecast.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                  analytics.forecast.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                {analytics.forecast.trend === 'increasing' ? '📈 Growing' :
                  analytics.forecast.trend === 'decreasing' ? '📉 Declining' : '➡️ Stable'}
              </div>
            </div>

            {/* Chart */}
            <div className="h-96 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  ...analytics.forecast.historical.map(h => ({
                    month: h.month.split('-')[1] + '/' + h.month.split('-')[0].slice(2),
                    actual: h.actual_amount,
                    predicted: null
                  })),
                  ...analytics.forecast.forecast.map(f => ({
                    month: f.month.split('-')[1] + '/' + f.month.split('-')[0].slice(2),
                    actual: null,
                    predicted: f.predicted_amount
                  }))
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value) => `₹${value?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.3}
                    name="Actual Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeDasharray="5 5"
                    name="Predicted Income"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast Details */}
            {analytics.forecast.forecast && analytics.forecast.forecast.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Next 3 Months Forecast</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analytics.forecast.forecast.map((prediction, index) => (
                    <div key={index} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-600 font-medium mb-1">{prediction.month}</p>
                      <p className="text-2xl font-bold text-purple-900 mb-2">
                        ₹{prediction.predicted_amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-xs text-purple-700">
                        Range: ₹{prediction.confidence_lower.toLocaleString('en-IN', { maximumFractionDigits: 0 })} -
                        ₹{prediction.confidence_upper.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}