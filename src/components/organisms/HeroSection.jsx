import React from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/atoms/Text'
import ProgressCircle from '@/components/molecules/ProgressCircle'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const HeroSection = ({ trip, stats, isSelected, onClick }) => {
  const getBudgetColorClass = (progress) => {
    if (progress >= 90) return 'bg-red-500'
    if (progress >= 75) return 'bg-amber-500'
    return 'bg-green-500'
  }

  const getBudgetTextColorClass = (progress) => {
    if (progress >= 90) return 'text-red-500'
    if (progress >= 75) return 'text-amber-500'
    return 'text-green-500'
  }

  const statusColorClass = trip.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
    trip.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border cursor-pointer transition-all duration-200 hover:shadow-soft ${
        isSelected ? 'border-primary' : 'border-surface-200 dark:border-surface-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <Text as="h3" className="font-semibold text-surface-900 dark:text-surface-100 truncate">{trip.name}</Text>
        <Badge className={statusColorClass}>
          {trip.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Text className="text-surface-600 dark:text-surface-400">Budget</Text>
          <Text className="font-semibold text-surface-900 dark:text-surface-100">
            {trip.currency} {trip.budget.toLocaleString()}
          </Text>
        </div>
        <div className="flex justify-between text-sm">
          <Text className="text-surface-600 dark:text-surface-400">Spent</Text>
          <Text className={`font-semibold ${getBudgetTextColorClass(stats.progress)}`}>
            {trip.currency} {stats.totalSpent.toLocaleString()}
          </Text>
        </div>

        <ProgressCircle progress={stats.progress} colorClass={getBudgetColorClass(stats.progress)} />
        <Text className="text-xs text-surface-500 dark:text-surface-400 text-right">
          {stats.progress.toFixed(1)}% used
        </Text>
      </div>
    </motion.div>
  )
}

export default HeroSection