/**
 * Modern Card Component
 * Design System: Linear/Vercel style with Tailwind CSS
 */
export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'normal',
  ...rest 
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  }
  
  const baseClasses = `bg-white rounded-xl border border-gray-200 shadow-soft transition-all duration-200 ${paddingClasses[padding]}`
  const hoverClasses = hover ? 'hover:shadow-medium hover:scale-[1.01] cursor-pointer' : ''
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
