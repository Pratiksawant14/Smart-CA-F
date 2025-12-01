import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AddTransactionForm({ userId, onTransactionAdded }) {
  const [formData, setFormData] = useState({
    transaction_date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense',
    category: 'Uncategorized',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const categories = [
    'Food', 'Transport', 'Utilities', 'Office Supplies',
    'Software', 'Professional Services', 'Marketing', 'Health',
    'Rent', 'Income', 'Banking', 'Investment', 'Education', 'Uncategorized'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from('transactions').insert([
        {
          user_id: userId,
          transaction_date: formData.transaction_date,
          description: formData.description.trim(),
          amount: parseFloat(formData.amount),
          type: formData.type,
          category: formData.category,
        },
      ])

      if (error) throw error

      // Reset form
      setFormData({
        transaction_date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        type: 'expense',
        category: 'Uncategorized',
      })

      onTransactionAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="transaction_date"
              name="transaction_date"
              type="date"
              value={formData.transaction_date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="e.g., Client payment, Office supplies"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="0.00"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  )
}