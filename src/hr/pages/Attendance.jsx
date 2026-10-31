import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Edit, Eye, RefreshCw, Check, X } from 'lucide-react'

import {
  getAllAttendance,
  updateAttendanceStatus
} from '../../redux/features/attendance/attendanceThunk'

// import { clearAttendanceStatusUpdate } from '../../Redux/features/attendance/attendanceSlice'
import { clearAttendanceStatusUpdate } from '../../redux/features/attendance/attendanceSlice'

import Pagination from '../../UI/Pagination'

// ==================================================
// DATE HELPERS
// ==================================================

const getLocalDate = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date())

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

const isValidDate = value => {
  if (typeof value !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

// Editing is allowed from day-before-yesterday and older.
// Example: If today is 31 October, editing starts from 29 October.
const canEditAttendance = attendanceDate => {
  if (!isValidDate(attendanceDate)) return false

  const today = getLocalDate()
  const [year, month, day] = today.split('-').map(Number)

  const yesterdayDate = new Date(Date.UTC(year, month - 1, day))

  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1)

  const yesterday = yesterdayDate.toISOString().slice(0, 10)

  return attendanceDate < yesterday
}

// ==================================================
// STATUS HELPERS
// ==================================================

const statusStyles = {
  Present: 'bg-black text-white',
  'Half Day': 'bg-gray-200 text-black',
  Pending: 'bg-yellow-100 text-yellow-800',
  Absent: 'bg-gray-900 text-white',
  'On Leave': 'bg-gray-100 text-gray-600',
  Holiday: 'bg-blue-100 text-blue-700',
  'Weekly Off': 'bg-purple-100 text-purple-700',
  'Work From Home': 'bg-green-100 text-green-700'
}

const statusOptions = [
  { value: 'present', label: 'Present' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'absent', label: 'Absent' },
  { value: 'leave', label: 'On Leave' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'weekly_off', label: 'Weekly Off' },
  { value: 'work_from_home', label: 'Work From Home' },
  { value: 'pending', label: 'Pending' }
]

const formatStatus = status => {
  const statusMap = {
    present: 'Present',
    half_day: 'Half Day',
    pending: 'Pending',
    absent: 'Absent',
    leave: 'On Leave',
    holiday: 'Holiday',
    weekly_off: 'Weekly Off',
    work_from_home: 'Work From Home'
  }

  return statusMap[String(status || '').toLowerCase()] || status || 'Pending'
}

// ==================================================
// TIME HELPERS
// ==================================================

const getTimestamp = value => {
  if (!value) return null

  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? null : timestamp
}

const formatTime = value => {
  const timestamp = getTimestamp(value)

  if (timestamp === null) return '--'

  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  })
}

const getAttendanceTime = (record, type) => {
  const firstHalfTime = record?.firstHalf?.[type]?.time
  const secondHalfTime = record?.secondHalf?.[type]?.time

  if (type === 'checkIn') {
    return formatTime(firstHalfTime || secondHalfTime)
  }

  return formatTime(secondHalfTime || firstHalfTime)
}

const getWorkingHours = record => {
  const sessions = [
    {
      checkIn: getTimestamp(record?.firstHalf?.checkIn?.time),
      checkOut: getTimestamp(record?.firstHalf?.checkOut?.time)
    },
    {
      checkIn: getTimestamp(record?.secondHalf?.checkIn?.time),
      checkOut: getTimestamp(record?.secondHalf?.checkOut?.time)
    }
  ]

  let totalMilliseconds = 0
  let hasCompletedSession = false

  sessions.forEach(({ checkIn, checkOut }) => {
    if (checkIn !== null && checkOut !== null && checkOut >= checkIn) {
      totalMilliseconds += checkOut - checkIn
      hasCompletedSession = true
    }
  })

  if (!hasCompletedSession) return '--'

  const totalMinutes = Math.floor(totalMilliseconds / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

// ==================================================
// EMPLOYEE HELPERS
// ==================================================

const getEmployeeName = employee => {
  if (!employee) return 'Unknown Employee'
  if (typeof employee === 'string') return employee

  return (
    [employee.firstName, employee.middleName, employee.lastName]
      .filter(Boolean)
      .join(' ') ||
    employee.name ||
    employee.fullName ||
    employee.employeeName ||
    'Unknown Employee'
  )
}

const getEmployeeId = employee => {
  if (!employee) return '--'
  if (typeof employee === 'string') return employee

  return (
    employee.employeeId ||
    employee.empId ||
    employee.employeeCode ||
    employee.code ||
    employee._id ||
    '--'
  )
}

const getProfilePhoto = employee => {
  if (!employee || typeof employee !== 'object') return ''

  return (
    employee.profilePhoto ||
    employee.profileImage ||
    employee.avatar ||
    employee.photo ||
    employee.image ||
    ''
  )
}

const getDepartment = employee => {
  if (!employee || typeof employee !== 'object') return 'N/A'

  const department = employee.department

  if (department && typeof department === 'object') {
    return (
      department.departmentName ||
      department.name ||
      department.title ||
      employee.departmentName ||
      'N/A'
    )
  }

  return employee.departmentName || 'N/A'
}

const getEmployeeInitials = name =>
  String(name || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

// ==================================================
// MAIN COMPONENT
// ==================================================

const Attendance = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [selectedDate, setSelectedDate] = useState(getLocalDate())
  const [page, setPage] = useState(1)

  // Status editor states
  const [editingId, setEditingId] = useState(null)
  const [editStatus, setEditStatus] = useState('pending')
  const [editReason, setEditReason] = useState('')

  // Local UI feedback
  const [updateSuccess, setUpdateSuccess] = useState('')

  const limit = 20

  // ==================================================
  // REDUX STATE
  // ==================================================

  const attendanceState = useSelector(state => state.attendance || {})

  const allAttendance = Array.isArray(attendanceState.allAttendance)
    ? attendanceState.allAttendance
    : Array.isArray(attendanceState.attendance)
    ? attendanceState.attendance
    : []

  const allAttendanceLoading =
    attendanceState.loading?.getAllAttendance ??
    attendanceState.allAttendanceLoading ??
    false

  const allAttendanceError =
    attendanceState.error?.getAllAttendance ??
    attendanceState.allAttendanceError ??
    null

  const updateLoading = attendanceState.loading?.updateAttendanceStatus ?? false

  const updateError = attendanceState.error?.updateAttendanceStatus ?? null

  const pagination =
    attendanceState.allAttendancePagination || attendanceState.pagination || {}

  // ==================================================
  // FETCH ATTENDANCE
  // ==================================================

  useEffect(() => {
    if (!isValidDate(selectedDate)) return

    dispatch(
      getAllAttendance({
        date: selectedDate,
        page,
        limit
      })
    )
  }, [dispatch, selectedDate, page])

  const handleRefresh = () => {
    if (!isValidDate(selectedDate)) return

    dispatch(
      getAllAttendance({
        date: selectedDate,
        page,
        limit
      })
    )
  }

  const handleDateChange = event => {
    setSelectedDate(event.target.value)
    setPage(1)
    setEditingId(null)
    setUpdateSuccess('')
  }

  // ==================================================
  // STATUS EDIT HANDLERS
  // ==================================================

  const handleEditStatus = employee => {
    if (!canEditAttendance(selectedDate)) return

    dispatch(clearAttendanceStatusUpdate())

    setUpdateSuccess('')
    setEditingId(employee.key)
    setEditStatus(employee.rawStatus || 'pending')
    setEditReason('')
  }

  const handleCancelEdit = () => {
    if (updateLoading) return

    setEditingId(null)
    setEditStatus('pending')
    setEditReason('')
    dispatch(clearAttendanceStatusUpdate())
  }

  const handleSaveStatus = async employee => {
    if (!canEditAttendance(selectedDate)) return
    if (!employee?.key || !editStatus || updateLoading) return

    setUpdateSuccess('')

    try {
      // Call the real backend API.
      await dispatch(
        updateAttendanceStatus({
          attendanceId: employee.key,
          status: editStatus,
          reason: editReason.trim()
        })
      ).unwrap()

      setUpdateSuccess(
        `Attendance status updated successfully for ${employee.name}.`
      )

      setEditingId(null)
      setEditStatus('pending')
      setEditReason('')

      // Refresh current date and page from backend.
      dispatch(
        getAllAttendance({
          date: selectedDate,
          page,
          limit
        })
      )
    } catch (error) {
      // Keep editor open so HR can retry.
      console.error('Attendance status update failed:', error)
    }
  }

  // ==================================================
  // MAP API RECORDS
  // ==================================================

  const employees = useMemo(() => {
    return allAttendance.map(record => {
      const employee = record?.employee
      const name = getEmployeeName(employee)
      const rawStatus = record?.status || 'pending'

      return {
        key: record?._id,
        name,
        id: getEmployeeId(employee),
        profilePhoto: getProfilePhoto(employee),
        department: getDepartment(employee),
        checkIn: getAttendanceTime(record, 'checkIn'),
        checkOut: getAttendanceTime(record, 'checkOut'),
        workingHours: getWorkingHours(record),
        status: formatStatus(rawStatus),
        rawStatus,
        reason: record?.remarks || '',
        record
      }
    })
  }, [allAttendance])

  // ==================================================
  // DEPARTMENT OPTIONS
  // ==================================================

  const departments = useMemo(() => {
    const availableDepartments = employees
      .map(employee => employee.department)
      .filter(name => name && name !== 'N/A')

    return ['All Departments', ...new Set(availableDepartments)]
  }, [employees])

  // ==================================================
  // SEARCH AND FILTER
  // ==================================================

  const filteredEmployees = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return employees.filter(employee => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchText) ||
        String(employee.id).toLowerCase().includes(searchText)

      const matchesDepartment =
        department === 'All Departments' || employee.department === department

      return matchesSearch && matchesDepartment
    })
  }, [employees, search, department])

  // ==================================================
  // PAGINATION
  // ==================================================

  const currentPage = Number(pagination.currentPage) || page

  const totalRecords = pagination.totalRecords ?? allAttendance.length

  const totalPages = Math.max(
    1,
    Number(pagination.totalPages) || Math.ceil(Number(totalRecords) / limit)
  )

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className='min-h-screen text-black'>
      <div className='mx-auto w-full max-w-7xl px-1 py-2'>
        {/* Date Filter */}
        <div className='mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-xl font-medium'>Attendance by Date</h2>

            <p className='mt-1 text-xs text-gray-500'>
              Select a date to view attendance records
            </p>
          </div>

          <div className='flex gap-2'>
            <input
              type='date'
              value={selectedDate}
              max={getLocalDate()}
              onChange={handleDateChange}
              className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black sm:w-auto'
            />

            <button
              type='button'
              onClick={handleRefresh}
              disabled={allAttendanceLoading || !selectedDate}
              title='Refresh attendance'
              className='flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50'
            >
              <RefreshCw
                size={16}
                className={allAttendanceLoading ? 'animate-spin' : ''}
              />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className='mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700'>
            {updateSuccess}
          </div>
        )}

        {/* Attendance Table */}
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
          {/* Table Header */}
          <div className='flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <h2 className='text-sm font-medium sm:text-base'>
                Employee Attendance
              </h2>

              <p className='mt-1 text-xs text-gray-500'>
                Attendance records for {selectedDate || 'selected date'}
              </p>
            </div>

            {/* Search and Department Filter */}
            <div className='flex w-full flex-col gap-2 sm:flex-row lg:w-auto'>
              <input
                type='text'
                placeholder='Search employee...'
                value={search}
                onChange={event => setSearch(event.target.value)}
                className='w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black sm:w-56'
              />

              <select
                value={department}
                onChange={event => setDepartment(event.target.value)}
                className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black sm:w-48'
              >
                {departments.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* API Error */}
          {allAttendanceError && (
            <div className='m-4 rounded-lg border border-red-200 bg-red-50 p-4'>
              <p className='text-sm text-red-700'>
                {typeof allAttendanceError === 'string'
                  ? allAttendanceError
                  : 'Failed to fetch attendance.'}
              </p>

              <button
                type='button'
                onClick={handleRefresh}
                className='mt-2 text-sm font-medium text-red-800 underline'
              >
                Try again
              </button>
            </div>
          )}

          {/* Table */}
          <div className='w-full overflow-x-auto'>
            <table className='w-full min-w-[950px] text-left'>
              <thead className='bg-gray-50'>
                <tr>
                  {[
                    'Employee',
                    'Department',
                    'Check In',
                    'Check Out',
                    'Working Hours',
                    'Status',
                    'Action'
                  ].map(heading => (
                    <th
                      key={heading}
                      className='whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 sm:px-5'
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-100'>
                {allAttendanceLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-5 py-12 text-center text-sm text-gray-500'
                    >
                      Loading attendance...
                    </td>
                  </tr>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => {
                    const isEditing = editingId === employee.key
                    const isEditable = canEditAttendance(selectedDate)

                    return (
                      <tr key={employee.key} className='hover:bg-gray-50'>
                        {/* Employee Profile */}
                        <td className='px-4 py-4 sm:px-5'>
                          <div className='flex items-center gap-3'>
                            <div className='flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black text-xs text-white'>
                              <ProfileAvatar
                                photo={employee.profilePhoto}
                                name={employee.name}
                              />
                            </div>

                            <div className='min-w-0'>
                              <p className='truncate text-sm font-medium'>
                                {employee.name}
                              </p>

                              <p className='text-xs text-gray-400'>
                                {employee.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className='whitespace-nowrap px-4 py-4 text-sm text-gray-600 sm:px-5'>
                          {employee.department}
                        </td>

                        {/* Check In */}
                        <td className='whitespace-nowrap px-4 py-4 text-sm sm:px-5'>
                          {employee.checkIn}
                        </td>

                        {/* Check Out */}
                        <td className='whitespace-nowrap px-4 py-4 text-sm sm:px-5'>
                          {employee.checkOut}
                        </td>

                        {/* Working Hours */}
                        <td className='whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700 sm:px-5'>
                          {employee.workingHours}
                        </td>

                        {/* Status */}
                        <td className='px-4 py-4 sm:px-5'>
                          {isEditing ? (
                            <div className='min-w-[220px] space-y-2'>
                              <select
                                value={editStatus}
                                disabled={updateLoading}
                                onChange={event =>
                                  setEditStatus(event.target.value)
                                }
                                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-black disabled:opacity-60'
                              >
                                {statusOptions.map(option => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>

                              <textarea
                                value={editReason}
                                disabled={updateLoading}
                                onChange={event =>
                                  setEditReason(event.target.value)
                                }
                                placeholder='Reason (optional)'
                                maxLength={500}
                                rows={2}
                                className='w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-black disabled:opacity-60'
                              />

                              <p className='text-right text-[10px] text-gray-400'>
                                {editReason.length}/500
                              </p>

                              {/* Update API Error */}
                              {updateError && (
                                <p className='rounded-md bg-red-50 p-2 text-xs text-red-600'>
                                  {typeof updateError === 'string'
                                    ? updateError
                                    : 'Failed to update attendance.'}
                                </p>
                              )}

                              <div className='flex items-center gap-2'>
                                <button
                                  type='button'
                                  disabled={updateLoading}
                                  onClick={() => handleSaveStatus(employee)}
                                  className='flex items-center gap-1 rounded-md bg-black px-3 py-1.5 text-xs text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
                                >
                                  {updateLoading ? (
                                    <>
                                      <RefreshCw
                                        size={13}
                                        className='animate-spin'
                                      />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <Check size={13} />
                                      Save
                                    </>
                                  )}
                                </button>

                                <button
                                  type='button'
                                  disabled={updateLoading}
                                  onClick={handleCancelEdit}
                                  className='flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-50'
                                >
                                  <X size={13} />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-col items-start gap-1'>
                              <div className='flex items-center gap-2'>
                                <span
                                  className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                                    statusStyles[employee.status] ||
                                    'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {employee.status}
                                </span>

                                {/* Edit only for eligible dates */}
                                {isEditable && (
                                  <button
                                    type='button'
                                    title='Edit attendance status'
                                    onClick={() => handleEditStatus(employee)}
                                    className='flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-black'
                                  >
                                    <Edit size={14} />
                                  </button>
                                )}
                              </div>

                              {employee.reason && (
                                <p className='max-w-[220px] text-[11px] text-gray-500'>
                                  Reason: {employee.reason}
                                </p>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Action */}
                        <td className='px-4 py-4 sm:px-5'>
                          <button
                            type='button'
                            title='View attendance details'
                            onClick={() =>
                              navigate(`/hr/attendance/${employee.key}`)
                            }
                            className='flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-black'
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-5 py-10 text-center text-sm text-gray-500'
                    >
                      {allAttendanceError
                        ? 'Attendance could not be loaded.'
                        : !selectedDate
                        ? 'Please select a valid date.'
                        : search || department !== 'All Departments'
                        ? 'No matching employees found.'
                        : 'No attendance records found for this date.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='border-t border-gray-100 bg-white'>
            <div className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5'>
              <p className='text-xs text-gray-500'>
                Page {currentPage} of {totalPages}
                {' · '}
                {totalRecords} total records
              </p>

              <div
                className={
                  allAttendanceLoading ? 'pointer-events-none opacity-50' : ''
                }
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={newPage => {
                    if (
                      !allAttendanceLoading &&
                      newPage >= 1 &&
                      newPage <= totalPages
                    ) {
                      setPage(newPage)
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================================================
// PROFILE AVATAR
// ==================================================

function ProfileAvatar ({ photo, name }) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [photo])

  if (photo && !imageFailed) {
    return (
      <img
        src={photo}
        alt={name}
        loading='lazy'
        className='h-full w-full object-cover'
        onError={() => setImageFailed(true)}
      />
    )
  }

  return <span>{getEmployeeInitials(name)}</span>
}

export default Attendance
