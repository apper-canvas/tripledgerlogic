import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'

const CategoryForm = ({ show, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [errors, setErrors] = useState({})

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
      newErrors.name = 'Category name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim()
    })

    // Reset form
    setFormData({ name: '', description: '' })
    setErrors({})
  }

  const handleClose = () => {
    setFormData({ name: '', description: '' })
    setErrors({})
    onClose()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-neu-light dark:shadow-neu-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Create New Category
              </Text>
              <Button 
                variant="text" 
                onClick={handleClose} 
                className="p-2" 
                iconName="X" 
                iconSize={20}
                disabled={loading}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Category Name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                name="name"
                placeholder="Enter category name"
                error={errors.name}
              />

              <FormField
                label="Description"
                as="textarea"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe this category (optional)"
                name="description"
              />

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  onClick={handleClose} 
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
                  iconName={loading ? "Loader" : "Plus"}
                  iconSize={16}
                >
                  {loading ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CategoryForm