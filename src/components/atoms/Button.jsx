import React from 'react'
import Icon from '@/components/atoms/Icon'

const Button = ({ children, onClick, className = '', variant = 'primary', iconName, iconSize = 20, type = 'button', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-base transition-all duration-200 shadow-md hover:shadow-lg"

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-soft",
    secondary: "bg-surface-200 dark:bg-surface-600 text-surface-800 dark:text-surface-100 hover:bg-surface-300 dark:hover:bg-surface-500 font-semibold",
    outline: "border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700",
    text: "text-surface-400 hover:text-primary shadow-none hover:shadow-none",
    danger: "text-surface-400 hover:text-red-500 shadow-none hover:shadow-none"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {iconName && <Icon name={iconName} size={iconSize} className="mr-2" />}
      {children}
    </button>
  )
}

export default Button