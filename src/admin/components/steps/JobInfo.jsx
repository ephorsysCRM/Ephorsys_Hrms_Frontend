import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { validateJobInfo } from '../../utils/ValidateJobInfo'
import { getAllDepartments } from '../../../redux/features/department/departmentThunk'

export default function JobInfo ({ data, onChange, errors = {} }) {
  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch()

  const { departments = [], loading: departmentLoading } = useSelector(
    state => state.department
  )

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [fieldErrors, setFieldErrors] = useState({})

  // =====================================================
  // GET ALL DEPARTMENTS
  // =====================================================

  useEffect(() => {
    dispatch(getAllDepartments(1, 100))
  }, [dispatch])

  // =====================================================
  // UPDATE FIELD
  // =====================================================

  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  // =====================================================
  // VALIDATE FIELD
  // =====================================================

  const validateField = field => {
    const validationErrors = validateJobInfo(data)

    setFieldErrors(prev => ({
      ...prev,
      [field]: validationErrors[field] || ''
    }))
  }

  // =====================================================
  // LABEL
  // =====================================================

  const Label = ({ children, required = false }) => (
    <label className='text-sm font-medium text-gray-800'>
      {children}

      {required && <span className='ml-1 text-red-500'>*</span>}
    </label>
  )

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = field => {
    const hasError = errors[field] || fieldErrors[field]

    return `
      mt-2
      w-full
      rounded-lg
      border
      px-3
      py-2
      outline-none
      transition
      ${
        hasError
          ? 'border-red-500 focus:border-red-500'
          : 'border-gray-300 focus:border-black'
      }
    `
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-black'>Job Information</h2>

        <p className='mt-1 text-sm text-gray-500'>
          Enter the employee's job, employment and work-related information.
        </p>
      </div>

      {/* =================================================
          FORM GRID
      ================================================= */}

      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        {/* =================================================
            DEPARTMENT
        ================================================= */}

        <div>
          <Label required>Department</Label>

          <select
            value={data.department || ''}
            onChange={e => update('department', e.target.value)}
            onBlur={() => validateField('department')}
            className={inputClass('department')}
          >
            <option value=''>
              {departmentLoading
                ? 'Loading departments...'
                : 'Select department'}
            </option>

            {/* =============================================
                DYNAMIC DEPARTMENTS
            ============================================= */}

            {!departmentLoading &&
              departments?.map(department => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
          </select>

          {(errors.department || fieldErrors.department) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.department || fieldErrors.department}
            </p>
          )}
        </div>

        {/* =================================================
            DESIGNATION
        ================================================= */}

        <div>
          <Label required>Designation</Label>

          <input
            type='text'
            value={data.designation || ''}
            onChange={e => update('designation', e.target.value)}
            onBlur={() => validateField('designation')}
            placeholder='Enter designation'
            className={inputClass('designation')}
          />

          {(errors.designation || fieldErrors.designation) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.designation || fieldErrors.designation}
            </p>
          )}
        </div>

        {/* =================================================
            ROLE
        ================================================= */}

        <div>
          <Label required>Role</Label>

          <select
            value={data.role || ''}
            onChange={e => update('role', e.target.value)}
            onBlur={() => validateField('role')}
            className={inputClass('role')}
          >
            <option value=''>Select role</option>

            <option value='employee'>Employee</option>

            <option value='hr'>HR</option>

            <option value='manager'>Manager</option>
          </select>

          {(errors.role || fieldErrors.role) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.role || fieldErrors.role}
            </p>
          )}
        </div>

        {/* =================================================
            EMPLOYMENT TYPE
        ================================================= */}

        <div>
          <Label required>Employment Type</Label>

          <select
            value={data.employmentType || ''}
            onChange={e => update('employmentType', e.target.value)}
            onBlur={() => validateField('employmentType')}
            className={inputClass('employmentType')}
          >
            <option value=''>Select employment type</option>

            <option value='full_time'>Full Time</option>

            <option value='part_time'>Part Time</option>

            <option value='intern'>Intern</option>

            <option value='freelancer'>Freelancer</option>

            <option value='contract'>Contract</option>
          </select>

          {(errors.employmentType || fieldErrors.employmentType) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.employmentType || fieldErrors.employmentType}
            </p>
          )}
        </div>

        {/* =================================================
            WORK LOCATION
        ================================================= */}

        <div>
          <Label required>Work Location</Label>

          <input
            type='text'
            value={data.workLocation || ''}
            onChange={e => update('workLocation', e.target.value)}
            onBlur={() => validateField('workLocation')}
            placeholder='Enter work location'
            className={inputClass('workLocation')}
          />

          {(errors.workLocation || fieldErrors.workLocation) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.workLocation || fieldErrors.workLocation}
            </p>
          )}
        </div>

        {/* =================================================
            JOINING DATE
        ================================================= */}

        <div>
          <Label required>Joining Date</Label>

          <input
            type='date'
            value={data.joiningDate || ''}
            onChange={e => update('joiningDate', e.target.value)}
            onBlur={() => validateField('joiningDate')}
            className={inputClass('joiningDate')}
          />

          {(errors.joiningDate || fieldErrors.joiningDate) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.joiningDate || fieldErrors.joiningDate}
            </p>
          )}
        </div>

        {/* =================================================
            PROBATION END DATE
        ================================================= */}

        <div>
          <Label>Probation End Date</Label>

          <input
            type='date'
            value={data.probationEndDate || ''}
            min={data.joiningDate || undefined}
            onChange={e => update('probationEndDate', e.target.value)}
            onBlur={() => validateField('probationEndDate')}
            className={inputClass('probationEndDate')}
          />

          {(errors.probationEndDate || fieldErrors.probationEndDate) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.probationEndDate || fieldErrors.probationEndDate}
            </p>
          )}
        </div>

        {/* =================================================
            SHIFT TIME FROM
        ================================================= */}

        <div>
          <Label>Shift Time From</Label>

          <input
            type='time'
            value={data.shiftFrom || ''}
            onChange={e => update('shiftFrom', e.target.value)}
            onBlur={() => validateField('shiftFrom')}
            className={inputClass('shiftFrom')}
          />
        </div>

        {/* =================================================
            SHIFT TIME TO
        ================================================= */}

        <div>
          <Label>Shift Time To</Label>

          <input
            type='time'
            value={data.shiftTo || ''}
            onChange={e => update('shiftTo', e.target.value)}
            onBlur={() => validateField('shiftTo')}
            className={inputClass('shiftTo')}
          />

          {(errors.shiftTo || fieldErrors.shiftTo) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.shiftTo || fieldErrors.shiftTo}
            </p>
          )}
        </div>

        {/* =================================================
            WORK MODE
        ================================================= */}

        <div>
          <Label required>Work Mode</Label>

          <select
            value={data.workMode || ''}
            onChange={e => update('workMode', e.target.value)}
            onBlur={() => validateField('workMode')}
            className={inputClass('workMode')}
          >
            <option value=''>Select work mode</option>

            <option value='remote'>Remote</option>

            <option value='hybrid'>Hybrid</option>

            <option value='office'>Office</option>
          </select>

          {(errors.workMode || fieldErrors.workMode) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.workMode || fieldErrors.workMode}
            </p>
          )}
        </div>

        {/* =================================================
            EMPLOYMENT STATUS
        ================================================= */}

        <div>
          <Label required>Employment Status</Label>

          <select
            value={data.employmentStatus || ''}
            onChange={e => update('employmentStatus', e.target.value)}
            onBlur={() => validateField('employmentStatus')}
            className={inputClass('employmentStatus')}
          >
            <option value=''>Select employment status</option>

            <option value='active'>Active</option>

            <option value='notice_period'>Notice Period</option>

            <option value='resigned'>Resigned</option>

            <option value='terminated'>Terminated</option>
          </select>

          {(errors.employmentStatus || fieldErrors.employmentStatus) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.employmentStatus || fieldErrors.employmentStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
