import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-[var(--bloxs-font-body)] font-semibold rounded-[var(--bloxs-radius-base)] transition-all duration-[var(--bloxs-transition-base)] outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[var(--bloxs-navy)] text-[var(--bloxs-white)] hover:bg-[var(--bloxs-blue)] active:bg-[var(--bloxs-navy-mid)]',
    secondary: 'bg-[var(--bloxs-blue)] text-[var(--bloxs-white)] hover:bg-[var(--bloxs-navy)] active:bg-[var(--bloxs-blue-mid)]',
    outline: 'bg-[var(--bloxs-white)] text-[var(--bloxs-navy)] border-[var(--bloxs-border-medium)] border-[var(--bloxs-border)] hover:border-[var(--bloxs-navy)] hover:bg-[var(--bloxs-gray-50)]',
    ghost: 'bg-transparent text-[var(--bloxs-blue)] hover:bg-[var(--bloxs-blue-xxlight)]'
  };

  const sizes = {
    sm: 'text-[var(--bloxs-text-sm)] px-[14px] py-[7px]',
    md: 'text-[var(--bloxs-text-md)] px-[18px] py-[9px]',
    lg: 'text-[var(--bloxs-text-lg)] px-[28px] py-[13px]'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <i className="fas fa-spinner fa-spin"></i>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}
