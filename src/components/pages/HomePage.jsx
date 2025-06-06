import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/molecules/Header'
import HeroSection from '@/components/organisms/HeroSection'
import TripOverview from '@/components/organisms/TripOverview'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import ExpenseList from '@/components/organisms/ExpenseList'
import ExpenseForm from '@/components/organisms/ExpenseForm'
import ReceiptModal from '@/components/organisms/ReceiptModal'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

import tripService from '@/services/api/tripService'
import expenseService from '@/services/api/expenseService'
import exchangeRateService from '@/services/api/exchangeRateService'

const HomePage = () => {
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [exchangeRates, setExchangeRates] = useState([])

  const categories = [
    { id: 'transport', name: 'Transport', icon: 'Car', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { id: 'accommodation', name: 'Accommodation', icon: 'Bed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'meals', name: 'Meals', icon: 'Coffee', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { id: 'other', name: 'Other', icon: 'ShoppingBag', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
  ]
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']

  // Load trips
  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      try {
        const result = await tripService.getAll()
        setTrips(result || [])
        if (result?.length > 0) {
          setSelectedTrip(result[0])
        }
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load trips')
      } finally {
        setLoading(false)
      }
    }
    loadTrips()
  }, [])

  // Load expenses for selected trip
  useEffect(() => {
    const loadExpenses = async () => {
      if (!selectedTrip) {
        setExpenses([]);
        return;
      }
      try {
        const allExpenses = await expenseService.getAll()
        const tripExpenses = allExpenses?.filter(expense => expense.tripId === selectedTrip.id) || []
        setExpenses(tripExpenses)
      } catch (err) {
        console.error('Failed to load expenses:', err)
        toast.error('Failed to load expenses for trip')
      }
    }
    loadExpenses()
  }, [selectedTrip])

  // Load exchange rates
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

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleSelectTrip = useCallback((tripId) => {
    const trip = trips.find(t => t.id === tripId)
    setSelectedTrip(trip)
  }, [trips])

  const calculateTripStats = useCallback((trip) => {
    const tripExpenses = expenses.filter(expense => expense.tripId === trip.id)
    const totalSpent = tripExpenses.reduce((sum, expense) => sum + (expense.convertedAmount || expense.amount), 0)
    const progress = Math.min((totalSpent / trip.budget) * 100, 100)
    return { totalSpent, progress }
  }, [expenses])

  const convertCurrency = useCallback((amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount

    const rate = exchangeRates.find(r =>
      r.fromCurrency === fromCurrency && r.toCurrency === toCurrency
    )
    return rate ? amount * rate.rate : amount
  }, [exchangeRates])

  const handleSubmitExpense = async (formData, expenseId) => {
    try {
      const convertedAmount = convertCurrency(
        parseFloat(formData.amount),
        formData.currency,
        selectedTrip.currency
      )

      const expenseData = {
        ...formData,
        tripId: selectedTrip.id,
        amount: parseFloat(formData.amount),
        convertedAmount,
        date: new Date(formData.date),
        receiptUrl: formData.receiptUrl || `https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop`
      }

      if (expenseId) {
        const updated = await expenseService.update(expenseId, expenseData)
        setExpenses(prev => prev.map(exp =>
          exp.id === updated.id ? updated : exp
        ))
        toast.success('Expense updated successfully')
      } else {
        const created = await expenseService.create(expenseData)
        setExpenses(prev => [...prev, created])
        toast.success('Expense added successfully')
      }
      setEditingExpense(null)
    } catch (err) {
      console.error('Failed to save expense:', err)
      toast.error('Failed to save expense')
    }
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowExpenseForm(true)
  }

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expenseService.delete(expenseId)
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId))
      toast.success('Expense deleted successfully')
    } catch (err) {
      console.error('Failed to delete expense:', err)
      toast.error('Failed to delete expense')
    }
  }

  const handleShowReceipt = (url) => {
    setSelectedReceipt(url)
    setShowReceiptModal(true)
  }

  const filteredExpenses = expenses.filter(expense =>
    selectedCategory === 'all' || expense.category === selectedCategory
  )

  const currentTripStats = selectedTrip ? calculateTripStats(selectedTrip) : { totalSpent: 0, progress: 0 }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      <Header
        trips={trips}
        selectedTrip={selectedTrip}
        onSelectTrip={handleSelectTrip}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trips.slice(0, 4).map((trip) => {
            const stats = calculateTripStats(trip)
            return (
              <HeroSection
                key={trip.id}
                trip={trip}
                stats={stats}
                isSelected={selectedTrip?.id === trip.id}
                onClick={() => setSelectedTrip(trip)}
              />
            )
          })}
        </div>

        {selectedTrip && (
          <div className="space-y-6">
            <TripOverview
              trip={selectedTrip}
              totalSpent={currentTripStats.totalSpent}
              budgetProgress={currentTripStats.progress}
              onAddExpense={() => setShowExpenseForm(true)}
            />

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <ExpenseList
              expenses={filteredExpenses}
              tripCurrency={selectedTrip.currency}
              categories={categories}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onShowReceipt={handleShowReceipt}
            />
          </div>
        )}

        {!selectedTrip && trips.length === 0 && (
          <div className="text-center py-12">
            <Icon name="MapPin" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">No trips found</Text>
            <Text className="text-surface-600 dark:text-surface-400">Create your first trip to start tracking expenses</Text>
          </div>
        )}
      </main>

      <ExpenseForm
        show={showExpenseForm}
        onClose={() => {
          setShowExpenseForm(false)
          setEditingExpense(null)
        }}
        onSubmit={handleSubmitExpense}
        editingExpense={editingExpense}
        tripCurrency={selectedTrip?.currency}
        categories={categories}
        currencies={currencies}
      />

      <ReceiptModal
        show={showReceiptModal}
        imageUrl={selectedReceipt}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  )
}

export default HomePage