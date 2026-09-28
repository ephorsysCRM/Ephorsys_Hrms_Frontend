import React, { useState } from "react";

export default function AccessPermissions({ data, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          Access Permissions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure the employee's login password and access details.
        </p>
      </div>

      {/* Access Card */}
      <div className="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-black">
            Account Access
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Set the password that will be used to access the employee account.
          </p>
        </div>

        {/* Two fields per row on medium+ screens */}
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {/* Password */}
          <div className="min-w-0">
            <label className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={data?.password || ""}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-20 outline-none focus:border-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="min-w-0">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={data?.confirmPassword || ""}
                onChange={(e) =>
                  update("confirmPassword", e.target.value)
                }
                placeholder="Confirm password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-20 outline-none focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-black"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Password mismatch */}
            {data?.confirmPassword &&
              data?.password !== data?.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  Passwords do not match.
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}