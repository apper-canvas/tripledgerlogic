import React from 'react'

const ProgressCircle = ({ progress, className = '', colorClass }) => {
  return (
    <div className={`w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      ></div>
    </div>
  )
}

export default ProgressCircle