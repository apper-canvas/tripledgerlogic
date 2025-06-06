import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/molecules/Header'
import CalendarView from '@/components/organisms/CalendarView'
import ExpenseForm from '@/components/organisms/ExpenseForm'
import ReceiptModal from '@/components/organisms/ReceiptModal'
import expenseService from '@/services/api/expenseService'
import tripService from '@/services/api/tripService'

const CalendarPage = ({ darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [paymentModes, setPaymentModes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [tripsData, categoriesData, paymentModesData] = await Promise.all([
        tripService.getAll(),
        expenseService.getCategories(),
        expenseService.getPaymentModes()
      ])
      
      setTrips(tripsData)
      setCategories(categoriesData)
      setPaymentModes(paymentModesData)
      
      if (tripsData.length > 0) {
        const firstTrip = tripsData[0]
        setSelectedTrip(firstTrip)
        const expensesData = await expenseService.getAll(firstTrip.id)
        setExpenses(expensesData)
      }
    } catch (err) {
      setError('Failed to load data')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTripChange = async (tripId) => {
    if (!tripId) return
    
    try {
      setLoading(true)
      const trip = trips.find(t => t.id === tripId)
      setSelectedTrip(trip)
      const expensesData = await expenseService.getAll(tripId)
      setExpenses(expensesData)
    } catch (err) {
      toast.error('Failed to load expenses')
      console.error('Error loading expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = (date) => {
    setSelectedDate(date)
    setEditingExpense(null)
    setShowExpenseForm(true)
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowExpenseForm(true)
  }

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return
    
    try {
      await expenseService.delete(expenseId)
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId))
      toast.success('Expense deleted successfully')
    } catch (err) {
      toast.error('Failed to delete expense')
      console.error('Error deleting expense:', err)
    }
  }

  const handleExpenseSubmit = async (expenseData, expenseId) => {
    try {
      if (selectedDate && !expenseId) {
        expenseData.date = selectedDate
      }
      
      if (expenseId) {
        const updatedExpense = await expenseService.update(expenseId, {
          ...expenseData,
          amount: parseFloat(expenseData.amount),
          tripId: selectedTrip.id
        })
        setExpenses(prev => prev.map(exp => exp.id === expenseId ? updatedExpense : exp))
        toast.success('Expense updated successfully')
      } else {
        const newExpense = await expenseService.create({
          ...expenseData,
          amount: parseFloat(expenseData.amount),
          tripId: selectedTrip.id
        })
        setExpenses(prev => [...prev, newExpense])
        toast.success('Expense added successfully')
      }
    } catch (err) {
      toast.error('Failed to save expense')
      console.error('Error saving expense:', err)
    }
  }

  const handleShowReceipt = (receiptUrl) => {
    setSelectedReceipt(receiptUrl)
    setShowReceiptModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-100 dark:bg-surface-900">
        <Header 
          darkMode={darkMode} 
          onToggleDarkMode={onToggleDarkMode}
          onNavigateHome={() => navigate('/')}
        />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-100 dark:bg-surface-900">
        <Header 
          darkMode={darkMode} 
          onToggleDarkMode={onToggleDarkMode}
          onNavigateHome={() => navigate('/')}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={loadData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-100 dark:bg-surface-900"
    >
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={onToggleDarkMode}
        onNavigateHome={() => navigate('/')}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarView
          trips={trips}
          selectedTrip={selectedTrip}
          expenses={expenses}
          categories={categories}
          paymentModes={paymentModes}
          onTripChange={handleTripChange}
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onShowReceipt={handleShowReceipt}
        />
      </div>

      <ExpenseForm
        show={showExpenseForm}
        onClose={() => {
          setShowExpenseForm(false)
          setSelectedDate(null)
        }}
        onSubmit={handleExpenseSubmit}
        editingExpense={editingExpense}
        tripCurrency={selectedTrip?.currency}
        categories={categories}
        currencies={['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']}
        paymentModes={paymentModes}
      />

      <ReceiptModal
        show={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        receiptUrl={selectedReceipt}
      />
    </motion.div>
  )
}

export default CalendarPage