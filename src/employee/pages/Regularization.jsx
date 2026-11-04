import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CalendarDays,
  Clock3,
  Search,
  RefreshCw,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  X,
  LoaderCircle,
  UserRound,
  MessageSquareText
} from 'lucide-react'

import { getMyRegularization } from '../../redux/features/regularization/regularizationThunk'

// ======================================================
// Helpers
// ======================================================

const formatDate = date => {
  if (!date) return '--'

  const parsedDate = new Date(`${String(date).slice(0, 10)}T12:00:00`)

  if (Number.isNaN(parsedDate.getTime())) return '--'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(parsedDate)
}

const formatDateTime = date => {
  if (!date) return '--'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return '--'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsedDate)
}

const formatStatus = status => {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  }

  return labels[String(status || '').toLowerCase()] || status || '--'
}

const formatRequestedStatus = status => {
  const labels = {
    present: 'Present',
    half_day: 'Half Day',
    leave: 'Leave'
  }

  return labels[String(status || '').toLowerCase()] || status || '--'
}

const getStatusStyle = status => {
  const styles = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200'
  }

  return (
    styles[String(status || '').toLowerCase()] ||
    'bg-gray-100 text-gray-600 border-gray-200'
  )
}

const getStatusIcon = status => {
  switch (String(status || '').toLowerCase()) {
    case 'approved':
      return CheckCircle2

    case 'rejected':
      return XCircle

    default:
      return Clock3
  }
}

// ======================================================
// Reusable Components
// ======================================================

const StatusBadge = ({ status }) => {
  const Icon = getStatusIcon(status)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
        status
      )}`}
    >
      <Icon size={13} />
      {formatStatus(status)}
    </span>
  )
}

const StatCard = ({ title, value, icon: Icon, iconStyle }) => (
  <div className='rounded-2xl border border-gray-200 bg-white p-4 sm:p-5'>
    <div className='flex items-center justify-between gap-3'>
      <div>
        <p className='text-sm font-medium text-gray-500'>{title}</p>

        <p className='mt-2 text-2xl font-bold text-gray-900'>{value}</p>
      </div>

      <div className={`rounded-xl p-3 ${iconStyle}`}>
        <Icon size={21} />
      </div>
    </div>
  </div>
)

const EmptyState = () => (
  <div className='flex flex-col items-center justify-center px-4 py-14 text-center'>
    <div className='rounded-2xl bg-gray-100 p-4'>
      <FileText size={30} className='text-gray-400' />
    </div>

    <h3 className='mt-4 text-base font-semibold text-gray-900'>
      No regularization requests found
    </h3>

    <p className='mt-1 max-w-sm text-sm text-gray-500'>
      Your attendance regularization requests will appear here once submitted.
    </p>
  </div>
)

// ======================================================
// Request Details Modal
// ======================================================

const RequestDetailsModal = ({ request, onClose }) => {
  if (!request) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px]'
      onClick={onClose}
    >
      <div
        className='w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl'
        onClick={event => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between border-b border-gray-100 px-5 py-4'>
          <div>
            <h2 className='text-lg font-bold text-gray-900'>Request Details</h2>

            <p className='mt-0.5 text-xs text-gray-500'>
              Attendance regularization information
            </p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900'
          >
            <X size={19} />
          </button>
        </div>

        {/* Modal Body */}
        <div className='space-y-5 p-5'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='rounded-xl bg-gray-50 p-3'>
              <p className='text-xs text-gray-500'>Attendance Date</p>

              <p className='mt-1 text-sm font-semibold text-gray-900'>
                {formatDate(request.attendanceDate)}
              </p>
            </div>

            <div className='rounded-xl bg-gray-50 p-3'>
              <p className='text-xs text-gray-500'>Requested Status</p>

              <p className='mt-1 text-sm font-semibold text-gray-900'>
                {formatRequestedStatus(request.requestedStatus)}
              </p>
            </div>
          </div>

          <div>
            <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
              Request Status
            </p>

            <StatusBadge status={request.status} />
          </div>

          <div>
            <div className='mb-2 flex items-center gap-2'>
              <MessageSquareText size={16} className='text-gray-500' />

              <p className='text-sm font-semibold text-gray-900'>Reason</p>
            </div>

            <div className='rounded-xl border border-gray-200 bg-gray-50 p-3'>
              <p className='whitespace-pre-wrap text-sm leading-6 text-gray-700'>
                {request.reason || '--'}
              </p>
            </div>
          </div>

          {String(request.status).toLowerCase() === 'rejected' && (
            <div>
              <div className='mb-2 flex items-center gap-2'>
                <AlertCircle size={16} className='text-red-500' />

                <p className='text-sm font-semibold text-red-700'>
                  Rejection Reason
                </p>
              </div>

              <div className='rounded-xl border border-red-100 bg-red-50 p-3'>
                <p className='whitespace-pre-wrap text-sm leading-6 text-red-700'>
                  {request.rejectionReason || 'No rejection reason provided.'}
                </p>
              </div>
            </div>
          )}

          <div className='grid grid-cols-2 gap-3 border-t border-gray-100 pt-4'>
            <div>
              <p className='text-xs text-gray-500'>Submitted On</p>

              <p className='mt-1 text-sm font-medium text-gray-800'>
                {formatDateTime(request.createdAt)}
              </p>
            </div>

            <div>
              <p className='text-xs text-gray-500'>Reviewed On</p>

              <p className='mt-1 text-sm font-medium text-gray-800'>
                {formatDateTime(request.reviewedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className='flex justify-end border-t border-gray-100 px-5 py-4'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ======================================================
// Main Employee Regularization Page
// ======================================================

const Regularization = () => {
  const dispatch = useDispatch()

  const {
    myRequests = [],
    myRequestsPagination,
    loading,
    error
  } = useSelector(state => state.regularization || {})

  const isLoading = loading?.getMyRequests || false
  const requestError = error?.getMyRequests

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)

  // ======================================================
  // Fetch Employee's Own Regularization Requests
  // ======================================================

  const fetchRequests = () => {
    dispatch(
      getMyRegularization({
        page: 1,
        limit: 100
      })
    )
  }

  useEffect(() => {
    fetchRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // ======================================================
  // Statistics
  // ======================================================

  const stats = useMemo(() => {
    const requests = Array.isArray(myRequests) ? myRequests : []

    return {
      total: requests.length,
      pending: requests.filter(
        item => String(item.status).toLowerCase() === 'pending'
      ).length,
      approved: requests.filter(
        item => String(item.status).toLowerCase() === 'approved'
      ).length,
      rejected: requests.filter(
        item => String(item.status).toLowerCase() === 'rejected'
      ).length
    }
  }, [myRequests])

  // ======================================================
  // Search and Status Filter
  // ======================================================

  const filteredRequests = useMemo(() => {
    const requests = Array.isArray(myRequests) ? myRequests : []

    return requests.filter(request => {
      const searchValue = search.toLowerCase().trim()

      const matchesSearch =
        !searchValue ||
        String(request.reason || '')
          .toLowerCase()
          .includes(searchValue) ||
        String(request.attendanceDate || '')
          .toLowerCase()
          .includes(searchValue) ||
        String(request.requestedStatus || '')
          .toLowerCase()
          .includes(searchValue)

      const matchesStatus =
        statusFilter === 'all' ||
        String(request.status || '').toLowerCase() === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [myRequests, search, statusFilter])

  // ======================================================
  // Loading State
  // ======================================================

  if (isLoading && !myRequests.length) {
    return (
      <div className='mx-auto w-full max-w-[1500px] space-y-6 py-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
            Attendance Regularization
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            Track your attendance correction requests.
          </p>
        </div>

        <div className='flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white'>
          <div className='flex items-center gap-3 text-sm text-gray-500'>
            <LoaderCircle size={20} className='animate-spin' />
            Loading your requests...
          </div>
        </div>
      </div>
    )
  }

  // ======================================================
  // Main UI
  // ======================================================

  return (
    <div className='mx-auto w-full max-w-[1500px] space-y-6 py-2'>
      {/* Page Header */}
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
            Attendance Regularization
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            Track and monitor your attendance correction requests.
          </p>
        </div>

        <button
          type='button'
          onClick={fetchRequests}
          disabled={isLoading}
          className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {requestError && (
        <div className='flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4'>
          <AlertCircle size={19} className='mt-0.5 shrink-0 text-red-600' />

          <div className='flex-1'>
            <p className='text-sm font-semibold text-red-800'>
              Unable to load regularization requests
            </p>

            <p className='mt-1 text-sm text-red-700'>
              {typeof requestError === 'string'
                ? requestError
                : requestError?.message || 'Something went wrong.'}
            </p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          title='Total Requests'
          value={stats.total}
          icon={FileText}
          iconStyle='bg-gray-100 text-gray-700'
        />

        <StatCard
          title='Pending Requests'
          value={stats.pending}
          icon={Clock3}
          iconStyle='bg-amber-50 text-amber-600'
        />

        <StatCard
          title='Approved Requests'
          value={stats.approved}
          icon={CheckCircle2}
          iconStyle='bg-emerald-50 text-emerald-600'
        />

        <StatCard
          title='Rejected Requests'
          value={stats.rejected}
          icon={XCircle}
          iconStyle='bg-red-50 text-red-600'
        />
      </div>

      {/* Request History */}
      <section className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
        {/* Section Header */}
        <div className='flex flex-col justify-between gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:p-5'>
          <div className='flex items-center gap-3'>
            <div className='rounded-xl bg-gray-100 p-2.5'>
              <CalendarDays size={20} className='text-gray-700' />
            </div>

            <div>
              <h2 className='font-semibold text-gray-900'>
                My Request History
              </h2>

              <p className='text-xs text-gray-500'>
                View your submitted attendance requests
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-2 sm:flex-row'>
            {/* Search */}
            <div className='relative'>
              <Search
                size={16}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              />

              <input
                type='text'
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder='Search requests...'
                className='w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gray-400 sm:w-56'
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
              className='rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-400'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {filteredRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[850px] text-left'>
                <thead className='bg-gray-50'>
                  <tr className='border-b border-gray-100'>
                    <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Attendance Date
                    </th>

                    <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Reason
                    </th>

                    <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Requested Status
                    </th>

                    <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Request Status
                    </th>

                    <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Submitted On
                    </th>

                    <th className='px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-gray-100'>
                  {filteredRequests.map((request, index) => (
                    <tr
                      key={request._id || request.id || index}
                      className='transition hover:bg-gray-50/80'
                    >
                      {/* Attendance Date */}
                      <td className='whitespace-nowrap px-5 py-4'>
                        <div className='flex items-center gap-2'>
                          <CalendarDays size={15} className='text-gray-400' />

                          <span className='text-sm font-medium text-gray-800'>
                            {formatDate(request.attendanceDate)}
                          </span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className='max-w-[250px] px-5 py-4'>
                        <p className='truncate text-sm text-gray-700'>
                          {request.reason || '--'}
                        </p>
                      </td>

                      {/* Requested Status */}
                      <td className='whitespace-nowrap px-5 py-4'>
                        <span className='rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700'>
                          {formatRequestedStatus(request.requestedStatus)}
                        </span>
                      </td>

                      {/* Request Status */}
                      <td className='whitespace-nowrap px-5 py-4'>
                        <StatusBadge status={request.status} />
                      </td>

                      {/* Submitted Date */}
                      <td className='whitespace-nowrap px-5 py-4'>
                        <span className='text-sm text-gray-600'>
                          {formatDate(request.createdAt)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className='whitespace-nowrap px-5 py-4 text-right'>
                        <button
                          type='button'
                          onClick={() => setSelectedRequest(request)}
                          className='inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100'
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className='flex flex-col justify-between gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center'>
              <p className='text-xs text-gray-500'>
                Showing {filteredRequests.length} of {stats.total} requests
              </p>

              <p className='text-xs text-gray-400'>
                {myRequestsPagination?.totalRecords != null
                  ? `Total records: ${myRequestsPagination.totalRecords}`
                  : ''}
              </p>
            </div>
          </>
        )}
      </section>

      {/* Request Details */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  )
}

export default Regularization
