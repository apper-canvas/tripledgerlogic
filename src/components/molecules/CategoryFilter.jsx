import React from 'react'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
<div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => onSelectCategory('all')}
        className={selectedCategory === 'all' ? 'bg-primary text-white shadow-lg' : 'bg-surface-200 dark:bg-surface-600 text-surface-800 dark:text-surface-100 hover:bg-surface-300 dark:hover:bg-surface-500 shadow-md hover:shadow-lg text-base font-semibold'}
      >
        All
      </Button>
      {categories.map(category => (
        <Button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex items-center gap-1 text-base font-semibold ${selectedCategory === category.id
              ? 'bg-primary text-white shadow-lg'
              : 'bg-surface-200 dark:bg-surface-600 text-surface-800 dark:text-surface-100 hover:bg-surface-300 dark:hover:bg-surface-500 shadow-md hover:shadow-lg'
            }`}
        >
          <Icon name={category.icon} size={16} />
          {category.name}
        </Button>
      ))}
    </div>
  )
}

export default CategoryFilter