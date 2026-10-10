import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Hash,
  User,
  XCircle
} from 'lucide-react'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { getDepartment } from '../../Redux/features/department/departmentThunk'

const DepartmentView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { department, fetchingSingle, error } = useSelector(
    state => state.department
  )

  useEffect(() => {
    if (id) {
      dispatch(getDepartment(id))
    }
  }, [dispatch, id])

  if (fetchingSingle) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='px-4 py-6'>
        <button
          onClick={() => navigate(-1)}
          className='mb-5 flex items-center gap-2 text-sm text-gray-600 hover:text-black'
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className='rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600'>
          {error}
        </div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className='px-4 py-6'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-sm text-gray-600 hover:text-black'
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className='mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center'>
          <p className='text-sm text-gray-500'>Department not found</p>
        </div>
      </div>
    )
  }

  const isActive = department.status?.toLowerCase() === 'active'

  const createdDate = department.createdAt
    ? new Date(department.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '-'

  const updatedDate = department.updatedAt
    ? new Date(department.updatedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '-'

  return (
    <div className='min-h-screen bg-gray-50 px-1 py-3 text-black sm:px-6 lg:px-1'>
      {/* Header */}
      <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <button
            onClick={() => navigate(-1)}
            className='mb-3 flex items-center gap-2 text-sm text-gray-500 transition hover:text-black'
          >
            <ArrowLeft size={17} />
            Back to Departments
          </button>

          <h1 className='text-xl font-semibold sm:text-2xl'>
            Department Details
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            View department information
          </p>
        </div>

        {/* Status */}
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
            isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}

          {isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Main Card */}
      <div className='rounded-xl border border-gray-200 bg-white'>
        {/* Department Header */}
        <div className='border-b border-gray-200 p-5 sm:p-6'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white'>
              <Building2 size={23} />
            </div>

            <div className='min-w-0'>
              <h2 className='text-lg font-semibold sm:text-xl'>
                {department.name}
              </h2>

              <p className='mt-1 text-sm text-gray-500'>
                Department Code:{' '}
                <span className='font-medium text-gray-700'>
                  {department.code || '-'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className='p-5 sm:p-6'>
          <h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500'>
            Department Information
          </h3>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Department Name */}
            <div className='rounded-lg border border-gray-200 p-4'>
              <div className='mb-2 flex items-center gap-2 text-gray-500'>
                <Building2 size={17} />
                <span className='text-xs font-medium'>Department Name</span>
              </div>

              <p className='text-sm font-semibold'>{department.name || '-'}</p>
            </div>

            {/* Department Code */}
            <div className='rounded-lg border border-gray-200 p-4'>
              <div className='mb-2 flex items-center gap-2 text-gray-500'>
                <Hash size={17} />
                <span className='text-xs font-medium'>Department Code</span>
              </div>

              <p className='text-sm font-semibold'>{department.code || '-'}</p>
            </div>

            {/* Department Head */}
            <div className='rounded-lg border border-gray-200 p-4'>
              <div className='mb-2 flex items-center gap-2 text-gray-500'>
                <User size={17} />
                <span className='text-xs font-medium'>Department Head</span>
              </div>

              <p className='text-sm font-semibold'>
                {department.departmentHead
                  ? [
                      department.departmentHead.firstName,
                      department.departmentHead.middleName,
                      department.departmentHead.lastName
                    ]
                      .filter(Boolean)
                      .join(' ') || 'Not Assigned'
                  : 'Not Assigned'}
              </p>

              {department.departmentHead?.employeeId && (
                <p className='mt-1 text-xs text-gray-500'>
                  Employee ID: {department.departmentHead.employeeId}
                </p>
              )}

              {department.departmentHead?.officialEmail && (
                <p className='mt-1 break-all text-xs text-gray-500'>
                  {department.departmentHead.officialEmail}
                </p>
              )}
            </div>

            {/* Status */}
            <div className='rounded-lg border border-gray-200 p-4'>
              <div className='mb-2 flex items-center gap-2 text-gray-500'>
                {isActive ? <CheckCircle2 size={17} /> : <XCircle size={17} />}

                <span className='text-xs font-medium'>Status</span>
              </div>

              <p
                className={`text-sm font-semibold ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className='mt-4 rounded-lg border border-gray-200 p-4'>
            <div className='mb-2 flex items-center gap-2 text-gray-500'>
              <FileText size={17} />

              <span className='text-xs font-medium'>Description</span>
            </div>

            <p className='text-sm leading-6 text-gray-700'>
              {department.description || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className='border-t border-gray-200 bg-gray-50 p-5 sm:p-6'>
          <h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500'>
            Record Information
          </h3>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {/* Department ID */}
            <div>
              <p className='mb-1 text-xs text-gray-400'>Department ID</p>

              <p className='break-all text-xs font-medium text-gray-700'>
                {department._id || '-'}
              </p>
            </div>

            {/* Created */}
            <div>
              <div className='mb-1 flex items-center gap-1 text-xs text-gray-400'>
                <CalendarDays size={13} />
                Created On
              </div>

              <p className='text-sm font-medium text-gray-700'>{createdDate}</p>
            </div>

            {/* Updated */}
            <div>
              <div className='mb-1 flex items-center gap-1 text-xs text-gray-400'>
                <CalendarDays size={13} />
                Last Updated
              </div>

              <p className='text-sm font-medium text-gray-700'>{updatedDate}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end border-t border-gray-200 p-4'>
          <button
            onClick={() => navigate(-1)}
            className='rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800'
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default DepartmentView
