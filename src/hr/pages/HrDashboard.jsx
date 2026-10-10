import {
  Users,
  UserCheck,
  CalendarOff,
  UserX,
  ArrowUpRight,
  Plus,
  CalendarCheck,
  UserPlus,
  ClipboardList,
  Megaphone,
  Building2,
  ArrowUpLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HRDashboard = () => {
  const navigate = useNavigate();

  // --------------------------------
  // Dashboard Data
  // --------------------------------

  const stats = [
    {
      title: "Employees",
      value: 248,
      icon: Users,
    },
    {
      title: "Present",
      value: 218,
      icon: UserCheck,
    },
    {
      title: "On Leave",
      value: 18,
      icon: CalendarOff,
    },
    {
      title: "Absent",
      value: 12,
      icon: UserX,
    },
  ];

  const attendance = [
    {
      label: "Present",
      value: 218,
    },
    {
      label: "Late",
      value: 12,
    },
    {
      label: "Absent",
      value: 12,
    },
  ];

  const leaveSummary = [
    {
      label: "Pending",
      value: 8,
    },
    {
      label: "Approved",
      value: 24,
    },
    {
      label: "Rejected",
      value: 3,
    },
  ];

  const recentLeaves = [
    {
      employee: "Rahul Kumar",
      leaveType: "Casual Leave",
      dates: "Oct 10 - 11",
      status: "Pending",
    },
    {
      employee: "Priya Das",
      leaveType: "Sick Leave",
      dates: "Oct 12",
      status: "Approved",
    },
    {
      employee: "Sneha Patel",
      leaveType: "Casual Leave",
      dates: "Oct 20",
      status: "Pending",
    },
    {
      employee: "Arjun Mehta",
      leaveType: "Sick Leave",
      dates: "Oct 05 - 06",
      status: "Approved",
    },
  ];

  const departments = [
    {
      name: "Engineering",
      employees: 82,
    },
    {
      name: "HR",
      employees: 18,
    },
    {
      name: "Marketing",
      employees: 32,
    },
    {
      name: "Sales",
      employees: 46,
    },
    {
      name: "Finance",
      employees: 28,
    },
  ];

  const announcements = [
    {
      title: "Time Table Update Notice",
      date: "Oct 13, 2026",
    },
    {
      title: "Policy update",
      date: "Oct 17, 2026",
    },
    {
      title: "Team meeting",
      date: "Oct 18, 2026",
    },
    {
      title: "Dussehra",
      date: "Oct 18 - Oct 20, 2026",
    },
  ];

  // --------------------------------
  // Component
  // --------------------------------

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-3">
      <div className="mx-auto max-w-375">

        {/* ==============================
            Header
        ============================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1 py-2">

          <div>
            <p className="text-sm font-medium text-gray-500">
              HR Dashboard
            </p>

            <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
              Good morning, HR
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening today.
            </p>
          </div>

        </div>

        {/* ==============================
            CARDS
        ============================== */}

        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                    <Icon
                      size={20}
                      className="text-gray-700"
                    />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* ==============================
            ATTENDANCE + LEAVE SUMMARY
        ============================== */}

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Common HR tasks, all in one place
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Manage Attendance */}
              <button
                onClick={() => navigate("/hr/attendance")}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-black hover:bg-gray-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-black group-hover:text-white">
                  <CalendarCheck size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Manage Attendance
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    View employee attendance
                  </p>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-gray-400 transition group-hover:text-black"
                />
              </button>

              {/* Add Employee */}
              <button
                onClick={() => navigate('/hr/add-employee')}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-black hover:bg-gray-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-black group-hover:text-white">
                  <UserPlus size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Add Employee
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Register a new employee
                  </p>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-gray-400 transition group-hover:text-black"
                />
              </button>

              {/* Add Department */}
              <button
                onClick={() => navigate("/hr/departments")}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-black hover:bg-gray-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-black group-hover:text-white">
                  <Building2 size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Add Department
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Create a new department
                  </p>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-gray-400 transition group-hover:text-black"
                />
              </button>

              {/* Review Leave Requests */}
              <button
                onClick={() => navigate("/hr/leave-management")}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-black hover:bg-gray-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-black group-hover:text-white">
                  <ClipboardList size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Review Leave Requests
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Review pending approvals
                  </p>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-gray-400 transition group-hover:text-black"
                />
              </button>

              {/* Create Announcement */}
              <button
                onClick={() => navigate("/hr/announcements")}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-black hover:bg-gray-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-black group-hover:text-white">
                  <Megaphone size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Create Announcement
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Share company updates
                  </p>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-gray-400 transition group-hover:text-black"
                />
              </button>
            </div>
          </div>



          {/* Leave Requests Summary */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Leave Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current leave request status
              </p>
            </div>

            <div className="space-y-3">

              {leaveSummary.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>

                  <span
                    className={`
                      flex h-8 min-w-8 items-center justify-center
                      rounded-full px-2 text-xs font-semibold
                      ${item.label === "Pending"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* ==============================
            RECENT LEAVE REQUESTS
        ============================== */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white">

          <div className="flex flex-col  gap-3 sm:flex-row sm:justify-between  border-b border-gray-200 px-5 py-4">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Leave Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest employee leave activity
              </p>
            </div>

            <button
              className="flex items-center gap-1  text-sm font-medium text-gray-600 transition hover:text-black"
              onClick={() => navigate("/hr/leave-management")}
            >
              View all
              <ArrowUpRight size={15} />
            </button>

          </div>

          {/* Desktop Table */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-175">

              <thead>
                <tr className="border-b border-gray-100">

                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                    Employee
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                    Leave Type
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                    Dates
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {recentLeaves.map((leave) => (
                  <tr
                    key={`${leave.employee}-${leave.dates}`}
                    className="border-b border-gray-100 last:border-0"
                  >

                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {leave.employee}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {leave.leaveType}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {leave.dates}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex rounded-full px-3 py-1
                          text-xs font-medium
                          ${leave.status === "Pending"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {leave.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* Mobile */}

          <div className="divide-y divide-gray-100 md:hidden">

            {recentLeaves.map((leave) => (
              <div
                key={`${leave.employee}-${leave.dates}`}
                className="p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {leave.employee}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {leave.leaveType}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {leave.dates}
                    </p>
                  </div>

                  <span
                    className={`
                      shrink-0 rounded-full px-3 py-1
                      text-xs font-medium
                      ${leave.status === "Pending"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {leave.status}
                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* ==============================
            DEPARTMENTS + ANNOUNCEMENTS
        ============================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Departments */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">

           <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Departments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Employee distribution
              </p>
            </div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                onClick={() => navigate("/hr/departments")}
              >
                <ArrowUpLeft size={15} /> View Departments
              </button>
            </div>

            <div className="space-y-4">

              {departments.map((department) => (
                <div
                  key={department.name}
                  className="flex items-center justify-between"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                      <Users
                        size={15}
                        className="text-gray-600"
                      />
                    </div>

                    <span className="text-sm font-medium text-gray-800">
                      {department.name}
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {department.employees}
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* Announcements */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Announcements
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Latest company updates
                </p>
              </div>

              {/* Add Announcement */}

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                onClick={() => navigate("/hr/announcements")}
              >
                <Plus size={15} /> Add Announcement
              </button>

            </div>

            <div className="space-y-3">

              {announcements.map((announcement) => (
                <div
                  key={announcement.title}
                  className="rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                >

                  <p className="text-sm font-medium text-gray-900">
                    {announcement.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {announcement.date}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default HRDashboard;