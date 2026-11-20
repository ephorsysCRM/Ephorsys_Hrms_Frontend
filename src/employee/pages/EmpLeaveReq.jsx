import { Plus, LoaderCircle, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '../../UI/Modal'
import LeaveModal from '../employeeModal/LeaveModal'
import Pagination from '../../UI/Pagination'

import { getMyLeaveApplications } from '../../redux/features/employeeLeave/employeeLeaveThunk'

const LIMIT = 5

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

  const {
    myLeaveApplications = [],
    myApplicationsPagination,
    myApplicationsLoading,
    myApplicationsError
  } = useSelector(state => state.employeeLeave)

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

  // Refresh list after modal closes successfully
  const handleCloseApplyLeave = () => {
    setApplyLeaveOpen(false)

    setCurrentPage(1)

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
    <div className='flex h-[calc(100vh-80px)] min-h-[500px] flex-col overflow-hidden p-4 sm:p-6 lg:p-1'>
      {/* Fixed Header */}
      <div className='sticky top-0 z-20 mb-6 flex shrink-0 flex-col gap-4  px-2 py-3 sm:flex-row sm:items-end sm:justify-between'>
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

      {/* Leave History Container */}
      <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
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
        <div className='min-h-0 flex-1 overflow-y-auto'>
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
