export const validateContactInfo = (data) => {
  const errors = {};

  if (!data.personalEmail?.trim()) {
    errors.personalEmail = "Personal email is required";
  }

  if (!data.officialEmail?.trim()) {
    errors.officialEmail = "Official email is required";
  }

  if (!data.mobile?.trim()) {
    errors.mobile = "Mobile number is required";
  } else if (data.mobile.length !== 10) {
    errors.mobile = "Mobile number must be 10 digits";
  }

  if (!data.city?.trim()) {
    errors.city = "City is required";
  }

  if (!data.state?.trim()) {
    errors.state = "State is required";
  }

  if (!data.pinCode?.trim()) {
    errors.pinCode = "PIN code is required";
  } else if (data.pinCode.length !== 6) {
    errors.pinCode = "PIN code must be 6 digits";
  }

  if (!data.currentAddress?.trim()) {
    errors.currentAddress = "Current address is required";
  }

  if (!data.permanentAddress?.trim()) {
    errors.permanentAddress = "Permanent address is required";
  }

  return errors;
};