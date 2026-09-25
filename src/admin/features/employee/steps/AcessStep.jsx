export default function AccessStep({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Access & Permissions
      </h2>

      <select
        className="w-full border p-2"
        value={data.access}
        onChange={(e) =>
          setData({ ...data, access: e.target.value })
        }
      >
        <option value="">Select Access</option>
        <option value="Employee">Employee</option>
        <option value="Manager">Manager</option>
        <option value="Admin">Admin</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.emailAccess}
          onChange={(e) =>
            setData({
              ...data,
              emailAccess: e.target.checked,
            })
          }
        />
        Email Access
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.attendanceAccess}
          onChange={(e) =>
            setData({
              ...data,
              attendanceAccess: e.target.checked,
            })
          }
        />
        Attendance Access
      </label>
    </div>
  );
}