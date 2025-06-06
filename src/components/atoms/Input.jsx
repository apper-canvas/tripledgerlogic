import React from 'react'

const Input = ({ type = 'text', value, onChange, className = '', placeholder = '', required = false, step, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      step={step}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  )
}

export default Input