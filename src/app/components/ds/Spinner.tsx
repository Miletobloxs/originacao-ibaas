interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'muted';
  className?: string;
}

export function Spinner({
  size = 'md',
  color = 'primary',
  className = ''
}: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors = {
    primary: 'text-[var(--bloxs-blue)]',
    secondary: 'text-[var(--bloxs-navy)]',
    white: 'text-[var(--bloxs-white)]',
    muted: 'text-[var(--bloxs-gray-400)]'
  };

  return (
    <div className={`inline-block ${className}`} role="status" aria-label="Carregando">
      <i className={`fas fa-spinner animate-spin ${sizes[size]} ${colors[color]}`}></i>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

interface SpinnerOverlayProps {
  message?: string;
}

export function SpinnerOverlay({ message = 'Carregando...' }: SpinnerOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[var(--bloxs-z-modal)]">
      <div className="bg-[var(--bloxs-white)] rounded-[var(--bloxs-radius-xl)] p-8 flex flex-col items-center gap-4 shadow-[var(--bloxs-shadow-xl)]">
        <Spinner size="xl" />
        <p className="text-[var(--bloxs-text-base)] text-[var(--bloxs-text)] font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
