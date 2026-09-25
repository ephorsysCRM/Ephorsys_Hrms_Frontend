import StepIndicator from "./StepIndicator";

import { useState } from "react";

const Stepper=({
  steps,
  children,
  onCancel,
  onComplete,
}) => {
  const [step, setStep] = useState(0);

  return (
    <div className="w-full max-w-2xl rounded-xl bg-white p-6 text-black">
      <StepIndicator steps={steps} current={step} />

      <div className="my-6">{children[step]}</div>

      <div className="flex justify-between">
        <button onClick={onCancel} className="border px-4 py-2">
          Cancel
        </button>

        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="border px-4 py-2">
              Back
            </button>
          )}

          <button
            onClick={() =>
              step === steps.length - 1
                ? onComplete()
                : setStep(step + 1)
            }
            className="bg-black px-4 py-2 text-white">
            {step === steps.length - 1 ? "Create" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Stepper