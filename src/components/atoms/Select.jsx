import React from 'react'

const Select = ({ value, onChange, options, className = '', ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
className={`bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-2 text-sm text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    >
      {(options || []).map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select