export default function BasicInfoStep({ data, setData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Basic Information
      </h2>

      <input
        className="w-full border p-2"
        placeholder="Full Name"
        value={data.name}
        onChange={(e) =>
          setData({ ...data, name: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />
    </div>
  );
}