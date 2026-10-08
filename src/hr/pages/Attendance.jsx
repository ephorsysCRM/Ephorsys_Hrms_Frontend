import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarkAttendanceModal from "../hrModals/MarkAttendanceModal";
import Modal from "../../UI/Modal";
import { ArrowLeft } from "lucide-react";

const employees = [
  {
    name: "Rahul Kumar",
    id: "EMP-1024",
    department: "Engineering",
    date: "2026-10-07",
    checkIn: "09:02 AM",
    checkOut: "06:12 PM",
    status: "Present",
  },
  {
    name: "Rahul Kumar",
    id: "EMP-1024",
    department: "Engineering",
    date: "2026-10-08",
    checkIn: "09:15 AM",
    checkOut: "06:05 PM",
    status: "Late",
  },
  {
    name: "Priya Das",
    id: "EMP-1056",
    department: "HR",
    date: "2026-10-07",
    checkIn: "09:42 AM",
    checkOut: "06:05 PM",
    status: "Late",
  },
  {
    name: "Priya Das",
    id: "EMP-1056",
    department: "HR",
    date: "2026-10-08",
    checkIn: "09:01 AM",
    checkOut: "06:10 PM",
    status: "Present",
  },
];

const statusStyles = {
  Present: "bg-black text-white",
  Late: "bg-gray-200 text-black",
  Absent: "bg-gray-900 text-white",
  "On Leave": "bg-gray-100 text-gray-600",
};

function Attendance() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);

  const filteredEmployees = employees.filter((employee) => {
    const matchesDate = employee.date === selectedDate;

    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.id.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All Departments" ||
      employee.department === department;

    return matchesDate && matchesSearch && matchesDepartment;
  });

  const totalEmployee = filteredEmployees.length;

  const presentCount = filteredEmployees.filter(
    (employee) => employee.status === "Present"
  ).length;

  const absentCount = filteredEmployees.filter(
    (employee) => employee.status === "Absent"
  ).length;

  const lateCount = filteredEmployees.filter(
    (employee) => employee.status === "Late"
  ).length;


  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
        <button
          type='button'
          onClick={() => navigate('/hr/dashboard')}
          className='group inline-flex items-center gap-2 rounded-lg py-1.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-white hover:text-black'
        >
          <ArrowLeft
            size={17}
            className='transition-transform duration-200 group-hover:-translate-x-0.5'
          />
          Back to dashboard
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">
              Attendance
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Manage employee attendance
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {/* <button
              className="
                w-full rounded-lg border border-gray-300 bg-white
                px-4 py-2.5 text-sm transition
                hover:bg-gray-50
                sm:w-auto
              "
            >
              Export
            </button> */}

            <button
              onClick={() => setMarkAttendanceOpen(true)}
              className="
                w-full rounded-lg bg-black px-4 py-2.5
                text-sm text-white transition
                hover:bg-gray-800
                sm:w-auto
              "
            >
              + Mark Attendance
            </button>
          </div>
        </div>

        {/* Date */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium sm:text-base">
            Today's Attendance
          </h2>

          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="
      w-full rounded-lg border border-gray-200
      bg-white px-3 py-2.5 text-sm
      outline-none transition
      focus:border-black
      sm:w-auto
    "
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 text-center">
          <Stat title="Total Employees" value={totalEmployee} />
          <Stat title="Present" value={presentCount} />
          <Stat title="Absent" value={absentCount} />
          <Stat title="Late" value={lateCount} />
        </div>

        {/* Employee Table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white sm:mt-6">

          {/* Table Header */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-sm font-medium sm:text-base">
                Employee Attendance
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Attendance records for today
              </p>
            </div>

            {/* Filters */}
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full rounded-lg border border-gray-200
                  px-3 py-2.5 text-sm outline-none
                  focus:border-black
                  sm:w-56
                "
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="
                  w-full rounded-lg border border-gray-200
                  bg-white px-3 py-2.5 text-sm outline-none
                  focus:border-black
                  sm:w-44
                "
              >
                <option>All Departments</option>
                <option>Engineering</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Design</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-[750px] w-full text-left">

              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 sm:px-5">
                    Employee
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 sm:px-5">
                    Department
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 sm:px-5">
                    Check In
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 sm:px-5">
                    Check Out
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 sm:px-5">
                    Status
                  </th>

                  <th className="px-4 py-3 sm:px-5"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50"
                    >

                      {/* Employee */}
                      <td className="px-4 py-4 sm:px-5">
                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex h-8 w-8 shrink-0 items-center
                              justify-center rounded-full bg-black
                              text-[10px] text-white
                              sm:h-9 sm:w-9 sm:text-xs
                            "
                          >
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {employee.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {employee.id}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Department */}
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 sm:px-5">
                        {employee.department}
                      </td>

                      {/* Check In */}
                      <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-5">
                        {employee.checkIn}
                      </td>

                      {/* Check Out */}
                      <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-5">
                        {employee.checkOut}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 sm:px-5">
                        <span
                          className={`
                            inline-flex whitespace-nowrap
                            rounded-full px-3 py-1
                            text-xs font-medium
                            ${statusStyles[employee.status]}
                          `}
                        >
                          {employee.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 sm:px-5">
                        <button
                          className="
                            flex h-8 w-8 items-center justify-center
                            rounded-md text-lg text-gray-400
                            hover:bg-gray-100 hover:text-black
                          "
                        >
                          ⋮
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-sm text-gray-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {/* <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

            <p className="text-xs text-gray-500">
              Showing {filteredEmployees.length} of 248 employees
            </p>

            {totalPages > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div> */}
        </div>
        <Modal
          isOpen={markAttendanceOpen}
          onClose={() => setMarkAttendanceOpen(false)}
          title="Mark Attendance"
          size="md"
        >
          <MarkAttendanceModal
            onClose={() => setMarkAttendanceOpen(false)}
            onSave={(attendanceData) => {
              console.log("Attendance saved:", attendanceData);

              // API call / state update will go here
              setMarkAttendanceOpen(false);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}

/* ---------------- stat style ---------------- */

function Stat({ title, value }) {
  return (
    <div
      className="
        rounded-xl border border-gray-200
        bg-white p-4 sm:p-5
      "
    >
      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-xl font-semibold sm:text-2xl">
        {value}
      </p>

    </div>
  );
}

export default Attendance;