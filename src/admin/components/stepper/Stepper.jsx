import React from "react";
import StepIndicator from "./StepIndicator";

export default function Stepper({
  steps,
  children,
  onCancel,
  onComplete,
}) {
  const [step, setStep] = React.useState(0);

  const isLastStep = step === steps.length - 1;

  return (
    <div className="flex h-dvh w-full flex-col bg-white text-black md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-xl md:border md:border-gray-200 md:shadow-xl">

      {/* STEPPER */}
      <div className="shrink-0 border-b border-gray-200 p-4 sm:p-6">
        <StepIndicator
          steps={steps}
          current={step}
        />
      </div>

      {/* FORM CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {children[step]}
      </div>

      {/* BUTTONS */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-white p-4 sm:p-6">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Cancel
        </button>

        <div className="flex gap-2">

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              isLastStep
                ? onComplete()
                : setStep(step + 1)
            }
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {isLastStep ? "Create" : "Next"}
          </button>

        </div>
      </div>
    </div>
  );
}