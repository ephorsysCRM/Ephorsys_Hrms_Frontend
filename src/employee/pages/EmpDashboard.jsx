import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Eye,
  LogIn,
  LogOut,
  Megaphone,
  WalletCards
} from 'lucide-react'
import { useSelector } from 'react-redux'

// ======================================================
// Demo data - replace with your API / redux data
// ======================================================

const TARGET_MINUTES = 9 * 60

const todayAttendance = {
  status: 'Present',
  checkIn: '09:32 AM',
  checkOut: null,
  workedMinutes: 4 * 60 + 25
}

const leaveBalance = [
  { label: 'Casual Leave', value: 8 },
  { label: 'Sick Leave', value: 10 },
  { label: 'Used', value: 4 }
]

const monthStats = [
  { label: 'Present', value: 21, dot: 'bg-emerald-600' },
  { label: 'Absent', value: 1, dot: 'bg-red-500' },
  { label: 'Leave', value: 2, dot: 'bg-blue-500' },
  { label: 'Late', value: 3, dot: 'bg-amber-500' }
]

const announcements = [
  { title: 'Salary processed', date: 'Oct 10, 2026' },
  { title: 'New holiday announced', date: 'Oct 08, 2026' },
  { title: 'Team meeting tomorrow', date: 'Oct 07, 2026' }
]

const payslips = [
  { month: 'October 2026', amount: '₹35,000' },
  { month: 'September 2026', amount: '₹35,000' },
  { month: 'August 2026', amount: '₹35,000' }
]

// ======================================================
// Helpers
// ======================================================

const getGreeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      hourCycle: 'h23',
      timeZone: 'Asia/Kolkata'
    }).format(new Date())
  )

  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

const formatToday = () =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(new Date())

const formatMinutes = minutes =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}h ${String(
    minutes % 60
  ).padStart(2, '0')}m`

// ======================================================
// Reusable Components
// ======================================================

const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className='mb-5 flex items-center justify-between gap-3'>
    <div className='flex items-center gap-3'>
      <div className='rounded-xl bg-gray-100 p-2.5'>
        <Icon size={20} />
      </div>

      <div>
        <h2 className='font-semibold text-gray-900'>{title}</h2>

        {subtitle && <p className='text-xs text-gray-500'>{subtitle}</p>}
      </div>
    </div>

    {action && (
      <button
        type='button'
        className='flex shrink-0 items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-black'
      >
        {action}
        <ChevronRight size={16} />
      </button>
    )}
  </div>
)

const InfoRow = ({ icon: Icon, label, value, last }) => (
  <div
    className={`flex items-center justify-between gap-3 py-3.5 ${
      last ? '' : 'border-b border-gray-200'
    }`}
  >
    <div className='flex items-center gap-3'>
      <div className='rounded-lg bg-white p-2'>
        <Icon size={17} />
      </div>

      <span className='text-sm text-gray-600'>{label}</span>
    </div>

    <span className='font-semibold text-gray-900'>{value}</span>
  </div>
)

// ======================================================
// Main Dashboard
// ======================================================

const EmployeeDashboard = () => {
  const user = useSelector(state => state.auth?.user)

  const fullName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.fullName ||
    ''

  const firstName = fullName.trim().split(/\s+/)[0] || 'there'

  const progress = Math.min(
    100,
    Math.round((todayAttendance.workedMinutes / TARGET_MINUTES) * 100)
  )

  return (
    <div className='mx-auto w-full max-w-[1500px] space-y-6 py-2'>
      {/* Greeting */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
          {getGreeting()}, {firstName}
        </h1>

        <p className='mt-1 text-sm text-gray-500'>{formatToday()}</p>
      </div>

      {/* Today's attendance + leave */}
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-3'>
        <section className='overflow-hidden rounded-2xl border border-gray-200 bg-white xl:col-span-2'>
          <div className='h-1 bg-black' />

          <div className='p-4 sm:p-5'>
            <div className='mb-5 flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <div className='rounded-xl bg-gray-100 p-2.5'>
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className='font-semibold text-gray-900'>
                    Today's Attendance
                  </h2>

                  <p className='text-xs text-gray-500'>Work day progress</p>
                </div>
              </div>

              <span className='rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700'>
                {todayAttendance.status}
              </span>
            </div>

            <div className='rounded-xl bg-gray-50 px-4'>
              <InfoRow
                icon={LogIn}
                label='Check In'
                value={todayAttendance.checkIn}
              />

              <InfoRow
                icon={LogOut}
                label='Check Out'
                value={todayAttendance.checkOut || '--:--'}
              />

              <InfoRow
                icon={Clock3}
                label='Working Time'
                value={formatMinutes(todayAttendance.workedMinutes)}
                last
              />
            </div>

            <div className='mt-4'>
              <div className='mb-1.5 flex items-center justify-between text-xs text-gray-500'>
                <span>{progress}% of 9h day</span>
                <span>{formatMinutes(TARGET_MINUTES)}</span>
              </div>

              <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                <div
                  className='h-full rounded-full bg-black transition-all'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className='flex flex-col rounded-2xl border border-gray-200 bg-white p-4 sm:p-5'>
          <SectionHeader
            icon={CalendarDays}
            title='My Leave'
            subtitle='12 days remaining'
          />

          <div className='space-y-2.5'>
            {leaveBalance.map(item => (
              <div
                key={item.label}
                className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'
              >
                <span className='text-sm text-gray-600'>{item.label}</span>

                <span className='font-semibold text-gray-900'>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <button
            type='button'
            className='mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-black py-3 text-sm font-medium text-gray-900 transition hover:bg-black hover:text-white xl:mt-auto'
          >
            <CalendarDays size={17} />
            Apply Leave
          </button>
        </section>
      </div>

      {/* This month */}
      <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-5'>
        <SectionHeader
          icon={CalendarDays}
          title='This Month'
          subtitle='Your attendance overview'
          action='Full history'
        />

        <div className='grid grid-cols-2 gap-2.5 sm:grid-cols-4'>
          {monthStats.map(stat => (
            <div
              key={stat.label}
              className='rounded-xl border border-gray-100 bg-gray-50 p-3'
            >
              <div className='flex items-center gap-2'>
                <span className={`h-2 w-2 rounded-full ${stat.dot}`} />

                <span className='text-xs text-gray-500'>{stat.label}</span>
              </div>

              <p className='mt-2 text-2xl font-semibold text-gray-900'>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements + payslips */}
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-5'>
        <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 xl:col-span-2'>
          <SectionHeader
            icon={Megaphone}
            title='Announcements'
            subtitle='Latest updates'
            action='View all'
          />

          <div className='divide-y divide-gray-100'>
            {announcements.map(item => (
              <div key={item.title} className='flex gap-3 py-3.5 first:pt-0'>
                <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black' />

                <div className='min-w-0'>
                  <p className='text-sm font-medium text-gray-900'>
                    {item.title}
                  </p>

                  <p className='mt-1 text-xs text-gray-500'>{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 xl:col-span-3'>
          <SectionHeader
            icon={WalletCards}
            title='Recent Payslips'
            subtitle='Your latest salary records'
            action='View all'
          />

          <div className='divide-y divide-gray-100 rounded-xl border border-gray-100'>
            {payslips.map(item => (
              <div
                key={item.month}
                className='flex items-center justify-between gap-3 px-4 py-3.5'
              >
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-gray-900'>
                    {item.month}
                  </p>

                  <p className='mt-0.5 text-sm font-semibold text-gray-600'>
                    {item.amount}
                  </p>
                </div>

                <button
                  type='button'
                  className='flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-black hover:bg-black hover:text-white'
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default EmployeeDashboard
