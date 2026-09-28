export const validatePermission = (
  data
) => {
  const errors = {};

  const password = data?.password || "";
  const confirmPassword =
    data?.confirmPassword || "";

  if (!password.trim()) {
    errors.password =
      "Password is required.";
  } else if (password.length < 8) {
    errors.password =
      "Password must be at least 8 characters.";
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword =
      "Confirm password is required.";
  } else if (
    password !== confirmPassword
  ) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  return errors;
};