import { useState } from "react";

/* --------------------------------
   Validation
-------------------------------- */

export const validateContactInfo = (data) => {
  const errors = {};

  /* Personal Email */
  if (!data.personalEmail?.trim()) {
    errors.personalEmail = "Personal email is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      data.personalEmail.trim()
    )
  ) {
    errors.personalEmail = "Please enter a valid email address.";
  }

  /* Official Email */
  if (!data.officialEmail?.trim()) {
    errors.officialEmail = "Official email is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      data.officialEmail.trim()
    )
  ) {
    errors.officialEmail = "Please enter a valid email address.";
  }

  /* Mobile Number */
  if (!data.mobile?.trim()) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(data.mobile.trim())) {
    errors.mobile = "Mobile number must be 10 digits.";
  }

  /* Alternate Mobile - Optional */
  if (
    data.alternateMobile?.trim() &&
    !/^\d{10}$/.test(data.alternateMobile.trim())
  ) {
    errors.alternateMobile =
      "Alternate mobile number must be 10 digits.";
  }

  /* Emergency Contact Number - Optional */
  if (
    data.emergencyContactNumber?.trim() &&
    !/^\d{10}$/.test(
      data.emergencyContactNumber.trim()
    )
  ) {
    errors.emergencyContactNumber =
      "Emergency contact number must be 10 digits.";
  }

  /* City */
  if (!data.city?.trim()) {
    errors.city = "City is required.";
  }

  /* State */
  if (!data.state?.trim()) {
    errors.state = "State is required.";
  }

  /* PIN Code */
  if (!data.pinCode?.trim()) {
    errors.pinCode = "PIN code is required.";
  } else if (!/^\d{6}$/.test(data.pinCode.trim())) {
    errors.pinCode = "PIN code must be 6 digits.";
  }

  /* Current Address */
  if (!data.currentAddress?.trim()) {
    errors.currentAddress =
      "Current address is required.";
  }

  /* Permanent Address */
  if (!data.permanentAddress?.trim()) {
    errors.permanentAddress =
      "Permanent address is required.";
  }

  return errors;
};


/* --------------------------------
   Component
-------------------------------- */

export default function ContactInfo({
  data,
  onChange,
}) {
  const [errors, setErrors] = useState({});


  /* --------------------------------
     Update Field
  -------------------------------- */

  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });

    // Remove error once user starts correcting it
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };


  /* --------------------------------
     Validate Field
  -------------------------------- */

  const validateField = (field) => {
    const fieldErrors = validateContactInfo(data);

    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field] || "",
    }));
  };


  /* --------------------------------
     Label
  -------------------------------- */

  const Label = ({
    children,
    required = false,
  }) => (
    <label className="text-sm font-medium text-gray-800">
      {children}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>
  );


  /* --------------------------------
     Input Class
  -------------------------------- */

  const inputClass = (field) =>
    `mt-2 w-full rounded-lg border px-3 py-2.5 outline-none transition ${
      errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-black"
    }`;


  return (
    <div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter the employee's contact and address
          information.
        </p>
      </div>


      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


        {/* ================================
            PERSONAL EMAIL
        ================================= */}

        <div>
          <Label required>
            Personal Email
          </Label>

          <input
            type="email"
            value={data.personalEmail || ""}
            onChange={(e) =>
              update(
                "personalEmail",
                e.target.value
              )
            }
            onBlur={() =>
              validateField("personalEmail")
            }
            placeholder="employee@gmail.com"
            className={inputClass(
              "personalEmail"
            )}
          />

          {errors.personalEmail && (
            <p className="mt-1 text-xs text-red-500">
              {errors.personalEmail}
            </p>
          )}
        </div>


        {/* ================================
            OFFICIAL EMAIL
        ================================= */}

        <div>
          <Label required>
            Official Email
          </Label>

          <input
            type="email"
            value={data.officialEmail || ""}
            onChange={(e) =>
              update(
                "officialEmail",
                e.target.value
              )
            }
            onBlur={() =>
              validateField("officialEmail")
            }
            placeholder="employee@company.com"
            className={inputClass(
              "officialEmail"
            )}
          />

          {errors.officialEmail && (
            <p className="mt-1 text-xs text-red-500">
              {errors.officialEmail}
            </p>
          )}
        </div>


        {/* ================================
            MOBILE
        ================================= */}

        <div>
          <Label required>
            Mobile Number
          </Label>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={data.mobile || ""}
            onChange={(e) =>
              update(
                "mobile",
                e.target.value.replace(/\D/g, "")
              )
            }
            onBlur={() =>
              validateField("mobile")
            }
            placeholder="Enter mobile number"
            className={inputClass("mobile")}
          />

          {errors.mobile && (
            <p className="mt-1 text-xs text-red-500">
              {errors.mobile}
            </p>
          )}
        </div>


        {/* ================================
            ALTERNATE MOBILE
        ================================= */}

        <div>
          <Label>
            Alternate Mobile Number
          </Label>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={data.alternateMobile || ""}
            onChange={(e) =>
              update(
                "alternateMobile",
                e.target.value.replace(/\D/g, "")
              )
            }
            onBlur={() =>
              validateField("alternateMobile")
            }
            placeholder="Enter alternate number"
            className={inputClass(
              "alternateMobile"
            )}
          />

          {errors.alternateMobile && (
            <p className="mt-1 text-xs text-red-500">
              {errors.alternateMobile}
            </p>
          )}
        </div>


        {/* ================================
            EMERGENCY CONTACT NAME
        ================================= */}

        <div>
          <Label>
            Emergency Contact Name
          </Label>

          <input
            type="text"
            value={
              data.emergencyContactName || ""
            }
            onChange={(e) =>
              update(
                "emergencyContactName",
                e.target.value
              )
            }
            onBlur={() =>
              validateField(
                "emergencyContactName"
              )
            }
            placeholder="Enter emergency contact name"
            className={inputClass(
              "emergencyContactName"
            )}
          />

          {errors.emergencyContactName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.emergencyContactName}
            </p>
          )}
        </div>


        {/* ================================
            EMERGENCY CONTACT NUMBER
        ================================= */}

        <div>
          <Label>
            Emergency Contact Number
          </Label>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={
              data.emergencyContactNumber || ""
            }
            onChange={(e) =>
              update(
                "emergencyContactNumber",
                e.target.value.replace(/\D/g, "")
              )
            }
            onBlur={() =>
              validateField(
                "emergencyContactNumber"
              )
            }
            placeholder="Enter emergency number"
            className={inputClass(
              "emergencyContactNumber"
            )}
          />

          {errors.emergencyContactNumber && (
            <p className="mt-1 text-xs text-red-500">
              {errors.emergencyContactNumber}
            </p>
          )}
        </div>


        {/* ================================
            CITY
        ================================= */}

        <div>
          <Label required>
            City
          </Label>

          <input
            type="text"
            value={data.city || ""}
            onChange={(e) =>
              update("city", e.target.value)
            }
            onBlur={() =>
              validateField("city")
            }
            placeholder="Enter city"
            className={inputClass("city")}
          />

          {errors.city && (
            <p className="mt-1 text-xs text-red-500">
              {errors.city}
            </p>
          )}
        </div>


        {/* ================================
            STATE
        ================================= */}

        <div>
          <Label required>
            State
          </Label>

          <input
            type="text"
            value={data.state || ""}
            onChange={(e) =>
              update("state", e.target.value)
            }
            onBlur={() =>
              validateField("state")
            }
            placeholder="Enter state"
            className={inputClass("state")}
          />

          {errors.state && (
            <p className="mt-1 text-xs text-red-500">
              {errors.state}
            </p>
          )}
        </div>


        {/* ================================
            PIN CODE
        ================================= */}

        <div>
          <Label required>
            PIN Code
          </Label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={data.pinCode || ""}
            onChange={(e) =>
              update(
                "pinCode",
                e.target.value.replace(/\D/g, "")
              )
            }
            onBlur={() =>
              validateField("pinCode")
            }
            placeholder="Enter PIN code"
            className={inputClass("pinCode")}
          />

          {errors.pinCode && (
            <p className="mt-1 text-xs text-red-500">
              {errors.pinCode}
            </p>
          )}
        </div>


        {/* ================================
            CURRENT ADDRESS
        ================================= */}

        <div className="md:col-span-2">
          <Label required>
            Current Address
          </Label>

          <textarea
            value={data.currentAddress || ""}
            onChange={(e) =>
              update(
                "currentAddress",
                e.target.value
              )
            }
            onBlur={() =>
              validateField("currentAddress")
            }
            placeholder="Enter current residential address"
            rows={3}
            className={inputClass(
              "currentAddress"
            )}
          />

          {errors.currentAddress && (
            <p className="mt-1 text-xs text-red-500">
              {errors.currentAddress}
            </p>
          )}
        </div>


        {/* ================================
            PERMANENT ADDRESS
        ================================= */}

        <div className="md:col-span-2">
          <Label required>
            Permanent Address
          </Label>

          <textarea
            value={data.permanentAddress || ""}
            onChange={(e) =>
              update(
                "permanentAddress",
                e.target.value
              )
            }
            onBlur={() =>
              validateField("permanentAddress")
            }
            placeholder="Enter permanent residential address"
            rows={3}
            className={inputClass(
              "permanentAddress"
            )}
          />

          {errors.permanentAddress && (
            <p className="mt-1 text-xs text-red-500">
              {errors.permanentAddress}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}