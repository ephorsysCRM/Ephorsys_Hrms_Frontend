const StepIndicator=({ steps, current }) =>{
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`rounded px-3 py-2 text-sm ${
            index === current
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {index + 1}. {step}
        </div>
      ))}
    </div>
  );
}

export default StepIndicator;