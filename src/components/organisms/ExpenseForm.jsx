import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

const ExpenseForm = ({
  show,
  onClose,
  onSubmit,
  editingExpense,
  tripCurrency,
  categories,
  currencies,
  paymentModes
}) => {
const initialFormData = {
    amount: '',
    currency: tripCurrency || 'USD',
    category: 'meals',
    paymentMode: 'cash',
    merchant: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    receiptUrl: ''
  }
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        currency: editingExpense.currency,
        category: editingExpense.category,
        paymentMode: editingExpense.paymentMode || 'cash',
        merchant: editingExpense.merchant,
        date: format(new Date(editingExpense.date), 'yyyy-MM-dd'),
        notes: editingExpense.notes || '',
        receiptUrl: editingExpense.receiptUrl || ''
      })
    } else {
      setFormData(initialFormData)
    }
  }, [editingExpense, show, tripCurrency])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData, editingExpense?.id)
    onClose()
  }

const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }))
  const currencyOptions = currencies.map(curr => ({ value: curr, label: curr }))
  const paymentModeOptions = paymentModes?.map(mode => ({ value: mode.id, label: mode.name })) || []

return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-neu-light dark:shadow-neu-dark max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {editingExpense ? 'Edit Expense' : 'Add Expense'}
              </Text>
              <Button variant="text" onClick={onClose} className="p-2" iconName="X" iconSize={20} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Amount"
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  name="amount"
                />
                <FormField
                  label="Currency"
                  as="select"
                  value={formData.currency}
                  onChange={handleChange}
                  options={currencyOptions}
                  name="currency"
                />
              </div>

<FormField
                label="Category"
                as="select"
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
                name="category"
              />

              <FormField
                label="Payment Mode"
                as="select"
                value={formData.paymentMode}
                onChange={handleChange}
                options={paymentModeOptions}
                name="paymentMode"
                required
              />
              <FormField
                label="Merchant"
                type="text"
                required
                value={formData.merchant}
                onChange={handleChange}
                placeholder="Enter merchant name"
                name="merchant"
              />

              <FormField
                label="Date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
                name="date"
              />

              <FormField
                label="Notes"
                as="textarea"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Add notes (optional)"
                name="notes"
              />

              <div className="flex space-x-3 pt-4">
                <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  {editingExpense ? 'Update' : 'Add'} Expense
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExpenseForm