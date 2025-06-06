import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '@/components/molecules/Header'
import CategoryForm from '@/components/organisms/CategoryForm'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Icon from '@/components/atoms/Icon'
import expenseService from '@/services/api/expenseService'

const ManageCategoriesPage = ({ darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await expenseService.getCategories()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (categoryData) => {
    setFormLoading(true)
    try {
      await expenseService.createCategory(categoryData)
      toast.success('Category created successfully!')
      setShowForm(false)
      loadCategories()
    } catch (error) {
      toast.error(error.message || 'Failed to create category')
      console.error('Error creating category:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      await expenseService.deleteCategory(categoryId)
      toast.success('Category deleted successfully!')
      loadCategories()
    } catch (error) {
      toast.error(error.message || 'Failed to delete category')
      console.error('Error deleting category:', error)
    }
  }

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-surface-900">
      <Header 
        trips={[]}
        selectedTrip={null}
        onSelectTrip={() => {}}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Text as="h1" className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              Manage Categories
            </Text>
            <Text className="text-surface-600 dark:text-surface-400">
              Create and manage expense categories for your trips
            </Text>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              iconName="ArrowLeft"
              iconSize={16}
            >
              Back to Home
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              iconName="Plus"
              iconSize={16}
            >
              New Category
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Icon name="Loader" className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Categories ({categories.length})
              </Text>
            </div>
            
            <div className="divide-y divide-surface-200 dark:divide-surface-700">
              {categories.map(category => (
                <div key={category.id} className="p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <Text as="h4" className="font-semibold text-surface-900 dark:text-surface-100 mb-1">
                      {category.name}
                    </Text>
                    <Text className="text-sm text-surface-600 dark:text-surface-400">
                      {category.description}
                    </Text>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleDeleteCategory(category.id)}
                      variant="outline"
                      iconName="Trash2"
                      iconSize={16}
                      className="text-red-600 hover:text-red-700 hover:border-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <CategoryForm
          show={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateCategory}
          loading={formLoading}
        />
      </div>
    </div>
  )
}

export default ManageCategoriesPage