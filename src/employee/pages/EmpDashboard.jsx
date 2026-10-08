import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Megaphone,
  IndianRupee,
  LogIn,
  LogOut,
  WalletCards,
  BarChart3,
} from "lucide-react";

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black">
      <main className="mx-auto w-full max-w-[1500px] px-4 py-1 sm:px-6 lg:px-1">

        {/* ================= HEADER ================= */}
        <div className="mb-5 flex items-center justify-between">
          <div>
           
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Good Morning, Rahul 👋
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Here's your work overview for today
            </p>
          </div>

          <button
            className="
              relative rounded-xl border border-gray-200 bg-white p-3
              text-gray-600 transition
              hover:border-black hover:text-black
            "
          >
            <Bell size={20} />

            <span
              className="
                absolute -right-1 -top-1 flex h-4 w-4
                items-center justify-center rounded-full
                bg-black text-[9px] font-semibold text-white
              "
            >
              3
            </span>
          </button>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Attendance */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-3">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Attendance
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    Present
                  </p>
                </div>
              </div>

              <ChevronRight
                size={19}
                className="text-gray-400"
              />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-medium">
                09:32 AM
              </span>
            </div>
          </div>

          {/* Leave */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-3">
                  <FileText size={21} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Leave Balance
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    12 Days
                  </p>
                </div>
              </div>

              <ChevronRight
                size={19}
                className="text-gray-400"
              />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Remaining
            </p>
          </div>

          {/* Salary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-3">
                  <IndianRupee size={21} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Salary
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    ₹35,000
                  </p>
                </div>
              </div>

              <ChevronRight
                size={19}
                className="text-gray-400"
              />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              October 2026
            </p>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* ================= TODAY ATTENDANCE ================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Today's Attendance
                  </h2>

                  <p className="text-xs text-gray-500">
                    Thursday, 08 October 2026
                  </p>
                </div>
              </div>

              <button className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-black">
                View Details
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="rounded-xl bg-[#f7f7f7] p-4">

              {/* Check In */}
              <div className="flex items-center justify-between border-b border-gray-200 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2">
                    <LogIn size={17} />
                  </div>

                  <span className="text-sm text-gray-600">
                    Check In
                  </span>
                </div>

                <span className="font-semibold">
                  09:32 AM
                </span>
              </div>

              {/* Check Out */}
              <div className="flex items-center justify-between border-b border-gray-200 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2">
                    <LogOut size={17} />
                  </div>

                  <span className="text-sm text-gray-600">
                    Check Out
                  </span>
                </div>

                <span className="font-semibold">
                  --:--
                </span>
              </div>

              {/* Working Time */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2">
                    <Clock3 size={17} />
                  </div>

                  <span className="text-sm text-gray-600">
                    Working Time
                  </span>
                </div>

                <span className="font-semibold">
                  04h 25m
                </span>
              </div>
            </div>

            <button
              className="
                mt-5 flex w-full items-center justify-center gap-2
                rounded-xl bg-black py-3
                text-sm font-medium text-white
                transition hover:bg-gray-800
              "
            >
              <LogOut size={17} />
              Check Out
            </button>
          </section>

          {/* ================= MY LEAVE ================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <CalendarDays size={20} />
                </div>

                <h2 className="font-semibold">
                  My Leave
                </h2>
              </div>

              <ChevronRight
                size={18}
                className="text-gray-400"
              />
            </div>

            <div className="space-y-3">

              <div className="flex items-center justify-between rounded-xl bg-[#f7f7f7] px-4 py-3">
                <span className="text-sm text-gray-600">
                  Casual Leave
                </span>

                <span className="font-semibold">
                  8
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#f7f7f7] px-4 py-3">
                <span className="text-sm text-gray-600">
                  Sick Leave
                </span>

                <span className="font-semibold">
                  10
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#f7f7f7] px-4 py-3">
                <span className="text-sm text-gray-600">
                  Used
                </span>

                <span className="font-semibold">
                  4
                </span>
              </div>
            </div>

            <button
              className="
                mt-19.5 flex w-full items-center justify-center gap-2
                rounded-xl border border-black
                py-3 text-sm font-medium
                transition hover:bg-black hover:text-white
              "
            >
              <CalendarDays size={17} />
              Apply Leave
            </button>
          </section>
        </div>

        {/* ================= ANNOUNCEMENTS ================= */}
        <div className="mt-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <Megaphone size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Announcements
                  </h2>

                  <p className="text-xs text-gray-500">
                    Latest updates from your organization
                  </p>
                </div>
              </div>

              <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-black">
                View All
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 divide-y divide-gray-100 md:grid-cols-3 md:divide-x md:divide-y-0">

              <Announcement
                title="Salary processed"
                date="Oct 10, 2026"
              />

              <Announcement
                title="New holiday announced"
                date="Oct 08, 2026"
              />

              <Announcement
                title="Team meeting tomorrow"
                date="Oct 07, 2026"
              />
            </div>
          </section>
        </div>

        {/* ================= ATTENDANCE SUMMARY ================= */}
        <div className="mt-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Attendance Summary
                  </h2>

                  <p className="text-xs text-gray-500">
                    Your attendance overview
                  </p>
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">

              <AttendanceStat
                label="Present"
                value="21"
                dot="bg-green-500"
              />

              <AttendanceStat
                label="Absent"
                value="1"
                dot="bg-red-400"
              />

              <AttendanceStat
                label="Leave"
                value="2"
                dot="bg-gray-400"
              />

              <AttendanceStat
                label="Late"
                value="3"
                dot="bg-yellow-400"
              />

            </div>
          </section>
        </div>

        {/* ================= RECENT PAYSLIPS ================= */}
        <div className="mt-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <WalletCards size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Recent Payslips
                  </h2>

                  <p className="text-xs text-gray-500">
                    Your latest salary records
                  </p>
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-gray-400"
              />
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-xl border border-gray-100 sm:block">

              <div className="grid grid-cols-3 bg-gray-50 px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                <span>Month</span>
                <span>Amount</span>
                <span>Action</span>
              </div>

              <PayslipRow
                month="October 2026"
                amount="₹35,000"
              />

              <PayslipRow
                month="September 2026"
                amount="₹35,000"
              />

              <PayslipRow
                month="August 2026"
                amount="₹35,000"
              />
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 sm:hidden">

              <MobilePayslip
                month="October 2026"
                amount="₹35,000"
              />

              <MobilePayslip
                month="September 2026"
                amount="₹35,000"
              />

              <MobilePayslip
                month="August 2026"
                amount="₹35,000"
              />

            </div>
          </section>
        </div>

      </main>
    </div>
  );
};


/* ================= COMPONENTS ================= */

const Announcement = ({ title, date }) => {
  return (
    <div className="px-0 py-4 md:px-5 md:py-2">
      <div className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black" />

        <div>
          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
};


const AttendanceStat = ({ label, value, dot }) => {
  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />

        <span className="text-sm text-gray-500">
          {label}
        </span>
      </div>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
};


const PayslipRow = ({ month, amount }) => {
  return (
    <div className="grid grid-cols-3 items-center border-t border-gray-100 px-5 py-4">

      <span className="text-sm font-medium">
        {month}
      </span>

      <span className="text-sm font-semibold">
        {amount}
      </span>

      <div>
        <button
          className="
            flex items-center gap-2 rounded-lg
            border border-gray-300 px-3 py-1.5
            text-xs font-medium
            transition hover:border-black hover:bg-black hover:text-white
          "
        >
          <Eye size={14} />
          View
        </button>
      </div>
    </div>
  );
};


const MobilePayslip = ({ month, amount }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">

      <div>
        <p className="text-sm font-medium">
          {month}
        </p>

        <p className="mt-1 text-sm font-semibold">
          {amount}
        </p>
      </div>

      <button
        className="
          flex items-center gap-2 rounded-lg
          border border-gray-300 px-3 py-2
          text-xs font-medium
          hover:border-black
        "
      >
        <Eye size={14} />
        View
      </button>
    </div>
  );
};

export default EmployeeDashboard;