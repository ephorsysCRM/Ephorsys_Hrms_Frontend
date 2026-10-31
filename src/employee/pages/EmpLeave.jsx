import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  Plus,
  ArrowUpRight,
  BriefcaseBusiness,
  Stethoscope,
  Home
} from 'lucide-react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Modal from '../../UI/Modal'
import LeaveModal from '../employeeModal/LeaveModal'

const Leave = () => {
  const navigate = useNavigate()

  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false)

  const leaveBalances = [
    {
      name: 'Casual Leave',
      shortName: 'CL',
      used: 4,
      total: 12,
      icon: CalendarDays
    },
    {
      name: 'Sick Leave',
      shortName: 'SL',
      used: 3,
      total: 10,
      icon: Stethoscope
    },
  ]

  const leaveRequests = [
    {
      id: 1,
      type: 'Casual Leave',
      from: '10 Oct 2026',
      to: '11 Oct 2026',
      days: 2,
      reason: 'Personal work',
      status: 'Pending'
    },
    {
      id: 2,
      type: 'Sick Leave',
      from: '02 Oct 2026',
      to: '02 Oct 2026',
      days: 1,
      reason: 'Not feeling well',
      status: 'Approved'
    },
    {
      id: 3,
      type: 'Work From Home',
      from: '28 Sep 2026',
      to: '28 Sep 2026',
      days: 1,
      reason: 'Personal work',
      status: 'Rejected'
    }
  ]

  const getStatusStyle = status => {
    if (status === 'Approved') {
      return 'border-green-200 bg-green-50 text-green-700'
    }

    if (status === 'Rejected') {
      return 'border-red-200 bg-red-50 text-red-700'
    }

    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  const handleCloseApplyLeave = () => {
    setApplyLeaveOpen(false)
  }

  return (
    <div className='min-h-screen  p-4 sm:p-6 lg:p-1'>

      {/* Header */}
      <div className='mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between px-2'>

        <div>
          

          <h1 className='text-2xl font-bold tracking-tight text-black sm:text-3xl'>
            Leave Management
          </h1>

          <p className='mt-1.5 text-sm text-gray-500'>
            Manage your leave balance and track your requests.
          </p>
        </div>

        <button
          onClick={() => setApplyLeaveOpen(true)}
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-gray-800'
        >
          <Plus size={18} />
          Apply Leave
        </button>

      </div>

      {/* Summary */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>

        {/* Available */}
        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='flex items-start justify-between'>

            <div>
              <p className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                Available
              </p>

              <p className='mt-3 text-3xl font-bold tracking-tight text-black'>
                17
              </p>

              <p className='mt-1 text-xs text-gray-500'>
                days remaining
              </p>
            </div>

            <div className='rounded-xl bg-gray-100 p-3 text-black'>
              <CalendarDays size={20} />
            </div>

          </div>
        </div>

        {/* Used */}
        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='flex items-start justify-between'>

            <div>
              <p className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                Used
              </p>

              <p className='mt-3 text-3xl font-bold tracking-tight text-black'>
                10
              </p>

              <p className='mt-1 text-xs text-gray-500'>
                days this year
              </p>
            </div>

            <div className='rounded-xl bg-gray-100 p-3 text-black'>
              <CheckCircle2 size={20} />
            </div>

          </div>
        </div>

        {/* Pending */}
        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='flex items-start justify-between'>

            <div>
              <p className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                Pending
              </p>

              <p className='mt-3 text-3xl font-bold tracking-tight text-black'>
                1
              </p>

              <p className='mt-1 text-xs text-gray-500'>
                awaiting approval
              </p>
            </div>

            <div className='rounded-xl bg-gray-100 p-3 text-black'>
              <Clock3 size={20} />
            </div>

          </div>
        </div>

        {/* Rejected */}
        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='flex items-start justify-between'>

            <div>
              <p className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                Rejected
              </p>

              <p className='mt-3 text-3xl font-bold tracking-tight text-black'>
                1
              </p>

              <p className='mt-1 text-xs text-gray-500'>
                requests rejected
              </p>
            </div>

            <div className='rounded-xl bg-gray-100 p-3 text-black'>
              <XCircle size={20} />
            </div>

          </div>
        </div>

      </div>

      {/* Leave Balance */}
      <div className='mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>

        <div className='flex flex-col gap-1 border-b border-gray-100 px-5 py-5 sm:px-6'>

          <h2 className='text-lg font-bold text-black'>
            Leave Balance
          </h2>

          <p className='text-sm text-gray-500'>
            Your current leave entitlement for 2026.
          </p>

        </div>

        <div className='grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6'>

          {leaveBalances.map(leave => {

            const Icon = leave.icon

            const remaining = leave.total - leave.used

            const percentage =
              (remaining / leave.total) * 100

            return (
              <div
                key={leave.name}
                className='rounded-xl border border-gray-200 p-4 transition duration-200 hover:border-gray-300'
              >

                <div className='flex items-center justify-between gap-4'>

                  <div className='flex min-w-0 items-center gap-3'>

                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white'>
                      <Icon size={18} />
                    </div>

                    <div className='min-w-0'>

                      <p className='truncate text-sm font-semibold text-gray-900'>
                        {leave.name}
                      </p>

                      <p className='mt-0.5 text-xs text-gray-500'>
                        {leave.used} used of {leave.total} days
                      </p>

                    </div>

                  </div>

                  <div className='text-right'>

                    <p className='text-lg font-bold text-black'>
                      {remaining}
                    </p>

                    <p className='text-[10px] uppercase tracking-wide text-gray-400'>
                      left
                    </p>

                  </div>

                </div>

               <div className='mt-4 h-4 overflow-hidden rounded-full bg-gray-200'>
  <div
    className={`h-full rounded-full transition-all duration-500 ${
      percentage < 40
        ? 'bg-red-500'
        : percentage < 70
          ? 'bg-yellow-700'
          : 'bg-green-900'
    }`}
    style={{
      width: `${percentage}%`
    }}
  />
</div>
              </div>
            )
          })}

        </div>

      </div>

      {/* Leave Requests */}
      <div className='mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>

        <div className='flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'>

          <div>

            <h2 className='text-lg font-bold text-black'>
              My Leave Requests
            </h2>

            <p className='mt-1 text-sm text-gray-500'>
              Recent leave applications and their status.
            </p>

          </div>

          <button
            onClick={() => setApplyLeaveOpen(true)}
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-black transition hover:underline'
          >
            Apply new leave
            <ArrowUpRight size={16} />
          </button>

        </div>

        {/* Desktop */}
        <div className='hidden overflow-x-auto md:block'>

          <table className='w-full'>

            <thead>

              <tr className='border-b border-gray-100 bg-gray-50/70'>

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

              {leaveRequests.map(request => (

                <tr
                  key={request.id}
                  className='transition hover:bg-gray-50/70'
                >

                  <td className='px-6 py-4'>

                    <p className='text-sm font-semibold text-gray-900'>
                      {request.type}
                    </p>

                  </td>

                  <td className='px-6 py-4'>

                    <p className='text-sm text-gray-700'>
                      {request.from}
                    </p>

                    {request.from !== request.to && (
                      <p className='mt-0.5 text-xs text-gray-400'>
                        to {request.to}
                      </p>
                    )}

                  </td>

                  <td className='px-6 py-4'>

                    <span className='text-sm font-semibold text-gray-900'>
                      {request.days}{' '}
                      {request.days === 1
                        ? 'day'
                        : 'days'}
                    </span>

                  </td>

                  <td className='max-w-[240px] px-6 py-4'>

                    <p className='truncate text-sm text-gray-600'>
                      {request.reason}
                    </p>

                  </td>

                  <td className='px-6 py-4'>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Mobile */}
        <div className='space-y-3 p-4 md:hidden'>

          {leaveRequests.map(request => (

            <div
              key={request.id}
              className='rounded-xl border border-gray-200 p-4'
            >

              <div className='flex items-start justify-between gap-3'>

                <div>

                  <p className='text-sm font-bold text-black'>
                    {request.type}
                  </p>

                  <p className='mt-1 text-xs text-gray-500'>
                    {request.from}

                    {request.from !== request.to &&
                      ` → ${request.to}`}
                  </p>

                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>

              </div>

              <div className='mt-3 flex items-center justify-between border-t border-gray-100 pt-3'>

                <p className='max-w-[70%] truncate text-xs text-gray-500'>
                  {request.reason}
                </p>

                <p className='text-xs font-bold text-black'>
                  {request.days}{' '}
                  {request.days === 1
                    ? 'day'
                    : 'days'}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyLeaveOpen}
        onClose={handleCloseApplyLeave}
        title='Apply Leave'
        size='md'
      >
        <LeaveModal
          onClose={handleCloseApplyLeave}
        />
      </Modal>

    </div>
  )
}

export default Leave