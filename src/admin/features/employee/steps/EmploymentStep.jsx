export default function EmploymentStep({ data, setData }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">
          Employment Details
        </h2>

        <p className="text-sm text-gray-500">
          Employee ID, department, designation, joining date
        </p>
      </div>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Employee ID"
        value={data.id}
        onChange={(e) =>
          setData({ ...data, id: e.target.value })
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <select
          className="rounded-lg border p-3"
          value={data.department}
          onChange={(e) =>
            setData({
              ...data,
              department: e.target.value,
            })
          }
        >
          <option value="">Select Department</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Human Resources">
            Human Resources
          </option>
        </select>

        <input
          className="rounded-lg border p-3"
          placeholder="Designation"
          value={data.designation}
          onChange={(e) =>
            setData({
              ...data,
              designation: e.target.value,
            })
          }
        />
      </div>

      <input
        type="date"
        className="w-full rounded-lg border p-3"
        value={data.joiningDate}
        onChange={(e) =>
          setData({
            ...data,
            joiningDate: e.target.value,
          })
        }
      />
    </div>
  );
}