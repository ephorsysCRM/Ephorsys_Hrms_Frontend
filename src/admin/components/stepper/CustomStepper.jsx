import { cls } from "../../utils/helpers";

export default function CustomStepper({
  steps,
  activeStep,
  onStepClick,
}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center">

        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isDisabled = index > activeStep + 1;

          return (
            <div
              key={index}
              className="flex flex-1 items-center"
            >
              {/* Step Circle */}
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onStepClick?.(index)}
                aria-label={`Step ${index + 1}`}
                className={cls(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all",

                  isActive
                    ? "border-black bg-black text-white shadow-md"
                    : isCompleted
                    ? "border-black bg-white text-black"
                    : "border-gray-300 bg-white text-gray-500",

                  isDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-black hover:text-white"
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </button>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={cls(
                    "mx-3 h-0.5 flex-1 rounded-full",
                    index < activeStep
                      ? "bg-black"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}