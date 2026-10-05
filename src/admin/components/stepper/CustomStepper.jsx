import { cls } from "../../utils/helpers";

export default function CustomStepper({
  steps,
  activeStep,
  onStepClick,
}) {
  return (
    <div className="sticky -top-6 z-10 w-full border-b border-gray-200 px-1 bg-white rounded-2xl">
      <div className="w-full overflow-x-auto scrollbar-none px-2">
        <div className="flex min-w-max items-center py-2 sm:min-w-0 sm:w-full">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const isDisabled = index > activeStep + 1;

            return (
              <div
                key={index}
                className={cls(
                  "flex items-center gap-3",
                  index < steps.length - 1
                    ? "flex-1"
                    : "shrink-0"
                )}
              >
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onStepClick?.(index)}
                  aria-label={`Step ${index + 1}`}
                  aria-current={isActive ? "step" : undefined}
                  className={cls(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    "border text-xs font-semibold transition-all duration-200",
                    "sm:h-9 sm:w-9 sm:text-sm",
                    "md:h-10 md:w-10",

                    isActive
                      ? "border-black bg-black text-white shadow-md"
                      : isCompleted
                      ? "border-black bg-white text-black"
                      : "border-gray-300 bg-white text-gray-500",

                    isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-black hover:text-white"
                  )}
                >
                  {isCompleted ? "✓" : index + 1}
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={cls(
                      "mx-1.5 h-0.5 flex-1 rounded-full",
                      "sm:mx-2 md:mx-3",
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
    </div>
  );
}