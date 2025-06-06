import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Icon from '@/components/atoms/Icon'
import Badge from '@/components/atoms/Badge'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const ExpenseCard = ({ expense, categoryInfo, tripCurrency, onEdit, onDelete, onShowReceipt }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0 cursor-pointer"
            style={{ backgroundImage: `url(${expense.receiptUrl})` }}
            onClick={() => onShowReceipt(expense.receiptUrl)}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Text as="h4" className="font-semibold text-surface-900 dark:text-surface-100 truncate">
                {expense.merchant}
              </Text>
              <Badge className={categoryInfo.color}>
                {categoryInfo.name}
              </Badge>
            </div>
            <Text className="text-sm text-surface-600 dark:text-surface-400">
              {format(new Date(expense.date), 'MMM dd, yyyy')}
            </Text>
            {expense.notes && (
              <Text className="text-sm text-surface-500 dark:text-surface-400 mt-1 truncate">
                {expense.notes}
              </Text>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <Text className="font-semibold text-surface-900 dark:text-surface-100">
              {expense.currency} {expense.amount.toLocaleString()}
            </Text>
            {expense.currency !== tripCurrency && (
              <Text className="text-sm text-surface-500 dark:text-surface-400">
                {tripCurrency} {expense.convertedAmount?.toLocaleString()}
              </Text>
            )}
          </div>

          <div className="flex space-x-1">
            <Button variant="text" onClick={() => onEdit(expense)} iconName="Edit2" iconSize={16} />
            <Button variant="danger" onClick={() => onDelete(expense.id)} iconName="Trash2" iconSize={16} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ExpenseCard