import { useState } from "react";

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

export default function JobInfo({ data, onChange }) {
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateField = (field) => {
    const validationErrors = validateJobInfo(data);

    setErrors((prev) => ({
      ...prev,
      [field]: validationErrors[field] || "",
    }));
  };

  const Label = ({ children, required = false }) => (
    <label className="text-sm font-medium text-gray-800">
      {children}

      {required && (
        <span className="ml-1 text-red-500">*</span>
      )}
    </label>
  );

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
          Job Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter the employee's job, employment and
          work-related information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* =================================
            DEPARTMENT
        ================================== */}

        <div>
          <Label required>
            Department
          </Label>

          <input
            type="text"
            value={data.department || ""}
            onChange={(e) =>
              update("department", e.target.value)
            }
            onBlur={() =>
              validateField("department")
            }
            placeholder="Enter department"
            className={inputClass("department")}
          />

          {errors.department && (
            <p className="mt-1 text-xs text-red-500">
              {errors.department}
            </p>
          )}
        </div>

        {/* =================================
            DESIGNATION
        ================================== */}

        <div>
          <Label required>
            Designation
          </Label>

          <input
            type="text"
            value={data.designation || ""}
            onChange={(e) =>
              update("designation", e.target.value)
            }
            onBlur={() =>
              validateField("designation")
            }
            placeholder="Enter designation"
            className={inputClass("designation")}
          />

          {errors.designation && (
            <p className="mt-1 text-xs text-red-500">
              {errors.designation}
            </p>
          )}
        </div>

        {/* =================================
            EMPLOYMENT TYPE
        ================================== */}

        <div>
          <Label required>
            Employment Type
          </Label>

          <select
            value={data.employmentType || ""}
            onChange={(e) =>
              update(
                "employmentType",
                e.target.value
              )
            }
            onBlur={() =>
              validateField("employmentType")
            }
            className={inputClass("employmentType")}
          >
            <option value="">
              Select employment type
            </option>

            <option value="full_time">
              Full Time
            </option>

            <option value="part_time">
              Part Time
            </option>

            <option value="intern">
              Intern
            </option>

            <option value="freelancer">
              Freelancer
            </option>

            <option value="contract">
              Contract
            </option>
          </select>

          {errors.employmentType && (
            <p className="mt-1 text-xs text-red-500">
              {errors.employmentType}
            </p>
          )}
        </div>

        {/* =================================
            WORK LOCATION
        ================================== */}

        <div>
          <Label required>
            Work Location
          </Label>

          <input
            type="text"
            value={data.workLocation || ""}
            onChange={(e) =>
              update("workLocation", e.target.value)
            }
            onBlur={() =>
              validateField("workLocation")
            }
            placeholder="Enter work location"
            className={inputClass("workLocation")}
          />

          {errors.workLocation && (
            <p className="mt-1 text-xs text-red-500">
              {errors.workLocation}
            </p>
          )}
        </div>

        {/* =================================
            JOINING DATE
        ================================== */}

        <div>
          <Label required>
            Joining Date
          </Label>

          <input
            type="date"
            value={data.joiningDate || ""}
            onChange={(e) =>
              update("joiningDate", e.target.value)
            }
            onBlur={() =>
              validateField("joiningDate")
            }
            className={inputClass("joiningDate")}
          />

          {errors.joiningDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.joiningDate}
            </p>
          )}
        </div>

        {/* =================================
            PROBATION END DATE
        ================================== */}

        <div>
          <Label>
            Probation End Date
          </Label>

          <input
            type="date"
            value={data.probationEndDate || ""}
            min={data.joiningDate || undefined}
            onChange={(e) =>
              update(
                "probationEndDate",
                e.target.value
              )
            }
            onBlur={() =>
              validateField("probationEndDate")
            }
            className={inputClass(
              "probationEndDate"
            )}
          />

          {errors.probationEndDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.probationEndDate}
            </p>
          )}
        </div>

        {/* =================================
            SHIFT TIMING
        ================================== */}

        <div className="md:col-span-2">
          <Label>
            Shift Timing
          </Label>

          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* From */}
            <div>
              <label className="text-xs text-gray-500">
                From
              </label>

              <input
                type="time"
                value={data.shiftFrom || ""}
                onChange={(e) =>
                  update(
                    "shiftFrom",
                    e.target.value
                  )
                }
                onBlur={() =>
                  validateField("shiftFrom")
                }
                className={inputClass("shiftFrom")}
              />
            </div>

            {/* To */}
            <div>
              <label className="text-xs text-gray-500">
                To
              </label>

              <input
                type="time"
                value={data.shiftTo || ""}
                onChange={(e) =>
                  update(
                    "shiftTo",
                    e.target.value
                  )
                }
                onBlur={() =>
                  validateField("shiftTo")
                }
                className={inputClass("shiftTo")}
              />

              {errors.shiftTo && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.shiftTo}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* =================================
            WORK MODE
        ================================== */}

        <div>
          <Label required>
            Work Mode
          </Label>

          <select
            value={data.workMode || ""}
            onChange={(e) =>
              update("workMode", e.target.value)
            }
            onBlur={() =>
              validateField("workMode")
            }
            className={inputClass("workMode")}
          >
            <option value="">
              Select work mode
            </option>

            <option value="remote">
              Remote
            </option>

            <option value="hybrid">
              Hybrid
            </option>

            <option value="office">
              Office
            </option>
          </select>

          {errors.workMode && (
            <p className="mt-1 text-xs text-red-500">
              {errors.workMode}
            </p>
          )}
        </div>

        {/* =================================
            EMPLOYMENT STATUS
        ================================== */}

        <div>
          <Label required>
            Employment Status
          </Label>

          <select
            value={data.employmentStatus || ""}
            onChange={(e) =>
              update(
                "employmentStatus",
                e.target.value
              )
            }
            onBlur={() =>
              validateField("employmentStatus")
            }
            className={inputClass(
              "employmentStatus"
            )}
          >
            <option value="">
              Select employment status
            </option>

            <option value="active">
              Active
            </option>

            <option value="notice_period">
              Notice Period
            </option>

            <option value="resigned">
              Resigned
            </option>

            <option value="terminated">
              Terminated
            </option>
          </select>

          {errors.employmentStatus && (
            <p className="mt-1 text-xs text-red-500">
              {errors.employmentStatus}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}