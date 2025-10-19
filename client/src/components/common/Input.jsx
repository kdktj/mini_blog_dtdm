/**
 * Modern Input Component
 * Design System: Linear/Vercel style with Tailwind CSS
 */
export default function Input({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange,
  error = '',
  disabled = false,
  required = false,
  name = '',
  className = '',
  ...rest
}) {
  const inputClasses = `w-full px-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed ${
    error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
  } ${className}`
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={name || label} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name || label}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...rest}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
