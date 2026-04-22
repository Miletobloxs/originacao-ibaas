import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon
}: BadgeProps) {
  const variants = {
    primary: 'bg-[var(--bloxs-blue-xlight)] text-[var(--bloxs-blue)]',
    secondary: 'bg-[var(--bloxs-navy)] text-[var(--bloxs-white)]',
    success: 'bg-[var(--bloxs-success-light)] text-[var(--bloxs-success)]',
    warning: 'bg-[var(--bloxs-warning-light)] text-[var(--bloxs-warning)]',
    error: 'bg-[var(--bloxs-error-light)] text-[var(--bloxs-error)]',
    gray: 'bg-[var(--bloxs-gray-100)] text-[var(--bloxs-gray-600)]'
  };

  const sizes = {
    sm: 'text-[10px] py-[2px] px-[7px]',
    md: 'text-[11px] py-[3px] px-[10px]'
  };

  return (
    <span className={`inline-flex items-center gap-[5px] rounded-[var(--bloxs-radius-full)] font-semibold ${variants[variant]} ${sizes[size]}`}>
      {icon && icon}
      {children}
    </span>
  );
}
