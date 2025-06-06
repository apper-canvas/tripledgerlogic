import React from 'react'
import Select from '@/components/atoms/Select'

const TripSelector = ({ value, onChange, options }) => {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      options={options}
    />
  )
}

export default TripSelector