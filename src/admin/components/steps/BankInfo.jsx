export default function BankInfo({
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

  const inputClass = (field) =>
    `mt-2 w-full rounded-lg border px-3 py-2 outline-none transition ${errors[field]
      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
      : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
    }`;

  const labelClass = "text-sm font-medium text-gray-700";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          Bank Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter the employee's bank account and payment information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Bank Name */}
        <div>
          <label className={labelClass}>
            Bank Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={data.bankName || ""}
            onChange={(e) =>
              update("bankName", e.target.value)
            }
            placeholder="Enter bank name"
            className={inputClass("bankName")}
          />

          {errors.bankName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.bankName}
            </p>
          )}
        </div>

        {/* Account Holder Name */}
        <div>
          <label className={labelClass}>
            Account Holder Name{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={data.accountHolderName || ""}
            onChange={(e) =>
              update(
                "accountHolderName",
                e.target.value
              )
            }
            placeholder="Enter account holder name"
            className={inputClass("accountHolderName")}
          />

          {errors.accountHolderName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.accountHolderName}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className={labelClass}>
            Account Number{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            inputMode="numeric"
            value={data.accountNumber || ""}
            onChange={(e) =>
              update("accountNumber", e.target.value)
            }
            placeholder="Enter account number"
            className={inputClass("accountNumber")}
          />

          {errors.accountNumber && (
            <p className="mt-1 text-xs text-red-500">
              {errors.accountNumber}
            </p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <label className={labelClass}>
            IFSC Code <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={data.ifscCode || ""}
            onChange={(e) =>
              update(
                "ifscCode",
                e.target.value.toUpperCase()
              )
            }
            placeholder="e.g. SBIN0001234"
            className={inputClass("ifscCode")}
          />

          {errors.ifscCode && (
            <p className="mt-1 text-xs text-red-500">
              {errors.ifscCode}
            </p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className={labelClass}>
            Branch <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={data.branch || ""}
            onChange={(e) =>
              update("branch", e.target.value)
            }
            placeholder="Enter branch name"
            className={inputClass("branch")}
          />

          {errors.branch && (
            <p className="mt-1 text-xs text-red-500">
              {errors.branch}
            </p>
          )}
        </div>

        {/* Passbook / Bank Document */}
        <div>
          <label className={labelClass}>
            Passbook / Bank Document{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              update(
                "bankDocument",
                e.target.files?.[0] || null
              )
            }
            className={`mt-2 block w-full cursor-pointer rounded-lg border bg-white px-3 py-2 text-sm outline-none file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800 ${errors.bankDocument
                ? "border-red-500"
                : "border-gray-300"
              }`}
          />

          <p className="mt-1 text-xs text-gray-500">
            Upload passbook or bank proof in PDF, JPG, JPEG, or PNG format.
          </p>

          {errors.bankDocument && (
            <p className="mt-1 text-xs text-red-500">
              {errors.bankDocument}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}