import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Save, Loader2 } from 'lucide-react'

import { updateEmployeeLeave } from '../../redux/features/employeeLeave/employeeLeaveThunk'

import { clearUpdateEmployeeLeaveState } from '../../redux/features/employeeLeave/employeeLeaveSlice'

const EditLeaveModal = ({
  employee,
  year = new Date().getFullYear(),
  onClose,
  onSubmit
}) => {
  const dispatch = useDispatch()

  const { updateEmployeeLeaveLoading, updateEmployeeLeaveError } = useSelector(
    state => state.employeeLeave
  )

  // =====================================================
  // GET EMPLOYEE LEAVE RECORD
  // =====================================================

  const leaveRecord = employee?.leaveDetails?.find(
    leave => Number(leave.year) === Number(year)
  )

  // =====================================================
  // FORM STATE
  // =====================================================

  const [form, setForm] = useState({
    sickLeave: 0,
    casualLeave: 0,
    workFromHome: 0
  })

  // =====================================================
  // SET EXISTING LEAVE DATA
  // =====================================================

  useEffect(() => {
    if (leaveRecord) {
      setForm({
        sickLeave: leaveRecord.sickLeave?.total ?? 0,
        casualLeave: leaveRecord.casualLeave?.total ?? 0,
        workFromHome: leaveRecord.workFromHome?.total ?? 0
      })
    }
  }, [leaveRecord])

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = e => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // =====================================================
  // UPDATE EMPLOYEE LEAVE
  // =====================================================

  const handleSubmit = async e => {
    e.preventDefault()

    if (!employee?._id || !leaveRecord) {
      return
    }

    dispatch(clearUpdateEmployeeLeaveState())

    const leaveData = {
      sickLeave: Number(form.sickLeave),
      casualLeave: Number(form.casualLeave),
      workFromHome: Number(form.workFromHome)
    }

    const result = await dispatch(
      updateEmployeeLeave(employee._id, year, leaveData)
    )

    if (result?.success) {
      await onSubmit?.(result)
      onClose?.()
    }
  }

  // =====================================================
  // EMPLOYEE DETAILS
  // =====================================================

  const employeeName = employee
    ? [employee.firstName, employee.middleName, employee.lastName]
        .filter(Boolean)
        .join(' ')
    : 'Employee'

  const initials = employeeName
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // =====================================================
  // INPUT STYLES
  // =====================================================

  const inputClass =
    'w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  const labelClass = 'mb-1.5 block text-xs font-medium text-gray-600'

  // =====================================================
  // UI
  // =====================================================

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Employee Details */}
      <div className='flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3'>
        {employee?.profilePhoto ? (
          <img
            src={employee.profilePhoto}
            alt={employeeName}
            className='h-10 w-10 rounded-full object-cover'
          />
        ) : (
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white'>
            {initials}
          </div>
        )}

        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-gray-800'>
            {employeeName}
          </p>

          <p className='mt-0.5 text-xs text-gray-500'>
            {employee?.employeeId || '-'} · {employee?.department?.name || '-'}
          </p>
        </div>
      </div>

      {/* Leave Year */}
      <div>
        <label className={labelClass}>Leave Year</label>

        <input
          type='number'
          value={year}
          disabled
          className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
        />
      </div>

      {/* Leave Inputs */}
      <div className='grid grid-cols-2 gap-3'>
        {/* Sick Leave */}
        <div>
          <label className={labelClass}>Sick Leave (Days)</label>

          <input
            type='number'
            name='sickLeave'
            min={leaveRecord?.sickLeave?.used ?? 0}
            required
            value={form.sickLeave}
            onChange={handleChange}
            className={inputClass}
          />

          <p className='mt-1 text-[11px] text-gray-400'>
            Used: {leaveRecord?.sickLeave?.used ?? 0} days
          </p>
        </div>

        {/* Casual Leave */}
        <div>
          <label className={labelClass}>Casual Leave (Days)</label>

          <input
            type='number'
            name='casualLeave'
            min={leaveRecord?.casualLeave?.used ?? 0}
            required
            value={form.casualLeave}
            onChange={handleChange}
            className={inputClass}
          />

          <p className='mt-1 text-[11px] text-gray-400'>
            Used: {leaveRecord?.casualLeave?.used ?? 0} days
          </p>
        </div>

        {/* Work From Home */}
        <div className='col-span-2'>
          <label className={labelClass}>Work From Home (Days)</label>

          <input
            type='number'
            name='workFromHome'
            min={leaveRecord?.workFromHome?.used ?? 0}
            required
            value={form.workFromHome}
            onChange={handleChange}
            className={inputClass}
          />

          <p className='mt-1 text-[11px] text-gray-400'>
            Used: {leaveRecord?.workFromHome?.used ?? 0} days
          </p>
        </div>
      </div>

      {/* API Error */}
      {updateEmployeeLeaveError && (
        <div className='rounded-lg border border-red-100 bg-red-50 px-3 py-2'>
          <p className='text-xs text-red-600'>{updateEmployeeLeaveError}</p>
        </div>
      )}

      {/* Footer */}
      <div className='flex justify-end gap-2 border-t border-gray-100 pt-3'>
        <button
          type='button'
          onClick={onClose}
          disabled={updateEmployeeLeaveLoading}
          className='rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={
            updateEmployeeLeaveLoading || !employee?._id || !leaveRecord
          }
          className='flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {updateEmployeeLeaveLoading ? (
            <>
              <Loader2 size={14} className='animate-spin' />
              Updating...
            </>
          ) : (
            <>
              <Save size={14} />
              Update Leave
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default EditLeaveModal
