export default function StepIndicator({ steps, current }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">

      {steps.map((step, index) => {
        const active = index === current;
        const completed = index < current;

        return (
          <div
            key={step}
            className="flex min-w-max flex-1 items-center gap-2"
          >
            {/* NUMBER */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium ${active
                  ? "border-black bg-black text-white"
                  : completed
                    ? "border-black bg-white text-black"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
            >
              {index + 1}
            </div>

            {/* LABEL */}
            <div className="hidden sm:block">
              <p
                className={`text-sm font-medium ${active
                    ? "text-black"
                    : completed
                      ? "text-black"
                      : "text-gray-400"
                  }`}
              >
                {step}
              </p>
            </div>

            {/* LINE */}
            {index < steps.length - 1 && (
              <div className="mx-1 h-px min-w-4 flex-1 bg-gray-200 sm:block" />
            )}
          </div>
        );
      })}

    </div>
  );
}