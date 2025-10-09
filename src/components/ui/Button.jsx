// src/components/ui/Button.jsx
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses = 'btn';
  const variantClass = variant === 'secondary' ? 'btn-secondary' : 
                      variant === 'danger' ? 'btn-danger' : '';
  const classes = `${baseClasses} ${variantClass} ${className}`.trim();

  return (
    <button
      {...props}
      className={classes}
    >
      {children}
    </button>
  );
}
