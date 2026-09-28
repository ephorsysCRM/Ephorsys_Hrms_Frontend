export const validateInfo = (data) => {
  const errors = {};

  // Employee ID
  if (!data.employeeId?.trim()) {
    errors.employeeId = "Employee ID is required";
  }

  // First Name
  if (!data.firstName?.trim()) {
    errors.firstName = "First Name is required";
  }


  // Last Name
  if (!data.lastName?.trim()) {
    errors.lastName = "Last Name is required";
  }

  // Gender
  if (!data.gender) {
    errors.gender = "Gender is required";
  }

  // Marital Status
  if (!data.maritalStatus) {
    errors.maritalStatus = "Marital Status is required";
  }

  // Blood Group
  if (!data.bloodGroup) {
    errors.bloodGroup = "Blood Group is required";
  }

  // Date of Birth
  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Date of Birth is required";
  } else {
    const today = new Date();
    const dob = new Date(data.dateOfBirth);

    if (dob > today) {
      errors.dateOfBirth = "Date of Birth cannot be in the future";
    }
  }

  // Profile Photo
  if (!data.profilePhoto) {
    errors.profilePhoto = "Profile Photo is required";
  } else if (data.profilePhoto instanceof File) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(data.profilePhoto.type)) {
      errors.profilePhoto =
        "Only JPG, PNG, and WEBP files are allowed";
    }

    if (data.profilePhoto.size > maxSize) {
      errors.profilePhoto =
        "Profile Photo must be less than 5MB";
    }
  }

  return errors;
};