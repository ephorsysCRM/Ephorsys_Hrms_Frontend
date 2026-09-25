export default function PayrollStep({ data, setData }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">
          Work & Payroll Details
        </h2>

        <p className="text-sm text-gray-500">
          Work location, employment type, salary and payroll details
        </p>
      </div>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Work Location"
        value={data.workLocation}
        onChange={(e) =>
          setData({
            ...data,
            workLocation: e.target.value,
          })
        }
      />

      <select
        className="w-full rounded-lg border p-3"
        value={data.employmentType}
        onChange={(e) =>
          setData({
            ...data,
            employmentType: e.target.value,
          })
        }
      >
        <option value="">Select Employment Type</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="Contract">Contract</option>
        <option value="Intern">Intern</option>
      </select>

      <input
        type="number"
        className="w-full rounded-lg border p-3"
        placeholder="Salary"
        value={data.salary}
        onChange={(e) =>
          setData({
            ...data,
            salary: e.target.value,
          })
        }
      />

      <select
        className="w-full rounded-lg border p-3"
        value={data.payFrequency}
        onChange={(e) =>
          setData({
            ...data,
            payFrequency: e.target.value,
          })
        }
      >
        <option value="">Select Pay Frequency</option>
        <option value="Monthly">Monthly</option>
        <option value="Weekly">Weekly</option>
        <option value="Bi-Weekly">Bi-Weekly</option>
      </select>
    </div>
  );
}