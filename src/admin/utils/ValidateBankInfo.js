export const validateBankInfo = (data) => {
  const errors = {};

  if (!data.bankName?.trim()) {
    errors.bankName = "Bank name is required";
  }

  if (!data.accountHolderName?.trim()) {
    errors.accountHolderName =
      "Account holder name is required";
  }

  if (!data.accountNumber?.trim()) {
    errors.accountNumber =
      "Account number is required";
  }

  if (!data.ifscCode?.trim()) {
    errors.ifscCode = "IFSC code is required";
  } else if (
    !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode)
  ) {
    errors.ifscCode = "Enter a valid IFSC code";
  }

  if (!data.branch?.trim()) {
    errors.branch = "Branch is required";
  }

  if (!data.bankDocument) {
    errors.bankDocument =
      "Passbook or bank document is required";
  }

  return errors;
};