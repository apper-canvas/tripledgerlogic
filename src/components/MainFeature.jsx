import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'
import expenseService from '../services/api/expenseService'
import exchangeRateService from '../services/api/exchangeRateService'

const MainFeature = ({ trip, expenses, onExpenseAdded, onExpenseUpdated, onExpenseDeleted }) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [exchangeRates, setExchangeRates] = useState([])
  const [formData, setFormData] = useState({
    amount: '',
    currency: trip?.currency || 'USD',
    category: 'meals',
    merchant: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    receiptUrl: ''
  })

  const categories = [
    { id: 'transport', name: 'Transport', icon: 'Car', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { id: 'accommodation', name: 'Accommodation', icon: 'Bed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'meals', name: 'Meals', icon: 'Coffee', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { id: 'other', name: 'Other', icon: 'ShoppingBag', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
  ]

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const rates = await exchangeRateService.getAll()
        setExchangeRates(rates || [])
      } catch (err) {
        console.error('Failed to load exchange rates:', err)
      }
    }
    loadExchangeRates()
  }, [])

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount
    
    const rate = exchangeRates.find(r => 
      r.fromCurrency === fromCurrency && r.toCurrency === toCurrency
    )
    
    return rate ? amount * rate.rate : amount
  }

  const handleSubmitExpense = async (e) => {
    e.preventDefault()
    
    try {
      const convertedAmount = convertCurrency(
        parseFloat(formData.amount),
        formData.currency,
        trip.currency
      )

      const expenseData = {
        ...formData,
        tripId: trip.id,
        amount: parseFloat(formData.amount),
        convertedAmount,
        date: new Date(formData.date),
        receiptUrl: formData.receiptUrl || `https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop`
      }

      if (editingExpense) {
        const updated = await expenseService.update(editingExpense.id, expenseData)
        onExpenseUpdated(updated)
        setEditingExpense(null)
      } else {
        const created = await expenseService.create(expenseData)
        onExpenseAdded(created)
      }

      setShowExpenseForm(false)
      setFormData({
        amount: '',
        currency: trip.currency,
        category: 'meals',
        merchant: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        receiptUrl: ''
      })
    } catch (err) {
      console.error('Failed to save expense:', err)
    }
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setFormData({
      amount: expense.amount.toString(),
      currency: expense.currency,
      category: expense.category,
      merchant: expense.merchant,
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
      notes: expense.notes || '',
      receiptUrl: expense.receiptUrl || ''
    })
    setShowExpenseForm(true)
  }

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expenseService.delete(expenseId)
      onExpenseDeleted(expenseId)
    } catch (err) {
      console.error('Failed to delete expense:', err)
    }
  }

  const filteredExpenses = expenses.filter(expense => 
    selectedCategory === 'all' || expense.category === selectedCategory
  )

  const totalSpent = expenses.reduce((sum, expense) => sum + (expense.convertedAmount || expense.amount), 0)
  const budgetProgress = (totalSpent / trip.budget) * 100

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[3]
  }

  return (
    <div className="space-y-6">
      {/* Trip Overview */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              {trip.name}
            </h2>
            <p className="text-surface-600 dark:text-surface-400">
              {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200 shadow-soft"
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Expense
          </button>
        </div>

        {/* Budget Progress */}
        <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Budget Progress</span>
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
              {trip.currency} {totalSpent.toLocaleString()} / {trip.budget.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-3 rounded-full ${
                budgetProgress >= 90 ? 'bg-red-500' :
                budgetProgress >= 75 ? 'bg-amber-500' : 'bg-green-500'
              }`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-surface-500 dark:text-surface-400">
            <span>{budgetProgress.toFixed(1)}% used</span>
            <span>{trip.currency} {(trip.budget - totalSpent).toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              <ApperIcon name={category.icon} size={16} />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Expenses ({filteredExpenses.length})
          </h3>
        </div>
        
        <div className="divide-y divide-surface-200 dark:divide-surface-700">
          {filteredExpenses.map(expense => {
            const categoryInfo = getCategoryInfo(expense.category)
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div 
                      className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0 cursor-pointer"
                      style={{ backgroundImage: `url(${expense.receiptUrl})` }}
                      onClick={() => {
                        setSelectedReceipt(expense.receiptUrl)
                        setShowReceiptModal(true)
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-surface-900 dark:text-surface-100 truncate">
                          {expense.merchant}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryInfo.color}`}>
                          {categoryInfo.name}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                      </p>
                      {expense.notes && (
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 truncate">
                          {expense.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-surface-900 dark:text-surface-100">
                        {expense.currency} {expense.amount.toLocaleString()}
                      </div>
                      {expense.currency !== trip.currency && (
                        <div className="text-sm text-surface-500 dark:text-surface-400">
                          {trip.currency} {expense.convertedAmount?.toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="p-2 text-surface-400 hover:text-primary transition-colors"
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
          
          {filteredExpenses.length === 0 && (
            <div className="p-12 text-center">
              <ApperIcon name="Receipt" className="h-12 w-12 text-surface-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                No expenses found
              </h4>
              <p className="text-surface-600 dark:text-surface-400">
                {selectedCategory === 'all' 
                  ? 'Add your first expense to start tracking'
                  : `No expenses in ${categories.find(c => c.id === selectedCategory)?.name} category`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {showExpenseForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowExpenseForm(false)
              setEditingExpense(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-neu-light dark:shadow-neu-dark"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {editingExpense ? 'Edit Expense' : 'Add Expense'}
                </h3>
                <button
                  onClick={() => {
                    setShowExpenseForm(false)
                    setEditingExpense(null)
                  }}
                  className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitExpense} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Merchant
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.merchant}
                    onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary"
                    placeholder="Enter merchant name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary"
                    rows="3"
                    placeholder="Add notes (optional)"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExpenseForm(false)
                      setEditingExpense(null)
                    }}
                    className="flex-1 px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {editingExpense ? 'Update' : 'Add'} Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setShowReceiptModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedReceipt}
                alt="Receipt"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setShowReceiptModal(false)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature