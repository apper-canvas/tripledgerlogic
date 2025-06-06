import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import tripService from '../services/api/tripService'
import expenseService from '../services/api/expenseService'

const Home = () => {
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

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

  useEffect(() => {
    const loadExpenses = async () => {
      if (!selectedTrip) return
      try {
        const allExpenses = await expenseService.getAll()
        const tripExpenses = allExpenses?.filter(expense => expense.tripId === selectedTrip.id) || []
        setExpenses(tripExpenses)
      } catch (err) {
        console.error('Failed to load expenses:', err)
      }
    }
    loadExpenses()
  }, [selectedTrip])

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

  const calculateTripStats = (trip) => {
    const tripExpenses = expenses.filter(expense => expense.tripId === trip.id)
    const totalSpent = tripExpenses.reduce((sum, expense) => sum + (expense.convertedAmount || expense.amount), 0)
    const remaining = trip.budget - totalSpent
    const progress = Math.min((totalSpent / trip.budget) * 100, 100)
    
    return { totalSpent, remaining, progress }
  }

  const getBudgetColor = (progress) => {
    if (progress >= 90) return 'text-red-500'
    if (progress >= 75) return 'text-amber-500'
    return 'text-green-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-soft border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Plane" className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">TripLedger</h1>
              </div>
              
              {/* Trip Selector */}
              <div className="hidden sm:block">
                <select
                  value={selectedTrip?.id || ''}
                  onChange={(e) => {
                    const trip = trips.find(t => t.id === e.target.value)
                    setSelectedTrip(trip)
                  }}
                  className="bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Trip</option>
                  {trips.map(trip => (
                    <option key={trip.id} value={trip.id}>{trip.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <ApperIcon name={darkMode ? "Sun" : "Moon"} size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trips.slice(0, 4).map((trip) => {
            const stats = calculateTripStats(trip)
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border cursor-pointer transition-all duration-200 hover:shadow-soft ${
                  selectedTrip?.id === trip.id ? 'border-primary' : 'border-surface-200 dark:border-surface-700'
                }`}
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100 truncate">{trip.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trip.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    trip.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {trip.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Budget</span>
                    <span className="font-semibold text-surface-900 dark:text-surface-100">
                      {trip.currency} {trip.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Spent</span>
                    <span className={`font-semibold ${getBudgetColor(stats.progress)}`}>
                      {trip.currency} {stats.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        stats.progress >= 90 ? 'bg-red-500' :
                        stats.progress >= 75 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(stats.progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 text-right">
                    {stats.progress.toFixed(1)}% used
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Main Feature Component */}
        {selectedTrip && (
          <MainFeature 
            trip={selectedTrip} 
            expenses={expenses}
            onExpenseAdded={(newExpense) => {
              setExpenses(prev => [...prev, newExpense])
              toast.success('Expense added successfully')
            }}
            onExpenseUpdated={(updatedExpense) => {
              setExpenses(prev => prev.map(exp => 
                exp.id === updatedExpense.id ? updatedExpense : exp
              ))
              toast.success('Expense updated successfully')
            }}
            onExpenseDeleted={(expenseId) => {
              setExpenses(prev => prev.filter(exp => exp.id !== expenseId))
              toast.success('Expense deleted successfully')
            }}
          />
        )}

        {!selectedTrip && trips.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="MapPin" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">No trips found</h3>
            <p className="text-surface-600 dark:text-surface-400">Create your first trip to start tracking expenses</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home