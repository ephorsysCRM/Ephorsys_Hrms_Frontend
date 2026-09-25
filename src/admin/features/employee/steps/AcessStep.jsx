export default function AccessStep({ data, setData }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">
          Access & Permissions
        </h2>

        <p className="text-sm text-gray-500">
          Login credentials, system access, and role-based permissions
        </p>
      </div>

      <input
        type="email"
        className="w-full rounded-lg border p-3"
        placeholder="Login Email"
        value={data.loginEmail}
        onChange={(e) =>
          setData({
            ...data,
            loginEmail: e.target.value,
          })
        }
      />

      <input
        type="password"
        className="w-full rounded-lg border p-3"
        placeholder="Temporary Password"
        value={data.password}
        onChange={(e) =>
          setData({
            ...data,
            password: e.target.value,
          })
        }
      />

      <select
        className="w-full rounded-lg border p-3"
        value={data.systemAccess}
        onChange={(e) =>
          setData({
            ...data,
            systemAccess: e.target.value,
          })
        }
      >
        <option value="">Select System Access</option>
        <option value="Employee Portal">Employee Portal</option>
        <option value="Manager Portal">Manager Portal</option>
        <option value="Admin Portal">Admin Portal</option>
      </select>

      <div className="space-y-3">
        <p className="font-medium">Permissions</p>

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={data.attendancePermission}
            onChange={(e) =>
              setData({
                ...data,
                attendancePermission: e.target.checked,
              })
            }
          />
          Attendance
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={data.leavePermission}
            onChange={(e) =>
              setData({
                ...data,
                leavePermission: e.target.checked,
              })
            }
          />
          Leave Management
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={data.employeePermission}
            onChange={(e) =>
              setData({
                ...data,
                employeePermission: e.target.checked,
              })
            }
          />
          Employee Management
        </label>
      </div>
    </div>
  );
}