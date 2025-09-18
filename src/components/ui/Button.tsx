import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary)',
          color: 'white',
          borderColor: 'var(--primary)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--muted-bg)',
          color: 'var(--muted)',
          borderColor: 'var(--card-border)',
          border: '1px solid'
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger)',
          color: 'white',
          borderColor: 'var(--danger)'
        };
      default:
        return {
          backgroundColor: 'var(--primary)',
          color: 'white',
          borderColor: 'var(--primary)'
        };
    }
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.backgroundColor = 'var(--card-border)';
    } else if (variant === 'danger') {
      e.currentTarget.style.backgroundColor = 'var(--danger)';
      e.currentTarget.style.opacity = '0.9';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const styles = getVariantStyles(variant);
    e.currentTarget.style.backgroundColor = styles.backgroundColor;
    e.currentTarget.style.opacity = '1';
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={getVariantStyles(variant)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;