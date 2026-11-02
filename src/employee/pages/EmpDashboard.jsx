import {
  CalendarDays,
  Clock3,
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

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className='mb-5 flex items-center gap-3'>
    <div className='rounded-xl bg-gray-100 p-2.5'>
      <Icon size={20} />
    </div>

    <div>
      <h2 className='font-semibold text-gray-900'>{title}</h2>

      {subtitle && <p className='text-xs text-gray-500'>{subtitle}</p>}
    </div>
  </div>
)

const ComingSoon = ({ className = '' }) => (
  <div
    className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center ${className}`}
  >
    <p className='text-sm font-semibold text-gray-900'>Coming soon</p>

    <p className='mt-1 text-xs text-gray-500'>
      This feature will be available soon.
    </p>
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
            subtitle='Leave balance and requests'
          />

          <ComingSoon className='flex-1' />
        </section>
      </div>

      {/* This month */}
      <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-5'>
        <SectionHeader
          icon={CalendarDays}
          title='This Month'
          subtitle='Your attendance overview'
        />

        <ComingSoon />
      </section>

      {/* Announcements + payslips */}
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-5'>
        <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 xl:col-span-2'>
          <SectionHeader
            icon={Megaphone}
            title='Announcements'
            subtitle='Latest updates'
          />

          <ComingSoon />
        </section>

        <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 xl:col-span-3'>
          <SectionHeader
            icon={WalletCards}
            title='Recent Payslips'
            subtitle='Your latest salary records'
          />

          <ComingSoon />
        </section>
      </div>
    </div>
  )
}

export default EmployeeDashboard
