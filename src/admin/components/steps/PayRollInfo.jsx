export default function WorkPayrollDetails({
  data,
  onChange,
  errors = {},
}) {
  // =========================================
  // UPDATE FIELD
  // =========================================

  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // =========================================
  // NUMBER HELPER
  // =========================================

  const number = (value) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  };

  // =========================================
  // INPUT VALUES
  // =========================================

  const basicSalary = number(data.basicSalary);

  const hraPercentage = number(
    data.hraPercentage
  );

  const conveyanceAllowance = number(
    data.conveyanceAllowance
  );

  const specialAllowance = number(
    data.specialAllowance
  );

  const epfPercentage = number(
    data.epfPercentage
  );

  const professionalTaxPercentage = number(
    data.professionalTaxPercentage
  );

  const tds = number(data.tds);

  const employerPfPercentage = number(
    data.employerPfPercentage
  );

  // =========================================
  // EARNINGS CALCULATIONS
  // =========================================

  // HRA amount
  const hraAmount =
    (basicSalary * hraPercentage) / 100;

  // Gross salary
  const grossSalary =
    basicSalary +
    hraAmount +
    conveyanceAllowance +
    specialAllowance;

  // =========================================
  // DEDUCTION CALCULATIONS
  // =========================================

  // Employee EPF
  const epfAmount =
    (basicSalary * epfPercentage) / 100;

  // Professional Tax
  const professionalTaxAmount =
    (grossSalary *
      professionalTaxPercentage) /
    100;

  // Total deductions
  const totalDeductions =
    epfAmount +
    professionalTaxAmount +
    tds;

  // Net salary / Take-home
  const netSalary =
    grossSalary - totalDeductions;

  // =========================================
  // EMPLOYER CONTRIBUTION
  // =========================================

  // Employer PF
  const employerPfAmount =
    (basicSalary * employerPfPercentage) /
    100;

  // =========================================
  // CTC
  // =========================================

  const ctc =
    grossSalary + employerPfAmount;

  // =========================================
  // FORMAT CURRENCY
  // =========================================

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    );
  };

  // =========================================
  // INPUT CLASS
  // =========================================

  const inputClass = (field) =>
    `mt-2 w-full rounded-lg border px-3 py-2.5
     outline-none transition
     ${
       errors[field]
         ? "border-red-500 focus:border-red-500"
         : "border-gray-300 focus:border-black"
     }`;

  // =========================================
  // LABEL COMPONENT
  // =========================================

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

  return (
    <div>
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-black">
          Payroll
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure salary, earnings, deductions,
          and employer contributions.
        </p>
      </div>

      {/* =====================================
          EARNINGS
      ====================================== */}

      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-black">
            Earnings
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Configure the employee's salary and
            earning components.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* ===============================
              BASIC SALARY
          ================================ */}

          <div>
            <Label required>
              Basic Salary
            </Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={data.basicSalary || ""}
                onChange={(e) =>
                  update(
                    "basicSalary",
                    e.target.value
                  )
                }
                placeholder="50000"
                className={`${inputClass(
                  "basicSalary"
                )} pl-8`}
              />
            </div>

            {errors.basicSalary && (
              <p className="mt-1 text-xs text-red-500">
                {errors.basicSalary}
              </p>
            )}
          </div>

          {/* ===============================
              HRA
          ================================ */}

          <div>
            <Label required>
              HRA
            </Label>

            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    data.hraPercentage || ""
                  }
                  onChange={(e) =>
                    update(
                      "hraPercentage",
                      e.target.value
                    )
                  }
                  placeholder="40"
                  className={`${inputClass(
                    "hraPercentage"
                  )} pr-8`}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  %
                </span>
              </div>

              <div className="flex w-36 items-center justify-end rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700">
                {formatCurrency(hraAmount)}
              </div>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              HRA amount:{" "}
              {formatCurrency(hraAmount)}
            </p>

            {errors.hraPercentage && (
              <p className="mt-1 text-xs text-red-500">
                {errors.hraPercentage}
              </p>
            )}
          </div>

          {/* ===============================
              CONVEYANCE ALLOWANCE
          ================================ */}

          <div>
            <Label>
              Conveyance Allowance
            </Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={
                  data.conveyanceAllowance || ""
                }
                onChange={(e) =>
                  update(
                    "conveyanceAllowance",
                    e.target.value
                  )
                }
                placeholder="5000"
                className={`${inputClass(
                  "conveyanceAllowance"
                )} pl-8`}
              />
            </div>
          </div>

          {/* ===============================
              SPECIAL ALLOWANCE
          ================================ */}

          <div>
            <Label>
              Special Allowance
            </Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={
                  data.specialAllowance || ""
                }
                onChange={(e) =>
                  update(
                    "specialAllowance",
                    e.target.value
                  )
                }
                placeholder="5000"
                className={`${inputClass(
                  "specialAllowance"
                )} pl-8`}
              />
            </div>
          </div>
        </div>

        {/* ===============================
            GROSS SALARY
        ================================ */}

        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Gross Salary
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Automatically calculated from
                total earnings
              </p>
            </div>

            <p className="text-lg font-semibold text-black">
              {formatCurrency(grossSalary)}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          DEDUCTIONS
      ====================================== */}

      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-black">
            Deductions
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Configure employee salary deductions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* ===============================
              EPF
          ================================ */}

          <div>
            <Label>
              EPF
            </Label>

            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    data.epfPercentage || ""
                  }
                  onChange={(e) =>
                    update(
                      "epfPercentage",
                      e.target.value
                    )
                  }
                  placeholder="12"
                  className={`${inputClass(
                    "epfPercentage"
                  )} pr-8`}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  %
                </span>
              </div>

              <div className="flex w-32 items-center justify-end rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700">
                {formatCurrency(epfAmount)}
              </div>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Based on basic salary
            </p>

            {errors.epfPercentage && (
              <p className="mt-1 text-xs text-red-500">
                {errors.epfPercentage}
              </p>
            )}
          </div>

          {/* ===============================
              PROFESSIONAL TAX
          ================================ */}

          <div>
            <Label>
              Professional Tax
            </Label>

            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    data.professionalTaxPercentage ||
                    ""
                  }
                  onChange={(e) =>
                    update(
                      "professionalTaxPercentage",
                      e.target.value
                    )
                  }
                  placeholder="2"
                  className={`${inputClass(
                    "professionalTaxPercentage"
                  )} pr-8`}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  %
                </span>
              </div>

              <div className="flex w-32 items-center justify-end rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700">
                {formatCurrency(
                  professionalTaxAmount
                )}
              </div>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Based on gross salary
            </p>

            {errors.professionalTaxPercentage && (
              <p className="mt-1 text-xs text-red-500">
                {
                  errors.professionalTaxPercentage
                }
              </p>
            )}
          </div>

          {/* ===============================
              TDS
          ================================ */}

          <div>
            <Label>
              TDS
            </Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={data.tds || ""}
                onChange={(e) =>
                  update(
                    "tds",
                    e.target.value
                  )
                }
                placeholder="2500"
                className={`${inputClass(
                  "tds"
                )} pl-8`}
              />
            </div>

            {errors.tds && (
              <p className="mt-1 text-xs text-red-500">
                {errors.tds}
              </p>
            )}
          </div>
        </div>

        {/* ===============================
            TOTAL DEDUCTIONS
        ================================ */}

        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Deductions
              </p>

              <p className="mt-1 text-xs text-gray-400">
                EPF + Professional Tax + TDS
              </p>
            </div>

            <p className="text-lg font-semibold text-black">
              {formatCurrency(totalDeductions)}
            </p>
          </div>
        </div>

        {/* ===============================
            NET SALARY
        ================================ */}

        <div className="mt-3 rounded-lg border border-black bg-black p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Net Salary
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Take-home pay after deductions
              </p>
            </div>

            <p className="text-xl font-bold">
              {formatCurrency(netSalary)}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          EMPLOYER CONTRIBUTIONS
      ====================================== */}

      <div>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-black">
            Employer Contributions
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Configure employer-side payroll
            contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* ===============================
              EMPLOYER PF
          ================================ */}

          <div>
            <Label>
              Employer PF Contribution
            </Label>

            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    data.employerPfPercentage ||
                    ""
                  }
                  onChange={(e) =>
                    update(
                      "employerPfPercentage",
                      e.target.value
                    )
                  }
                  placeholder="12"
                  className={`${inputClass(
                    "employerPfPercentage"
                  )} pr-8`}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  %
                </span>
              </div>

              <div className="flex w-36 items-center justify-end rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700">
                {formatCurrency(
                  employerPfAmount
                )}
              </div>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Based on basic salary
            </p>

            {errors.employerPfPercentage && (
              <p className="mt-1 text-xs text-red-500">
                {errors.employerPfPercentage}
              </p>
            )}
          </div>
        </div>

        {/* ===============================
            CTC
        ================================ */}

        <div className="mt-5 rounded-lg border border-gray-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-black">
                CTC
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Gross salary + employer
                contributions
              </p>
            </div>

            <p className="text-xl font-bold text-black">
              {formatCurrency(ctc)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}