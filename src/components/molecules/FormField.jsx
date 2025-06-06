import React from 'react'
import Label from '@/components/atoms/Label'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Text from '@/components/atoms/Text'

const FormField = ({ label, type = 'text', value, onChange, options, required, step, placeholder, as = 'input', rows, ...props }) => {
  const InputComponent = as === 'select' ? Select : (as === 'textarea' ? Textarea : Input);

  return (
    <div>
      <Label className="mb-2">{label}</Label>
      {as === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary"
          rows={rows}
          placeholder={placeholder}
          {...props}
        />
      ) : (
        <InputComponent
          type={type}
          value={value}
          onChange={onChange}
          options={options} // Only relevant for Select component
          required={required}
          step={step}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  )
}

// Basic Textarea component to be used within FormField
const Textarea = ({ value, onChange, className = '', placeholder = '', rows = 3, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary ${className}`}
    rows={rows}
    placeholder={placeholder}
    {...props}
  />
);

export default FormField