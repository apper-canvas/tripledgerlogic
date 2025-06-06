import React, { useState } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Icon from '@/components/atoms/Icon'
import TripSelector from '@/components/molecules/TripSelector'
import CalendarDay from '@/components/atoms/CalendarDay'

const CalendarView = ({
  trips,
  selectedTrip,
  expenses,
  categories,
  paymentModes,
  onTripChange,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onShowReceipt
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // month, week, day

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const getExpensesForDate = (date) => {
    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.date)
      return isSameDay(expenseDate, date)
    })
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    const colors = {
      transport: 'bg-blue-500',
      accommodation: 'bg-green-500',
      meals: 'bg-orange-500',
      other: 'bg-purple-500'
    }
    return colors[categoryId] || 'bg-gray-500'
  }

  const renderMonthView = () => {
    const rows = []
    let days = []
    let date = startDate

    // Calendar header
    const dateFormat = 'EEEE'
    const days_header = []
    let startDay = startOfWeek(currentDate)

    for (let i = 0; i < 7; i++) {
      days_header.push(
        <div key={i} className="p-2 text-center font-semibold text-surface-600 dark:text-surface-400 text-sm">
          {format(addDays(startDay, i), 'EEE')}
        </div>
      )
    }

    // Calendar days
    while (date <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayExpenses = getExpensesForDate(date)
        days.push(
          <CalendarDay
            key={date}
            date={date}
            isCurrentMonth={isSameMonth(date, monthStart)}
            isToday={isSameDay(date, new Date())}
            expenses={dayExpenses}
            categories={categories}
            onAddExpense={onAddExpense}
            onEditExpense={onEditExpense}
            onDeleteExpense={onDeleteExpense}
            getCategoryColor={getCategoryColor}
          />
        )
        date = addDays(date, 1)
      }
      rows.push(
        <div key={date} className="calendar-grid">
          {days}
        </div>
      )
      days = []
    }

    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
        <div className="calendar-grid bg-surface-50 dark:bg-surface-700">
          {days_header}
        </div>
        {rows}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const days = []

    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i)
      const dayExpenses = getExpensesForDate(date)
      
      days.push(
        <div key={date} className="flex-1 border-r border-surface-200 dark:border-surface-700 last:border-r-0">
          <div className="p-3 border-b border-surface-200 dark:border-surface-700 text-center">
            <Text className="text-sm font-medium text-surface-600 dark:text-surface-400">
              {format(date, 'EEE')}
            </Text>
            <Text className={`text-lg font-semibold ${isSameDay(date, new Date()) ? 'text-primary' : 'text-surface-900 dark:text-surface-100'}`}>
              {format(date, 'd')}
            </Text>
          </div>
          <div className="p-3 min-h-96">
            {dayExpenses.map(expense => (
              <div
                key={expense.id}
                className="mb-2 p-2 rounded-lg bg-surface-50 dark:bg-surface-700 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-600"
                onClick={() => onEditExpense(expense)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(expense.category)}`} />
                  <Text className="text-sm font-medium text-surface-900 dark:text-surface-100">
                    {expense.merchant}
                  </Text>
                </div>
                <Text className="text-xs text-surface-600 dark:text-surface-400">
                  {expense.amount} {expense.currency}
                </Text>
              </div>
            ))}
            <Button
              variant="text"
              onClick={() => onAddExpense(format(date, 'yyyy-MM-dd'))}
              className="w-full mt-2 border-2 border-dashed border-surface-300 dark:border-surface-600 hover:border-primary"
            >
              <Icon name="Plus" size={16} />
              Add
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
        <div className="flex">
          {days}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayExpenses = getExpensesForDate(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <Text as="h3" className="text-xl font-semibold text-surface-900 dark:text-surface-100">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </Text>
        </div>
        <div className="p-6">
          {dayExpenses.length > 0 ? (
            <div className="space-y-4">
              {dayExpenses.map(expense => (
                <div
                  key={expense.id}
                  className="p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer"
                  onClick={() => onEditExpense(expense)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getCategoryColor(expense.category)}`} />
                      <Text className="font-medium text-surface-900 dark:text-surface-100">
                        {expense.merchant}
                      </Text>
                    </div>
                    <Text className="font-semibold text-surface-900 dark:text-surface-100">
                      {expense.amount} {expense.currency}
                    </Text>
                  </div>
                  {expense.notes && (
                    <Text className="text-sm text-surface-600 dark:text-surface-400">
                      {expense.notes}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Calendar" className="h-12 w-12 text-surface-400 mx-auto mb-4" />
              <Text className="text-surface-600 dark:text-surface-400 mb-4">
                No expenses for this day
              </Text>
              <Button
                variant="primary"
                onClick={() => onAddExpense(format(currentDate, 'yyyy-MM-dd'))}
              >
                Add Expense
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7))
    } else {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7))
    } else {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy')
    } else if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate)
      const weekEnd = endOfWeek(currentDate)
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <TripSelector
            trips={trips}
            selectedTrip={selectedTrip}
            onTripChange={onTripChange}
          />
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Selector */}
          <div className="flex items-center bg-surface-200 dark:bg-surface-700 rounded-lg p-1">
            {['month', 'week', 'day'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'primary' : 'text'}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="px-3 py-1 text-sm capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} iconName="ChevronLeft">
          Previous
        </Button>
        
        <Text as="h2" className="text-xl font-semibold text-surface-900 dark:text-surface-100">
          {getHeaderTitle()}
        </Text>
        
        <Button variant="outline" onClick={handleNext} iconName="ChevronRight">
          Next
        </Button>
      </div>

      {/* Calendar Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${format(currentDate, 'yyyy-MM-dd')}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-4">
        <Text className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-3">
          Categories
        </Text>
        <div className="flex flex-wrap gap-4">
          {categories.map(category => (
            <div key={category.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.id)}`} />
              <Text className="text-sm text-surface-600 dark:text-surface-400">
                {category.name}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarView