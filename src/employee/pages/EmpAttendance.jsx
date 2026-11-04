// import { useCallback, useEffect, useMemo, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   CalendarDays,
//   Clock3,
//   LogIn,
//   LogOut,
//   CalendarCheck,
//   ChevronLeft,
//   ChevronRight,
//   LoaderCircle,
//   RefreshCw
// } from 'lucide-react'

// import { getMyAttendance } from '../../redux/features/attendance/attendanceThunk'
// import Modal from '../../UI/Modal'

// // ======================================================
// // Date Helpers
// // ======================================================

// const pad = value => String(value).padStart(2, '0')

// const getDateString = date => {
//   const parts = new Intl.DateTimeFormat('en-CA', {
//     timeZone: 'Asia/Kolkata',
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit'
//   }).formatToParts(date)

//   const values = Object.fromEntries(parts.map(part => [part.type, part.value]))

//   return `${values.year}-${values.month}-${values.day}`
// }

// const getMonthKey = (year, monthIndex) => `${year}-${pad(monthIndex + 1)}`

// const shiftMonth = (monthKey, delta) => {
//   const [year, month] = monthKey.split('-').map(Number)
//   const date = new Date(year, month - 1 + delta, 1)

//   return getMonthKey(date.getFullYear(), date.getMonth())
// }

// const getMonthRange = monthKey => {
//   const [year, month] = monthKey.split('-').map(Number)

//   return {
//     startDate: `${year}-${pad(month)}-01`,
//     endDate: `${year}-${pad(month)}-${pad(new Date(year, month, 0).getDate())}`
//   }
// }

// const formatMonth = monthKey =>
//   new Intl.DateTimeFormat('en-IN', {
//     month: 'long',
//     year: 'numeric',
//     timeZone: 'Asia/Kolkata'
//   }).format(new Date(`${monthKey}-01T12:00:00+05:30`))

// const formatDate = value => {
//   if (!value) return '--'

//   const dateString =
//     typeof value === 'string'
//       ? value.slice(0, 10)
//       : getDateString(new Date(value))

//   return new Intl.DateTimeFormat('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     timeZone: 'Asia/Kolkata'
//   }).format(new Date(`${dateString}T12:00:00+05:30`))
// }

// const formatFullDate = dateString =>
//   new Intl.DateTimeFormat('en-IN', {
//     weekday: 'long',
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//     timeZone: 'Asia/Kolkata'
//   }).format(new Date(`${dateString}T12:00:00+05:30`))

// const formatTime = value => {
//   if (!value) return '--'

//   return new Intl.DateTimeFormat('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//     timeZone: 'Asia/Kolkata'
//   }).format(new Date(value))
// }

// const getMinutesOfDay = value => {
//   if (!value) return null

//   const parts = new Intl.DateTimeFormat('en-GB', {
//     timeZone: 'Asia/Kolkata',
//     hour: '2-digit',
//     minute: '2-digit',
//     hourCycle: 'h23'
//   }).formatToParts(new Date(value))

//   const values = Object.fromEntries(parts.map(part => [part.type, part.value]))

//   return Number(values.hour) * 60 + Number(values.minute)
// }

// const formatDuration = minutes => {
//   const total = Math.max(0, Math.round(Number(minutes) || 0))

//   return `${Math.floor(total / 60)}h ${total % 60}m`
// }

// // ======================================================
// // Attendance Helpers
// // ======================================================

// const getRecordTimes = record => {
//   const halves = [record?.firstHalf, record?.secondHalf]

//   const checkIns = halves
//     .map(half => half?.checkIn?.time)
//     .filter(Boolean)
//     .sort((a, b) => new Date(a) - new Date(b))

//   const checkOuts = halves
//     .map(half => half?.checkOut?.time)
//     .filter(Boolean)
//     .sort((a, b) => new Date(a) - new Date(b))

//   return {
//     checkIn: checkIns[0] || null,
//     checkOut: checkOuts.at(-1) || null
//   }
// }

// const getRecordMinutes = record =>
//   Math.max(
//     0,
//     Number(record?.totalWorkDuration || 0) ||
//       Number(record?.creditedDuration || 0)
//   )

// const isCheckedInNow = record =>
//   [record?.firstHalf, record?.secondHalf].some(
//     half => half?.checkIn?.time && !half?.checkOut?.time
//   )

// const getStatus = record => {
//   const status = String(record?.status || 'pending').toLowerCase()

//   const labels = {
//     present: 'Present',
//     absent: 'Absent',
//     leave: 'On Leave',
//     half_day: 'Half Day',
//     holiday: 'Holiday',
//     weekly_off: 'Weekly Off',
//     pending: 'Pending'
//   }

//   return labels[status] || status.replaceAll('_', ' ')
// }

// const getMonthlySummary = records => {
//   let present = 0
//   let absent = 0
//   let leave = 0
//   let halfDays = 0
//   let holidays = 0
//   let weeklyOffDays = 0
//   let totalWorkMinutes = 0
//   let checkInTotal = 0
//   let checkInCount = 0
//   let checkOutTotal = 0
//   let checkOutCount = 0

//   records.forEach(record => {
//     const status = String(record?.status || '').toLowerCase()

//     if (status === 'present') present++
//     if (status === 'absent') absent++
//     if (status === 'leave') leave++
//     if (status === 'half_day') halfDays++
//     if (status === 'holiday') holidays++
//     if (status === 'weekly_off') weeklyOffDays++

//     totalWorkMinutes += getRecordMinutes(record)

//     const times = getRecordTimes(record)
//     const checkInMinutes = getMinutesOfDay(times.checkIn)
//     const checkOutMinutes = getMinutesOfDay(times.checkOut)

//     if (checkInMinutes !== null) {
//       checkInTotal += checkInMinutes
//       checkInCount++
//     }

//     if (checkOutMinutes !== null) {
//       checkOutTotal += checkOutMinutes
//       checkOutCount++
//     }
//   })

//   const averageTime = (total, count) => {
//     if (!count) return '--'

//     const average = Math.round(total / count)
//     const date = new Date(0)

//     date.setUTCHours(Math.floor(average / 60), average % 60, 0, 0)

//     return new Intl.DateTimeFormat('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//       timeZone: 'UTC'
//     }).format(date)
//   }

//   const countedDays = present + absent + leave + halfDays

//   return {
//     present,
//     absent,
//     leave,
//     halfDays,
//     holidays,
//     weeklyOffDays,
//     totalWorkMinutes,
//     hours: formatDuration(totalWorkMinutes),
//     checkIn: averageTime(checkInTotal, checkInCount),
//     checkOut: averageTime(checkOutTotal, checkOutCount),
//     percentage: countedDays
//       ? Math.round(((present + halfDays * 0.5) / countedDays) * 100)
//       : 0,
//     totalRecords: records.length
//   }
// }

// // ======================================================
// // Calendar Helpers
// // ======================================================

// const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// const SUNDAY_LABEL = 'Sunday Off'

// // Calendar cell colours, keyed by day label
// const cellClasses = {
//   [SUNDAY_LABEL]: 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100',
//   Present:
//     'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
//   Absent: 'border-red-500 bg-red-500 text-white hover:bg-red-600',
//   'On Leave': 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
//   'Half Day': 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
//   Holiday: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
//   'Weekly Off': 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200',
//   Pending: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
//   'No Record': 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
// }

// const statusClasses = {
//   [SUNDAY_LABEL]: 'bg-red-50 text-red-600',
//   Present: 'bg-emerald-50 text-emerald-700',
//   'Half Day': 'bg-amber-50 text-amber-700',
//   Absent: 'bg-red-50 text-red-700',
//   'On Leave': 'bg-blue-50 text-blue-700',
//   Pending: 'bg-amber-50 text-amber-700',
//   Holiday: 'bg-purple-50 text-purple-700',
//   'Weekly Off': 'bg-gray-100 text-gray-600',
//   'No Record': 'bg-gray-100 text-gray-600'
// }

// const legendItems = [
//   { label: 'Present', dot: 'bg-emerald-600' },
//   { label: 'Absent', dot: 'bg-red-500' },
//   { label: 'On Leave', dot: 'bg-blue-500' },
//   { label: 'Half Day', dot: 'bg-amber-500' },
//   { label: 'Holiday', dot: 'bg-purple-500' },
//   { label: SUNDAY_LABEL, dot: 'bg-red-300' }
// ]

// // ======================================================
// // Reusable Components
// // ======================================================

// const SummaryItem = ({ icon: Icon, label, value, className = '' }) => (
//   <div
//     className={`min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-3 ${className}`}
//   >
//     <div className='flex items-center gap-1.5 text-gray-500'>
//       <Icon size={15} className='shrink-0' />
//       <span className='whitespace-nowrap text-xs'>{label}</span>
//     </div>

//     <p className='mt-2 whitespace-nowrap text-base font-semibold text-gray-900 sm:text-lg'>
//       {value}
//     </p>
//   </div>
// )

// const DetailRow = ({ icon: Icon, label, children }) => (
//   <div className='flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3'>
//     <Icon size={17} className='shrink-0 text-gray-500' />
//     <span className='text-sm text-gray-500'>{label}</span>
//     <span className='ml-auto text-right text-sm font-semibold text-gray-900'>
//       {children}
//     </span>
//   </div>
// )

// // Content shown inside the modal when a calendar date is clicked
// const DayDetails = ({ day }) => {
//   const { dateString, record, label } = day
//   const times = getRecordTimes(record)

//   const duration = !record
//     ? '--'
//     : isCheckedInNow(record)
//     ? 'In progress'
//     : formatDuration(getRecordMinutes(record))

//   return (
//     <div className='space-y-3'>
//       <p className='text-sm text-gray-500'>{formatFullDate(dateString)}</p>

//       <DetailRow icon={LogIn} label='Check-in'>
//         {formatTime(times.checkIn)}
//       </DetailRow>

//       <DetailRow icon={LogOut} label='Check-out'>
//         {times.checkOut ? formatTime(times.checkOut) : '--'}
//       </DetailRow>

//       <DetailRow icon={Clock3} label='Work Duration'>
//         {duration}
//       </DetailRow>

//       <DetailRow icon={CalendarCheck} label='Status'>
//         <span
//           className={`rounded-full px-3 py-1 text-xs font-medium ${
//             statusClasses[label] || 'bg-gray-100 text-gray-600'
//           }`}
//         >
//           {label}
//         </span>
//       </DetailRow>
//     </div>
//   )
// }

// // ======================================================
// // Main Attendance Component
// // ======================================================

// const Attendance = () => {
//   const dispatch = useDispatch()

//   const user = useSelector(state => state.auth?.user)

//   const joiningDateValue =
//     user?.joiningDate ||
//     user?.dateOfJoining ||
//     user?.dateOfJoiningCompany ||
//     null

//   const joiningDate = useMemo(() => {
//     if (!joiningDateValue) return null

//     const date = new Date(joiningDateValue)

//     return Number.isNaN(date.getTime()) ? null : date
//   }, [joiningDateValue])

//   const joiningString = joiningDate ? getDateString(joiningDate) : null
//   const joiningMonthKey = joiningString ? joiningString.slice(0, 7) : null

//   const todayString = getDateString(new Date())
//   const todayMonthKey = todayString.slice(0, 7)

//   const [calendarMonth, setCalendarMonth] = useState(todayMonthKey)
//   const [monthlyData, setMonthlyData] = useState({})
//   const [monthlyLoading, setMonthlyLoading] = useState(false)
//   const [selectedDay, setSelectedDay] = useState(null)

//   const [todayData, setTodayData] = useState(null)
//   const [todayLoading, setTodayLoading] = useState(false)
//   const [todayError, setTodayError] = useState('')

//   const calendarData = monthlyData[calendarMonth]
//   const calendarSummary = calendarData?.summary || getMonthlySummary([])

//   const canGoPrev = !joiningMonthKey || calendarMonth > joiningMonthKey
//   const canGoNext = calendarMonth < todayMonthKey

//   // ------------------------------------------------------
//   // Fetch today's attendance
//   // ------------------------------------------------------

//   useEffect(() => {
//     let cancelled = false

//     const loadToday = async () => {
//       setTodayLoading(true)
//       setTodayError('')

//       try {
//         const response = await dispatch(
//           getMyAttendance({
//             startDate: todayString,
//             endDate: todayString,
//             page: 1,
//             pageSize: 10
//           })
//         ).unwrap()

//         if (!cancelled) {
//           const records = response?.attendance || []

//           setTodayData(
//             records.find(record => record.date?.slice(0, 10) === todayString) ||
//               null
//           )
//         }
//       } catch (error) {
//         if (!cancelled) {
//           setTodayError(
//             typeof error === 'string'
//               ? error
//               : 'Failed to load today attendance.'
//           )
//         }
//       } finally {
//         if (!cancelled) {
//           setTodayLoading(false)
//         }
//       }
//     }

//     loadToday()

//     return () => {
//       cancelled = true
//     }
//   }, [dispatch, todayString])

//   // ------------------------------------------------------
//   // Fetch a single month
//   // ------------------------------------------------------

//   const fetchMonth = useCallback(
//     async monthKey => {
//       const { startDate, endDate } = getMonthRange(monthKey)

//       try {
//         const response = await dispatch(
//           getMyAttendance({
//             startDate,
//             endDate,
//             page: 1,
//             pageSize: 100
//           })
//         ).unwrap()

//         const records = response?.attendance || []

//         return {
//           key: monthKey,
//           records,
//           summary: getMonthlySummary(records),
//           error: null
//         }
//       } catch (error) {
//         return {
//           key: monthKey,
//           records: [],
//           summary: getMonthlySummary([]),
//           error:
//             typeof error === 'string'
//               ? error
//               : error?.message || 'Failed to load this month.'
//         }
//       }
//     },
//     [dispatch]
//   )

//   const loadMonths = useCallback(
//     async monthKeys => {
//       setMonthlyLoading(true)

//       const results = await Promise.all(monthKeys.map(fetchMonth))

//       setMonthlyData(previous => {
//         const updated = { ...previous }

//         results.forEach(result => {
//           updated[result.key] = result
//         })

//         return updated
//       })

//       setMonthlyLoading(false)
//     },
//     [fetchMonth]
//   )

//   // Load the month shown in the calendar whenever it changes.
//   useEffect(() => {
//     let cancelled = false

//     const run = async () => {
//       setMonthlyLoading(true)

//       const result = await fetchMonth(calendarMonth)

//       if (cancelled) return

//       setMonthlyData(previous => ({ ...previous, [result.key]: result }))
//       setMonthlyLoading(false)
//     }

//     run()

//     return () => {
//       cancelled = true
//     }
//   }, [calendarMonth, fetchMonth])

//   const refreshCalendar = () => loadMonths([calendarMonth])

//   // ------------------------------------------------------
//   // Calendar cells
//   // ------------------------------------------------------

//   const calendarCells = useMemo(() => {
//     const [year, month] = calendarMonth.split('-').map(Number)
//     const daysInMonth = new Date(year, month, 0).getDate()
//     const firstWeekDay = new Date(year, month - 1, 1).getDay()

//     const recordsByDate = {}

//     ;(calendarData?.records || []).forEach(record => {
//       const key = record?.date?.slice(0, 10)
//       if (key) recordsByDate[key] = record
//     })

//     const cells = Array.from({ length: firstWeekDay }, () => null)

//     for (let day = 1; day <= daysInMonth; day++) {
//       const dateString = `${year}-${pad(month)}-${pad(day)}`
//       const weekDay = new Date(year, month - 1, day).getDay()
//       const record = recordsByDate[dateString] || null
//       const isSunday = weekDay === 0
//       const isFuture = dateString > todayString
//       const isBeforeJoining = Boolean(
//         joiningString && dateString < joiningString
//       )

//       let label

//       if (isSunday && !getRecordTimes(record).checkIn) {
//         label = SUNDAY_LABEL
//       } else if (record) {
//         label = getStatus(record)
//       } else {
//         label = 'No Record'
//       }

//       cells.push({
//         day,
//         dateString,
//         record,
//         label,
//         isSunday,
//         isToday: dateString === todayString,
//         // Sundays always stay red (even in the future), other future days
//         // and days before joining are disabled.
//         disabled: isBeforeJoining || (isFuture && !isSunday),
//         isBeforeJoining
//       })
//     }

//     return cells
//   }, [calendarMonth, calendarData, todayString, joiningString])

//   // ------------------------------------------------------
//   // Today's attendance details
//   // ------------------------------------------------------

//   const todayTimes = getRecordTimes(todayData)
//   const isCurrentlyCheckedIn = isCheckedInNow(todayData)
//   const todayStatus = todayData ? getStatus(todayData) : 'Pending'

//   // ------------------------------------------------------
//   // Render
//   // ------------------------------------------------------

//   return (
//     <div className='min-h-screen py-2 sm:py-4'>
//       <div className='mx-auto space-y-6'>
//         {/* Header */}
//         <div className='flex flex-wrap items-center justify-between gap-3'>
//           <div>
//             <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
//               Attendance
//             </h1>

//             <p className='mt-1 text-sm text-gray-500'>
//               Track your daily attendance and monthly performance.
//             </p>
//           </div>

//           <div className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600'>
//             <CalendarDays size={17} />
//             {formatDate(todayString)}
//           </div>
//         </div>

//         {/* Top section */}
//         <div className='grid grid-cols-1 gap-5'>
//           {/* Today's attendance */}
//           <section className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
//             <div className='h-1 bg-black' />

//             <div className='p-4 sm:p-5'>
//               <div className='flex flex-wrap items-center justify-between gap-3'>
//                 <div>
//                   <div className='flex items-center gap-2'>
//                     <CalendarCheck size={19} />

//                     <h2 className='font-semibold text-gray-900'>
//                       Today's Attendance
//                     </h2>
//                   </div>

//                   <p className='mt-1 text-xs text-gray-500'>
//                     {formatDate(todayString)}
//                   </p>
//                 </div>

//                 <span
//                   className={`rounded-full px-3 py-1.5 text-xs font-medium ${
//                     statusClasses[todayStatus] || 'bg-gray-100 text-gray-600'
//                   }`}
//                 >
//                   {todayStatus}
//                 </span>
//               </div>

//               {todayLoading ? (
//                 <div className='flex items-center gap-2 py-8 text-sm text-gray-500'>
//                   <LoaderCircle size={16} className='animate-spin' />
//                   Loading today's attendance...
//                 </div>
//               ) : todayError ? (
//                 <p className='mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
//                   {todayError}
//                 </p>
//               ) : (
//                 <>
//                   <div className='mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3'>
//                     <SummaryItem
//                       icon={LogIn}
//                       label='Check-in'
//                       value={formatTime(todayTimes.checkIn)}
//                     />

//                     <SummaryItem
//                       icon={LogOut}
//                       label='Check-out'
//                       value={
//                         todayTimes.checkOut
//                           ? formatTime(todayTimes.checkOut)
//                           : 'Not yet'
//                       }
//                     />

//                     <SummaryItem
//                       icon={Clock3}
//                       label='Work duration'
//                       className='col-span-2 sm:col-span-1'
//                       value={
//                         isCurrentlyCheckedIn
//                           ? 'In progress'
//                           : formatDuration(getRecordMinutes(todayData))
//                       }
//                     />
//                   </div>

//                   <div className='mt-3 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3'>
//                     <CalendarCheck
//                       size={17}
//                       className='shrink-0 text-gray-500'
//                     />

//                     <span className='text-xs text-gray-500'>
//                       Attendance record
//                     </span>

//                     <span className='ml-auto text-right text-sm font-semibold text-gray-900'>
//                       {todayData ? 'Recorded' : 'No record yet'}
//                     </span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </section>
//         </div>

//         {/* Attendance History - Calendar */}
//         <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-6'>
//           <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
//             <div>
//               <h2 className='font-semibold text-gray-900'>
//                 Attendance History
//               </h2>

//               <p className='mt-1 text-sm text-gray-500'>
//                 Click on any date to see check-in, check-out and work duration.
//               </p>

//               {joiningDate && (
//                 <p className='mt-1 text-xs text-gray-500'>
//                   Joined on {formatDate(joiningString)}
//                 </p>
//               )}
//             </div>

//             <div className='flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap'>
//               <div className='flex min-w-0 flex-1 items-center justify-between gap-2 sm:flex-none sm:justify-start'>
//                 <button
//                   type='button'
//                   onClick={() =>
//                     setCalendarMonth(shiftMonth(calendarMonth, -1))
//                   }
//                   disabled={!canGoPrev}
//                   aria-label='Previous month'
//                   className='shrink-0 rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 disabled:opacity-40'
//                 >
//                   <ChevronLeft size={16} />
//                 </button>

//                 <span className='min-w-0 flex-1 text-center text-sm font-semibold text-gray-900 sm:min-w-[140px] sm:flex-none'>
//                   {formatMonth(calendarMonth)}
//                 </span>

//                 <button
//                   type='button'
//                   onClick={() => setCalendarMonth(shiftMonth(calendarMonth, 1))}
//                   disabled={!canGoNext}
//                   aria-label='Next month'
//                   className='shrink-0 rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 disabled:opacity-40'
//                 >
//                   <ChevronRight size={16} />
//                 </button>
//               </div>

//               <button
//                 type='button'
//                 onClick={refreshCalendar}
//                 disabled={monthlyLoading}
//                 aria-label='Refresh'
//                 className='flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:ml-1'
//               >
//                 <RefreshCw
//                   size={15}
//                   className={monthlyLoading ? 'animate-spin' : ''}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {!joiningDate && (
//             <div className='mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800'>
//               Joining date was not found in your profile. Please ensure your
//               employee profile includes a valid joining date.
//             </div>
//           )}

//           {calendarData?.error && (
//             <div className='mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
//               <span>{calendarData.error}</span>

//               <button
//                 type='button'
//                 onClick={refreshCalendar}
//                 className='font-semibold underline'
//               >
//                 Retry
//               </button>
//             </div>
//           )}

//           {/* Month totals */}
//           <div className='mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5'>
//             {[
//               { label: 'Present', value: calendarSummary.present },
//               { label: 'Absent', value: calendarSummary.absent },
//               { label: 'Leave', value: calendarSummary.leave },
//               { label: 'Half Day', value: calendarSummary.halfDays },
//               { label: 'Work Hours', value: calendarSummary.hours }
//             ].map(item => (
//               <div
//                 key={item.label}
//                 className='col-span-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 last:col-span-2 sm:last:col-span-1'
//               >
//                 <p className='text-xs text-gray-500'>{item.label}</p>
//                 <p className='mt-1 text-base font-semibold text-gray-900'>
//                   {calendarData && !calendarData.error ? item.value : '--'}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Calendar */}
//           <div className='relative mt-5'>
//             {monthlyLoading && !calendarData && (
//               <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70'>
//                 <LoaderCircle
//                   size={22}
//                   className='animate-spin text-gray-500'
//                 />
//               </div>
//             )}

//             <div className='grid grid-cols-7 gap-1.5 sm:gap-2'>
//               {WEEK_DAYS.map((name, index) => (
//                 <div
//                   key={name}
//                   className={`py-2 text-center text-xs font-medium ${
//                     index === 0 ? 'text-red-600' : 'text-gray-500'
//                   }`}
//                 >
//                   {name}
//                 </div>
//               ))}

//               {calendarCells.map((cell, index) =>
//                 cell === null ? (
//                   <div key={`empty-${index}`} />
//                 ) : (
//                   <button
//                     key={cell.dateString}
//                     type='button'
//                     disabled={cell.disabled}
//                     onClick={() => setSelectedDay(cell)}
//                     title={cell.disabled ? '' : cell.label}
//                     className={`flex min-h-[52px] w-full min-w-0 flex-col items-center justify-center rounded-xl border p-1 text-center transition sm:min-h-[76px] sm:items-start sm:justify-between sm:p-2 sm:text-left ${
//                       cell.disabled
//                         ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
//                         : cellClasses[cell.label] || cellClasses['No Record']
//                     } ${cell.isToday ? 'ring-2 ring-black ring-offset-1' : ''}`}
//                   >
//                     <span className='text-sm font-semibold'>{cell.day}</span>

//                     {!cell.disabled && (
//                       <span className='hidden text-[10px] font-medium leading-tight sm:block'>
//                         {cell.label === 'No Record' ? '' : cell.label}
//                       </span>
//                     )}
//                   </button>
//                 )
//               )}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500'>
//             {legendItems.map(item => (
//               <span key={item.label} className='flex items-center gap-1.5'>
//                 <span className={`h-2 w-2 rounded-full ${item.dot}`} />
//                 {item.label}
//               </span>
//             ))}
//           </div>
//         </section>
//       </div>

//       {/* Day details modal */}
//       <Modal
//         isOpen={Boolean(selectedDay)}
//         onClose={() => setSelectedDay(null)}
//         title='Attendance Details'
//         size='md'
//       >
//         {selectedDay && <DayDetails day={selectedDay} />}
//       </Modal>
//     </div>
//   )
// }

// export default Attendance


import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CalendarDays,
  Clock3,
  LogIn,
  LogOut,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
  Send
} from 'lucide-react'

import { getMyAttendance } from '../../redux/features/attendance/attendanceThunk'
import Modal from '../../UI/Modal'

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

const shiftMonth = (monthKey, delta) => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)

  return getMonthKey(date.getFullYear(), date.getMonth())
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

const formatFullDate = dateString =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(new Date(`${dateString}T12:00:00+05:30`))

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

const isCheckedInNow = record =>
  [record?.firstHalf, record?.secondHalf].some(
    half => half?.checkIn?.time && !half?.checkOut?.time
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
// Calendar Helpers
// ======================================================

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const SUNDAY_LABEL = 'Sunday Off'

// Calendar cell colours, keyed by day label
const cellClasses = {
  [SUNDAY_LABEL]: 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100',
  Present:
    'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  Absent: 'border-red-500 bg-red-500 text-white hover:bg-red-600',
  'On Leave': 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
  'Half Day': 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
  Holiday: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
  'Weekly Off': 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
  'No Record': 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
}

const statusClasses = {
  [SUNDAY_LABEL]: 'bg-red-50 text-red-600',
  Present: 'bg-emerald-50 text-emerald-700',
  'Half Day': 'bg-amber-50 text-amber-700',
  Absent: 'bg-red-50 text-red-700',
  'On Leave': 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
  Holiday: 'bg-purple-50 text-purple-700',
  'Weekly Off': 'bg-gray-100 text-gray-600',
  'No Record': 'bg-gray-100 text-gray-600'
}

const legendItems = [
  { label: 'Present', dot: 'bg-emerald-600' },
  { label: 'Absent', dot: 'bg-red-500' },
  { label: 'On Leave', dot: 'bg-blue-500' },
  { label: 'Half Day', dot: 'bg-amber-500' },
  { label: 'Holiday', dot: 'bg-purple-500' },
  { label: SUNDAY_LABEL, dot: 'bg-red-300' }
]

// ======================================================
// Reusable Components
// ======================================================

const SummaryItem = ({ icon: Icon, label, value, className = '' }) => (
  <div
    className={`min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-3 ${className}`}
  >
    <div className='flex items-center gap-1.5 text-gray-500'>
      <Icon size={15} className='shrink-0' />
      <span className='whitespace-nowrap text-xs'>{label}</span>
    </div>

    <p className='mt-2 whitespace-nowrap text-base font-semibold text-gray-900 sm:text-lg'>
      {value}
    </p>
  </div>
)

const DetailRow = ({ icon: Icon, label, children }) => (
  <div className='flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3'>
    <Icon size={17} className='shrink-0 text-gray-500' />
    <span className='text-sm text-gray-500'>{label}</span>
    <span className='ml-auto text-right text-sm font-semibold text-gray-900'>
      {children}
    </span>
  </div>
)

// Content shown inside the modal when a calendar date is clicked
const DayDetails = ({ day, onRegularize, hasRequest }) => {
  const { dateString, record, label } = day
  const times = getRecordTimes(record)

  const duration = !record
    ? '--'
    : isCheckedInNow(record)
      ? 'In progress'
      : formatDuration(getRecordMinutes(record))

  return (
    <div className='space-y-3'>
      <p className='text-sm text-gray-500'>{formatFullDate(dateString)}</p>

      <DetailRow icon={LogIn} label='Check-in'>
        {formatTime(times.checkIn)}
      </DetailRow>

      <DetailRow icon={LogOut} label='Check-out'>
        {times.checkOut ? formatTime(times.checkOut) : '--'}
      </DetailRow>

      <DetailRow icon={Clock3} label='Work Duration'>
        {duration}
      </DetailRow>

      <DetailRow icon={CalendarCheck} label='Status'>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[label] || 'bg-gray-100 text-gray-600'
            }`}
        >
          {label}
        </span>
      </DetailRow>

      <div className='border-t border-gray-100 pt-3'>
        {hasRequest ? (
          <div className='flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3'>
            <span className='text-sm font-medium text-amber-700'>
              Regularization Requested
            </span>

            <span className='rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700'>
              Pending HR
            </span>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => onRegularize(day)}
            className='flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-black hover:bg-gray-50'
          >
            <CalendarCheck size={16} />
            Add Regularization
          </button>
        )}
      </div>
    </div>
  )
}


const RegularizationForm = ({ day, onClose, onSubmit }) => {
  const [description, setDescription] = useState('')
  const [regularizationStatus, setRegularizationStatus] = useState('')

  const handleSubmit = event => {
    event.preventDefault()

    const reason = description.trim()
    if (!reason || !regularizationStatus) return

    onSubmit({
      date: day.dateString,
      recordId: day.record?._id || null,
      reason,
      description: reason,
      regularizationStatus,
      status: 'pending',
      requestedAt: new Date().toISOString()
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Regularization Status */}
      <div>
        <label className='mb-1.5 block text-sm font-medium text-gray-700'>
          Regularization Status
        </label>

        <select
          value={regularizationStatus}
          onChange={event => setRegularizationStatus(event.target.value)}
          required
          className='w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 outline-none focus:border-black'
        >
          <option value='' disabled>
            Select regularization status
          </option>
          <option value='half_day'>Half Day</option>
          <option value='present'>Present</option>
          <option value='leave'>Leave</option>
        </select>
      </div>

      {/* Reason */}
      <div>
        <label className='mb-1.5 block text-sm font-medium text-gray-700'>
          Reason For Regularization
        </label>

        <textarea
          value={description}
          onChange={event => setDescription(event.target.value)}
          rows={4}
          required
          placeholder='Please explain why you need attendance regularization...'
          className='w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-black'
        />
      </div>

      {/* Actions */}
      <div className='flex justify-end gap-3 pt-2'>
        <button
          type='button'
          onClick={onClose}
          className='rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={!description.trim() || !regularizationStatus}
          className='flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <Send size={15} />
          Send Request
        </button>
      </div>
    </form>
  )
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

  const joiningString = joiningDate ? getDateString(joiningDate) : null
  const joiningMonthKey = joiningString ? joiningString.slice(0, 7) : null

  const todayString = getDateString(new Date())
  const todayMonthKey = todayString.slice(0, 7)

  const [calendarMonth, setCalendarMonth] = useState(todayMonthKey)
  const [monthlyData, setMonthlyData] = useState({})
  const [monthlyLoading, setMonthlyLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedRegularizationDay, setSelectedRegularizationDay] =
    useState(null)
  const [regularizationRequests, setRegularizationRequests] = useState({})

  const [todayData, setTodayData] = useState(null)
  const [todayLoading, setTodayLoading] = useState(false)
  const [todayError, setTodayError] = useState('')

  const calendarData = monthlyData[calendarMonth]
  const calendarSummary = calendarData?.summary || getMonthlySummary([])

  const canGoPrev = !joiningMonthKey || calendarMonth > joiningMonthKey
  const canGoNext = calendarMonth < todayMonthKey

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
  // Fetch a single month
  // ------------------------------------------------------

  const fetchMonth = useCallback(
    async monthKey => {
      const { startDate, endDate } = getMonthRange(monthKey)

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
          key: monthKey,
          records,
          summary: getMonthlySummary(records),
          error: null
        }
      } catch (error) {
        return {
          key: monthKey,
          records: [],
          summary: getMonthlySummary([]),
          error:
            typeof error === 'string'
              ? error
              : error?.message || 'Failed to load this month.'
        }
      }
    },
    [dispatch]
  )

  const loadMonths = useCallback(
    async monthKeys => {
      setMonthlyLoading(true)

      const results = await Promise.all(monthKeys.map(fetchMonth))

      setMonthlyData(previous => {
        const updated = { ...previous }

        results.forEach(result => {
          updated[result.key] = result
        })

        return updated
      })

      setMonthlyLoading(false)
    },
    [fetchMonth]
  )

  // Load the month shown in the calendar whenever it changes.
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setMonthlyLoading(true)

      const result = await fetchMonth(calendarMonth)

      if (cancelled) return

      setMonthlyData(previous => ({ ...previous, [result.key]: result }))
      setMonthlyLoading(false)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [calendarMonth, fetchMonth])

  const refreshCalendar = () => loadMonths([calendarMonth])

  // Frontend-only regularization request handling.
  // Replace this handler with the API call when the backend is ready.
  const handleRegularizationSubmit = request => {
    setRegularizationRequests(previous => ({
      ...previous,
      [request.date]: request
    }))

    console.log('Regularization Request:', request)

    setSelectedRegularizationDay(null)
  }

  // ------------------------------------------------------
  // Calendar cells
  // ------------------------------------------------------

  const calendarCells = useMemo(() => {
    const [year, month] = calendarMonth.split('-').map(Number)
    const daysInMonth = new Date(year, month, 0).getDate()
    const firstWeekDay = new Date(year, month - 1, 1).getDay()

    const recordsByDate = {}

      ; (calendarData?.records || []).forEach(record => {
        const key = record?.date?.slice(0, 10)
        if (key) recordsByDate[key] = record
      })

    const cells = Array.from({ length: firstWeekDay }, () => null)

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${pad(month)}-${pad(day)}`
      const weekDay = new Date(year, month - 1, day).getDay()
      const record = recordsByDate[dateString] || null
      const isSunday = weekDay === 0
      const isFuture = dateString > todayString
      const isBeforeJoining = Boolean(
        joiningString && dateString < joiningString
      )

      let label

      if (isSunday && !getRecordTimes(record).checkIn) {
        label = SUNDAY_LABEL
      } else if (record) {
        label = getStatus(record)
      } else {
        label = 'No Record'
      }

      cells.push({
        day,
        dateString,
        record,
        label,
        isSunday,
        isToday: dateString === todayString,
        // Sundays always stay red (even in the future), other future days
        // and days before joining are disabled.
        disabled: isBeforeJoining || (isFuture && !isSunday),
        isBeforeJoining
      })
    }

    return cells
  }, [calendarMonth, calendarData, todayString, joiningString])

  // ------------------------------------------------------
  // Today's attendance details
  // ------------------------------------------------------

  const todayTimes = getRecordTimes(todayData)
  const isCurrentlyCheckedIn = isCheckedInNow(todayData)
  const todayStatus = todayData ? getStatus(todayData) : 'Pending'

  // ------------------------------------------------------
  // Render
  // ------------------------------------------------------

  return (
    <div className='min-h-screen py-2 sm:py-4'>
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
        <div className='grid grid-cols-1 gap-5'>
          {/* Today's attendance */}
          <section className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
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
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${statusClasses[todayStatus] || 'bg-gray-100 text-gray-600'
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
                  <div className='mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3'>
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
                      className='col-span-2 sm:col-span-1'
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
        </div>

        {/* Attendance History - Calendar */}
        <section className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='font-semibold text-gray-900'>
                Attendance History
              </h2>

              <p className='mt-1 text-sm text-gray-500'>
                Click on any date to see check-in, check-out and work duration.
              </p>

              {joiningDate && (
                <p className='mt-1 text-xs text-gray-500'>
                  Joined on {formatDate(joiningString)}
                </p>
              )}
            </div>

            <div className='flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap'>
              <div className='flex min-w-0 flex-1 items-center justify-between gap-2 sm:flex-none sm:justify-start'>
                <button
                  type='button'
                  onClick={() =>
                    setCalendarMonth(shiftMonth(calendarMonth, -1))
                  }
                  disabled={!canGoPrev}
                  aria-label='Previous month'
                  className='shrink-0 rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 disabled:opacity-40'
                >
                  <ChevronLeft size={16} />
                </button>

                <span className='min-w-0 flex-1 text-center text-sm font-semibold text-gray-900 sm:min-w-35 sm:flex-none'>
                  {formatMonth(calendarMonth)}
                </span>

                <button
                  type='button'
                  onClick={() => setCalendarMonth(shiftMonth(calendarMonth, 1))}
                  disabled={!canGoNext}
                  aria-label='Next month'
                  className='shrink-0 rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 disabled:opacity-40'
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button
                type='button'
                onClick={refreshCalendar}
                disabled={monthlyLoading}
                aria-label='Refresh'
                className='flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:ml-1'
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

          {calendarData?.error && (
            <div className='mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
              <span>{calendarData.error}</span>

              <button
                type='button'
                onClick={refreshCalendar}
                className='font-semibold underline'
              >
                Retry
              </button>
            </div>
          )}

          {/* Month totals */}
          <div className='mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5'>
            {[
              { label: 'Present', value: calendarSummary.present },
              { label: 'Absent', value: calendarSummary.absent },
              { label: 'Leave', value: calendarSummary.leave },
              { label: 'Half Day', value: calendarSummary.halfDays },
              { label: 'Work Hours', value: calendarSummary.hours }
            ].map(item => (
              <div
                key={item.label}
                className='col-span-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 last:col-span-2 sm:last:col-span-1'
              >
                <p className='text-xs text-gray-500'>{item.label}</p>
                <p className='mt-1 text-base font-semibold text-gray-900'>
                  {calendarData && !calendarData.error ? item.value : '--'}
                </p>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className='relative mt-5'>
            {monthlyLoading && !calendarData && (
              <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70'>
                <LoaderCircle
                  size={22}
                  className='animate-spin text-gray-500'
                />
              </div>
            )}

            <div className='grid grid-cols-7 gap-1.5 sm:gap-2'>
              {WEEK_DAYS.map((name, index) => (
                <div
                  key={name}
                  className={`py-2 text-center text-xs font-medium ${index === 0 ? 'text-red-600' : 'text-gray-500'
                    }`}
                >
                  {name}
                </div>
              ))}

              {calendarCells.map((cell, index) =>
                cell === null ? (
                  <div key={`empty-${index}`} />
                ) : (
                  <button
                    key={cell.dateString}
                    type='button'
                    disabled={cell.disabled}
                    onClick={() => setSelectedDay(cell)}
                    title={cell.disabled ? '' : cell.label}
                    className={`flex min-h-13 w-full min-w-0 flex-col items-center justify-center rounded-xl border p-1 text-center transition sm:min-h-19 sm:items-start sm:justify-between sm:p-2 sm:text-left ${cell.disabled
                      ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                      : cellClasses[cell.label] || cellClasses['No Record']
                      } ${cell.isToday ? 'ring-2 ring-black ring-offset-1' : ''}`}
                  >
                    <span className='text-sm font-semibold'>{cell.day}</span>

                    {!cell.disabled && (
                      <span className='hidden text-[10px] font-medium leading-tight sm:block'>
                        {cell.label === 'No Record' ? '' : cell.label}
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Legend */}
          <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500'>
            {legendItems.map(item => (
              <span key={item.label} className='flex items-center gap-1.5'>
                <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                {item.label}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Day details modal */}
      <Modal
        isOpen={Boolean(selectedDay)}
        onClose={() => setSelectedDay(null)}
        title='Attendance Details'
        size='md'
      >
        {selectedDay && (
          <DayDetails
            day={selectedDay}
            hasRequest={Boolean(
              regularizationRequests[selectedDay.dateString]
            )}
            onRegularize={day => {
              setSelectedDay(null)
              setSelectedRegularizationDay(day)
            }}
          />
        )}
      </Modal>

      {/* Regularization request modal */}
      <Modal
        isOpen={Boolean(selectedRegularizationDay)}
        onClose={() => setSelectedRegularizationDay(null)}
        title='Attendance Regularization'
        size='md'
      >
        {selectedRegularizationDay && (
          <RegularizationForm
            day={selectedRegularizationDay}
            onClose={() => setSelectedRegularizationDay(null)}
            onSubmit={handleRegularizationSubmit}
          />
        )}
      </Modal>
    </div>
  )
}

export default Attendance
