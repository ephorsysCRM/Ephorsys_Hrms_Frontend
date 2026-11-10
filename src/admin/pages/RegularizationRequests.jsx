import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  Search,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  CalendarDays,
  User,
  RefreshCw,
  FileText,
  AlertCircle
} from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'

import {
  getAllRegularization,
  reviewRegularization
} from '../../redux/features/regularization/regularizationThunk'

import Pagination from '../../UI/Pagination'
import Modal from '../../UI/Modal'
import RegularizationDetailsModal from '../adminModals/RegularizationDetailsModal'
import RegularizationRejectModal from '../adminModals/RegularizationRejectModal'

const RegularizationRequests = () => {
  const dispatch = useDispatch()

  const {
    allRequests = [],
    allRequestsPagination = {},
    loading = {},
    error = {}
  } = useSelector(state => state.regularization || {})

  // --------------------------------------------------
  // FILTER STATES
  // --------------------------------------------------

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [attendanceDate, setAttendanceDate] = useState('')

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  // --------------------------------------------------
  // ACTION MENU
  // --------------------------------------------------

  const [openActionId, setOpenActionId] = useState(null)
  const [menuPosition, setMenuPosition] = useState(null)

  // --------------------------------------------------
  // DETAILS MODAL
  // --------------------------------------------------

  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // --------------------------------------------------
  // REJECT MODAL
  // --------------------------------------------------

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectRequestId, setRejectRequestId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [reviewLoading, setReviewLoading] = useState(false)

  // --------------------------------------------------
  // FETCH REQUESTS
  // --------------------------------------------------

  const fetchRequests = useCallback(() => {
    const params = {
      page: currentPage,
      limit
    }

    if (statusFilter !== 'all') {
      params.status = statusFilter
    }

    // Filter by exact attendance date.
    // Both dates are the same because the user selects one date.
    if (attendanceDate) {
      params.startDate = attendanceDate
      params.endDate = attendanceDate
    }

    dispatch(getAllRegularization(params))
  }, [dispatch, currentPage, statusFilter, attendanceDate])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const getEmployeeName = employee => {
    if (!employee) return 'Unknown Employee'

    if (typeof employee === 'string') return employee

    return (
      [employee.firstName, employee.middleName, employee.lastName]
        .filter(Boolean)
        .join(' ') ||
      employee.name ||
      employee.fullName ||
      'Unknown Employee'
    )
  }

  const getEmployeeImage = employee => {
    if (!employee || typeof employee === 'string') return null

    return employee.profilePhoto || null
  }

  const getEmployeeId = employee => {
    if (!employee) return '-'

    if (typeof employee === 'string') return employee

    return employee.employeeId || employee.empId || employee._id || '-'
  }

  const getDepartmentName = employee => {
    if (!employee || typeof employee === 'string') return '-'

    if (typeof employee.department === 'object') {
      return employee.department?.name || '-'
    }

    return employee.department || '-'
  }

  const getReviewerName = reviewer => {
    if (!reviewer) return '-'

    if (typeof reviewer === 'string') return reviewer

    return (
      [reviewer.firstName, reviewer.middleName, reviewer.lastName]
        .filter(Boolean)
        .join(' ') ||
      reviewer.name ||
      '-'
    )
  }

  // --------------------------------------------------
  // DATE HELPERS
  // --------------------------------------------------

  const formatDate = date => {
    if (!date) return '-'

    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-')

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      ).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return '-'

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = date => {
    if (!date) return '-'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return '-'

    return parsedDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // --------------------------------------------------
  // STATUS HELPERS
  // --------------------------------------------------

  const getStatusClass = status => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700'

      case 'rejected':
        return 'bg-red-100 text-red-700'

      case 'pending':
      default:
        return 'bg-amber-100 text-amber-700'
    }
  }

  const getRequestedStatusLabel = status => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'Present'

      case 'half_day':
        return 'Half Day'

      case 'leave':
        return 'Leave'

      default:
        return status || '-'
    }
  }

  // --------------------------------------------------
  // ACTION MENU POSITION
  // Render menu outside the table to prevent clipping.
  // --------------------------------------------------

  const toggleActionMenu = (event, request) => {
    event.preventDefault()
    event.stopPropagation()

    if (openActionId === request._id) {
      setOpenActionId(null)
      setMenuPosition(null)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()

    const menuWidth = 190
    const menuHeight = request.status === 'pending' ? 150 : 55

    let left = rect.right - menuWidth
    let top = rect.bottom + 6

    // Keep menu inside the screen horizontally.
    left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8))

    // Open upward when there isn't enough space below.
    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - 6
    }

    top = Math.max(8, top)

    setMenuPosition({ top, left })
    setOpenActionId(request._id)
  }

  const closeActionMenu = () => {
    setOpenActionId(null)
    setMenuPosition(null)
  }

  // --------------------------------------------------
  // VIEW DETAILS
  // --------------------------------------------------

  const handleViewDetails = request => {
    closeActionMenu()
    setSelectedRequest(request)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedRequest(null)
  }

  // --------------------------------------------------
  // APPROVE REQUEST
  // --------------------------------------------------

  const handleApprove = async request => {
    if (!request?._id) return

    const confirmed = window.confirm(
      'Are you sure you want to approve this regularization request?'
    )

    if (!confirmed) return

    try {
      setReviewLoading(true)
      closeActionMenu()

      await dispatch(
        reviewRegularization({
          regularizationId: request._id,
          status: 'approved'
        })
      ).unwrap()

      await fetchRequests()

      window.alert('Regularization request approved successfully.')
    } catch (err) {
      window.alert(
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to approve request.'
      )
    } finally {
      setReviewLoading(false)
    }
  }

  // --------------------------------------------------
  // REJECT REQUEST
  // --------------------------------------------------

  const openRejectModal = request => {
    closeActionMenu()
    setRejectRequestId(request._id)
    setRejectionReason('')
    setShowRejectModal(true)
  }

  const closeRejectModal = () => {
    setShowRejectModal(false)
    setRejectRequestId(null)
    setRejectionReason('')
  }

  const handleReject = async () => {
    if (!rejectRequestId) return

    if (!rejectionReason.trim()) {
      window.alert('Please enter a rejection reason.')
      return
    }

    try {
      setReviewLoading(true)

      await dispatch(
        reviewRegularization({
          regularizationId: rejectRequestId,
          status: 'rejected',
          rejectionReason: rejectionReason.trim()
        })
      ).unwrap()

      closeRejectModal()

      await fetchRequests()

      window.alert('Regularization request rejected successfully.')
    } catch (err) {
      window.alert(
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to reject request.'
      )
    } finally {
      setReviewLoading(false)
    }
  }

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) return allRequests

    const search = searchTerm.toLowerCase()

    return allRequests.filter(request => {
      const employeeName = getEmployeeName(request.employee)
      const employeeId = getEmployeeId(request.employee)

      return (
        employeeName.toLowerCase().includes(search) ||
        String(employeeId).toLowerCase().includes(search) ||
        String(request.reason || '')
          .toLowerCase()
          .includes(search) ||
        String(request.status || '')
          .toLowerCase()
          .includes(search)
      )
    })
  }, [allRequests, searchTerm])

  // --------------------------------------------------
  // RESET FILTERS
  // --------------------------------------------------

  const handleResetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setAttendanceDate('')
    setCurrentPage(1)
    closeActionMenu()
  }

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.max(1, allRequestsPagination?.totalPages || 1)

  const handlePageChange = page => {
    setCurrentPage(page)
    closeActionMenu()
  }

  // Server-side total count after filters.
  const totalRecords = allRequestsPagination?.totalRecords ?? allRequests.length

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className='mx-auto w-full max-w-[1500px] space-y-5 py-2'>
      {/* HEADER */}
      <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Regularization Requests
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            Review and manage employee attendance regularization requests.
          </p>
        </div>

        <button
          type='button'
          onClick={fetchRequests}
          disabled={loading.getAllRequests || reviewLoading}
          className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50'
        >
          <RefreshCw
            size={17}
            className={loading.getAllRequests ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5'>
        <div className='grid grid-cols-1 gap-3 lg:grid-cols-12'>
          {/* SEARCH */}
          <div className='relative lg:col-span-6'>
            <Search
              size={18}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
            />

            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search employee or reason...'
              className='h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            />
          </div>

          {/* STATUS */}
          <div className='lg:col-span-3'>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
                closeActionMenu()
              }}
              className='h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>

          {/* ATTENDANCE DATE */}
          <div className='relative lg:col-span-3'>
            <CalendarDays
              size={18}
              className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
            />

            <input
              type='date'
              value={attendanceDate}
              onChange={e => {
                setAttendanceDate(e.target.value)
                setCurrentPage(1)
                closeActionMenu()
              }}
              className='h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              title='Select Attendance Date'
            />
          </div>
        </div>

        {/* FILTER FOOTER */}
        <div className='mt-4 flex flex-col justify-between gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center'>
          <p className='text-xs text-gray-500'>
            {attendanceDate
              ? `Showing requests for attendance date: ${formatDate(
                  attendanceDate
                )}`
              : 'Filter requests by employee, status or attendance date.'}
          </p>

          <button
            type='button'
            onClick={handleResetFilters}
            className='text-left text-sm font-medium text-blue-600 transition hover:text-blue-800 sm:text-right'
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error.getAllRequests && (
        <div className='flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
          <AlertCircle size={18} />
          {error.getAllRequests}
        </div>
      )}

      {/* TABLE CONTAINER */}
      <div className='rounded-2xl border border-gray-200 bg-white shadow-sm'>
        {/* TABLE HEADER */}
        <div className='flex flex-col justify-between gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='font-semibold text-gray-900'>Employee Requests</h2>

            <p className='mt-1 text-xs text-gray-500'>
              {attendanceDate
                ? `${totalRecords} requests on ${formatDate(attendanceDate)}`
                : `${totalRecords} total requests`}
            </p>
          </div>

          {attendanceDate && (
            <span className='inline-flex w-fit items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700'>
              {formatDate(attendanceDate)}
            </span>
          )}
        </div>

        {/* TABLE SCROLL */}
        <div className='w-full overflow-x-auto'>
          <table className='w-full min-w-[1100px] table-fixed text-left'>
            <colgroup>
              <col className='w-[21%]' />
              <col className='w-[14%]' />
              <col className='w-[17%]' />
              <col className='w-[14%]' />
              <col className='w-[14%]' />
              <col className='w-[13%]' />
              <col className='w-[7%]' />
            </colgroup>

            <thead className='bg-gray-50'>
              <tr className='border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                <th className='px-5 py-4'>Employee</th>
                <th className='px-5 py-4'>Attendance Date</th>
                <th className='px-5 py-4'>Reason</th>
                <th className='px-5 py-4'>Requested Status</th>
                <th className='px-5 py-4'>Request Status</th>
                <th className='px-5 py-4'>Submitted On</th>
                <th className='px-5 py-4 text-center'>Action</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {loading.getAllRequests ? (
                <tr>
                  <td colSpan={7} className='px-5 py-16 text-center'>
                    <RefreshCw
                      size={25}
                      className='mx-auto animate-spin text-blue-600'
                    />

                    <p className='mt-3 text-sm text-gray-500'>
                      Loading regularization requests...
                    </p>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className='px-5 py-16 text-center'>
                    <FileText size={36} className='mx-auto text-gray-300' />

                    <p className='mt-3 font-medium text-gray-700'>
                      No requests found
                    </p>

                    <p className='mt-1 text-sm text-gray-500'>
                      {attendanceDate
                        ? `No requests found for ${formatDate(attendanceDate)}.`
                        : 'No regularization requests match your filters.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map(request => (
                  <tr key={request._id} className='transition hover:bg-gray-50'>
                    {/* EMPLOYEE */}
                    <td className='px-5 py-4'>
                      <div className='flex min-w-0 items-center gap-3'>
                        <div className='flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-blue-50 text-blue-600'>
                          {getEmployeeImage(request.employee) ? (
                            <img
                              src={getEmployeeImage(request.employee)}
                              alt={getEmployeeName(request.employee)}
                              className='h-full w-full object-cover'
                              onError={e => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <User size={20} />
                          )}
                        </div>

                        <div className='min-w-0'>
                          <p
                            className='truncate text-sm font-semibold text-gray-800'
                            title={getEmployeeName(request.employee)}
                          >
                            {getEmployeeName(request.employee)}
                          </p>

                          <p className='mt-1 truncate text-xs text-gray-500'>
                            ID: {getEmployeeId(request.employee)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ATTENDANCE DATE */}
                    <td className='px-5 py-4 text-sm text-gray-700'>
                      {formatDate(request.attendanceDate)}
                    </td>

                    {/* REASON */}
                    <td className='px-5 py-4'>
                      <p
                        className='truncate text-sm text-gray-600'
                        title={request.reason || ''}
                      >
                        {request.reason || '-'}
                      </p>
                    </td>

                    {/* REQUESTED STATUS */}
                    <td className='px-5 py-4'>
                      <span className='inline-flex whitespace-nowrap rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium capitalize text-blue-700'>
                        {getRequestedStatusLabel(request.requestedStatus)}
                      </span>
                    </td>

                    {/* REQUEST STATUS */}
                    <td className='px-5 py-4'>
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status || 'Pending'}
                      </span>
                    </td>

                    {/* SUBMITTED ON */}
                    <td className='px-5 py-4 text-sm text-gray-600'>
                      {formatDate(request.createdAt)}
                    </td>

                    {/* ACTION BUTTON */}
                    <td className='px-5 py-4 text-center'>
                      <button
                        type='button'
                        onClick={e => toggleActionMenu(e, request)}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800'
                        aria-label='Open request actions'
                      >
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading.getAllRequests && allRequests.length > 0 && (
          <div className='flex flex-col justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center'>
            <p className='text-xs text-gray-500'>
              Page {allRequestsPagination?.currentPage || currentPage} of{' '}
              {totalPages}
            </p>

            <Pagination
              currentPage={allRequestsPagination?.currentPage || currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* --------------------------------------------------
          ACTION MENU - OUTSIDE TABLE USING PORTAL
      -------------------------------------------------- */}

      {openActionId &&
        menuPosition &&
        createPortal(
          <>
            <button
              type='button'
              aria-label='Close action menu'
              className='fixed inset-0 z-[9998] cursor-default'
              onClick={closeActionMenu}
            />

            <div
              className='fixed z-[9999] w-[190px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-2xl'
              style={{
                top: menuPosition.top,
                left: menuPosition.left
              }}
            >
              <button
                type='button'
                onClick={() => {
                  const request = allRequests.find(
                    item => item._id === openActionId
                  )

                  if (request) handleViewDetails(request)
                }}
                className='flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50'
              >
                <Eye size={17} />
                View Details
              </button>

              {(() => {
                const request = allRequests.find(
                  item => item._id === openActionId
                )

                if (request?.status !== 'pending') return null

                return (
                  <>
                    <button
                      type='button'
                      disabled={reviewLoading}
                      onClick={() => handleApprove(request)}
                      className='flex w-full items-center gap-3 px-4 py-3 text-sm text-green-700 transition hover:bg-green-50 disabled:opacity-50'
                    >
                      <CheckCircle size={17} />
                      Approve
                    </button>

                    <button
                      type='button'
                      disabled={reviewLoading}
                      onClick={() => openRejectModal(request)}
                      className='flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50'
                    >
                      <XCircle size={17} />
                      Reject
                    </button>
                  </>
                )
              })()}
            </div>
          </>,
          document.body
        )}

      {/* --------------------------------------------------
          VIEW DETAILS MODAL
      -------------------------------------------------- */}

      <Modal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        title='Regularization Request Details'
        size='lg'
      >
        <RegularizationDetailsModal request={selectedRequest} />
      </Modal>

      {/* --------------------------------------------------
          REJECT MODAL
      -------------------------------------------------- */}

      <Modal
        isOpen={showRejectModal}
        onClose={closeRejectModal}
        title='Reject Regularization Request'
        size='md'
      >
        <RegularizationRejectModal
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          handleReject={handleReject}
          reviewLoading={reviewLoading}
          onClose={closeRejectModal}
        />
      </Modal>
    </div>
  )
}

export default RegularizationRequests
