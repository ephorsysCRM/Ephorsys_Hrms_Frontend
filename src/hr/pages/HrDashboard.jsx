import {
  Users,
  UserCheck,
  CalendarOff,
  ClipboardList,
  Clock3,
  UserX,
  ArrowUpRight,
  CalendarDays,
  FileCheck2,
  Bell,
  BriefcaseBusiness,
} from "lucide-react";

const HRDashboard = () => {
  // -----------------------------
  // Dashboard Data
  // -----------------------------

  const stats = [
    {
      title: "Total Employees",
      value: "248",
      description: "Active employees",
      icon: Users,
    },
    {
      title: "Present Today",
      value: "218",
      description: "87.9% of employees",
      icon: UserCheck,
    },
    {
      title: "On Leave",
      value: "18",
      description: "Employees on leave",
      icon: CalendarOff,
    },
    {
      title: "Pending Requests",
      value: "8",
      description: "Need your attention",
      icon: ClipboardList,
    },
  ];

  const attendance = [
    {
      title: "Present",
      value: 218,
      icon: UserCheck,
    },
    {
      title: "Late",
      value: 12,
      icon: Clock3,
    },
    {
      title: "Absent",
      value: 12,
      icon: UserX,
    },
    {
      title: "On Leave",
      value: 18,
      icon: CalendarOff,
    },
  ];

  const actionItems = [
    {
      title: "Pending Leave Requests",
      count: 5,
      description: "Leave requests awaiting approval",
      icon: CalendarOff,
    },
    {
      title: "Pending Approvals",
      count: 2,
      description: "HR approvals requiring action",
      icon: FileCheck2,
    },
    {
      title: "Other HR Actions",
      count: 1,
      description: "Other pending HR tasks",
      icon: BriefcaseBusiness,
    },
  ];

  const recentActivities = [
    {
      title: "Leave request approved",
      employee: "Priya Das",
      detail: "Sick Leave",
      time: "10 minutes ago",
    },
    {
      title: "New employee added",
      employee: "Rohan Mehta",
      detail: "Engineering",
      time: "35 minutes ago",
    },
    {
      title: "Attendance marked",
      employee: "Amit Sharma",
      detail: "Present",
      time: "1 hour ago",
    },
    {
      title: "Leave request submitted",
      employee: "Neha Singh",
      detail: "Casual Leave",
      time: "2 hours ago",
    },
    {
      title: "Employee profile updated",
      employee: "Sneha Patel",
      detail: "Finance",
      time: "3 hours ago",
    },
  ];

  const departments = [
    {
      name: "Engineering",
      employees: 82,
      present: 74,
    },
    {
      name: "Sales",
      employees: 46,
      present: 41,
    },
    {
      name: "Marketing",
      employees: 32,
      present: 29,
    },
    {
      name: "Finance",
      employees: 28,
      present: 26,
    },
    {
      name: "HR",
      employees: 18,
      present: 17,
    },
  ];

  const upcomingEvents = [
    {
      title: "Payroll Processing",
      date: "Oct 25, 2026",
      type: "Payroll",
    },
    {
      title: "Performance Review",
      date: "Oct 28, 2026",
      type: "HR",
    },
    {
      title: "Employee Town Hall",
      date: "Oct 30, 2026",
      type: "Event",
    },
  ];

  // -----------------------------
  // Component
  // -----------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">

        {/* --------------------------------
            Header
        -------------------------------- */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              HR Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome back. Here&apos;s what&apos;s happening today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 sm:flex">
              <CalendarDays size={17} />
              <span>October 24, 2026</span>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100"
              title="Notifications"
            >
              <Bell size={18} />
            </button>
          </div>
        </div>

        {/* --------------------------------
            KPI Cards
        -------------------------------- */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --------------------------------
            Today's Overview
        -------------------------------- */}
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Attendance Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Today&apos;s Attendance
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Employee attendance overview
                </p>
              </div>

              <UserCheck
                size={21}
                className="text-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {attendance.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {item.title}
                      </span>

                      <Icon size={17} className="text-gray-400" />
                    </div>

                    <p className="text-2xl font-semibold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Attendance Progress */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Attendance rate
                </span>

                <span className="font-medium text-gray-900">
                  87.9%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-black"
                  style={{ width: "87.9%" }}
                />
              </div>
            </div>
          </div>

          {/* Action Required */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Action Required
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tasks that need your attention
                </p>
              </div>

              <ClipboardList
                size={21}
                className="text-gray-500"
              />
            </div>

            <div className="space-y-3">
              {actionItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-black px-2 text-xs font-medium text-white">
                        {item.count}
                      </span>

                      <ArrowUpRight
                        size={17}
                        className="text-gray-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --------------------------------
            Recent Activity + Department
        -------------------------------- */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Recent Activity */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest HR activities
              </p>
            </div>

            <div className="space-y-5">
              {recentActivities.map((activity, index) => (
                <div
                  key={`${activity.employee}-${index}`}
                  className="flex gap-3"
                >
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                      {activity.employee
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    {index !== recentActivities.length - 1 && (
                      <div className="absolute left-1/2 top-10 h-7 w-px -translate-x-1/2 bg-gray-200" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>

                      <span className="text-xs text-gray-400">
                        {activity.time}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      {activity.employee} · {activity.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              View All Activity
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Department Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Department Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Employee distribution by department
              </p>
            </div>

            <div className="space-y-5">
              {departments.map((department) => {
                const percentage = Math.round(
                  (department.present / department.employees) * 100
                );

                return (
                  <div key={department.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {department.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {department.employees} employees
                        </p>
                      </div>

                      <span className="text-sm font-medium text-gray-700">
                        {department.present} present
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-xs text-gray-400">
                      {percentage}% attendance
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --------------------------------
            Upcoming Events
        -------------------------------- */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Important HR dates and activities
              </p>
            </div>

            <CalendarDays
              size={21}
              className="text-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4"
              >
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-100">
                  <span className="text-[10px] font-medium uppercase text-gray-500">
                    {event.date.split(" ")[0]}
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {event.date.split(" ")[1].replace(",", "")}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {event.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {event.type} · {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HRDashboard;