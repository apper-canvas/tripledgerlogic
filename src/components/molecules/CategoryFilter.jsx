import React from 'react'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => onSelectCategory('all')}
        className={selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'}
      >
        All
      </Button>
      {categories.map(category => (
        <Button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex items-center gap-1 ${selectedCategory === category.id
              ? 'bg-primary text-white'
              : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
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