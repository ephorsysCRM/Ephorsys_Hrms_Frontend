import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  LogIn,
  LogOut,
  Megaphone,
  PieChart,
  WalletCards
} from 'lucide-react'

import { getMyAttendance } from '../../redux/features/attendance/attendanceThunk'

// ======================================================
// Config
// ======================================================

const TARGET_MINUTES = 9 * 60

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

const pad = value => String(value).padStart(2, '0')

const getDateString = date => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))

  return `${values.year}-${values.month}-${values.day}`
}

const getMonthRange = monthKey => {
  const [year, month] = monthKey.split('-').map(Number)

  return {
    startDate: `${year}-${pad(month)}-01`,
    endDate: `${year}-${pad(month)}-${pad(new Date(year, month, 0).getDate())}`
  }
}

const formatMonth = monthKey =>
  new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(new Date(`${monthKey}-01T12:00:00+05:30`))

const getMonthStats = records => {
  const count = status =>
    records.filter(
      record => String(record?.status || '').toLowerCase() === status
    ).length

  const present = count('present')
  const absent = count('absent')
  const leave = count('leave')
  const halfDays = count('half_day')
  const counted = present + absent + leave + halfDays

  return {
    present,
    absent,
    leave,
    halfDays,
    counted,
    percentage: counted
      ? Math.round(((present + halfDays * 0.5) / counted) * 100)
      : 0
  }
}

// conic-gradient string with one slice per status
const buildPieGradient = slices => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)

  if (!total) return '#e5e7eb'

  let start = 0

  const stops = slices
    .filter(slice => slice.value > 0)
    .map(slice => {
      const end = start + (slice.value / total) * 100
      const stop = `${slice.hex} ${start}% ${end}%`
      start = end
      return stop
    })

  return `conic-gradient(${stops.join(', ')})`
}

const formatTime = value => {
  if (!value) return '--:--'

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(new Date(value))
}

const getRecordTimes = record => {
  const halves = [record?.firstHalf, record?.secondHalf]

  const checkIns = halves
    .map(half => half?.checkIn?.time)
    .filter(Boolean)
    .sort((a, b) => new Date(a) - new Date(b))

  const checkOuts = halves
    .map(half => half?.checkOut?.time)
    .filter(Boolean)
    .sort((a, b) => new Date(a) - new Date(b))

  return {
    checkIn: checkIns[0] || null,
    checkOut: checkOuts.at(-1) || null
  }
}

const getRecordMinutes = record =>
  Math.max(
    0,
    Number(record?.totalWorkDuration || 0) ||
      Number(record?.creditedDuration || 0)
  )

// Check-in time of a half that has no check-out yet (user is working now)
const getOpenCheckIn = record =>
  [record?.firstHalf, record?.secondHalf].find(
    half => half?.checkIn?.time && !half?.checkOut?.time
  )?.checkIn?.time || null

const getStatus = (record, checkedIn) => {
  if (!record) return 'Not Marked'

  const status = String(record?.status || 'pending').toLowerCase()

  if (status === 'pending' && checkedIn) return 'Checked In'

  const labels = {
    present: 'Present',
    absent: 'Absent',
    leave: 'On Leave',
    half_day: 'Half Day',
    holiday: 'Holiday',
    weekly_off: 'Weekly Off',
    pending: 'Pending'
  }

  return labels[status] || status.replaceAll('_', ' ')
}

const statusDots = {
  Present: 'bg-emerald-500',
  'Checked In': 'bg-emerald-500',
  'Half Day': 'bg-amber-500',
  Absent: 'bg-red-500',
  'On Leave': 'bg-blue-500',
  Holiday: 'bg-purple-500',
  'Weekly Off': 'bg-gray-400',
  Pending: 'bg-amber-500',
  'Not Marked': 'bg-gray-400'
}

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

// ======================================================
// Main Dashboard
// ======================================================

const MyDashboard = () => {
  const user = useSelector(state => state.auth?.user)

  const fullName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.fullName ||
    ''

  const firstName = fullName.trim().split(/\s+/)[0] || 'there'

  const dispatch = useDispatch()

  const todayString = getDateString(new Date())
  const monthKey = todayString.slice(0, 7)

  const [todayData, setTodayData] = useState(null)
  const [todayLoading, setTodayLoading] = useState(true)
  const [todayError, setTodayError] = useState('')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false

    const loadToday = async () => {
      setTodayLoading(true)
      setTodayError('')

      try {
        const response = await dispatch(
          getMyAttendance({
            startDate: todayString,
            endDate: todayString,
            page: 1,
            pageSize: 10
          })
        ).unwrap()

        if (!cancelled) {
          const records = response?.attendance || []

          setTodayData(
            records.find(record => record.date?.slice(0, 10) === todayString) ||
              null
          )
        }
      } catch (error) {
        if (!cancelled) {
          setTodayError(
            typeof error === 'string'
              ? error
              : error?.message || 'Failed to load today attendance.'
          )
        }
      } finally {
        if (!cancelled) setTodayLoading(false)
      }
    }

    loadToday()

    return () => {
      cancelled = true
    }
  }, [dispatch, todayString])

  const openCheckIn = getOpenCheckIn(todayData)

  // Keep the working time ticking while the user is checked in
  useEffect(() => {
    if (!openCheckIn) return undefined

    const timer = setInterval(() => setNow(Date.now()), 60000)

    return () => clearInterval(timer)
  }, [openCheckIn])

  const [monthStats, setMonthStats] = useState(null)
  const [monthLoading, setMonthLoading] = useState(true)
  const [monthError, setMonthError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadMonth = async () => {
      setMonthLoading(true)
      setMonthError('')

      const { startDate, endDate } = getMonthRange(monthKey)

      try {
        const response = await dispatch(
          getMyAttendance({ startDate, endDate, page: 1, pageSize: 100 })
        ).unwrap()

        if (!cancelled) {
          setMonthStats(getMonthStats(response?.attendance || []))
        }
      } catch (error) {
        if (!cancelled) {
          setMonthError(
            typeof error === 'string'
              ? error
              : error?.message || 'Failed to load attendance.'
          )
        }
      } finally {
        if (!cancelled) setMonthLoading(false)
      }
    }

    loadMonth()

    return () => {
      cancelled = true
    }
  }, [dispatch, monthKey])

  const pieItems = [
    {
      label: 'Present',
      value: monthStats?.present || 0,
      hex: '#16a34a',
      dot: 'bg-emerald-600'
    },
    {
      label: 'Absent',
      value: monthStats?.absent || 0,
      hex: '#ef4444',
      dot: 'bg-red-500'
    },
    {
      label: 'On Leave',
      value: monthStats?.leave || 0,
      hex: '#3b82f6',
      dot: 'bg-blue-500'
    },
    {
      label: 'Half Day',
      value: monthStats?.halfDays || 0,
      hex: '#f59e0b',
      dot: 'bg-amber-500'
    }
  ]

  const todayTimes = getRecordTimes(todayData)
  const todayStatus = getStatus(todayData, Boolean(openCheckIn))

  const workedMinutes =
    getRecordMinutes(todayData) +
    (openCheckIn
      ? Math.max(0, Math.floor((now - new Date(openCheckIn).getTime()) / 60000))
      : 0)

  const progress = Math.min(
    100,
    Math.round((workedMinutes / TARGET_MINUTES) * 100)
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
        <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-[#111111] to-[#2a2a2a] p-5 text-white shadow-lg shadow-black/20 sm:p-6 xl:col-span-2'>
          {/* decorative circles */}
          <div className='pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10' />
          <div className='pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/5' />

          <div className='relative'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <div className='rounded-xl bg-white/15 p-2.5'>
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className='font-semibold'>Today's Attendance</h2>

                  <p className='text-xs text-gray-300'>{formatToday()}</p>
                </div>
              </div>

              <span className='flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-900'>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    statusDots[todayStatus] || 'bg-gray-400'
                  }`}
                />
                {todayLoading ? 'Loading...' : todayStatus}
              </span>
            </div>

            <div className='mt-6'>
              <p className='text-xs text-gray-300'>Working time</p>

              <p className='mt-1 text-4xl font-bold tracking-tight sm:text-5xl'>
                {todayLoading ? '--' : formatMinutes(workedMinutes)}
              </p>
            </div>

            <div className='mt-4'>
              <div className='h-2 overflow-hidden rounded-full bg-white/20'>
                <div
                  className='h-full rounded-full bg-white transition-all'
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className='mt-1.5 flex items-center justify-between text-xs text-gray-300'>
                <span>{progress}% completed</span>
                <span>Target {formatMinutes(TARGET_MINUTES)}</span>
              </div>
            </div>

            {todayError && (
              <p className='mt-4 rounded-lg bg-red-500/20 p-3 text-xs text-red-100'>
                {todayError}
              </p>
            )}

            <div className='mt-5 grid grid-cols-2 gap-3'>
              <div className='rounded-xl bg-white/15 p-3.5 backdrop-blur-sm'>
                <div className='flex items-center gap-2 text-gray-300'>
                  <LogIn size={15} />
                  <span className='text-xs'>Check In</span>
                </div>

                <p className='mt-2 text-lg font-semibold'>
                  {todayLoading ? '--:--' : formatTime(todayTimes.checkIn)}
                </p>
              </div>

              <div className='rounded-xl bg-white/15 p-3.5 backdrop-blur-sm'>
                <div className='flex items-center gap-2 text-gray-300'>
                  <LogOut size={15} />
                  <span className='text-xs'>Check Out</span>
                </div>

                <p className='mt-2 text-lg font-semibold'>
                  {todayLoading ? '--:--' : formatTime(todayTimes.checkOut)}
                </p>
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
        <div className='mb-5 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <div className='rounded-xl bg-gray-100 p-2.5'>
              <PieChart size={20} />
            </div>

            <div>
              <h2 className='font-semibold text-gray-900'>
                Attendance Distribution
              </h2>

              <p className='text-xs text-gray-500'>{formatMonth(monthKey)}</p>
            </div>
          </div>
        </div>

        {monthLoading ? (
          <div className='flex items-center gap-2 py-8 text-sm text-gray-500'>
            <LoaderCircle size={16} className='animate-spin' />
            Loading attendance...
          </div>
        ) : monthError ? (
          <p className='rounded-lg bg-red-50 p-3 text-sm text-red-700'>
            {monthError}
          </p>
        ) : (
          <div className='flex flex-col items-center gap-6 sm:flex-row sm:gap-8'>
            <div
              className='relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full'
              style={{ background: buildPieGradient(pieItems) }}
            >
              <div className='flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white'>
                <span className='text-2xl font-bold text-gray-900'>
                  {monthStats?.percentage || 0}%
                </span>

                <span className='text-[10px] text-gray-500'>Attendance</span>
              </div>
            </div>

            <div className='grid w-full flex-1 grid-cols-2 gap-2.5'>
              {pieItems.map(item => (
                <div
                  key={item.label}
                  className='rounded-xl border border-gray-100 bg-gray-50 p-3'
                >
                  <div className='flex items-center gap-2'>
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />

                    <span className='text-xs text-gray-500'>{item.label}</span>
                  </div>

                  <p className='mt-2 text-2xl font-semibold text-gray-900'>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default MyDashboard
