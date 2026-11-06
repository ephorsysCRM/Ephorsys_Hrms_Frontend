import React from 'react'
import { User, CalendarDays, FileText, XCircle } from 'lucide-react'

const RegularizationDetailsModal = ({ request }) => {
  if (!request) return null

  const employee = request.employee

  const employeeName =
    typeof employee === 'object' && employee
      ? [employee.firstName, employee.middleName, employee.lastName]
          .filter(Boolean)
          .join(' ') ||
        employee.name ||
        'Unknown Employee'
      : employee || 'Unknown Employee'

  const employeeId =
    typeof employee === 'object' && employee
      ? employee.employeeId || employee.empId || employee._id || '-'
      : '-'

  const department =
    typeof employee?.department === 'object'
      ? employee.department?.name || '-'
      : employee?.department || '-'

  const formatDate = date => {
    if (!date) return '-'

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
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

    const parsed = new Date(date)

    return Number.isNaN(parsed.getTime())
      ? '-'
      : parsed.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
  }

  const formatDateTime = date => {
    if (!date) return '-'

    const parsed = new Date(date)

    return Number.isNaN(parsed.getTime())
      ? '-'
      : parsed.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
  }

  const statusClass = {
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700'
  }

  const requestedStatus = {
    present: 'Present',
    half_day: 'Half Day',
    leave: 'Leave'
  }

  const reviewer = request.reviewedBy

  const reviewerName =
    typeof reviewer === 'object' && reviewer
      ? [reviewer.firstName, reviewer.middleName, reviewer.lastName]
          .filter(Boolean)
          .join(' ') ||
        reviewer.name ||
        '-'
      : reviewer || '-'

  return (
    <div className='space-y-5'>
      {/* Employee Information */}
      <div className='rounded-xl border border-gray-200 p-4'>
        <div className='mb-4 flex items-center gap-2'>
          <User size={18} className='text-blue-600' />
          <h3 className='font-semibold text-gray-900'>Employee Information</h3>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-blue-50'>
            {employee?.profilePhoto ? (
              <img
                src={employee.profilePhoto}
                alt={employeeName}
                className='h-full w-full object-cover'
              />
            ) : (
              <User size={24} className='text-blue-600' />
            )}
          </div>

          <div>
            <p className='font-semibold text-gray-900'>{employeeName}</p>
            <p className='mt-1 text-sm text-gray-500'>ID: {employeeId}</p>
          </div>
        </div>

        <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <p className='text-xs text-gray-500'>Department</p>
            <p className='mt-1 text-sm font-medium text-gray-800'>
              {department}
            </p>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Designation</p>
            <p className='mt-1 text-sm font-medium text-gray-800'>
              {employee?.designation || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Information */}
      <div className='rounded-xl border border-gray-200 p-4'>
        <div className='mb-4 flex items-center gap-2'>
          <CalendarDays size={18} className='text-blue-600' />
          <h3 className='font-semibold text-gray-900'>
            Attendance Information
          </h3>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <p className='text-xs text-gray-500'>Attendance Date</p>
            <p className='mt-1 text-sm font-medium text-gray-800'>
              {formatDate(request.attendanceDate)}
            </p>
          </div>

          <div>
            <p className='text-xs text-gray-500'>Requested Status</p>
            <p className='mt-1 text-sm font-medium text-gray-800'>
              {requestedStatus[request.requestedStatus] ||
                request.requestedStatus ||
                '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className='rounded-xl border border-gray-200 p-4'>
        <div className='mb-3 flex items-center gap-2'>
          <FileText size={18} className='text-blue-600' />
          <h3 className='font-semibold text-gray-900'>Request Reason</h3>
        </div>

        <p className='whitespace-pre-wrap text-sm leading-6 text-gray-700'>
          {request.reason || 'No reason provided.'}
        </p>
      </div>

      {/* Request Status */}
      <div className='rounded-xl border border-gray-200 p-4'>
        <h3 className='mb-3 font-semibold text-gray-900'>Request Status</h3>

        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
            statusClass[request.status] || statusClass.pending
          }`}
        >
          {request.status || 'Pending'}
        </span>

        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
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

          {request.reviewedBy && (
            <div className='sm:col-span-2'>
              <p className='text-xs text-gray-500'>Reviewed By</p>
              <p className='mt-1 text-sm font-medium text-gray-800'>
                {reviewerName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason */}
      {request.status === 'rejected' && (
        <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
          <div className='mb-2 flex items-center gap-2'>
            <XCircle size={18} className='text-red-600' />
            <h3 className='font-semibold text-red-800'>Rejection Reason</h3>
          </div>

          <p className='whitespace-pre-wrap text-sm leading-6 text-red-700'>
            {request.rejectionReason || 'No rejection reason provided.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default RegularizationDetailsModal
