export default function EmploymentStep({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Employment Details</h2>

      <input
        className="w-full border p-2"
        placeholder="Employee ID"
        value={data.employeeId}
        onChange={(e) =>
          setData({ ...data, employeeId: e.target.value })
        }
      />

      <input
        type="date"
        className="w-full border p-2"
        value={data.joiningDate}
        onChange={(e) =>
          setData({ ...data, joiningDate: e.target.value })
        }
      />

      <select
        className="w-full border p-2"
        value={data.employmentType}
        onChange={(e) =>
          setData({ ...data, employmentType: e.target.value })
        }
      >
        <option value="">Employment Type</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="Contract">Contract</option>
      </select>
    </div>
  );
}