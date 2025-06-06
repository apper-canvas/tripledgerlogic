import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import ProgressCircle from '@/components/molecules/ProgressCircle'

const TripOverview = ({ trip, totalSpent, budgetProgress, onAddExpense }) => {
  const getBudgetColorClass = (progress) => {
    if (progress >= 90) return 'bg-red-500'
    if (progress >= 75) return 'bg-amber-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Text as="h2" className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
            {trip.name}
          </Text>
          <Text className="text-surface-600 dark:text-surface-400">
            {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
          </Text>
        </div>
        <Button
          onClick={onAddExpense}
          variant="primary"
          iconName="Plus"
          iconSize={20}
          className="mt-4 sm:mt-0"
        >
          Add Expense
        </Button>
      </div>

      <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <Text className="text-sm font-medium text-surface-600 dark:text-surface-400">Budget Progress</Text>
          <Text className="text-sm font-semibold text-surface-900 dark:text-surface-100">
            {trip.currency} {totalSpent.toLocaleString()} / {trip.budget.toLocaleString()}
          </Text>
        </div>
        <ProgressCircle
          progress={budgetProgress}
          colorClass={getBudgetColorClass(budgetProgress)}
          className="h-3"
        />
        <div className="flex justify-between mt-2 text-xs text-surface-500 dark:text-surface-400">
          <Text>{budgetProgress.toFixed(1)}% used</Text>
          <Text>{trip.currency} {(trip.budget - totalSpent).toLocaleString()} remaining</Text>
        </div>
      </div>
    </div>
  )
}

export default TripOverview