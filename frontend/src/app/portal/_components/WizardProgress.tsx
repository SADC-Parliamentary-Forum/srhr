'use client'

interface WizardProgressProps {
  steps: string[]
  currentStep: number
}

export default function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="flex items-center gap-0 mb-lg">
      {steps.map((step, idx) => {
        const stepNum = idx + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-xs">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isCompleted
                    ? 'bg-primary text-on-primary'
                    : isActive
                    ? 'border-2 border-secondary-container bg-secondary-container text-on-secondary-container'
                    : 'border-2 border-outline-variant bg-surface text-on-surface-variant'
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-sm mb-4 ${
                  isCompleted ? 'bg-primary' : 'bg-outline-variant'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
