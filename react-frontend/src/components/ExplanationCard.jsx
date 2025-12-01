import { useState } from 'react'

export default function ExplanationCard({ title, value, explanation, color = 'primary', icon }) {
  const [showExplanation, setShowExplanation] = useState(false)

  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      text: 'text-primary-900',
      value: 'text-primary-600',
      icon: 'text-primary-600',
      button: 'text-primary-600 hover:text-primary-700'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      value: 'text-green-600',
      icon: 'text-green-600',
      button: 'text-green-600 hover:text-green-700'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      value: 'text-red-600',
      icon: 'text-red-600',
      button: 'text-red-600 hover:text-red-700'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      value: 'text-yellow-600',
      icon: 'text-yellow-600',
      button: 'text-yellow-600 hover:text-yellow-700'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      value: 'text-purple-600',
      icon: 'text-purple-600',
      button: 'text-purple-600 hover:text-purple-700'
    }
  }

  const classes = colorClasses[color] || colorClasses.primary

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className={`${classes.bg} p-3 rounded-lg`}>
              <div className={classes.icon}>{icon}</div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className={`text-3xl font-bold ${classes.value} mt-1`}>{value}</p>
          </div>
        </div>
        
        {explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className={`flex items-center space-x-1 ${classes.button} transition-colors`}
            title="View explanation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">
              {showExplanation ? 'Hide' : 'Info'}
            </span>
          </button>
        )}
      </div>

      {/* XAI Explanation */}
      {explanation && showExplanation && (
        <div className={`${classes.bg} border ${classes.border} rounded-lg p-4 mt-4`}>
          <div className="flex items-start">
            <svg className={`w-5 h-5 ${classes.icon} mr-3 flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div className="flex-1">
              <h4 className={`text-sm font-semibold ${classes.text} mb-2`}>AI Explanation</h4>
              <p className={`text-sm ${classes.text} whitespace-pre-line leading-relaxed`}>
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Preset icons for common use cases
export const TaxIcons = {
  IncomeTax: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  GST: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Profit: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Expense: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}