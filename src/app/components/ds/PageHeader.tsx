import { ReactNode } from 'react';

interface PageHeaderProps {
  breadcrumb?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  showDivider?: boolean;
}

export function PageHeader({
  breadcrumb,
  title,
  subtitle,
  action,
  showDivider = true
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumb && (
        <div className="text-[var(--bloxs-text-xs)] font-semibold tracking-[var(--bloxs-tracking-widest)] uppercase text-[var(--bloxs-blue)] mb-2">
          {breadcrumb}
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-4xl)] font-semibold text-[var(--bloxs-navy)] tracking-tight mb-1.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[var(--bloxs-text-md)] text-[var(--bloxs-text-muted)]">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {showDivider && (
        <div className="h-px bg-[var(--bloxs-border)] mt-5"></div>
      )}
    </div>
  );
}
