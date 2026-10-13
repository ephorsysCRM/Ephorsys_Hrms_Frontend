
import { useState } from 'react'
import {
  CalendarDays,
  Clock3,
  LogIn,
  LogOut,
  MapPin,
  CalendarCheck,
  CalendarOff,
  ChevronDown,
  ChevronRight,
  Eye,
  X,
  PieChart
} from 'lucide-react'

const monthlyData = [
  {
    month: 'October 2026',
    key: '2026-10',
    present: 18,
    absent: 1,
    leave: 2,
    checkIn: '09:14 AM',
    checkOut: '06:05 PM',
    hours: '8h 21m',
    percentage: 86,
    records: [
      { day: '10 Oct, Sat', in: '09:12 AM', out: '--', hours: 'In progress', distance: '85 m', status: 'Present' },
      { day: '09 Oct, Fri', in: '09:05 AM', out: '06:02 PM', hours: '8h 27m', distance: '120 m', status: 'Present' },
      { day: '08 Oct, Thu', in: '09:32 AM', out: '06:10 PM', hours: '8h 08m', distance: '240 m', status: 'Late' },
      { day: '07 Oct, Wed', in: '09:08 AM', out: '06:00 PM', hours: '8h 22m', distance: '65 m', status: 'Present' },
      { day: '06 Oct, Tue', in: '--', out: '--', hours: '--', distance: '--', status: 'On Leave' },
      { day: '05 Oct, Mon', in: '09:11 AM', out: '06:03 PM', hours: '8h 22m', distance: '95 m', status: 'Present' },
      { day: '04 Oct, Sun', in: '--', out: '--', hours: '--', distance: '--', status: 'Day Off' }
    ]
  },
  {
    month: 'September 2026',
    key: '2026-09',
    present: 20,
    absent: 1,
    leave: 1,
    checkIn: '09:16 AM',
    checkOut: '06:08 PM',
    hours: '8h 18m',
    percentage: 91,
    records: []
  },
  {
    month: 'August 2026',
    key: '2026-08',
    present: 19,
    absent: 1,
    leave: 2,
    checkIn: '09:20 AM',
    checkOut: '06:01 PM',
    hours: '8h 05m',
    percentage: 86,
    records: []
  },
  {
    month: 'July 2026',
    key: '2026-07',
    present: 22,
    absent: 0,
    leave: 1,
    checkIn: '09:10 AM',
    checkOut: '06:12 PM',
    hours: '8h 26m',
    percentage: 96,
    records: []
  }
]

const statusStyle = {
  Present: 'bg-emerald-50 text-emerald-700',
  Late: 'bg-amber-50 text-amber-700',
  Absent: 'bg-red-50 text-red-700',
  'On Leave': 'bg-blue-50 text-blue-700',
  'Day Off': 'bg-gray-100 text-gray-600'
}

const SummaryItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
    <div className="flex items-center gap-1.5 text-gray-500">
      <Icon size={15} />
      <span className="text-xs">{label}</span>
    </div>
    <p className="mt-2 text-lg font-semibold text-gray-900">{value}</p>
  </div>
)

const Attendance = () => {
  const [selectedMonth, setSelectedMonth] = useState(monthlyData[0])
  const [viewMonth, setViewMonth] = useState(null)

  const today = {
    date: 'Saturday, 10 October 2026',
    checkIn: '09:12 AM',
    checkOut: null,
    hours: 'In progress',
    status: 'Present'
  }

  const weeklyRecords = monthlyData[0].records

  const totalDays =
    selectedMonth.present + selectedMonth.absent + selectedMonth.leave

  const presentPercent = totalDays
    ? (selectedMonth.present / totalDays) * 100
    : 0

  const absentPercent = totalDays
    ? (selectedMonth.absent / totalDays) * 100
    : 0

  const leavePercent = totalDays
    ? (selectedMonth.leave / totalDays) * 100
    : 0

  const donutStyle = {
    background: `conic-gradient(
      #16a34a 0% ${presentPercent}%,
      #ef4444 ${presentPercent}% ${presentPercent + absentPercent}%,
      #3b82f6 ${presentPercent + absentPercent}% 100%
    )`
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-2 sm:p-6 lg:p-1">
      <div className="mx-auto space-y-6">

        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Attendance
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your attendance and monthly work summary.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600">
            <CalendarDays size={17} />
            October 2026
          </div>
        </div>

        {/* Main two-column layout: 60% / 40% */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">

          {/* LEFT: Today + weekly history (60%) */}
          <div className="space-y-5 lg:col-span-3">

            {/* Today's attendance */}
          
<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
  <div className="h-1 bg-black" />

  <div className="p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <CalendarCheck size={19} />
          <h2 className="font-semibold text-gray-900">
            Today's Attendance
          </h2>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          {today.date}
        </p>
      </div>

      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
        {today.status}
      </span>
    </div>

    <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
      <div className="rounded-xl bg-gray-50 p-3">
        <LogIn size={17} className="text-gray-500" />
        <p className="mt-3 text-xs text-gray-500">Check-in</p>
        <p className="mt-1 text-sm font-semibold text-gray-900 sm:text-base">
          {today.checkIn}
        </p>
      </div>

      <div className="rounded-xl bg-gray-50 p-3">
        <LogOut size={17} className="text-gray-500" />
        <p className="mt-3 text-xs text-gray-500">Check-out</p>
        <p className="mt-1 text-sm font-semibold text-gray-900 sm:text-base">
          Not yet
        </p>
      </div>

      <div className="rounded-xl bg-gray-50 p-3">
        <Clock3 size={17} className="text-gray-500" />
        <p className="mt-3 text-xs text-gray-500">Work time</p>
        <p className="mt-1 text-sm font-semibold text-gray-900 sm:text-base">
          In progress
        </p>
      </div>
    </div>

    {/* Check-in location */}
    <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3">
      <MapPin size={17} className="shrink-0 text-gray-500" />

      <span className="text-xs text-gray-500">
        Check-in location
      </span>

      <span className="text-sm font-semibold text-gray-900">
        85 m away
      </span>
    </div>
  </div>
</section>


            {/* Last 7 days */}
            <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Last 7 Days
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Daily attendance and check-in distance
                  </p>
                </div>
                <CalendarDays size={19} className="text-gray-500" />
              </div>

              <div className="mt-4 divide-y divide-gray-100">
                {weeklyRecords.map((record) => (
                  <div key={record.day} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {record.day}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {record.in === '--'
                            ? record.status === 'On Leave'
                              ? 'Approved leave'
                              : 'Weekly off'
                            : `${record.in} – ${record.out === '--' ? 'In progress' : record.out}`}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${statusStyle[record.status]}`}>
                          {record.status}
                        </span>
                        <p className="mt-2 text-xs font-medium text-gray-700">
                          {record.hours}
                        </p>
                      </div>
                    </div>

                    {record.distance !== '--' && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin size={13} />
                        Check-in location
                        <span className="text-gray-300">·</span>
                        <span className="font-medium text-gray-700">
                          {record.distance} away
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Monthly overview + donut chart (40%) */}
          <div className="space-y-5 lg:col-span-2">

            <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Monthly Overview
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Attendance averages
                  </p>
                </div>

                <div className="relative">
                  <select
                    value={selectedMonth.key}
                    onChange={(e) => {
                      setSelectedMonth(
                        monthlyData.find(m => m.key === e.target.value)
                      )
                    }}
                    className="max-w-32 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-2 pr-7 text-xs font-medium text-gray-700 outline-none focus:border-black sm:max-w-none sm:pl-3 sm:pr-8"
                  >
                    {monthlyData.map(month => (
                      <option key={month.key} value={month.key}>
                        {month.month}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <SummaryItem icon={LogIn} label="Avg. Check-in" value={selectedMonth.checkIn} />
                <SummaryItem icon={LogOut} label="Avg. Check-out" value={selectedMonth.checkOut} />
                <SummaryItem icon={Clock3} label="Avg. Work Hours" value={selectedMonth.hours} />
                <SummaryItem icon={CalendarOff} label="Leave Taken" value={`${selectedMonth.leave} days`} />
              </div>

              {/* Donut chart */}
              <div className="mt-4 rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <PieChart size={17} className="text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Attendance Distribution
                  </h3>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div
                    className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
                    style={donutStyle}
                    role="img"
                    aria-label={`${selectedMonth.present} present, ${selectedMonth.absent} absent and ${selectedMonth.leave} leave days`}
                  >
                    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-xl font-bold text-gray-900">
                        {selectedMonth.percentage}%
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Attendance
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    {[
                      { label: 'Present', value: selectedMonth.present, color: 'bg-emerald-600' },
                      { label: 'Absent', value: selectedMonth.absent, color: 'bg-red-500' },
                      { label: 'On Leave', value: selectedMonth.leave, color: 'bg-blue-500' }
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-xs text-gray-600">{item.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Previous month history */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-900">
                Previous Months History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review your attendance performance month by month.
              </p>
            </div>
            <HistoryIcon />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {monthlyData.slice(1).map(month => (
              <div
                key={month.key}
                className="rounded-xl border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {month.month}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {month.present} days present
                    </p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {month.percentage}%
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${month.percentage}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[11px] text-gray-500">Avg. hours</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {month.hours}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500">Leave</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {month.leave} days
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMonth(month)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Eye size={15} />
                  View History
                  <ChevronRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Previous month detail modal */}
      {viewMonth && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setViewMonth(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
            className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 id="history-title" className="font-semibold text-gray-900">
                  {viewMonth.month}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Monthly attendance details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewMonth(null)}
                aria-label="Close history"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SummaryItem icon={CalendarCheck} label="Present" value={viewMonth.present} />
                <SummaryItem icon={CalendarOff} label="Absent" value={viewMonth.absent} />
                <SummaryItem icon={LogIn} label="Avg. Check-in" value={viewMonth.checkIn} />
                <SummaryItem icon={Clock3} label="Avg. Hours" value={viewMonth.hours} />
              </div>

              {viewMonth.records.length ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs text-gray-500">
                        <th className="px-3 py-3">Date</th>
                        <th className="px-3 py-3">Check-in</th>
                        <th className="px-3 py-3">Check-out</th>
                        <th className="px-3 py-3">Distance</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewMonth.records.map(record => (
                        <tr key={record.day} className="border-b border-gray-100 text-sm last:border-0">
                          <td className="px-3 py-3">{record.day}</td>
                          <td className="px-3 py-3">{record.in}</td>
                          <td className="px-3 py-3">{record.out}</td>
                          <td className="px-3 py-3">{record.distance}</td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full px-2 py-1 text-xs ${statusStyle[record.status]}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                  <CalendarDays className="mx-auto text-gray-400" size={26} />
                  <p className="mt-3 text-sm font-medium text-gray-800">
                    Detailed records are not connected yet
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    This sample month has summary figures only. Connect your API to show every day's record.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const HistoryIcon = () => (
  <div className="rounded-xl bg-gray-100 p-2.5">
    <CalendarDays size={19} className="text-gray-700" />
  </div>
)

export default Attendance
