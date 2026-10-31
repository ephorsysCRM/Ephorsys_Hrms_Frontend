import { useEffect, useMemo, useState } from "react";
import Modal from "../../UI/Modal" 
import { Save } from "lucide-react";
const employees = [
  {
    id: "EMP-1024",
    name: "Rahul Kumar",
    department: "Engineering",
  },
  {
    id: "EMP-1025",
    name: "Priya Das",
    department: "HR",
  },
  {
    id: "EMP-1026",
    name: "Amit Sharma",
    department: "Marketing",
  },
  {
    id: "EMP-1027",
    name: "Sneha Patel",
    department: "Finance",
  },
  {
    id: "EMP-1028",
    name: "Arjun Mehta",
    department: "Engineering",
  },
  {
    id: "EMP-1029",
    name: "Neha Singh",
    department: "Sales",
  },
];

const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Unpaid Leave",
];

const initialForm = {
  employeeId: "",
  leaveType: "",
  from: "",
  to: "",
  reason: "",
};

const ManageLeaveModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setError("");
    }
  }, [isOpen]);

  const selectedEmployee = useMemo(
    () =>
      employees.find(
        (employee) => employee.id === form.employeeId
      ),
    [form.employeeId]
  );

  const days = useMemo(() => {
    if (!form.from || !form.to) return 0;

    const start = new Date(`${form.from}T00:00:00`);
    const end = new Date(`${form.to}T00:00:00`);
    const difference =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return difference > 0 ? difference : 0;
  }, [form.from, form.to]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.employeeId ||
      !form.leaveType ||
      !form.from ||
      !form.to ||
      !form.reason.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (days <= 0) {
      setError("To date must be the same as or after the From date.");
      return;
    }

    const newLeave = {
      employeeId: form.employeeId,
      employee: selectedEmployee.name,
      department: selectedEmployee.department,
      leaveType: form.leaveType,
      from: form.from,
      to: form.to,
      days,
      reason: form.reason.trim(),
      status: "Pending",
    };

    onSubmit(newLeave);

    setForm(initialForm);
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Leave"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Employee */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Employee <span className="text-red-500">*</span>
          </label>

          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className="
              w-full rounded-lg border border-gray-200
              bg-white px-3 py-2.5 text-sm text-gray-900
              outline-none transition focus:border-black
            "
          >
            <option value="">Select employee</option>

            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} — {employee.department}
              </option>
            ))}
          </select>
        </div>

        {/* Leave Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Leave Type <span className="text-red-500">*</span>
          </label>

          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            className="
              w-full rounded-lg border border-gray-200
              bg-white px-3 py-2.5 text-sm text-gray-900
              outline-none transition focus:border-black
            "
          >
            <option value="">Select leave type</option>

            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              From Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              name="from"
              value={form.from}
              onChange={handleChange}
              className="
                w-full rounded-lg border border-gray-200
                bg-white px-3 py-2.5 text-sm text-gray-900
                outline-none transition focus:border-black
              "
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              To Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              name="to"
              value={form.to}
              min={form.from || undefined}
              onChange={handleChange}
              className="
                w-full rounded-lg border border-gray-200
                bg-white px-3 py-2.5 text-sm text-gray-900
                outline-none transition focus:border-black
              "
            />
          </div>
        </div>

        {/* Days */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total Leave Days
            </span>

            <span className="text-lg font-semibold text-gray-900">
              {days || 0}
            </span>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Reason <span className="text-red-500">*</span>
          </label>

          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={4}
            placeholder="Enter reason for leave..."
            className="
              w-full resize-none rounded-lg
              border border-gray-200 bg-white
              px-3 py-2.5 text-sm text-gray-900
              outline-none transition focus:border-black
            "
          />
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
            {error}
          </p>
        )}

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg border border-gray-200
              px-4 py-2.5 text-sm font-medium
              text-gray-700 transition hover:bg-gray-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
            flex gap-2 justify-center items-center
              rounded-lg bg-black px-4 py-2.5
              text-sm font-medium text-white
              transition hover:bg-gray-800
            "
          >
             <Save size={15} />
            Save Leave
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageLeaveModal;
