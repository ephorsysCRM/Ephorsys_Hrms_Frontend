import {
  Plus,
  LoaderCircle,
  CalendarDays,
  HeartPulse,
  Home
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '../../UI/Modal'
import LeaveModal from '../employeeModal/LeaveModal'
import Pagination from '../../UI/Pagination'

import { getMyLeaveApplications } from '../../redux/features/employeeLeave/employeeLeaveThunk'
import { getAdminProfile } from '../../redux/features/auth/authThunk'

const LIMIT = 5

// Leave types for the balance cards
const leaveTypes = [
  {
    name: 'Casual Leave',
    shortName: 'Casual',
    key: 'casualLeave',
    icon: CalendarDays,
    iconStyle: 'bg-blue-50 text-blue-700',
    progress: 'bg-blue-600'
  },
  {
    name: 'Sick Leave',
    shortName: 'Sick',
    key: 'sickLeave',
    icon: HeartPulse,
    iconStyle: 'bg-amber-50 text-amber-700',
    progress: 'bg-amber-500'
  },
  {
    name: 'Work From Home',
    shortName: 'WFH',
    key: 'workFromHome',
    icon: Home,
    iconStyle: 'bg-green-50 text-green-600',
    progress: 'bg-green-600'
  }
]

// Format leave type
const formatLeaveType = type => {
  const types = {
    casualLeave: 'Casual Leave',
    sickLeave: 'Sick Leave',
    workFromHome: 'Work From Home'
  }

  return types[type] || type || 'N/A'
}

// Format date
const formatDate = date => {
  if (!date) return 'N/A'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return 'N/A'

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Status styling
const getStatusStyle = status => {
  const normalizedStatus = status?.toLowerCase()

  if (normalizedStatus === 'approved') {
    return 'border-green-200 bg-green-50 text-green-700'
  }

  if (normalizedStatus === 'rejected') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  return 'border-amber-200 bg-amber-50 text-amber-700'
}

// Format status label
const formatStatus = status => {
  if (!status) return 'Pending'

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

// Calculate displayed days
const getLeaveDays = request => {
  if (request.isHalfDay) return 0.5

  return (
    request.totalDays ??
    request.numberOfDays ??
    request.days ??
    request.totalLeaveDays ??
    0
  )
}

// Rejection reason is shown only for rejected applications
const getRejectionReason = request =>
  request.status?.toLowerCase() === 'rejected'
    ? request.rejectionReason?.trim() || ''
    : ''

const EmpLeaveReq = () => {
  const dispatch = useDispatch()

  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const selectedYear = new Date().getFullYear()

  // Leave balance states
  const [employee, setEmployee] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [balanceError, setBalanceError] = useState('')

  const {
    myLeaveApplications = [],
    myApplicationsPagination,
    myApplicationsLoading,
    myApplicationsError
  } = useSelector(state => state.employeeLeave)

  // Fetch leave balance (employee profile)
  const fetchBalance = async () => {
    setBalanceLoading(true)
    setBalanceError('')

    try {
      const response = await dispatch(getAdminProfile())

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch employee profile')
      }

      const employeeData =
        response?.data?.user ||
        response?.data?.employee ||
        response?.data?.admin ||
        response?.data

      if (!employeeData) {
        throw new Error('Employee details not found')
      }

      setEmployee(employeeData)
    } catch (err) {
      setBalanceError(err?.message || 'Unable to load leave details')
    } finally {
      setBalanceLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [dispatch])

  const currentYearLeave = useMemo(() => {
    return (
      employee?.leaveDetails?.find(
        leave => Number(leave.year) === Number(selectedYear)
      ) || null
    )
  }, [employee, selectedYear])

  const leaveBalances = useMemo(() => {
    return leaveTypes.map(leave => {
      const balance = currentYearLeave?.[leave.key]

      return {
        ...leave,
        used: Number(balance?.used ?? 0),
        total: Number(balance?.total ?? 0),
        remaining: Number(balance?.remaining ?? 0)
      }
    })
  }, [currentYearLeave])

  // Fetch applications whenever page changes
  useEffect(() => {
    dispatch(
      getMyLeaveApplications({
        page: currentPage,
        limit: LIMIT
      })
    )
  }, [dispatch, currentPage])

  const totalPages = myApplicationsPagination?.totalPages || 1

  // Refresh list and leave balances after modal closes
  const handleCloseApplyLeave = () => {
    setApplyLeaveOpen(false)

    setCurrentPage(1)

    fetchBalance()

    dispatch(
      getMyLeaveApplications({
        page: 1,
        limit: LIMIT
      })
    )
  }

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  return (
    <div className='flex flex-col px-0 py-2 sm:p-6 lg:p-1'>
      {/* Fixed Header */}
      <div className='sticky top-0 z-20 mb-4 flex shrink-0 flex-col gap-4 px-0 py-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-black '>
            My Leave Requests
          </h1>

          <p className='mt-1.5 text-sm text-gray-500'>
            View your leave applications and track their status.
          </p>
        </div>

        <button
          onClick={() => setApplyLeaveOpen(true)}
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-gray-800'
        >
          <Plus size={18} />
          Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className='mb-4 shrink-0'>
        {balanceLoading ? (
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500'>
            Loading your leave details...
          </div>
        ) : balanceError ? (
          <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600'>
            {balanceError}
          </div>
        ) : !employee ? (
          <div className='rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700'>
            Employee profile not found. Please log in again.
          </div>
        ) : (
          <>
            {!currentYearLeave && (
              <div className='mb-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700'>
                Leave has not been assigned for {selectedYear} yet.
              </div>
            )}

            <div className='grid grid-cols-3 gap-2 sm:gap-4'>
              {leaveBalances.map(leave => {
                const Icon = leave.icon

                const usedPercentage =
                  leave.total > 0 ? (leave.used / leave.total) * 100 : 0

                return (
                  <div
                    key={leave.key}
                    className='rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md sm:rounded-2xl sm:p-5'
                  >
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl ${leave.iconStyle}`}
                      >
                        <Icon
                          className='h-4 w-4 sm:h-5 sm:w-5'
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className='min-w-0'>
                        <p className='truncate text-[11px] font-medium text-gray-500 sm:text-sm'>
                          <span className='sm:hidden'>{leave.shortName}</span>
                          <span className='hidden sm:inline'>{leave.name}</span>
                        </p>

                        <h2 className='text-xl font-bold leading-tight text-gray-900 sm:text-3xl'>
                          {String(leave.remaining).padStart(2, '0')}
                          <span className='ml-1 text-[11px] font-medium text-gray-400 sm:text-sm'>
                            left
                          </span>
                        </h2>
                      </div>
                    </div>

                    <div className='mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100'>
                      <div
                        className={`h-full rounded-full ${leave.progress} transition-all duration-500`}
                        style={{ width: `${Math.min(100, usedPercentage)}%` }}
                      />
                    </div>

                    <p className='mt-2 text-[10px] text-gray-400 sm:text-xs'>
                      {leave.used} / {leave.total} used
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Leave History Container */}
      <div className='flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
        {/* Table Heading - Fixed */}
        <div className='shrink-0 border-b border-gray-100 px-5 py-5 sm:px-6'>
          <h2 className='text-lg font-bold text-black'>
            Leave Request History
          </h2>

          <p className='mt-1 text-sm text-gray-500'>
            Recent leave applications and their approval status.
          </p>
        </div>

        {/* Scrollable Content */}
        <div>
          {/* Loading */}
          {myApplicationsLoading && (
            <div className='flex min-h-[250px] items-center justify-center'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-500'>
                <LoaderCircle size={20} className='animate-spin' />
                Loading leave applications...
              </div>
            </div>
          )}

          {/* Error */}
          {!myApplicationsLoading && myApplicationsError && (
            <div className='flex min-h-[250px] flex-col items-center justify-center px-4 text-center'>
              <p className='text-sm font-semibold text-red-600'>
                {typeof myApplicationsError === 'string'
                  ? myApplicationsError
                  : myApplicationsError.message ||
                    'Failed to load leave applications.'}
              </p>

              <button
                onClick={() =>
                  dispatch(
                    getMyLeaveApplications({
                      page: currentPage,
                      limit: LIMIT
                    })
                  )
                }
                className='mt-3 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!myApplicationsLoading &&
            !myApplicationsError &&
            myLeaveApplications.length === 0 && (
              <div className='flex min-h-[300px] flex-col items-center justify-center px-4 text-center'>
                <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100'>
                  <CalendarDays size={26} className='text-gray-500' />
                </div>

                <h3 className='text-base font-bold text-gray-900'>
                  No Leave Applications
                </h3>

                <p className='mt-1 max-w-sm text-sm text-gray-500'>
                  You haven't submitted any leave applications yet.
                </p>
              </div>
            )}

          {/* Desktop Table */}
          {!myApplicationsLoading &&
            !myApplicationsError &&
            myLeaveApplications.length > 0 && (
              <>
                <div className='hidden overflow-x-auto md:block'>
                  <table className='w-full'>
                    <thead className='sticky top-0 z-10 bg-gray-50'>
                      <tr className='border-b border-gray-100'>
                        <th className='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400'>
                          Leave Type
                        </th>

                        <th className='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400'>
                          Duration
                        </th>

                        <th className='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400'>
                          Days
                        </th>

                        <th className='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400'>
                          Reason
                        </th>

                        <th className='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400'>
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-100'>
                      {myLeaveApplications.map(request => {
                        const status = formatStatus(request.status)
                        const days = getLeaveDays(request)
                        const rejectionReason = getRejectionReason(request)

                        return (
                          <tr
                            key={request._id || request.id}
                            className='transition hover:bg-gray-50/70'
                          >
                            <td className='px-6 py-4'>
                              <p className='text-sm font-semibold text-gray-900'>
                                {formatLeaveType(request.leaveType)}
                              </p>

                              {request.isHalfDay && (
                                <p className='mt-1 text-xs text-gray-400'>
                                  Half Day
                                </p>
                              )}
                            </td>

                            <td className='px-6 py-4'>
                              <p className='text-sm text-gray-700'>
                                {formatDate(request.fromDate)}
                              </p>

                              {request.fromDate !== request.toDate && (
                                <p className='mt-0.5 text-xs text-gray-400'>
                                  to {formatDate(request.toDate)}
                                </p>
                              )}
                            </td>

                            <td className='px-6 py-4'>
                              <span className='text-sm font-semibold text-gray-900'>
                                {days} {days === 1 ? 'day' : 'days'}
                              </span>
                            </td>

                            <td className='max-w-[240px] px-6 py-4'>
                              <p className='truncate text-sm text-gray-600'>
                                {request.reason || 'N/A'}
                              </p>

                              {rejectionReason && (
                                <p className='mt-1.5 break-words text-xs leading-5 text-red-600'>
                                  <span className='font-semibold'>
                                    Rejection reason:
                                  </span>{' '}
                                  {rejectionReason}
                                </p>
                              )}
                            </td>

                            <td className='px-6 py-4'>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                                  request.status
                                )}`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className='space-y-3 p-4 md:hidden'>
                  {myLeaveApplications.map(request => {
                    const status = formatStatus(request.status)
                    const days = getLeaveDays(request)
                    const rejectionReason = getRejectionReason(request)

                    return (
                      <div
                        key={request._id || request.id}
                        className='rounded-xl border border-gray-200 p-4'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='text-sm font-bold text-black'>
                              {formatLeaveType(request.leaveType)}
                            </p>

                            <p className='mt-1 text-xs text-gray-500'>
                              {formatDate(request.fromDate)}

                              {request.fromDate !== request.toDate &&
                                ` → ${formatDate(request.toDate)}`}
                            </p>

                            {request.isHalfDay && (
                              <p className='mt-1 text-xs text-gray-400'>
                                Half Day
                              </p>
                            )}
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className='mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3'>
                          <p className='max-w-[70%] truncate text-xs text-gray-500'>
                            {request.reason || 'N/A'}
                          </p>

                          <p className='shrink-0 text-xs font-bold text-black'>
                            {days} {days === 1 ? 'day' : 'days'}
                          </p>
                        </div>

                        {rejectionReason && (
                          <div className='mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2'>
                            <p className='text-[11px] font-semibold text-red-700'>
                              Rejection reason
                            </p>

                            <p className='mt-0.5 break-words text-xs leading-5 text-red-600'>
                              {rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
        </div>

        {/* Fixed Pagination */}
        {!myApplicationsLoading &&
          !myApplicationsError &&
          myLeaveApplications.length > 0 &&
          totalPages > 1 && (
            <div className='shrink-0 border-t border-gray-100 bg-white'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyLeaveOpen}
        onClose={handleCloseApplyLeave}
        title='Apply Leave'
        size='md'
      >
        <LeaveModal onClose={handleCloseApplyLeave} />
      </Modal>
    </div>
  )
}

export default EmpLeaveReq
