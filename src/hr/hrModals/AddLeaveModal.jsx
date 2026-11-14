import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Loader2 } from 'lucide-react'

import { createEmployeeLeave } from '../../redux/features/employeeLeave/employeeLeaveThunk'

import { clearCreateEmployeeLeaveState } from '../../redux/features/employeeLeave/employeeLeaveSlice'

const AddLeaveModal = ({ employee, onClose, onSubmit }) => {
  const dispatch = useDispatch()

  const { createEmployeeLeaveLoading, createEmployeeLeaveError } = useSelector(
    state => state.employeeLeave
  )

  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    sickLeave: 10,
    casualLeave: 12,
    workFromHome: 8
  })

  const handleChange = e => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // =====================================================
  // CREATE / ASSIGN EMPLOYEE LEAVE
  // =====================================================

  const handleSubmit = async e => {
    e.preventDefault()

    if (!employee?._id) {
      return
    }

    dispatch(clearCreateEmployeeLeaveState())

    const leaveData = {
      year: Number(form.year),
      sickLeave: Number(form.sickLeave),
      casualLeave: Number(form.casualLeave),
      workFromHome: Number(form.workFromHome)
    }

    const result = await dispatch(createEmployeeLeave(employee._id, leaveData))

    if (result?.success) {
      // Optional parent callback for refreshing employee data
      await onSubmit?.(result)

      onClose?.()
    }
  }

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

  const inputClass =
    'w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  const labelClass = 'mb-1.5 block text-xs font-medium text-gray-600'

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

      {/* Year */}
      <div>
        <label className={labelClass}>Leave Year</label>

        <input
          type='number'
          name='year'
          min='2000'
          max='2100'
          required
          value={form.year}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Leave Inputs */}
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className={labelClass}>Sick Leave (Days)</label>

          <input
            type='number'
            name='sickLeave'
            min='0'
            required
            value={form.sickLeave}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Casual Leave (Days)</label>

          <input
            type='number'
            name='casualLeave'
            min='0'
            required
            value={form.casualLeave}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className='col-span-2'>
          <label className={labelClass}>Work From Home (Days)</label>

          <input
            type='number'
            name='workFromHome'
            min='0'
            required
            value={form.workFromHome}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* API Error */}
      {createEmployeeLeaveError && (
        <div className='rounded-lg border border-red-100 bg-red-50 px-3 py-2'>
          <p className='text-xs text-red-600'>{createEmployeeLeaveError}</p>
        </div>
      )}

      {/* Footer */}
      <div className='flex justify-end gap-2 border-t border-gray-100 pt-3'>
        <button
          type='button'
          onClick={onClose}
          disabled={createEmployeeLeaveLoading}
          className='rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={createEmployeeLeaveLoading || !employee?._id}
          className='flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {createEmployeeLeaveLoading ? (
            <>
              <Loader2 size={14} className='animate-spin' />
              Assigning...
            </>
          ) : (
            <>
              <Plus size={14} />
              Add Leave
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default AddLeaveModal
