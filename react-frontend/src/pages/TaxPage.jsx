import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ExplanationCard, { TaxIcons } from '../components/ExplanationCard'
import { API_BASE_URL } from '../config'

export default function TaxPage({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [taxData, setTaxData] = useState(null)

  useEffect(() => {
    fetchTaxSummary()
  }, [])

  const fetchTaxSummary = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (!currentSession) {
        setError('Not authenticated')
        return
      }

      const token = currentSession.access_token

      const response = await fetch(`${API_BASE_URL}/api/tax_summary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tax summary')
      }

      setTaxData(data)
    } catch (err) {
      console.error('Tax summary error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Calculating your taxes...</p>
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
                <h1 className="text-2xl font-bold text-primary-900">Tax Summary</h1>
              </div>
              <button onClick={handleSignOut} className="btn-secondary">Sign Out</button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <p className="text-red-600">{error}</p>
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
                <h1 className="text-2xl font-bold text-primary-900">Tax & Compliance</h1>
                <p className="text-sm text-gray-600">{taxData?.financial_year || 'Current FY'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={fetchTaxSummary} className="btn-secondary flex items-center">
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExplanationCard
            title="Gross Income"
            value={`₹${taxData?.gross_income?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}`}
            color="green"
            icon={TaxIcons.Profit}
          />
          <ExplanationCard
            title="Total Expenses"
            value={`₹${taxData?.total_expenses?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}`}
            color="red"
            icon={TaxIcons.Expense}
          />
          <ExplanationCard
            title="Net Profit"
            value={`₹${taxData?.net_profit?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}`}
            color="primary"
            icon={TaxIcons.Profit}
            explanation={`Profit Margin: ${taxData?.actual_profit_margin?.toFixed(1) || '0'}%`}
          />
        </div>

        {/* Tax Liability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ExplanationCard
            title="Income Tax Liability"
            value={`₹${taxData?.income_tax?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}`}
            explanation={taxData?.explanation}
            color="purple"
            icon={TaxIcons.IncomeTax}
          />
          <ExplanationCard
            title="GST Liability"
            value={`₹${taxData?.gst_liability?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}`}
            explanation={taxData?.gst_applicable ?
              `GST is applicable as your income exceeds ₹20 lakhs. You must be GST registered.` :
              `GST registration not required. Your income is below the ₹20 lakh threshold.`
            }
            color={taxData?.gst_applicable ? 'red' : 'green'}
            icon={TaxIcons.GST}
          />
        </div>

        {/* Total Tax Liability */}
        <div className="mb-8">
          <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">Total Tax Liability</h2>
                <p className="text-4xl font-bold text-purple-900">
                  ₹{taxData?.total_tax_liability?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
                </p>
                {taxData?.use_presumptive && (
                  <p className="text-sm text-purple-700 mt-2">
                    ✓ Presumptive taxation applied (Section 44ADA)
                  </p>
                )}
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Deductible Expenses */}
        {taxData?.deductible_expenses && taxData.deductible_expenses.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Deductible Business Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {taxData.deductible_expenses.map((expense, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-900">{expense.category}</h3>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    ₹{expense.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {expense.count} transaction{expense.count !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {taxData?.recommendations && taxData.recommendations.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Tax Recommendations</h2>
            <div className="space-y-3">
              {taxData.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${rec.type === 'danger' ? 'bg-red-50 border-red-500' :
                    rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                  <p className="text-sm text-gray-700">{rec.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tax Calendar */}
        {taxData?.tax_calendar && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Important Tax Deadlines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {taxData.tax_calendar.deadlines.map((deadline, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${deadline.type === 'tax' ? 'bg-purple-100' :
                      deadline.type === 'filing' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                      <svg className={`w-6 h-6 ${deadline.type === 'tax' ? 'text-purple-600' :
                        deadline.type === 'filing' ? 'text-blue-600' :
                          'text-green-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                      <p className="text-sm text-gray-500">{deadline.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}