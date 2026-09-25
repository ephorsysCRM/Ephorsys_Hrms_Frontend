export default function RoleStep({ data, setData }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">
          Role & Reporting
        </h2>

        <p className="text-sm text-gray-500">
          Employee or Manager, reporting manager, team assignment
        </p>
      </div>

      <select
        className="w-full rounded-lg border p-3"
        value={data.role}
        onChange={(e) =>
          setData({
            ...data,
            role: e.target.value,
          })
        }
      >
        <option value="">Select Role</option>
        <option value="Employee">Employee</option>
        <option value="Manager">Manager</option>
        <option value="HR">HR</option>
      </select>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Reporting Manager"
        value={data.manager}
        onChange={(e) =>
          setData({
            ...data,
            manager: e.target.value,
          })
        }
      />

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Team"
        value={data.team}
        onChange={(e) =>
          setData({
            ...data,
            team: e.target.value,
          })
        }
      />
    </div>
  );
}