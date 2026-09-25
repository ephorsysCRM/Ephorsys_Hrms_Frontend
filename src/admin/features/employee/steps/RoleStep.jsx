export default function RoleStep({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Role & Reporting</h2>

      <input
        className="w-full border p-2"
        placeholder="Job Title"
        value={data.jobTitle}
        onChange={(e) =>
          setData({ ...data, jobTitle: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Department"
        value={data.department}
        onChange={(e) =>
          setData({ ...data, department: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Reporting Manager"
        value={data.manager}
        onChange={(e) =>
          setData({ ...data, manager: e.target.value })
        }
      />
    </div>
  );
}