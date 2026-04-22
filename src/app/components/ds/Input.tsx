import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label className="text-[var(--bloxs-text-sm)] font-medium text-[var(--bloxs-gray-800)] tracking-[var(--bloxs-tracking-wide)]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--bloxs-gray-400)]">
            {leftIcon}
          </div>
        )}
        <input
          className={`w-full py-[var(--bloxs-input-padding-y)] px-[var(--bloxs-input-padding-x)] ${
            leftIcon ? 'pl-10' : ''
          } ${
            rightIcon ? 'pr-10' : ''
          } border-[var(--bloxs-border-medium)] border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-base)] text-[var(--bloxs-text-base)] font-[var(--bloxs-font-body)] text-[var(--bloxs-text)] bg-[var(--bloxs-white)] outline-none transition-all duration-[var(--bloxs-transition-base)] focus:border-[var(--bloxs-blue)] focus:shadow-[var(--bloxs-shadow-focus)] ${
            error ? 'border-[var(--bloxs-error)]' : ''
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--bloxs-gray-400)]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <span className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-error)]">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)]">
          {helperText}
        </span>
      )}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  helperText,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label className="text-[var(--bloxs-text-sm)] font-medium text-[var(--bloxs-gray-800)] tracking-[var(--bloxs-tracking-wide)]">
          {label}
        </label>
      )}
      <select
        className={`w-full py-[var(--bloxs-input-padding-y)] px-[var(--bloxs-input-padding-x)] border-[var(--bloxs-border-medium)] border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-base)] text-[var(--bloxs-text-base)] font-[var(--bloxs-font-body)] text-[var(--bloxs-text)] bg-[var(--bloxs-white)] outline-none transition-all duration-[var(--bloxs-transition-base)] focus:border-[var(--bloxs-blue)] focus:shadow-[var(--bloxs-shadow-focus)] appearance-none cursor-pointer ${
          error ? 'border-[var(--bloxs-error)]' : ''
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-error)]">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)]">
          {helperText}
        </span>
      )}
    </div>
  );
}

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
}

export function Textarea({
  label,
  error,
  helperText,
  rows = 4,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label className="text-[var(--bloxs-text-sm)] font-medium text-[var(--bloxs-gray-800)] tracking-[var(--bloxs-tracking-wide)]">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full py-[var(--bloxs-input-padding-y)] px-[var(--bloxs-input-padding-x)] border-[var(--bloxs-border-medium)] border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-base)] text-[var(--bloxs-text-base)] font-[var(--bloxs-font-body)] text-[var(--bloxs-text)] bg-[var(--bloxs-white)] outline-none resize-vertical min-h-[90px] transition-all duration-[var(--bloxs-transition-base)] focus:border-[var(--bloxs-blue)] focus:shadow-[var(--bloxs-shadow-focus)] ${
          error ? 'border-[var(--bloxs-error)]' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-error)]">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)]">
          {helperText}
        </span>
      )}
    </div>
  );
}
