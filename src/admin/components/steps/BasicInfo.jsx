import { useEffect, useState } from "react";
import { validateInfo } from "../../utils/ValidateInfo";

export default function BasicInformation({ data, onChange, onValidation }) {
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (data?.profilePhoto instanceof File) {
      const url = URL.createObjectURL(data.profilePhoto);
      setPhotoPreview(url);

      return () => URL.revokeObjectURL(url);
    }

    setPhotoPreview(data?.profilePhoto || null);
  }, [data?.profilePhoto]);

  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });

    // Validate changed field immediately
    const updatedData = {
      ...data,
      [field]: value,
    };

    const validationErrors = validateInfo(updatedData);

    setErrors((prev) => ({
      ...prev,
      [field]: validationErrors[field] || "",
    }));

    // Tell parent whether the complete form is valid
    if (onValidation) {
      onValidation(validationErrors);
    }
  };

  const validateField = (field) => {
    const fieldErrors = validateInfo(data);

    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field] || "",
    }));

    if (onValidation) {
      onValidation(fieldErrors);
    }
  };

  const validateAll = () => {
    const validationErrors = validateInfo(data);

    setErrors(validationErrors);

    if (onValidation) {
      onValidation(validationErrors);
    }

    return validationErrors;
  };

  const handlePhotoChange = (file) => {
    if (!file) {
      update("profilePhoto", null);
      setPhotoPreview(null);
      return;
    }

    const validationErrors = validateInfo({
      ...data,
      profilePhoto: file,
    });

    if (validationErrors.profilePhoto) {
      setErrors((prev) => ({
        ...prev,
        profilePhoto: validationErrors.profilePhoto,
      }));

      onChange({
        ...data,
        profilePhoto: null,
      });

      setPhotoPreview(null);

      if (onValidation) {
        onValidation(validationErrors);
      }

      return;
    }

    update("profilePhoto", file);
  };

  return (
    <div className="w-full min-w-0">
      <div className="w-full rounded-xl bg-white p-4 shadow-sm sm:p-5">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the employee's basic information
          </p>
        </div>

        {/* Form */}
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          {/* Employee ID */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Employee ID <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={data?.employeeId || ""}
              onChange={(e) =>
                update("employeeId", e.target.value)
              }
              onBlur={() => validateField("employeeId")}
              placeholder="Enter Employee ID"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.employeeId
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {errors.employeeId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.employeeId}
              </p>
            )}
          </div>

          {/* First Name */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={data?.firstName || ""}
              onChange={(e) =>
                update("firstName", e.target.value)
              }
              onBlur={() => validateField("firstName")}
              placeholder="Enter First Name"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.firstName
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Middle Name */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Middle Name
            </label>

            <input
              type="text"
              value={data?.middleName || ""}
              onChange={(e) =>
                update("middleName", e.target.value)
              }
              onBlur={() => validateField("middleName")}
              placeholder="Enter Middle Name"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.middleName
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {errors.middleName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.middleName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={data?.lastName || ""}
              onChange={(e) =>
                update("lastName", e.target.value)
              }
              onBlur={() => validateField("lastName")}
              placeholder="Enter Last Name"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.lastName
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>

            <select
              value={data?.gender || ""}
              onChange={(e) =>
                update("gender", e.target.value)
              }
              onBlur={() => validateField("gender")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.gender
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">
                {errors.gender}
              </p>
            )}
          </div>

          {/* Marital Status */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Marital Status{" "}
              <span className="text-red-500">*</span>
            </label>

            <select
              value={data?.maritalStatus || ""}
              onChange={(e) =>
                update("maritalStatus", e.target.value)
              }
              onBlur={() => validateField("maritalStatus")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.maritalStatus
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>

            {errors.maritalStatus && (
              <p className="mt-1 text-xs text-red-500">
                {errors.maritalStatus}
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Blood Group <span className="text-red-500">*</span>
            </label>

            <select
              value={data?.bloodGroup || ""}
              onChange={(e) =>
                update("bloodGroup", e.target.value)
              }
              onBlur={() => validateField("bloodGroup")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.bloodGroup
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            {errors.bloodGroup && (
              <p className="mt-1 text-xs text-red-500">
                {errors.bloodGroup}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Date of Birth <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              value={data?.dateOfBirth || ""}
              onChange={(e) =>
                update("dateOfBirth", e.target.value)
              }
              onBlur={() => validateField("dateOfBirth")}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.dateOfBirth
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Profile Photo */}
          <div className="min-w-0 md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Profile Photo <span className="text-red-500">*</span>
            </label>

            <div
              className={`w-full min-w-0 overflow-hidden rounded-lg border p-3 ${
                errors.profilePhoto
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Preview */}
                {photoPreview && (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* File Input */}
                <div className="min-w-0 flex-1">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      handlePhotoChange(e.target.files?.[0])
                    }
                    className="block w-full min-w-0 text-sm  file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-3 file:text-white file:py-2 file:text-sm file:font-medium  hover:file:bg-gray-800"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP. Maximum size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {errors.profilePhoto && (
              <p className="mt-1 text-xs text-red-500">
                {errors.profilePhoto}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}