export default function BasicInfoStep({ data, setData }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">
          Basic Information
        </h2>

        <p className="text-sm text-gray-500">
          Personal details and contact information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          className="rounded-lg border p-3"
          placeholder="First Name"
          value={data.firstName}
          onChange={(e) =>
            setData({ ...data, firstName: e.target.value })
          }
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Last Name"
          value={data.lastName}
          onChange={(e) =>
            setData({ ...data, lastName: e.target.value })
          }
        />
      </div>

      <input
        type="email"
        className="w-full rounded-lg border p-3"
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />

      <input
        type="tel"
        className="w-full rounded-lg border p-3"
        placeholder="Phone Number"
        value={data.phone}
        onChange={(e) =>
          setData({ ...data, phone: e.target.value })
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="date"
          className="rounded-lg border p-3"
          value={data.dateOfBirth}
          onChange={(e) =>
            setData({
              ...data,
              dateOfBirth: e.target.value,
            })
          }
        />

        <select
          className="rounded-lg border p-3"
          value={data.gender}
          onChange={(e) =>
            setData({ ...data, gender: e.target.value })
          }
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <textarea
        className="w-full rounded-lg border p-3"
        placeholder="Address"
        rows="3"
        value={data.address}
        onChange={(e) =>
          setData({ ...data, address: e.target.value })
        }
      />
    </div>
  );
}