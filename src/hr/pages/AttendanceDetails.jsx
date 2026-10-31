import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  BriefcaseBusiness,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Timer,
  CalendarDays,
  Coffee,
  LogIn,
  LogOut
} from 'lucide-react'

import { getAttendanceDetails } from '../../redux/features/attendance/attendanceThunk'
import { clearAttendanceDetails } from '../../redux/features/attendance/attendanceSlice'

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const formatDate = (date, timezone = 'Asia/Kolkata') => {
  if (!date) return 'N/A'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return 'N/A'

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: timezone
  })
}

const formatTime = (date, timezone = 'Asia/Kolkata') => {
  if (!date) return 'Not recorded'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return 'Not recorded'

  return parsedDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: timezone
  })
}

const formatDuration = (minutes = 0) => {
  const totalMinutes = Number(minutes) || 0

  if (totalMinutes <= 0) return '0 min'

  const hours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  if (hours === 0) return `${remainingMinutes} min`

  return `${hours}h ${remainingMinutes}m`
}

const getStatusLabel = status => {
  const statusMap = {
    present: 'Present',
    half_day: 'Half Day',
    absent: 'Absent',
    pending: 'Pending',
    leave: 'Leave',
    holiday: 'Holiday',
    weekly_off: 'Weekly Off',
    work_from_home: 'Work From Home',
    rejected: 'Rejected',
    approved: 'Approved'
  }

  return statusMap[status] || status || 'Unknown'
}

const getStatusClass = status => {
  const statusMap = {
    present: 'bg-black text-white',
    half_day: 'bg-gray-200 text-gray-900',
    absent: 'bg-gray-100 text-gray-700',
    pending: 'bg-gray-100 text-gray-600',
    leave: 'bg-gray-200 text-gray-800',
    holiday: 'bg-gray-200 text-gray-800',
    weekly_off: 'bg-gray-200 text-gray-800',
    work_from_home: 'bg-gray-200 text-gray-800',
    approved: 'bg-black text-white',
    rejected: 'bg-gray-200 text-gray-800'
  }

  return statusMap[status] || 'bg-gray-100 text-gray-700'
}

// Get employee name from populated updatedBy
const getEmployeeName = employee => {
  if (!employee) return 'Unknown User'

  if (typeof employee === 'string') return employee

  return (
    [employee.firstName, employee.middleName, employee.lastName]
      .filter(Boolean)
      .join(' ') ||
    employee.employeeId ||
    'Unknown User'
  )
}

// --------------------------------------------------
// RESPONSE NORMALIZER
// --------------------------------------------------

const extractAttendanceResponse = response => {
  if (!response) {
    return {
      attendance: null,
      summary: null,
      filters: null,
      pagination: null
    }
  }

  const payload = response?.data ?? response

  const candidates = [
    payload,
    payload?.data,
    payload?.result,
    payload?.attendanceDetails,
    payload?.data?.data,
    payload?.result?.data
  ].filter(Boolean)

  let attendance = null
  let source = null

  for (const candidate of candidates) {
    if (Array.isArray(candidate?.attendance)) {
      attendance = candidate.attendance[0] || null
      source = candidate
      break
    }

    if (Array.isArray(candidate?.data)) {
      attendance = candidate.data[0] || null
      source = candidate
      break
    }

    if (
      candidate?._id &&
      (candidate?.date || candidate?.firstHalf || candidate?.secondHalf)
    ) {
      attendance = candidate
      source = candidate
      break
    }
  }

  return {
    attendance,
    summary: source?.summary || payload?.summary || null,
    filters: source?.filters || payload?.filters || null,
    pagination: source?.pagination || payload?.pagination || null
  }
}

// --------------------------------------------------
// SMALL COMPONENTS
// --------------------------------------------------

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}

const SummaryCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className='rounded-xl border border-gray-200 bg-white p-5'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-medium text-gray-500'>{title}</p>

        <div className='rounded-lg bg-gray-100 p-2'>
          <Icon size={18} className='text-gray-700' />
        </div>
      </div>

      <h3 className='mt-3 text-2xl font-bold text-gray-900'>{value}</h3>

      {description && (
        <p className='mt-1 text-xs text-gray-500'>{description}</p>
      )}
    </div>
  )
}

const LocationInfo = ({ checkIn }) => {
  if (checkIn?.latitude == null || checkIn?.longitude == null) {
    return <p className='text-sm text-gray-400'>Location not recorded</p>
  }

  return (
    <a
      href={`https://www.google.com/maps?q=${checkIn.latitude},${checkIn.longitude}`}
      target='_blank'
      rel='noreferrer'
      className='inline-flex items-center gap-1 text-sm text-gray-700 underline underline-offset-2 hover:text-black'
    >
      <MapPin size={14} />
      View location
    </a>
  )
}

// --------------------------------------------------
// HALF DETAILS
// --------------------------------------------------

const HalfDetails = ({ title, data }) => {
  const checkIn = data?.checkIn || {}
  const checkOut = data?.checkOut || {}

  const status = data?.status || 'pending'

  return (
    <div className='rounded-xl border border-gray-200 bg-white'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4'>
        <div>
          <h3 className='font-semibold text-gray-900'>{title}</h3>
          <p className='mt-1 text-xs text-gray-500'>
            Attendance session details
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className='grid gap-5 p-5 sm:grid-cols-2'>
        {/* CHECK IN */}

        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <div className='rounded-lg bg-gray-100 p-2'>
              <LogIn size={17} />
            </div>

            <h4 className='text-sm font-semibold text-gray-900'>Check In</h4>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Time</p>
            <p className='mt-1 text-sm font-medium text-gray-900'>
              {formatTime(checkIn.time)}
            </p>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Accuracy</p>
            <p className='mt-1 text-sm text-gray-800'>
              {checkIn.accuracy != null ? `${checkIn.accuracy} meters` : 'N/A'}
            </p>
          </div>

          <LocationInfo checkIn={checkIn} />
        </div>

        {/* CHECK OUT */}

        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <div className='rounded-lg bg-gray-100 p-2'>
              <LogOut size={17} />
            </div>

            <h4 className='text-sm font-semibold text-gray-900'>Check Out</h4>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Time</p>
            <p className='mt-1 text-sm font-medium text-gray-900'>
              {formatTime(checkOut.time)}
            </p>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Accuracy</p>
            <p className='mt-1 text-sm text-gray-800'>
              {checkOut.accuracy != null
                ? `${checkOut.accuracy} meters`
                : 'N/A'}
            </p>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Auto Checkout</p>
            <p className='mt-1 text-sm text-gray-800'>
              {checkOut.autoCheckedOut ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      <div className='border-t border-gray-200 bg-gray-50 px-5 py-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <span className='text-sm text-gray-600'>Session Work Duration</span>

          <span className='text-sm font-bold text-gray-900'>
            {formatDuration(data?.workDuration)}
          </span>
        </div>
      </div>
    </div>
  )
}

// --------------------------------------------------
// ATTENDANCE STATUS HISTORY
// --------------------------------------------------

const AttendanceHistory = ({ history = [], timezone = 'Asia/Kolkata' }) => {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  )

  return (
    <div className='rounded-xl border border-gray-200 bg-white p-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <div className='flex items-center gap-2'>
            <Clock size={19} className='text-gray-700' />

            <h3 className='font-semibold text-gray-900'>
              Attendance Status History
            </h3>
          </div>

          <p className='mt-1 text-sm text-gray-500'>
            Track all changes made to this attendance record.
          </p>
        </div>

        <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700'>
          {sortedHistory.length}{' '}
          {sortedHistory.length === 1 ? 'Change' : 'Changes'}
        </span>
      </div>

      {sortedHistory.length === 0 ? (
        <div className='mt-5 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center'>
          <FileText size={28} className='mx-auto text-gray-400' />

          <p className='mt-3 text-sm font-medium text-gray-700'>
            No status history available
          </p>

          <p className='mt-1 text-xs text-gray-500'>
            Status changes will appear here when an update is made.
          </p>
        </div>
      ) : (
        <div className='mt-6 space-y-5'>
          {sortedHistory.map((item, index) => {
            const updatedBy = item.updatedBy
            const employeeName = getEmployeeName(updatedBy)

            return (
              <div
                key={item._id || `${item.updatedAt}-${index}`}
                className='relative flex gap-4'
              >
                {/* TIMELINE ICON */}

                <div className='flex flex-col items-center'>
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100'>
                    <RefreshCw size={16} className='text-gray-700' />
                  </div>

                  {index !== sortedHistory.length - 1 && (
                    <div className='mt-2 w-px flex-1 bg-gray-200' />
                  )}
                </div>

                {/* HISTORY CONTENT */}

                <div className='min-w-0 flex-1 rounded-lg border border-gray-200 p-4'>
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <p className='text-sm font-semibold text-gray-900'>
                      Attendance Status Updated
                    </p>

                    <span className='text-xs text-gray-500'>
                      {formatDate(item.updatedAt, timezone)} ·{' '}
                      {formatTime(item.updatedAt, timezone)}
                    </span>
                  </div>

                  {/* STATUS CHANGE */}

                  <div className='mt-4 flex flex-wrap items-center gap-2'>
                    <StatusBadge status={item.previousStatus} />

                    <span className='text-gray-400'>→</span>

                    <StatusBadge status={item.newStatus} />
                  </div>

                  {/* REASON */}

                  <div className='mt-4'>
                    <p className='text-xs font-medium text-gray-500'>Reason</p>

                    <p className='mt-1 text-sm text-gray-700'>
                      {item.reason?.trim() ? item.reason : 'No reason provided'}
                    </p>
                  </div>

                  {/* UPDATED BY */}

                  <div className='mt-4 flex items-center gap-3 border-t border-gray-100 pt-3'>
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100'>
                      {updatedBy?.profilePhoto ? (
                        <img
                          src={updatedBy.profilePhoto}
                          alt={employeeName}
                          className='h-full w-full object-cover'
                          onError={e => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <User size={17} className='text-gray-600' />
                      )}
                    </div>

                    <div className='min-w-0'>
                      <p className='text-xs text-gray-500'>Updated By</p>

                      <p className='truncate text-sm font-semibold text-gray-900'>
                        {employeeName}
                      </p>

                      <p className='text-xs text-gray-500'>
                        {updatedBy?.designation ||
                          updatedBy?.employeeId ||
                          (updatedBy
                            ? 'Employee'
                            : 'User information unavailable')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function AttendanceDetails () {
  const dispatch = useDispatch()
  const { id } = useParams()

  const { attendanceDetails, loading, error } = useSelector(
    state => state.attendance
  )

  const [retryCount, setRetryCount] = useState(0)

  // Fetch attendance details.
  useEffect(() => {
    if (!id) return

    dispatch(getAttendanceDetails(id))

    return () => {
      dispatch(clearAttendanceDetails())
    }
  }, [dispatch, id, retryCount])

  // Normalize API response.
  const normalized = useMemo(
    () => extractAttendanceResponse(attendanceDetails),
    [attendanceDetails]
  )

  const attendance = normalized.attendance
  const summary = normalized.summary
  const filters = normalized.filters

  const timezone = filters?.timezone || 'Asia/Kolkata'

  const handleRetry = () => {
    setRetryCount(previous => previous + 1)
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading?.getAttendanceDetails) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='text-center'>
          <RefreshCw size={30} className='mx-auto animate-spin text-gray-700' />

          <p className='mt-4 text-sm font-medium text-gray-600'>
            Loading attendance details...
          </p>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error?.getAttendanceDetails) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center px-4'>
        <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center'>
          <AlertCircle size={36} className='mx-auto text-gray-700' />

          <h2 className='mt-4 text-lg font-bold text-gray-900'>
            Unable to load attendance
          </h2>

          <p className='mt-2 text-sm text-gray-500'>
            {typeof error.getAttendanceDetails === 'string'
              ? error.getAttendanceDetails
              : 'Something went wrong while fetching attendance details.'}
          </p>

          <button
            onClick={handleRetry}
            className='mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800'
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------

  if (!attendance) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center px-4'>
        <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center'>
          <CalendarDays size={36} className='mx-auto text-gray-400' />

          <h2 className='mt-4 text-lg font-bold text-gray-900'>
            No attendance details found
          </h2>

          <p className='mt-2 text-sm text-gray-500'>
            Attendance record is not available.
          </p>

          <button
            onClick={handleRetry}
            className='mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100'
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // SUMMARY VALUES
  // --------------------------------------------------

  const totalDuration =
    summary?.totalWorkDurationMinutes ?? attendance?.totalWorkDuration ?? 0

  const creditedDuration =
    summary?.creditedDurationMinutes ?? attendance?.creditedDuration ?? 0

  const attendanceDate = attendance?.date || filters?.startDate

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <div className='space-y-6 pb-8'>
      {/* HEADER */}

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='mt-2 text-2xl font-bold text-gray-900'>
            Attendance Details
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            Complete attendance record and working session details.
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          className='inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100'
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* EMPLOYEE / DATE DETAILS */}

      <div className='rounded-xl border border-gray-200 bg-white p-5'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='h-12 w-12 overflow-hidden rounded-xl bg-gray-100'>
              {attendance.employee?.profilePhoto ||
              attendance.employee?.profile?.profilePhoto ? (
                <img
                  src={
                    attendance.employee?.profilePhoto ||
                    attendance.employee?.profile?.profilePhoto
                  }
                  alt='Employee Profile'
                  className='h-full w-full object-cover'
                  onError={e => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <User size={22} className='text-gray-700' />
                </div>
              )}
            </div>

            <div>
              <p className='text-xs text-gray-500'>Employee ID</p>

              <p className='mt-1 font-semibold text-gray-900'>
                {typeof attendance.employee === 'object'
                  ? attendance.employee?.employeeId ||
                    attendance.employee?._id ||
                    'N/A'
                  : attendance.employee || 'N/A'}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-5'>
            <div>
              <p className='text-xs text-gray-500'>Attendance Date</p>

              <p className='mt-1 flex items-center gap-2 text-sm font-semibold text-gray-900'>
                <CalendarDays size={15} />
                {formatDate(attendanceDate, timezone)}
              </p>
            </div>

            <div>
              <p className='text-xs text-gray-500'>Work Mode</p>

              <p className='mt-1 flex items-center gap-2 text-sm font-semibold capitalize text-gray-900'>
                <BriefcaseBusiness size={15} />
                {attendance.workMode || 'N/A'}
              </p>
            </div>

            <div>
              <p className='text-xs text-gray-500'>Status</p>

              <div className='mt-1'>
                <StatusBadge status={attendance.status} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <SummaryCard
          title='Total Work Duration'
          value={formatDuration(totalDuration)}
          icon={Clock}
          description='Total recorded working time'
        />

        <SummaryCard
          title='Credited Duration'
          value={formatDuration(creditedDuration)}
          icon={Timer}
          description='Credited attendance time'
        />

        <SummaryCard
          title='Present Days'
          value={summary?.presentDays ?? 0}
          icon={CheckCircle2}
          description='Present attendance records'
        />

        <SummaryCard
          title='Half Days'
          value={summary?.halfDays ?? 0}
          icon={Coffee}
          description='Half-day attendance records'
        />
      </div>

      {/* ADDITIONAL SUMMARY */}

      {summary && (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6'>
          {[
            {
              label: 'Absent',
              value: summary.absentDays
            },
            {
              label: 'Leave',
              value: summary.leaveDays
            },
            {
              label: 'Holidays',
              value: summary.holidays
            },
            {
              label: 'Weekly Off',
              value: summary.weeklyOffDays
            },
            {
              label: 'Pending',
              value: summary.pendingDays
            },
            {
              label: 'Records',
              value: summary.recordsInPage
            }
          ].map(item => (
            <div
              key={item.label}
              className='rounded-xl border border-gray-200 bg-white p-4'
            >
              <p className='text-xs text-gray-500'>{item.label}</p>

              <p className='mt-2 text-xl font-bold text-gray-900'>
                {item.value ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ATTENDANCE SESSION DETAILS */}

      <div>
        <div className='mb-4'>
          <h2 className='text-lg font-bold text-gray-900'>
            Attendance Sessions
          </h2>

          <p className='mt-1 text-sm text-gray-500'>
            Check-in and check-out information for both halves.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
          <HalfDetails title='First Half' data={attendance.firstHalf} />

          <HalfDetails title='Second Half' data={attendance.secondHalf} />
        </div>
      </div>

      {/* REMARKS */}

      <div className='rounded-xl border border-gray-200 bg-white p-5'>
        <div className='flex items-center gap-2'>
          <FileText size={18} className='text-gray-700' />

          <h3 className='font-semibold text-gray-900'>Remarks</h3>
        </div>

        <p className='mt-3 text-sm text-gray-600'>
          {attendance.remarks?.trim()
            ? attendance.remarks
            : 'No remarks available for this attendance record.'}
        </p>
      </div>

      {/* ATTENDANCE STATUS HISTORY */}

      <AttendanceHistory
        history={attendance.statusHistory || []}
        timezone={timezone}
      />

      {/* RECORD INFORMATION */}

      <div className='rounded-xl border border-gray-200 bg-white p-5'>
        <h3 className='font-semibold text-gray-900'>Record Information</h3>

        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <p className='text-xs text-gray-500'>Attendance Record ID</p>

            <p className='mt-1 break-all text-sm font-medium text-gray-900'>
              {attendance._id || 'N/A'}
            </p>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Employee ID</p>

            <p className='mt-1 break-all text-sm font-medium text-gray-900'>
              {typeof attendance.employee === 'object'
                ? attendance.employee?.employeeId || 'N/A'
                : attendance.employee || 'N/A'}
            </p>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Created At</p>

            <p className='mt-1 text-sm font-medium text-gray-900'>
              {formatTime(attendance.createdAt, timezone)}
            </p>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Last Updated</p>

            <p className='mt-1 text-sm font-medium text-gray-900'>
              {formatTime(attendance.updatedAt, timezone)}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className='flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4 text-xs text-gray-500'>
        <p>Attendance record: {attendance._id || 'N/A'}</p>

        <p>Timezone: {timezone}</p>
      </div>
    </div>
  )
}
