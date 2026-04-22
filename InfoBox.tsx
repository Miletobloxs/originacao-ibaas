import { ReactNode } from 'react';

interface InfoBoxProps {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'error';
  icon?: ReactNode;
  title?: string;
}

export function InfoBox({
  children,
  variant = 'info',
  icon,
  title
}: InfoBoxProps) {
  const variants = {
    info: {
      bg: 'bg-[var(--bloxs-blue-xxlight)]',
      border: 'border-[var(--bloxs-blue-light)]',
      borderLeft: 'border-l-[var(--bloxs-blue)]',
      text: 'text-[var(--bloxs-navy)]'
    },
    warning: {
      bg: 'bg-[#fffbeb]',
      border: 'border-[var(--bloxs-warning)]',
      borderLeft: 'border-l-[var(--bloxs-warning)]',
      text: 'text-[var(--bloxs-navy)]'
    },
    success: {
      bg: 'bg-[var(--bloxs-success-light)]',
      border: 'border-[var(--bloxs-success)]',
      borderLeft: 'border-l-[var(--bloxs-success)]',
      text: 'text-[var(--bloxs-navy)]'
    },
    error: {
      bg: 'bg-[var(--bloxs-error-light)]',
      border: 'border-[var(--bloxs-error)]',
      borderLeft: 'border-l-[var(--bloxs-error)]',
      text: 'text-[var(--bloxs-navy)]'
    }
  };

  const style = variants[variant];

  return (
    <div className={`${style.bg} border ${style.border} border-l-[3px] ${style.borderLeft} rounded-[var(--bloxs-radius-lg)] p-[14px_18px] text-[var(--bloxs-text-base)] ${style.text} leading-relaxed`}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-lg">{icon}</span>}
          {title && <strong className="font-semibold">{title}</strong>}
        </div>
      )}
      <div className="[&>strong]:font-semibold">
        {children}
      </div>
    </div>
  );
}
