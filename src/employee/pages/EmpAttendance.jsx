import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CalendarDays,
  Clock3,
  LogIn,
  LogOut,
  CalendarCheck,
  CalendarOff,
  ChevronDown,
  Eye,
  PieChart,
  LoaderCircle,
  RefreshCw
} from 'lucide-react'

import { getMyAttendance } from '../../redux/features/attendance/attendanceThunk'
import Modal from '../../UI/Modal'
import AttendanceHistoryModal from '../employeeModal/AttendanceHistoryModal'

// ======================================================
// Date Helpers
// ======================================================

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

const getMonthKey = (year, monthIndex) => `${year}-${pad(monthIndex + 1)}`

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

const formatDate = value => {
  if (!value) return '--'

  const dateString =
    typeof value === 'string'
      ? value.slice(0, 10)
      : getDateString(new Date(value))

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(new Date(`${dateString}T12:00:00+05:30`))
}

const formatTime = value => {
  if (!value) return '--'

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(new Date(value))
}

const getMinutesOfDay = value => {
  if (!value) return null

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date(value))

  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))

  return Number(values.hour) * 60 + Number(values.minute)
}

const formatDuration = minutes => {
  const total = Math.max(0, Math.round(Number(minutes) || 0))

  return `${Math.floor(total / 60)}h ${total % 60}m`
}

// ======================================================
// Financial Year Helpers
// ======================================================

const getFinancialYears = (count = 6) => {
  const now = new Date()
  const year = now.getFullYear()
  const startYear = now.getMonth() >= 3 ? year : year - 1

  return Array.from({ length: count }, (_, index) => {
    const start = startYear - index

    return {
      key: `${start}-${start + 1}`,
      label: `${start}-${String(start + 1).slice(-2)}`,
      startYear: start,
      endYear: start + 1
    }
  })
}

const getFinancialYearMonths = financialYear =>
  Array.from({ length: 12 }, (_, offset) => {
    const date = new Date(financialYear.startYear, 3 + offset, 1)
    const key = getMonthKey(date.getFullYear(), date.getMonth())

    return {
      key,
      month: formatMonth(key)
    }
  })

// ======================================================
// Attendance Helpers
// ======================================================

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

const getStatus = record => {
  const status = String(record?.status || 'pending').toLowerCase()

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

const getMonthlySummary = records => {
  let present = 0
  let absent = 0
  let leave = 0
  let halfDays = 0
  let holidays = 0
  let weeklyOffDays = 0
  let totalWorkMinutes = 0
  let checkInTotal = 0
  let checkInCount = 0
  let checkOutTotal = 0
  let checkOutCount = 0

  records.forEach(record => {
    const status = String(record?.status || '').toLowerCase()

    if (status === 'present') present++
    if (status === 'absent') absent++
    if (status === 'leave') leave++
    if (status === 'half_day') halfDays++
    if (status === 'holiday') holidays++
    if (status === 'weekly_off') weeklyOffDays++

    totalWorkMinutes += getRecordMinutes(record)

    const times = getRecordTimes(record)
    const checkInMinutes = getMinutesOfDay(times.checkIn)
    const checkOutMinutes = getMinutesOfDay(times.checkOut)

    if (checkInMinutes !== null) {
      checkInTotal += checkInMinutes
      checkInCount++
    }

    if (checkOutMinutes !== null) {
      checkOutTotal += checkOutMinutes
      checkOutCount++
    }
  })

  const averageTime = (total, count) => {
    if (!count) return '--'

    const average = Math.round(total / count)
    const date = new Date(0)

    date.setUTCHours(Math.floor(average / 60), average % 60, 0, 0)

    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    }).format(date)
  }

  const countedDays = present + absent + leave + halfDays

  return {
    present,
    absent,
    leave,
    halfDays,
    holidays,
    weeklyOffDays,
    totalWorkMinutes,
    hours: formatDuration(totalWorkMinutes),
    checkIn: averageTime(checkInTotal, checkInCount),
    checkOut: averageTime(checkOutTotal, checkOutCount),
    percentage: countedDays
      ? Math.round(((present + halfDays * 0.5) / countedDays) * 100)
      : 0,
    totalRecords: records.length
  }
}

// ======================================================
// Reusable Components
// ======================================================

const SummaryItem = ({ icon: Icon, label, value }) => (
  <div className='rounded-xl border border-gray-100 bg-gray-50 p-3'>
    <div className='flex items-center gap-1.5 text-gray-500'>
      <Icon size={15} />
      <span className='text-xs'>{label}</span>
    </div>

    <p className='mt-2 break-words text-lg font-semibold text-gray-900'>
      {value}
    </p>
  </div>
)

const statusClasses = {
  Present: 'bg-emerald-50 text-emerald-700',
  'Half Day': 'bg-amber-50 text-amber-700',
  Absent: 'bg-red-50 text-red-700',
  'On Leave': 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
  Holiday: 'bg-purple-50 text-purple-700',
  'Weekly Off': 'bg-gray-100 text-gray-600'
}

// ======================================================
// Main Attendance Component
// ======================================================

const Attendance = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth?.user)

  const joiningDateValue =
    user?.joiningDate ||
    user?.dateOfJoining ||
    user?.dateOfJoiningCompany ||
    null

  const joiningDate = useMemo(() => {
    if (!joiningDateValue) return null

    const date = new Date(joiningDateValue)

    return Number.isNaN(date.getTime()) ? null : date
  }, [joiningDateValue])

  const joiningMonthKey = joiningDate
    ? getMonthKey(joiningDate.getFullYear(), joiningDate.getMonth())
    : null

  const financialYears = useMemo(() => getFinancialYears(6), [])

  const currentDate = new Date()
  const todayString = getDateString(currentDate)
  const todayMonthKey = todayString.slice(0, 7)

  const currentFYStartYear =
    currentDate.getMonth() >= 3
      ? currentDate.getFullYear()
      : currentDate.getFullYear() - 1

  const currentFinancialYearKey = `${currentFYStartYear}-${
    currentFYStartYear + 1
  }`

  const [selectedFinancialYear, setSelectedFinancialYear] = useState(
    currentFinancialYearKey
  )

  const [monthlyData, setMonthlyData] = useState({})
  const [monthlyLoading, setMonthlyLoading] = useState(false)
  const [monthlyError, setMonthlyError] = useState('')
  const [viewMonth, setViewMonth] = useState(null)

  const [todayData, setTodayData] = useState(null)
  const [todayLoading, setTodayLoading] = useState(false)
  const [todayError, setTodayError] = useState('')

  const selectedFY =
    financialYears.find(year => year.key === selectedFinancialYear) ||
    financialYears[0]

  const allFinancialYearMonths = useMemo(
    () => getFinancialYearMonths(selectedFY),
    [selectedFY]
  )

  const visibleFinancialYearMonths = useMemo(
    () =>
      allFinancialYearMonths.filter(month => {
        if (joiningMonthKey && month.key < joiningMonthKey) {
          return false
        }

        if (month.key > todayMonthKey) {
          return false
        }

        return true
      }),
    [allFinancialYearMonths, joiningMonthKey, todayMonthKey]
  )

  const selectedMonthKey = todayMonthKey
  const selectedMonthData = monthlyData[selectedMonthKey]

  const selectedMonthSummary =
    selectedMonthData?.summary || getMonthlySummary([])

  // ------------------------------------------------------
  // Fetch today's attendance
  // ------------------------------------------------------

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
              : 'Failed to load today attendance.'
          )
        }
      } finally {
        if (!cancelled) {
          setTodayLoading(false)
        }
      }
    }

    loadToday()

    return () => {
      cancelled = true
    }
  }, [dispatch, todayString])

  // ------------------------------------------------------
  // Fetch visible months
  // ------------------------------------------------------

  useEffect(() => {
    let cancelled = false

    const loadVisibleMonths = async () => {
      if (!visibleFinancialYearMonths.length) {
        setMonthlyLoading(false)
        setMonthlyError('')
        return
      }

      setMonthlyLoading(true)
      setMonthlyError('')

      const results = await Promise.all(
        visibleFinancialYearMonths.map(async month => {
          const { startDate, endDate } = getMonthRange(month.key)

          try {
            const response = await dispatch(
              getMyAttendance({
                startDate,
                endDate,
                page: 1,
                pageSize: 100
              })
            ).unwrap()

            const records = response?.attendance || []

            return {
              key: month.key,
              records,
              summary: getMonthlySummary(records),
              error: null
            }
          } catch (error) {
            return {
              key: month.key,
              records: [],
              summary: getMonthlySummary([]),
              error:
                typeof error === 'string'
                  ? error
                  : error?.message || 'Failed to load this month.'
            }
          }
        })
      )

      if (!cancelled) {
        setMonthlyData(previous => {
          const updated = { ...previous }

          results.forEach(result => {
            updated[result.key] = result
          })

          return updated
        })

        setMonthlyError(results.find(result => result.error)?.error || '')

        setMonthlyLoading(false)
      }
    }

    loadVisibleMonths()

    return () => {
      cancelled = true
    }
  }, [dispatch, visibleFinancialYearMonths])

  // ------------------------------------------------------
  // Refresh monthly history
  // ------------------------------------------------------

  const refreshMonthlyHistory = async () => {
    if (!visibleFinancialYearMonths.length) return

    setMonthlyLoading(true)
    setMonthlyError('')

    const results = await Promise.all(
      visibleFinancialYearMonths.map(async month => {
        const { startDate, endDate } = getMonthRange(month.key)

        try {
          const response = await dispatch(
            getMyAttendance({
              startDate,
              endDate,
              page: 1,
              pageSize: 100
            })
          ).unwrap()

          const records = response?.attendance || []

          return {
            key: month.key,
            records,
            summary: getMonthlySummary(records),
            error: null
          }
        } catch (error) {
          return {
            key: month.key,
            records: [],
            summary: getMonthlySummary([]),
            error:
              typeof error === 'string'
                ? error
                : error?.message || 'Failed to load this month.'
          }
        }
      })
    )

    setMonthlyData(previous => {
      const updated = { ...previous }

      results.forEach(result => {
        updated[result.key] = result
      })

      return updated
    })

    setMonthlyError(results.find(result => result.error)?.error || '')

    setMonthlyLoading(false)
  }

  // ------------------------------------------------------
  // Today's attendance details
  // ------------------------------------------------------

  const todayTimes = getRecordTimes(todayData)

  const isCurrentlyCheckedIn = [
    todayData?.firstHalf,
    todayData?.secondHalf
  ].some(half => half?.checkIn?.time && !half?.checkOut?.time)

  const todayStatus = todayData ? getStatus(todayData) : 'Pending'

  // ------------------------------------------------------
  // Financial year totals
  // ------------------------------------------------------

  const loadedMonths = visibleFinancialYearMonths.filter(
    month => monthlyData[month.key] && !monthlyData[month.key].error
  )

  const failedMonths = visibleFinancialYearMonths.filter(
    month => monthlyData[month.key]?.error
  )

  const financialYearTotals = loadedMonths.reduce(
    (total, month) => {
      const summary = monthlyData[month.key].summary

      total.present += summary.present
      total.absent += summary.absent
      total.leave += summary.leave
      total.halfDays += summary.halfDays
      total.totalWorkMinutes += summary.totalWorkMinutes

      return total
    },
    {
      present: 0,
      absent: 0,
      leave: 0,
      halfDays: 0,
      totalWorkMinutes: 0
    }
  )

  const totalAttendanceDays =
    financialYearTotals.present +
    financialYearTotals.absent +
    financialYearTotals.leave +
    financialYearTotals.halfDays

  const financialYearPercentage = totalAttendanceDays
    ? Math.round(
        ((financialYearTotals.present + financialYearTotals.halfDays * 0.5) /
          totalAttendanceDays) *
          100
      )
    : 0

  // ------------------------------------------------------
  // Render
  // ------------------------------------------------------

  return (
    <div className='min-h-screen p-2 sm:p-6 lg:p-1'>
      <div className='mx-auto space-y-6'>
        {/* Header */}
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              Attendance
            </h1>

            <p className='mt-1 text-sm text-gray-500'>
              Track your daily attendance and monthly performance.
            </p>
          </div>

          <div className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600'>
            <CalendarDays size={17} />
            {formatDate(todayString)}
          </div>
        </div>

        {/* Top section */}
        <div className='grid grid-cols-1 items-start gap-5 lg:grid-cols-5'>
          {/* Today's attendance */}
          <section className='overflow-hidden rounded-2xl border border-gray-200 bg-white lg:col-span-3'>
            <div className='h-1 bg-black' />

            <div className='p-4 sm:p-5'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <div className='flex items-center gap-2'>
                    <CalendarCheck size={19} />

                    <h2 className='font-semibold text-gray-900'>
                      Today's Attendance
                    </h2>
                  </div>

                  <p className='mt-1 text-xs text-gray-500'>
                    {formatDate(todayString)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    statusClasses[todayStatus] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {todayStatus}
                </span>
              </div>

              {todayLoading ? (
                <div className='flex items-center gap-2 py-8 text-sm text-gray-500'>
                  <LoaderCircle size={16} className='animate-spin' />
                  Loading today's attendance...
                </div>
              ) : todayError ? (
                <p className='mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
                  {todayError}
                </p>
              ) : (
                <>
                  <div className='mt-5 grid grid-cols-3 gap-2 sm:gap-3'>
                    <SummaryItem
                      icon={LogIn}
                      label='Check-in'
                      value={formatTime(todayTimes.checkIn)}
                    />

                    <SummaryItem
                      icon={LogOut}
                      label='Check-out'
                      value={
                        todayTimes.checkOut
                          ? formatTime(todayTimes.checkOut)
                          : 'Not yet'
                      }
                    />

                    <SummaryItem
                      icon={Clock3}
                      label='Work duration'
                      value={
                        isCurrentlyCheckedIn
                          ? 'In progress'
                          : formatDuration(getRecordMinutes(todayData))
                      }
                    />
                  </div>

                  <div className='mt-3 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3'>
                    <CalendarCheck
                      size={17}
                      className='shrink-0 text-gray-500'
                    />

                    <span className='text-xs text-gray-500'>
                      Attendance record
                    </span>

                    <span className='ml-auto text-right text-sm font-semibold text-gray-900'>
                      {todayData ? 'Recorded' : 'No record yet'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Monthly overview */}
          <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 lg:col-span-2'>
            <div className='flex items-center justify-between gap-2'>
              <div>
                <h2 className='font-semibold text-gray-900'>
                  Monthly Overview
                </h2>

                <p className='mt-1 text-xs text-gray-500'>
                  Current month attendance
                </p>
              </div>

              <span className='rounded-lg bg-gray-100 px-2.5 py-2 text-xs font-medium text-gray-700'>
                {formatMonth(selectedMonthKey)}
              </span>
            </div>

            {selectedMonthData?.error && (
              <p className='mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700'>
                {selectedMonthData.error}
              </p>
            )}

            <div className='mt-4 grid grid-cols-2 gap-2.5'>
              <SummaryItem
                icon={LogIn}
                label='Avg. Check-in'
                value={selectedMonthSummary.checkIn}
              />

              <SummaryItem
                icon={LogOut}
                label='Avg. Check-out'
                value={selectedMonthSummary.checkOut}
              />

              <SummaryItem
                icon={Clock3}
                label='Total Work Hours'
                value={selectedMonthSummary.hours}
              />

              <SummaryItem
                icon={CalendarOff}
                label='Leave Taken'
                value={`${selectedMonthSummary.leave} days`}
              />
            </div>

            <div className='mt-4 rounded-xl border border-gray-100 p-4'>
              <div className='flex items-center gap-2'>
                <PieChart size={17} className='text-gray-600' />

                <h3 className='text-sm font-semibold text-gray-900'>
                  Attendance Distribution
                </h3>
              </div>

              <div className='mt-4 flex items-center gap-4'>
                <div
                  className='relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full'
                  style={{
                    background: `conic-gradient(
                      #16a34a 0% ${selectedMonthSummary.percentage}%,
                      #ef4444 ${selectedMonthSummary.percentage}% 100%
                    )`
                  }}
                >
                  <div className='flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white'>
                    <span className='text-xl font-bold text-gray-900'>
                      {selectedMonthSummary.percentage}%
                    </span>

                    <span className='text-[10px] text-gray-500'>
                      Attendance
                    </span>
                  </div>
                </div>

                <div className='min-w-0 flex-1 space-y-3'>
                  {[
                    {
                      label: 'Present',
                      value: selectedMonthSummary.present,
                      color: 'bg-emerald-600'
                    },
                    {
                      label: 'Absent',
                      value: selectedMonthSummary.absent,
                      color: 'bg-red-500'
                    },
                    {
                      label: 'On Leave',
                      value: selectedMonthSummary.leave,
                      color: 'bg-blue-500'
                    },
                    {
                      label: 'Half Day',
                      value: selectedMonthSummary.halfDays,
                      color: 'bg-amber-500'
                    }
                  ].map(item => (
                    <div
                      key={item.label}
                      className='flex items-center justify-between gap-2'
                    >
                      <div className='flex items-center gap-2'>
                        <span
                          className={`h-2 w-2 rounded-full ${item.color}`}
                        />

                        <span className='text-xs text-gray-600'>
                          {item.label}
                        </span>
                      </div>

                      <span className='text-xs font-semibold text-gray-900'>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Attendance History */}
        <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='font-semibold text-gray-900'>
                Attendance History
              </h2>

              <p className='mt-1 text-sm text-gray-500'>
                History starts from your joining month and ends at the current
                month.
              </p>

              {joiningDate && (
                <p className='mt-1 text-xs text-gray-500'>
                  Joined on {formatDate(getDateString(joiningDate))}
                </p>
              )}
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <label
                htmlFor='financial-year'
                className='text-sm font-medium text-gray-600'
              >
                Financial Year
              </label>

              <div className='relative'>
                <select
                  id='financial-year'
                  value={selectedFinancialYear}
                  onChange={event =>
                    setSelectedFinancialYear(event.target.value)
                  }
                  className='appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-gray-700 outline-none focus:border-black'
                >
                  {financialYears.map(year => (
                    <option key={year.key} value={year.key}>
                      {year.label}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                />
              </div>

              <button
                type='button'
                onClick={refreshMonthlyHistory}
                disabled={
                  monthlyLoading || visibleFinancialYearMonths.length === 0
                }
                className='flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50'
              >
                <RefreshCw
                  size={15}
                  className={monthlyLoading ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>
          </div>

          {!joiningDate && (
            <div className='mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800'>
              Joining date was not found in your profile. Please ensure your
              employee profile includes a valid joining date.
            </div>
          )}

          {monthlyError && (
            <div className='mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
              <span>{monthlyError}</span>

              <button
                type='button'
                onClick={refreshMonthlyHistory}
                className='font-semibold underline'
              >
                Retry
              </button>
            </div>
          )}

          <div className='mt-5 overflow-x-auto rounded-xl border border-gray-200'>
            <table className='w-full min-w-[950px] text-left text-sm'>
              <thead className='bg-gray-50 text-xs uppercase tracking-wide text-gray-500'>
                <tr>
                  <th className='px-4 py-3 font-medium'>Month</th>
                  <th className='px-4 py-3 font-medium'>Present</th>
                  <th className='px-4 py-3 font-medium'>Absent</th>
                  <th className='px-4 py-3 font-medium'>Leave</th>
                  <th className='px-4 py-3 font-medium'>Half Day</th>
                  <th className='px-4 py-3 font-medium'>Avg. Check-in</th>
                  <th className='px-4 py-3 font-medium'>Avg. Check-out</th>
                  <th className='px-4 py-3 font-medium'>Work Hours</th>
                  <th className='px-4 py-3 text-right font-medium'>Action</th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-100'>
                {visibleFinancialYearMonths.map(month => {
                  const data = monthlyData[month.key]
                  const stats = data?.summary || getMonthlySummary([])
                  const isLoading = monthlyLoading && !data

                  return (
                    <tr key={month.key} className='transition hover:bg-gray-50'>
                      <td className='whitespace-nowrap px-4 py-4 font-medium text-gray-900'>
                        {month.month}
                      </td>

                      <td className='px-4 py-4 font-medium text-emerald-700'>
                        {data && !data.error ? stats.present : '--'}
                      </td>

                      <td className='px-4 py-4 font-medium text-red-600'>
                        {data && !data.error ? stats.absent : '--'}
                      </td>

                      <td className='px-4 py-4 text-gray-700'>
                        {data && !data.error ? stats.leave : '--'}
                      </td>

                      <td className='px-4 py-4 text-gray-700'>
                        {data && !data.error ? stats.halfDays : '--'}
                      </td>

                      <td className='whitespace-nowrap px-4 py-4 text-gray-700'>
                        {data && !data.error ? stats.checkIn : '--'}
                      </td>

                      <td className='whitespace-nowrap px-4 py-4 text-gray-700'>
                        {data && !data.error ? stats.checkOut : '--'}
                      </td>

                      <td className='whitespace-nowrap px-4 py-4 text-gray-700'>
                        {data && !data.error ? stats.hours : '--'}
                      </td>

                      <td className='px-4 py-4 text-right'>
                        {isLoading ? (
                          <LoaderCircle
                            size={16}
                            className='ml-auto animate-spin text-gray-400'
                          />
                        ) : data?.error ? (
                          <button
                            type='button'
                            onClick={refreshMonthlyHistory}
                            className='text-xs font-medium text-red-600 hover:underline'
                          >
                            Retry
                          </button>
                        ) : (
                          <button
                            type='button'
                            disabled={!data}
                            onClick={() => setViewMonth(month)}
                            className='inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-white disabled:opacity-40'
                          >
                            <Eye size={14} />
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {!visibleFinancialYearMonths.length && (
                  <tr>
                    <td
                      colSpan={9}
                      className='px-4 py-10 text-center text-sm text-gray-500'
                    >
                      No attendance months are available for this financial year
                      based on your joining date.
                    </td>
                  </tr>
                )}

                {visibleFinancialYearMonths.length > 0 &&
                  !monthlyLoading &&
                  loadedMonths.length === 0 &&
                  !failedMonths.length && (
                    <tr>
                      <td
                        colSpan={9}
                        className='px-4 py-10 text-center text-sm text-gray-500'
                      >
                        No attendance records found.
                      </td>
                    </tr>
                  )}
              </tbody>

              {visibleFinancialYearMonths.length > 0 && (
                <tfoot className='border-t border-gray-200 bg-gray-50'>
                  <tr>
                    <td className='whitespace-nowrap px-4 py-3 font-semibold text-gray-900'>
                      Total
                    </td>

                    <td className='px-4 py-3 font-semibold text-emerald-700'>
                      {financialYearTotals.present}
                    </td>

                    <td className='px-4 py-3 font-semibold text-red-600'>
                      {financialYearTotals.absent}
                    </td>

                    <td className='px-4 py-3 font-semibold text-gray-900'>
                      {financialYearTotals.leave}
                    </td>

                    <td className='px-4 py-3 font-semibold text-gray-900'>
                      {financialYearTotals.halfDays}
                    </td>

                    <td colSpan={3} className='px-4 py-3 text-xs text-gray-500'>
                      {loadedMonths.length}/{visibleFinancialYearMonths.length}{' '}
                      months loaded
                      {failedMonths.length
                        ? ` · ${failedMonths.length} failed`
                        : ''}
                      {' · '}
                      {formatDuration(financialYearTotals.totalWorkMinutes)}
                    </td>

                    <td className='px-4 py-3 text-right font-semibold text-gray-900'>
                      {financialYearPercentage}%
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className='mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500'>
            <span className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-emerald-600' />
              Present
            </span>

            <span className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-red-500' />
              Absent
            </span>

            <span className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-blue-500' />
              Leave
            </span>

            <span className='ml-auto'>Financial year: April – March</span>
          </div>
        </section>
      </div>

      {/* Attendance History Modal */}
      <Modal
        isOpen={Boolean(viewMonth)}
        onClose={() => setViewMonth(null)}
        title={`${viewMonth?.month || 'Attendance'} History`}
        size='xl'
      >
        {viewMonth && (
          <AttendanceHistoryModal
            month={viewMonth.month}
            records={monthlyData[viewMonth.key]?.records || []}
            summary={monthlyData[viewMonth.key]?.summary}
            error={monthlyData[viewMonth.key]?.error}
          />
        )}
      </Modal>
    </div>
  )
}

export default Attendance
