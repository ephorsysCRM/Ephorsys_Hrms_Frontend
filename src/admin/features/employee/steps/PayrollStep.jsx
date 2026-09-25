export default function PayrollStep({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Work & Payroll</h2>

      <input
        className="w-full border p-2"
        placeholder="Work Location"
        value={data.location}
        onChange={(e) =>
          setData({ ...data, location: e.target.value })
        }
      />

      <input
        type="number"
        className="w-full border p-2"
        placeholder="Salary"
        value={data.salary}
        onChange={(e) =>
          setData({ ...data, salary: e.target.value })
        }
      />

      <select
        className="w-full border p-2"
        value={data.payroll}
        onChange={(e) =>
          setData({ ...data, payroll: e.target.value })
        }
      >
        <option value="">Payroll Type</option>
        <option value="Monthly">Monthly</option>
        <option value="Weekly">Weekly</option>
      </select>
    </div>
  );
}