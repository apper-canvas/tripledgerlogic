import React from 'react'
import { format } from 'date-fns'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const ExpenseCard = ({ 
  expense, 
  categoryInfo, 
  tripCurrency, 
  onEdit, 
  onDelete, 
  onShowReceipt,
  paymentModeInfo 
}) => {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const getPaymentModeIcon = (paymentMode) => {
    const modeIcons = {
      'cash': 'Banknote',
      'credit-card': 'CreditCard',
      'debit-card': 'CreditCard',
      'bank-transfer': 'ArrowLeftRight',
      'digital-wallet': 'Smartphone',
      'other': 'MoreHorizontal'
    }
    return modeIcons[paymentMode] || 'MoreHorizontal'
  }

  return (
    <div className="p-6 hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-2">
              <Icon 
                name={categoryInfo?.icon || 'Package'} 
                className="h-5 w-5 text-primary-600 dark:text-primary-400"
              />
              <Text as="h4" className="font-semibold text-surface-900 dark:text-surface-100">
                {expense.merchant}
              </Text>
            </div>
            <Badge variant="secondary" className="text-xs">
              {categoryInfo?.name || 'Other'}
            </Badge>
          </div>

          <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400 mb-2">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" className="h-4 w-4" />
              <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Icon name={getPaymentModeIcon(expense.paymentMode)} className="h-4 w-4" />
              <span>{paymentModeInfo?.name || 'Cash'}</span>
            </div>
          </div>

          {expense.notes && (
            <Text className="text-sm text-surface-600 dark:text-surface-400 mb-3">
              {expense.notes}
            </Text>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Text as="span" className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                {formatCurrency(expense.amount, expense.currency)}
              </Text>
              {expense.currency !== tripCurrency && (
                <Text as="span" className="text-sm text-surface-500 dark:text-surface-400 ml-2">
                  ({expense.currency})
                </Text>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {expense.receiptUrl && (
                <Button
                  variant="text"
                  size="sm"
                  iconName="Eye"
                  onClick={() => onShowReceipt(expense.receiptUrl)}
                  className="text-primary-600 hover:text-primary-700"
                />
              )}
              <Button
                variant="text"
                size="sm"
                iconName="Edit2"
                onClick={() => onEdit(expense)}
                className="text-surface-600 hover:text-surface-700"
              />
              <Button
                variant="text"
                size="sm"
                iconName="Trash2"
                onClick={() => onDelete(expense.id)}
                className="text-red-600 hover:text-red-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseCard