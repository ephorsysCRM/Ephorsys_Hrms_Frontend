export default function BankInfo({ data, onChange }) {
  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-1 focus:ring-black";

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
            className={inputClass}
          />
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
              update("accountHolderName", e.target.value)
            }
            placeholder="Enter account holder name"
            className={inputClass}
          />
        </div>

        {/* Account Number */}
        <div>
          <label className={labelClass}>
            Account Number <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            inputMode="numeric"
            value={data.accountNumber || ""}
            onChange={(e) =>
              update("accountNumber", e.target.value)
            }
            placeholder="Enter account number"
            className={inputClass}
          />
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
              update("ifscCode", e.target.value.toUpperCase())
            }
            placeholder="e.g. SBIN0001234"
            className={inputClass}
          />
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
            className={inputClass}
          />
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
            className="mt-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
          />

          <p className="mt-1 text-xs text-gray-500">
            Upload passbook or bank proof in PDF, JPG, JPEG, or PNG format.
          </p>
        </div>

      </div>
    </div>
  );
}