import React from 'react'
import ExpenseCard from '@/components/molecules/ExpenseCard'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

const ExpenseList = ({ expenses, tripCurrency, categories, paymentModes, onEditExpense, onDeleteExpense, onShowReceipt }) => {
  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[3]
  }

  const getPaymentModeInfo = (paymentModeId) => {
    return paymentModes?.find(mode => mode.id === paymentModeId) || { name: 'Cash', icon: 'Banknote' }
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-100">
          Expenses ({expenses.length})
        </Text>
      </div>

      <div className="divide-y divide-surface-200 dark:divide-surface-700">
{expenses.map(expense => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            categoryInfo={getCategoryInfo(expense.category)}
            paymentModeInfo={getPaymentModeInfo(expense.paymentMode)}
            tripCurrency={tripCurrency}
            onEdit={onEditExpense}
            onDelete={onDeleteExpense}
            onShowReceipt={onShowReceipt}
          />
        ))}

        {expenses.length === 0 && (
          <div className="p-12 text-center">
            <Icon name="Receipt" className="h-12 w-12 text-surface-400 mx-auto mb-4" />
            <Text as="h4" className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No expenses found
            </Text>
            <Text className="text-surface-600 dark:text-surface-400">
              {expenses.length === 0 && expenses.some(exp => exp.category === 'all')
                ? 'Add your first expense to start tracking'
                : `No expenses in ${categories.find(c => c.id === expenses.length === 0 ? 'all' : expenses[0]?.category)?.name} category`
              }
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseList