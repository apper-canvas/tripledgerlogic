import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import expenseService from '@/services/api/expenseService'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import FormField from '@/components/molecules/FormField'

const ManagePaymentModesPage = () => {
  const navigate = useNavigate()
  const [paymentModes, setPaymentModes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMode, setEditingMode] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'MoreHorizontal'
  })

  const iconOptions = [
    { value: 'Banknote', label: 'Banknote' },
    { value: 'CreditCard', label: 'Credit Card' },
    { value: 'ArrowLeftRight', label: 'Transfer' },
    { value: 'Smartphone', label: 'Digital Wallet' },
    { value: 'MoreHorizontal', label: 'Other' }
  ]

  useEffect(() => {
    loadPaymentModes()
  }, [])

  const loadPaymentModes = async () => {
    try {
      setLoading(true)
      const modes = await expenseService.getPaymentModes()
      setPaymentModes(modes)
    } catch (error) {
      toast.error('Failed to load payment modes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingMode) {
        await expenseService.updatePaymentMode(editingMode.id, formData)
        toast.success('Payment mode updated successfully')
      } else {
        await expenseService.createPaymentMode(formData)
        toast.success('Payment mode created successfully')
      }
      setShowForm(false)
      setEditingMode(null)
      setFormData({ name: '', description: '', icon: 'MoreHorizontal' })
      loadPaymentModes()
    } catch (error) {
      toast.error(error.message || 'Failed to save payment mode')
    }
  }

  const handleEdit = (mode) => {
    setEditingMode(mode)
    setFormData({
      name: mode.name,
      description: mode.description,
      icon: mode.icon
    })
    setShowForm(true)
  }

  const handleDelete = async (modeId) => {
    if (!confirm('Are you sure you want to delete this payment mode?')) return
    
    try {
      await expenseService.deletePaymentMode(modeId)
      toast.success('Payment mode deleted successfully')
      loadPaymentModes()
    } catch (error) {
      toast.error(error.message || 'Failed to delete payment mode')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingMode(null)
    setFormData({ name: '', description: '', icon: 'MoreHorizontal' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-100 dark:bg-surface-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Text>Loading payment modes...</Text>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-surface-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="text" 
              iconName="ArrowLeft" 
              onClick={() => navigate(-1)}
              className="p-2"
            />
            <div>
              <Text as="h1" className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                Manage Payment Modes
              </Text>
              <Text className="text-surface-600 dark:text-surface-400">
                Configure available payment methods for expenses
              </Text>
            </div>
          </div>
          <Button
            variant="primary"
            iconName="Plus"
            onClick={() => setShowForm(true)}
          >
            Add Payment Mode
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6 mb-8">
            <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              {editingMode ? 'Edit Payment Mode' : 'Add New Payment Mode'}
            </Text>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  placeholder="Enter payment mode name"
                />
                <FormField
                  label="Icon"
                  as="select"
                  value={formData.icon}
                  onChange={handleChange}
                  options={iconOptions}
                  name="icon"
                />
              </div>
              
              <FormField
                label="Description"
                as="textarea"
                value={formData.description}
                onChange={handleChange}
                name="description"
                rows="3"
                placeholder="Enter description (optional)"
              />

              <div className="flex space-x-3 pt-4">
                <Button type="button" onClick={resetForm} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingMode ? 'Update' : 'Create'} Payment Mode
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Modes List */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Payment Modes ({paymentModes.length})
            </Text>
          </div>

          <div className="divide-y divide-surface-200 dark:divide-surface-700">
            {paymentModes.map(mode => (
              <div key={mode.id} className="p-6 hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name={mode.icon} className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    <div>
                      <Text as="h4" className="font-semibold text-surface-900 dark:text-surface-100">
                        {mode.name}
                      </Text>
                      {mode.description && (
                        <Text className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                          {mode.description}
                        </Text>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="text"
                      size="sm"
                      iconName="Edit2"
                      onClick={() => handleEdit(mode)}
                      className="text-surface-600 hover:text-surface-700"
                    />
                    <Button
                      variant="text"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => handleDelete(mode.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={['cash', 'credit-card', 'debit-card', 'bank-transfer', 'digital-wallet', 'other'].includes(mode.id)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {paymentModes.length === 0 && (
              <div className="p-12 text-center">
                <Icon name="CreditCard" className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <Text as="h4" className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  No payment modes found
                </Text>
                <Text className="text-surface-600 dark:text-surface-400">
                  Add your first payment mode to get started
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagePaymentModesPage