import { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function KPICard({
  label,
  value,
  subtitle,
  icon,
  trend,
  trendValue
}: KPICardProps) {
  const trendColors = {
    up: 'text-[var(--bloxs-success)]',
    down: 'text-[var(--bloxs-error)]',
    neutral: 'text-[var(--bloxs-text-muted)]'
  };

  const trendIcons = {
    up: <i className="fas fa-arrow-up text-[10px]"></i>,
    down: <i className="fas fa-arrow-down text-[10px]"></i>,
    neutral: <i className="fas fa-minus text-[10px]"></i>
  };

  return (
    <div className="bg-[var(--bloxs-white)] border border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-xl)] p-[22px_24px] flex flex-col gap-2 hover:shadow-[var(--bloxs-shadow-lg)] transition-shadow duration-[var(--bloxs-transition-base)]">
      <div className="flex items-center gap-[6px] text-[var(--bloxs-text-xs)] font-semibold tracking-[var(--bloxs-tracking-wider)] uppercase text-[var(--bloxs-gray-400)]">
        {icon && <span className="text-[11px]">{icon}</span>}
        {label}
      </div>

      <div className="font-[var(--bloxs-font-display)] text-[26px] font-semibold text-[var(--bloxs-navy)] tracking-tight leading-none">
        {value}
      </div>

      <div className="flex items-center gap-[5px] text-[var(--bloxs-text-sm)] text-[var(--bloxs-text-muted)]">
        {trend && trendValue && (
          <>
            <span className={`flex items-center gap-1 ${trendColors[trend]}`}>
              {trendIcons[trend]}
              {trendValue}
            </span>
            {subtitle && <span className="text-[var(--bloxs-text-muted)]">·</span>}
          </>
        )}
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
}
