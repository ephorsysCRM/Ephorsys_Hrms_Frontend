import { useState } from "react";

import { validateJobInfo } from "../../utils/ValidateJobInfo";

export default function JobInfo({
  data,
  onChange,
  errors = {},
}) {

  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (field) => {
    const validationErrors = validateJobInfo(data);

    setFieldErrors((prev) => ({
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

  const inputClass = (field) => {
  const hasError =
    errors[field] || fieldErrors[field];

  return `mt-2 w-full rounded-lg border px-3 py-2 outline-none transition ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-black"
  }`;
};

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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* =================================
            DEPARTMENT
        ================================== */}

        <div>
  <Label required>
    Department
  </Label>

  <select
    value={data.department || ""}
    onChange={(e) =>
      update("department", e.target.value)
    }
    onBlur={() =>
      validateField("department")
    }
    className={inputClass("department")}
  >
    <option value=" ">
      Select department
    </option>

    <option value="Tech">
      Tech
    </option>

    <option value="Digital Marketing">
      Digital Marketing
    </option>

    <option value="BDE">
      BDE
    </option>

    <option value="Human Resources">
      Human Resources
    </option>

    <option value="Finance">
      Finance
    </option>

    <option value="Sales">
      Sales
    </option>

    <option value="Design">
      Design
    </option>

    <option value="Operations">
      Operations
    </option>
  </select>

  {(errors.department || fieldErrors.department) && (
    <p className="mt-1 text-xs text-red-500">
      {errors.department || fieldErrors.department}
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

        



            {/* From */}
            <div>
              <Label>
                Shift Time From
              </Label>

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
              <Label>
               Shift Time To
              </Label>

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