export const validateJobInfo = (data) => {
  const errors = {};

  // Department
  if (!data.department?.trim()) {
    errors.department = "Department is required.";
  }

  // Designation
  if (!data.designation?.trim()) {
    errors.designation = "Designation is required.";
  }

  // Employment Type
  if (!data.employmentType) {
    errors.employmentType = "Employment type is required.";
  }

  // Work Location
  if (!data.workLocation?.trim()) {
    errors.workLocation = "Work location is required.";
  }

  // Joining Date
  if (!data.joiningDate) {
    errors.joiningDate = "Joining date is required.";
  }

  // Probation End Date
  if (
    data.probationEndDate &&
    data.joiningDate &&
    data.probationEndDate < data.joiningDate
  ) {
    errors.probationEndDate =
      "Probation end date cannot be before joining date.";
  }

  // Shift timing
  if (data.shiftFrom && data.shiftTo) {
    if (data.shiftFrom >= data.shiftTo) {
      errors.shiftTo =
        "Shift end time must be after start time.";
    }
  }

  // Work Mode
  if (!data.workMode) {
    errors.workMode = "Work mode is required.";
  }

  // Employment Status
  if (!data.employmentStatus) {
    errors.employmentStatus =
      "Employment status is required.";
  }

  return errors;
};