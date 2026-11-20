import {
  CalendarDays,
  Clock3,
  Info,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { applyForLeave } from '../../redux/features/employeeLeave/employeeLeaveThunk'

const LeaveModal = ({ onClose }) => {
  const dispatch = useDispatch()

  const getTodayDate = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    leaveType: 'casualLeave',
    fromDate: '',
    toDate: '',
    isHalfDay: false,
    halfDaySession: '',
    reason: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [balanceCheck, setBalanceCheck] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setError('')
    setSuccessMessage('')
  }

  // =====================================================
  // HANDLE HALF DAY
  // =====================================================

  const handleHalfDayChange = e => {
    const checked = e.target.checked

    setFormData(prev => ({
      ...prev,
      isHalfDay: checked,
      toDate: checked ? prev.fromDate : prev.toDate,
      halfDaySession: checked ? 'first_half' : ''
    }))

    setError('')
  }

  // =====================================================
  // HANDLE FROM DATE
  // =====================================================

  const handleFromDateChange = e => {
    const value = e.target.value

    setFormData(prev => ({
      ...prev,
      fromDate: value,
      toDate: prev.isHalfDay ? value : prev.toDate
    }))

    setError('')
  }

  // =====================================================
  // CALCULATE CALENDAR DAYS
  // Backend calculates actual working days.
  // Sundays and active holidays are excluded there.
  // =====================================================

  const calculateDays = () => {
    if (!formData.fromDate || !formData.toDate) {
      return 0
    }

    const from = new Date(`${formData.fromDate}T00:00:00Z`)
    const to = new Date(`${formData.toDate}T00:00:00Z`)

    const difference = to.getTime() - from.getTime()

    if (difference < 0) return 0

    if (formData.isHalfDay) return 0.5

    return Math.floor(difference / 86400000) + 1
  }

  const totalDays = calculateDays()

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      leaveType: 'casualLeave',
      fromDate: '',
      toDate: '',
      isHalfDay: false,
      halfDaySession: '',
      reason: ''
    })

    setError('')
    setBalanceCheck(null)
    setSuccessMessage('')
  }

  // =====================================================
  // SUBMIT LEAVE APPLICATION
  // =====================================================

  const handleSubmit = async e => {
    e.preventDefault()

    setError('')
    setSuccessMessage('')
    setBalanceCheck(null)

    if (!formData.fromDate || !formData.toDate || !formData.reason.trim()) {
      setError('Please complete all required fields.')
      return
    }

    if (formData.toDate < formData.fromDate) {
      setError('To date cannot be earlier than from date.')
      return
    }

    if (formData.isHalfDay) {
      if (!formData.halfDaySession) {
        setError('Please select a half-day session.')
        return
      }

      if (formData.fromDate !== formData.toDate) {
        setError('Half-day leave must be for a single date.')
        return
      }
    }

    setLoading(true)

    try {
      const payload = {
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        isHalfDay: formData.isHalfDay,
        halfDaySession: formData.isHalfDay ? formData.halfDaySession : null,
        reason: formData.reason.trim(),
        attachment: null
      }

      const result = await dispatch(applyForLeave(payload))

      if (!result?.success) {
        throw new Error(
          result?.message || 'Failed to submit leave application.'
        )
      }

      // Store balance check returned by backend.
      setBalanceCheck(result.data?.balanceCheck || null)

      setSuccessMessage(
        result.message || 'Leave application submitted successfully.'
      )

      // Close after successful submission.
      // The parent can refresh the application list.
      onClose()
    } catch (err) {
      setError(err?.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // LEAVE TYPE LABEL
  // =====================================================

  const getLeaveTypeLabel = () => {
    const types = {
      casualLeave: 'Casual Leave',
      sickLeave: 'Sick Leave',
      workFromHome: 'Work From Home'
    }

    return types[formData.leaveType]
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-5'>
        {/* ============================================= */}
        {/* LEAVE TYPE */}
        {/* ============================================= */}

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
            <option value='casualLeave'>Casual Leave</option>
            <option value='sickLeave'>Sick Leave</option>
            <option value='workFromHome'>Work From Home</option>
          </select>
        </div>

        {/* ============================================= */}
        {/* LEAVE INFORMATION */}
        {/* ============================================= */}

        <div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white'>
            <CalendarDays size={17} className='text-gray-700' />
          </div>

          <div>
            <p className='text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
              Selected Leave Type
            </p>

            <p className='mt-0.5 text-sm font-bold text-black'>
              {getLeaveTypeLabel()}
            </p>
          </div>
        </div>

        {/* ============================================= */}
        {/* HALF DAY OPTION */}
        {/* ============================================= */}

        <div className='rounded-xl border border-gray-200 p-4'>
          <label className='flex cursor-pointer items-center justify-between gap-3'>
            <div>
              <p className='text-sm font-semibold text-gray-800'>
                Apply for Half Day
              </p>

              <p className='mt-1 text-xs text-gray-500'>
                Select this option if you need leave for half a day.
              </p>
            </div>

            <input
              type='checkbox'
              checked={formData.isHalfDay}
              onChange={handleHalfDayChange}
              disabled={loading}
              className='h-4 w-4 accent-black'
            />
          </label>

          {formData.isHalfDay && (
            <div className='mt-4 border-t border-gray-100 pt-4'>
              <label className='mb-2 block text-xs font-semibold text-gray-700'>
                Half Day Session
              </label>

              <select
                name='halfDaySession'
                value={formData.halfDaySession}
                onChange={handleChange}
                disabled={loading}
                required
                className='w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-black disabled:opacity-60'
              >
                <option value='first_half'>First Half</option>
                <option value='second_half'>Second Half</option>
              </select>
            </div>
          )}
        </div>

        {/* ============================================= */}
        {/* LEAVE DURATION */}
        {/* ============================================= */}

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
            {/* FROM DATE */}

            <div>
              <label className='mb-1.5 block text-[11px] font-medium text-gray-500'>
                From Date
              </label>

              <input
                type='date'
                name='fromDate'
                value={formData.fromDate}
                min={getTodayDate()}
                onChange={handleFromDateChange}
                required
                disabled={loading}
                className='w-full rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition focus:border-black disabled:opacity-60'
              />
            </div>

            {/* TO DATE */}

            <div>
              <label className='mb-1.5 block text-[11px] font-medium text-gray-500'>
                To Date
              </label>

              <input
                type='date'
                name='toDate'
                value={formData.toDate}
                min={formData.fromDate || getTodayDate()}
                onChange={handleChange}
                required
                disabled={loading || formData.isHalfDay}
                className='w-full rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60'
              />
            </div>
          </div>
        </div>

        {/* ============================================= */}
        {/* DURATION INFORMATION */}
        {/* ============================================= */}

        <div className='flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3'>
          <Clock3 size={17} className='shrink-0 text-gray-500' />

          <p className='text-xs leading-5 text-gray-500'>
            {totalDays > 0
              ? `Selected duration: ${totalDays} ${
                  totalDays === 1 ? 'day' : 'days'
                }. Final working days will be calculated by the server after excluding Sundays and active holidays.`
              : 'Select your leave dates to calculate the duration.'}
          </p>
        </div>

        {/* ============================================= */}
        {/* REASON */}
        {/* ============================================= */}

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
            placeholder='Enter the reason for your leave application...'
            className='w-full resize-none rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black disabled:opacity-60'
          />

          <p className='mt-1.5 text-[11px] text-gray-400'>
            Please provide a clear reason for your request.
          </p>
        </div>

        {/* ============================================= */}
        {/* BALANCE CHECK */}
        {/* ============================================= */}

        {balanceCheck && (
          <div
            className={`rounded-lg border px-4 py-3 ${
              balanceCheck.sufficient
                ? 'border-green-200 bg-green-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div className='flex items-start gap-2'>
              {balanceCheck.sufficient ? (
                <CheckCircle2 size={17} className='mt-0.5 text-green-600' />
              ) : (
                <AlertTriangle size={17} className='mt-0.5 text-amber-600' />
              )}

              <div>
                <p
                  className={`text-sm font-semibold ${
                    balanceCheck.sufficient
                      ? 'text-green-700'
                      : 'text-amber-700'
                  }`}
                >
                  {balanceCheck.sufficient
                    ? 'Sufficient Leave Balance'
                    : 'Insufficient Leave Balance'}
                </p>

                <p className='mt-1 text-xs leading-5 text-gray-600'>
                  Required: {balanceCheck.totalRequired} days
                  {' · '}
                  Available: {balanceCheck.totalAvailable} days
                  {' · '}
                  Shortfall: {balanceCheck.shortfall} days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================= */}
        {/* ERROR */}
        {/* ============================================= */}

        {error && (
          <div
            role='alert'
            className='flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
          >
            <AlertCircle size={17} className='mt-0.5 shrink-0' />
            <p>{error}</p>
          </div>
        )}

        {/* ============================================= */}
        {/* INFORMATION */}
        {/* ============================================= */}

        <div className='flex gap-3 rounded-lg bg-gray-50 px-4 py-3'>
          <Info size={16} className='mt-0.5 shrink-0 text-gray-500' />

          <p className='text-xs leading-5 text-gray-500'>
            Your application will be submitted with{' '}
            <span className='font-semibold text-gray-700'>Pending</span> status.
            Your leave balance will not be deducted at the time of application.
          </p>
        </div>
      </div>

      {/* ============================================= */}
      {/* FOOTER */}
      {/* ============================================= */}

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
            totalDays <= 0 ||
            (formData.isHalfDay && !formData.halfDaySession)
          }
          className='inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300'
        >
          {loading && <LoaderCircle size={16} className='animate-spin' />}

          {loading ? 'Submitting...' : 'Apply for Leave'}
        </button>
      </div>
    </form>
  )
}

export default LeaveModal
