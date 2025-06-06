import React, { useState } from 'react'
import { format, addDays } from 'date-fns'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Icon from '@/components/atoms/Icon'

const TripForm = ({ onSubmit, onCancel, loading = false, editingTrip = null }) => {
  const initialFormData = {
    name: '',
    destination: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    budget: '',
    currency: 'USD',
    description: ''
  }

  const [formData, setFormData] = useState(editingTrip || initialFormData)
  const [errors, setErrors] = useState({})

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Trip name is required'
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const tripData = {
      ...formData,
      budget: parseFloat(formData.budget)
    }

    onSubmit(tripData)
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-8 shadow-card border border-surface-200 dark:border-surface-700">
      <div className="flex items-center mb-6">
        <Icon name="MapPin" className="h-6 w-6 text-primary mr-3" />
        <Text as="h2" className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          {editingTrip ? 'Edit Trip' : 'Create New Trip'}
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Trip Name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          name="name"
          placeholder="Enter trip name"
          error={errors.name}
        />

        <FormField
          label="Destination"
          type="text"
          required
          value={formData.destination}
          onChange={handleChange}
          name="destination"
          placeholder="Enter destination"
          error={errors.destination}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Start Date"
            type="date"
            required
            value={formData.startDate}
            onChange={handleChange}
            name="startDate"
            error={errors.startDate}
          />

          <FormField
            label="End Date"
            type="date"
            required
            value={formData.endDate}
            onChange={handleChange}
            name="endDate"
            error={errors.endDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Budget"
            type="number"
            step="0.01"
            required
            value={formData.budget}
            onChange={handleChange}
            name="budget"
            placeholder="0.00"
            error={errors.budget}
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
          label="Description"
          as="textarea"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe your trip (optional)"
          name="description"
        />

        <div className="flex space-x-4 pt-6">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
            iconName={loading ? "Loader" : "Check"}
            iconSize={16}
          >
            {loading ? 'Creating...' : (editingTrip ? 'Update Trip' : 'Create Trip')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default TripForm