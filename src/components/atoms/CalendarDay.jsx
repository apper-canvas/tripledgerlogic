import React, { useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'

const CalendarDay = ({
  date,
  isCurrentMonth,
  isToday,
  expenses,
  categories,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  getCategoryColor
}) => {
  const [showExpenses, setShowExpenses] = useState(false)

  const handleDateClick = () => {
    if (expenses.length > 0) {
      setShowExpenses(!showExpenses)
    } else {
      onAddExpense(format(date, 'yyyy-MM-dd'))
    }
  }

  const dayClasses = `
    calendar-day hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-colors
    ${isToday ? 'today' : ''}
    ${!isCurrentMonth ? 'other-month' : ''}
  `

  return (
    <div className={dayClasses} onClick={handleDateClick}>
      <Text 
        className={`font-medium mb-1 ${
          isToday 
            ? 'text-primary font-bold' 
            : isCurrentMonth 
              ? 'text-surface-900 dark:text-surface-100' 
              : 'text-surface-400 dark:text-surface-600'
        }`}
      >
        {format(date, 'd')}
      </Text>
      
      {/* Expense indicators */}
      <div className="flex flex-wrap gap-1 justify-center">
        {expenses.slice(0, 3).map((expense, index) => (
          <div
            key={expense.id}
            className={`expense-dot ${getCategoryColor(expense.category)}`}
            style={{ 
              top: `${20 + index * 6}px`,
              left: `${4 + (index % 3) * 6}px`
            }}
            title={`${expense.merchant}: ${expense.amount} ${expense.currency}`}
          />
        ))}
        {expenses.length > 3 && (
          <div 
            className="expense-dot bg-surface-500"
            style={{ top: '38px', left: '22px' }}
            title={`+${expenses.length - 3} more expenses`}
          />
        )}
      </div>

      {/* Expense details popup */}
      <AnimatePresence>
        {showExpenses && expenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute z-50 mt-2 w-64 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 p-3"
            style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <Text className="font-medium text-surface-900 dark:text-surface-100">
                {format(date, 'MMM d')} Expenses
              </Text>
              <Button
                variant="text"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowExpenses(false)
                }}
                iconName="X"
                iconSize={16}
              />
            </div>
            
<div className="space-y-2 max-h-48 overflow-y-auto">
              {expenses.map(expense => (
                <div
                  key={expense.id}
                  className="flex flex-col p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer border border-surface-100 dark:border-surface-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditExpense(expense)
                    setShowExpenses(false)
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(expense.category)}`} />
                      <div className="min-w-0 flex-1">
                        <Text className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                          {expense.merchant}
                        </Text>
                        <Text className="text-xs text-surface-600 dark:text-surface-400">
                          {categories.find(c => c.id === expense.category)?.name || 'Other'}
                        </Text>
                      </div>
                    </div>
                    <Text className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: expense.currency || 'USD'
                      }).format(expense.amount)}
                    </Text>
                  </div>
                  {expense.tripId && (
                    <Text className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900 px-2 py-1 rounded-md">
                      Trip: {expense.tripName || 'Unknown Trip'}
                    </Text>
                  )}
                </div>
              ))}
            </div>
            
            <div className="border-t border-surface-200 dark:border-surface-700 mt-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddExpense(format(date, 'yyyy-MM-dd'))
                  setShowExpenses(false)
                }}
                className="w-full"
                iconName="Plus"
                iconSize={14}
              >
                Add Expense
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CalendarDay