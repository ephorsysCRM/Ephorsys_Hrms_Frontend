import { CalendarDays, Clock3, Info, LoaderCircle } from 'lucide-react'

import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { createAttendanceRequest } from '../../redux/features/attendance/attendanceThunk'

const LeaveModal = ({ onClose }) => {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    setError('')
  }

  const calculateDays = () => {
    if (!formData.fromDate || !formData.toDate) return 0

    // Use UTC date arithmetic to avoid daylight-saving/time differences.
    const from = new Date(`${formData.fromDate}T00:00:00Z`)
    const to = new Date(`${formData.toDate}T00:00:00Z`)

    const difference = to.getTime() - from.getTime()

    if (difference < 0) return 0

    return Math.floor(difference / 86400000) + 1
  }

  const totalDays = calculateDays()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!formData.fromDate || !formData.toDate || !formData.reason.trim()) {
      setError('Please complete all required fields.')
      return
    }

    if (formData.toDate < formData.fromDate) {
      setError('End date cannot be earlier than start date.')
      return
    }

    setLoading(true)

    try {
      const isWorkFromHome = formData.leaveType === 'Work From Home'

      // The current backend contract accepts one date per request.
      // Submit one request for each selected calendar date.
      const dates = []
      const current = new Date(`${formData.fromDate}T00:00:00Z`)
      const last = new Date(`${formData.toDate}T00:00:00Z`)

      while (current <= last) {
        dates.push(current.toISOString().slice(0, 10))
        current.setUTCDate(current.getUTCDate() + 1)
      }

      for (const date of dates) {
        await dispatch(
          createAttendanceRequest({
            date,
            requestType: 'leave',
            dayPart: 'full_day',
            workMode: isWorkFromHome ? 'work_from_home' : 'office',
            reason: `${formData.leaveType}: ${formData.reason.trim()}`
          })
        ).unwrap()
      }

      onClose()
    } catch (err) {
      setError(
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to submit request. Please try again.'
      )
    } finally {
      setLoading(false)
    }
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
            disabled={loading}
            className='w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-black disabled:opacity-60'
          >
            <option value='Casual Leave'>Casual Leave</option>
            <option value='Sick Leave'>Sick Leave</option>
            <option value='Earned Leave'>Earned Leave</option>
            <option value='Work From Home'>Work From Home</option>
            <option value='Unpaid Leave'>Unpaid Leave</option>
          </select>
        </div>

        {/* Available Balance */}
        <div className='flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white'>
              <CalendarDays size={17} className='text-gray-700' />
            </div>

            <div>
              <p className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                Available Balance
              </p>

              <p className='mt-0.5 text-sm font-bold text-black'>
                {leaveBalances[formData.leaveType]}

                {typeof leaveBalances[formData.leaveType] === 'number' && (
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
                {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
              </span>
            )}
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-[11px] font-medium text-gray-500'>
                From Date
              </label>

              <input
                type='date'
                name='fromDate'
                value={formData.fromDate}
                min={new Date().toLocaleDateString('en-CA')}
                onChange={handleChange}
                required
                disabled={loading}
                className='w-full rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition focus:border-black disabled:opacity-60'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-[11px] font-medium text-gray-500'>
                To Date
              </label>

              <input
                type='date'
                name='toDate'
                value={formData.toDate}
                min={
                  formData.fromDate || new Date().toLocaleDateString('en-CA')
                }
                onChange={handleChange}
                required
                disabled={loading}
                className='w-full rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition focus:border-black disabled:opacity-60'
              />
            </div>
          </div>
        </div>

        {/* Duration Information */}
        <div className='flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3'>
          <Clock3 size={17} className='shrink-0 text-gray-500' />

          <p className='text-xs text-gray-500'>
            {totalDays > 0
              ? `You are applying for ${totalDays} ${
                  totalDays === 1 ? 'day' : 'days'
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
            maxLength={1000}
            disabled={loading}
            placeholder='Enter the reason for your request...'
            className='w-full resize-none rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black disabled:opacity-60'
          />

          <p className='mt-1.5 text-[11px] text-gray-400'>
            Please provide a clear reason for your request.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role='alert'
            className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
          >
            {error}
          </div>
        )}

        {/* Information */}
        <div className='flex gap-3 rounded-lg bg-gray-50 px-4 py-3'>
          <Info size={16} className='mt-0.5 shrink-0 text-gray-500' />

          <p className='text-xs leading-5 text-gray-500'>
            Your request will remain{' '}
            <span className='font-semibold text-gray-700'>Pending</span> until
            reviewed by your manager or HR.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5'>
        <button
          type='button'
          onClick={onClose}
          disabled={loading}
          className='rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={
            loading ||
            !formData.fromDate ||
            !formData.toDate ||
            !formData.reason.trim() ||
            totalDays <= 0
          }
          className='inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300'
        >
          {loading && <LoaderCircle size={16} className='animate-spin' />}
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  )
}

export default LeaveModal
