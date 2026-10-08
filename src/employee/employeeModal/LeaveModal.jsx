import {
  CalendarDays,
  Clock3,
  Info
} from 'lucide-react'

import { useState } from 'react'

const LeaveModal = ({ onClose }) => {

  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: ''
  })

  const leaveBalances = {
    'Casual Leave': 8,
    'Sick Leave': 7,
    'Earned Leave': 12,
    'Work From Home': 6,
    'Unpaid Leave': 'Unlimited'
  }

  const handleChange = e => {

    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateDays = () => {

    if (!formData.fromDate || !formData.toDate) {
      return 0
    }

    const from = new Date(formData.fromDate)
    const to = new Date(formData.toDate)

    const difference =
      to.getTime() - from.getTime()

    if (difference < 0) {
      return 0
    }

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    )
  }

  const totalDays = calculateDays()

  const handleSubmit = e => {

    e.preventDefault()

    const leaveData = {
      ...formData,
      days: totalDays,
      status: 'Pending'
    }

    console.log('Leave Request:', leaveData)

    // Later:
    // dispatch(applyLeave(leaveData))

    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>

      <div className='space-y-5'>

        {/* Leave Type */}
        <div>

          <label className='mb-2 block text-xs font-semibold text-gray-700'>
            Leave Type
          </label>

          <select
            name='leaveType'
            value={formData.leaveType}
            onChange={handleChange}
            className='w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-black'
          >

            <option value='Casual Leave'>
              Casual Leave
            </option>

            <option value='Sick Leave'>
              Sick Leave
            </option>

            <option value='Earned Leave'>
              Earned Leave
            </option>

            <option value='Work From Home'>
              Work From Home
            </option>

            <option value='Unpaid Leave'>
              Unpaid Leave
            </option>

          </select>

        </div>

        {/* Available Balance */}
        <div className='flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3'>

          <div className='flex items-center gap-3'>

            <div className='flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white'>

              <CalendarDays
                size={17}
                className='text-gray-700'
              />

            </div>

            <div>

              <p className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                Available Balance
              </p>

              <p className='mt-0.5 text-sm font-bold text-black'>

                {leaveBalances[formData.leaveType]}

                {typeof leaveBalances[
                  formData.leaveType
                ] === 'number' && (
                  <span className='ml-1 text-xs font-medium text-gray-400'>
                    days
                  </span>
                )}

              </p>

            </div>

          </div>

        </div>

        {/* Dates */}
        <div>

          <div className='mb-2 flex items-center justify-between'>

            <label className='text-xs font-semibold text-gray-700'>
              Leave Duration
            </label>

            {totalDays > 0 && (
              <span className='text-xs font-semibold text-black'>
                {totalDays}{' '}
                {totalDays === 1
                  ? 'Day'
                  : 'Days'}
              </span>
            )}

          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>

            {/* From */}
            <div>

              <label className='mb-1.5 block text-[11px] font-medium text-gray-500'>
                From Date
              </label>

              <input
                type='date'
                name='fromDate'
                value={formData.fromDate}
                onChange={handleChange}
                required
                className='w-full rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition focus:border-black'
              />

            </div>

            {/* To */}
            <div>

              <label className='mb-1.5 block text-[11px] font-medium text-gray-500'>
                To Date
              </label>

              <input
                type='date'
                name='toDate'
                value={formData.toDate}
                min={formData.fromDate}
                onChange={handleChange}
                required
                className='w-full rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition focus:border-black'
              />

            </div>

          </div>

        </div>

        {/* Duration */}
        <div className='flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3'>

          <Clock3
            size={17}
            className='shrink-0 text-gray-500'
          />

          <p className='text-xs text-gray-500'>

            {totalDays > 0
              ? `You are applying for ${totalDays} ${
                  totalDays === 1
                    ? 'day'
                    : 'days'
                }.`
              : 'Select your leave dates to calculate the duration.'}

          </p>

        </div>

        {/* Reason */}
        <div>

          <label className='mb-2 block text-xs font-semibold text-gray-700'>
            Reason
          </label>

          <textarea
            name='reason'
            value={formData.reason}
            onChange={handleChange}
            required
            rows={4}
            placeholder='Enter the reason for your leave...'
            className='w-full resize-none rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black'
          />

          <p className='mt-1.5 text-[11px] text-gray-400'>
            Please provide a clear reason for your request.
          </p>

        </div>

        {/* Information */}
        <div className='flex gap-3 rounded-lg bg-gray-50 px-4 py-3'>

          <Info
            size={16}
            className='mt-0.5 shrink-0 text-gray-500'
          />

          <p className='text-xs leading-5 text-gray-500'>

            Your leave request will be submitted as

            <span className='font-semibold text-gray-700'>
              {' '}Pending
            </span>

            {' '}until it is reviewed by your manager or HR.

          </p>

        </div>

      </div>

      {/* Footer */}
      <div className='mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5'>

        <button
          type='button'
          onClick={onClose}
          className='rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={
            !formData.fromDate ||
            !formData.toDate ||
            !formData.reason
          }
          className='rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300'
        >
          Submit Leave
        </button>

      </div>

    </form>
  )
}

export default LeaveModal