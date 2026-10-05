export const validateExperience = (data) => {
  const errors = [];

  if (!Array.isArray(data)) {
    return [];
  }

  data.forEach((experience, index) => {
    const hasAnyValue =
      experience.companyName?.trim() ||
      experience.designation?.trim() ||
      experience.totalExperience?.trim() ||
      experience.skills?.trim() ||
      experience.startDate ||
      experience.endDate ||
      experience.reasonForLeaving?.trim();

    // Completely empty experience is allowed
    if (!hasAnyValue) {
      return;
    }

    const experienceErrors = {};

    if (!experience.companyName?.trim()) {
      experienceErrors.companyName =
        "Company name is required.";
    }

    if (!experience.designation?.trim()) {
      experienceErrors.designation =
        "Designation is required.";
    }

    if (!experience.totalExperience?.trim()) {
      experienceErrors.totalExperience =
        "Total experience is required.";
    }

    if (!experience.skills?.trim()) {
      experienceErrors.skills =
        "Skills are required.";
    }

    if (!experience.startDate) {
      experienceErrors.startDate =
        "Start date is required.";
    }

    if (!experience.endDate) {
      experienceErrors.endDate =
        "End date is required.";
    }

    if (
      experience.startDate &&
      experience.endDate &&
      experience.endDate < experience.startDate
    ) {
      experienceErrors.endDate =
        "End date cannot be before start date.";
    }

    if (
      !experience.reasonForLeaving?.trim()
    ) {
      experienceErrors.reasonForLeaving =
        "Reason for leaving is required.";
    }

    if (
      Object.keys(experienceErrors).length > 0
    ) {
      errors[index] = experienceErrors;
    }
  });

  return errors;
};