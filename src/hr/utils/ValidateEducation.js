export const validateEducation = (data) => {
  const errors = [];

  if (!Array.isArray(data) || data.length === 0) {
    return [
      {
        qualification:
          "At least one education entry is required.",
      },
    ];
  }

  data.forEach((education, index) => {
    const educationErrors = {};

    if (!education.qualification?.trim()) {
      educationErrors.qualification =
        "Qualification is required.";
    }

    if (!education.university?.trim()) {
      educationErrors.university =
        "University / Board is required.";
    }

    if (!education.passingYear) {
      educationErrors.passingYear =
        "Passing year is required.";
    } else {
      const year = Number(
        education.passingYear
      );

      const currentYear =
        new Date().getFullYear();

      if (year < 1950 || year > currentYear) {
        educationErrors.passingYear =
          `Passing year must be between 1950 and ${currentYear}.`;
      }
    }

    if (!education.scoreType) {
      educationErrors.scoreType =
        "Score type is required.";
    }

    if (
      education.score === "" ||
      education.score === null ||
      education.score === undefined
    ) {
      educationErrors.score =
        education.scoreType === "cgpa"
          ? "CGPA is required."
          : "Percentage is required.";
    } else {
      const score = Number(education.score);

      if (education.scoreType === "percentage") {
        if (score < 0 || score > 100) {
          educationErrors.score =
            "Percentage must be between 0 and 100.";
        }
      }

      if (education.scoreType === "cgpa") {
        if (score < 0 || score > 10) {
          educationErrors.score =
            "CGPA must be between 0 and 10.";
        }
      }
    }

    // Only add an entry when it actually has errors
    if (Object.keys(educationErrors).length > 0) {
      errors[index] = educationErrors;
    }
  });

  return errors;
};