import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClass = hover ? 'hover:shadow-[var(--bloxs-shadow-lg)] transition-shadow duration-[var(--bloxs-transition-base)]' : '';

  return (
    <div className={`bg-[var(--bloxs-white)] border border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-xl)] ${paddingClasses[padding]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ children, className = '', icon, action }: CardHeaderProps) {
  return (
    <div className={`px-6 py-[18px] border-b border-[var(--bloxs-border)] flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2 text-[var(--bloxs-text-base)] font-semibold text-[var(--bloxs-navy)]">
        {icon && <span className="text-[var(--bloxs-blue)] text-[13px]">{icon}</span>}
        {children}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function CardBody({ children, className = '', padding = 'md' }: CardBodyProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
