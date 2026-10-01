export const validatePayRoll = (data) => {
  const errors = {};

  // Basic Salary - required
  if (!data.basicSalary) {
    errors.basicSalary = "Basic salary is required.";
  } else if (Number(data.basicSalary) < 0) {
    errors.basicSalary = "Basic salary cannot be negative.";
  }

  // HRA - required
  if (!data.hraPercentage) {
    errors.hraPercentage = "HRA percentage is required.";
  } else if (
    Number(data.hraPercentage) < 0 ||
    Number(data.hraPercentage) > 100
  ) {
    errors.hraPercentage =
      "HRA must be between 0 and 100%.";
  }

  // EPF - optional
  if (
    Number(data.epfPercentage || 0) < 0 ||
    Number(data.epfPercentage || 0) > 100
  ) {
    errors.epfPercentage =
      "EPF must be between 0 and 100%.";
  }

  // Professional Tax - optional
  if (
    Number(data.professionalTaxPercentage || 0) < 0 ||
    Number(data.professionalTaxPercentage || 0) > 100
  ) {
    errors.professionalTaxPercentage =
      "PT must be between 0 and 100%.";
  }

  // TDS - optional
  if (Number(data.tds || 0) < 0) {
    errors.tds = "TDS cannot be negative.";
  }

  // Employer PF - optional
  if (
    Number(data.employerPfPercentage || 0) < 0 ||
    Number(data.employerPfPercentage || 0) > 100
  ) {
    errors.employerPfPercentage =
      "Employer PF must be between 0 and 100%.";
  }

  return errors;
};