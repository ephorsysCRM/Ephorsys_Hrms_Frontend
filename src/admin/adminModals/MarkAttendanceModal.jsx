import React, { useState } from "react";
import { Check, Clock, CalendarDays, User, Save } from "lucide-react";

const employees = [
  {
    id: "EMP-1024",
    name: "Rahul Kumar",
    department: "Engineering",
  },
  {
    id: "EMP-1056",
    name: "Priya Das",
    department: "HR",
  },
  {
    id: "EMP-1082",
    name: "Amit Singh",
    department: "Finance",
  },
  {
    id: "EMP-1103",
    name: "Neha Patel",
    department: "Design",
  },
  {
    id: "EMP-1121",
    name: "Arjun Mehta",
    department: "Engineering",
  },
];

const statuses = [
  "Present",
  "WFH",
  "Absent",
  "Late",
  "Half Day",
  "On Leave",
];

function MarkAttendanceModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    employee: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
    checkIn: "",
    checkOut: "",
    notes: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      status,
      ...(status === "Absent" || status === "On Leave"
        ? {
            checkIn: "",
            checkOut: "",
          }
        : {}),
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.employee) {
      setError("Please select an employee.");
      return;
    }

    if (
      formData.status !== "Absent" &&
      formData.status !== "On Leave" &&
      !formData.checkIn
    ) {
      setError("Please enter check-in time.");
      return;
    }

    const employee = employees.find(
      (item) => item.id === formData.employee
    );

    const attendanceData = {
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      date: formData.date,
      status: formData.status,
      checkIn: formData.checkIn || "-",
      checkOut: formData.checkOut || "-",
      notes: formData.notes,
    };

    onSave(attendanceData);
  };

  const disableTime =
    formData.status === "Absent" ||
    formData.status === "On Leave";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Employee */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Employee
        </label>

        <div className="relative">
          <User
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="
              w-full appearance-none rounded-lg
              border border-gray-200 bg-white
              py-2.5 pl-10 pr-3 text-sm
              outline-none focus:border-black
            "
          >
            <option value="">Select employee</option>

            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} — {employee.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Date
        </label>

        <div className="relative">
          <CalendarDays
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="
              w-full rounded-lg border border-gray-200
              py-2.5 pl-10 pr-3 text-sm
              outline-none focus:border-black
            "
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Attendance Status
        </label>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              className={`
                rounded-lg border px-3 py-2.5
                text-sm transition
                ${
                  formData.status === status
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Check In
          </label>

          <div className="relative">
            <Clock
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="time"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              disabled={disableTime}
              className="
                w-full rounded-lg border border-gray-200
                py-2.5 pl-10 pr-3 text-sm
                outline-none focus:border-black
                disabled:bg-gray-50
              "
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Check Out
          </label>

          <div className="relative">
            <Clock
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="time"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              disabled={disableTime}
              className="
                w-full rounded-lg border border-gray-200
                py-2.5 pl-10 pr-3 text-sm
                outline-none focus:border-black
                disabled:bg-gray-50
              "
            />
          </div>
        </div>

      </div>

      {/* Notes */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Notes
          <span className="ml-1 text-xs font-normal text-gray-400">
            Optional
          </span>
        </label>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Add any notes..."
          className="
            w-full resize-none rounded-lg
            border border-gray-200 px-3 py-2.5
            text-sm outline-none
            focus:border-black
          "
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={onClose}
          className="
            w-full rounded-lg border border-gray-200
            px-4 py-2.5 text-sm font-medium
            hover:bg-gray-50 sm:w-auto
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
            flex w-full items-center justify-center gap-2
            rounded-lg bg-black px-5 py-2.5
            text-sm font-medium text-white
            hover:bg-gray-800 sm:w-auto
          "
        >
           <Save size={15} />
          Save Attendance
        </button>

      </div>
    </form>
  );
}

export default MarkAttendanceModal;