import { ReactNode } from 'react';

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'vertical'
}: StepperProps) {
  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-[6px]">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isDone = stepNumber < currentStep;

          return (
            <div
              key={index}
              className={`flex items-start gap-[14px] py-[14px] px-4 rounded-[var(--bloxs-radius-lg)] cursor-default transition-all duration-[var(--bloxs-transition-base)] ${
                isActive
                  ? 'bg-[var(--bloxs-blue-xlight)]'
                  : isDone
                  ? 'bg-[var(--bloxs-gray-100)]'
                  : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 transition-all duration-[var(--bloxs-transition-slow)] ${
                  isActive
                    ? 'bg-[var(--bloxs-blue)] text-[var(--bloxs-white)]'
                    : isDone
                    ? 'bg-[var(--bloxs-success)] text-[var(--bloxs-white)]'
                    : 'bg-[var(--bloxs-gray-200)] text-[var(--bloxs-gray-600)]'
                }`}
              >
                {isDone ? <i className="fas fa-check"></i> : stepNumber}
              </div>
              <div className="flex-1">
                <strong
                  className={`block text-[13px] font-semibold ${
                    isActive ? 'text-[var(--bloxs-blue)]' : 'text-[var(--bloxs-navy)]'
                  }`}
                >
                  {step.label}
                </strong>
                {step.description && (
                  <span className="text-[11.5px] text-[var(--bloxs-text-muted)] leading-tight block mt-[2px]">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal stepper
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className="flex flex-col items-center flex-1 min-w-[90px] relative"
          >
            {!isLast && (
              <div
                className={`absolute top-[18px] left-1/2 w-full h-[2px] z-0 ${
                  isDone
                    ? 'bg-[var(--bloxs-blue)]'
                    : isActive
                    ? 'bg-gradient-to-r from-[var(--bloxs-blue)] to-[var(--bloxs-border)]'
                    : 'bg-[var(--bloxs-border)]'
                }`}
              ></div>
            )}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 relative z-10 flex-shrink-0 transition-all duration-[var(--bloxs-transition-slow)] ${
                isActive
                  ? 'bg-[var(--bloxs-blue)] text-[var(--bloxs-white)] border-[var(--bloxs-blue)]'
                  : isDone
                  ? 'bg-[var(--bloxs-success)] text-[var(--bloxs-white)] border-[var(--bloxs-success)]'
                  : 'bg-[var(--bloxs-gray-200)] text-[var(--bloxs-gray-500)] border-[var(--bloxs-border)]'
              }`}
            >
              {isDone ? <i className="fas fa-check"></i> : stepNumber}
            </div>
            <div
              className={`text-[11px] font-medium mt-2 text-center leading-tight ${
                isActive
                  ? 'text-[var(--bloxs-blue)] font-semibold'
                  : isDone
                  ? 'text-[var(--bloxs-success)]'
                  : 'text-[var(--bloxs-gray-400)]'
              }`}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
