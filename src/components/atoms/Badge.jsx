import React from 'react'

const Badge = ({ children, className = '' }) => {
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${className}`}>
      {children}
    </span>
  )
}

export default Badge