export const validateDoc = (data) => {
  const errors = {};

  const documents = {
    aadhaar: [],
    pan: [],
    resume: [],
    offerLetter: [],
    experienceLetter: [],
    signedNda: [],
    idCard: [],
    ...(data || {}),
  };

  if (
    !Array.isArray(documents.aadhaar) ||
    documents.aadhaar.length === 0
  ) {
    errors.aadhaar =
      "Aadhaar document is required.";
  }

  if (
    !Array.isArray(documents.pan) ||
    documents.pan.length === 0
  ) {
    errors.pan =
      "PAN document is required.";
  }

  if (
    !Array.isArray(documents.resume) ||
    documents.resume.length === 0
  ) {
    errors.resume =
      "Resume is required.";
  }

  if (
    !Array.isArray(documents.offerLetter) ||
    documents.offerLetter.length === 0
  ) {
    errors.offerLetter =
      "Offer letter is required.";
  }

  if (
    !Array.isArray(
      documents.experienceLetter
    ) ||
    documents.experienceLetter.length === 0
  ) {
    errors.experienceLetter =
      "Experience letter is required.";
  }

  if (
    !Array.isArray(documents.signedNda) ||
    documents.signedNda.length === 0
  ) {
    errors.signedNda =
      "Signed NDA is required.";
  }

  if (
    !Array.isArray(documents.idCard) ||
    documents.idCard.length === 0
  ) {
    errors.idCard =
      "ID card is required.";
  }

  return errors;
};