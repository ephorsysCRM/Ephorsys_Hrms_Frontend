import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateDepartment } from '../../Redux/features/department/departmentThunk'

const DepartmentEditModal = ({ department, onClose }) => {
  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch()

  const { updating } = useSelector(state => state.department)

  // =====================================================
  // LOCAL STATES
  // =====================================================

  const [name, setName] = useState('')

  const [code, setCode] = useState('')

  const [description, setDescription] = useState('')

  const [status, setStatus] = useState('active')

  // =====================================================
  // LOAD DEPARTMENT DATA
  // =====================================================

  useEffect(() => {
    if (!department) return

    setName(department.name || '')

    setCode(department.code || '')

    setDescription(department.description || '')

    setStatus(
      department.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active'
    )
  }, [department])

  // =====================================================
  // STATUS TOGGLE
  // =====================================================

  const handleStatusToggle = () => {
    setStatus(previousStatus =>
      previousStatus === 'active' ? 'inactive' : 'active'
    )
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async e => {
    e.preventDefault()

    if (!department?._id) {
      return
    }

    // ================================================
    // UPDATE DATA
    // ================================================

    const departmentData = {
      name,
      code,
      description,
      status
    }

    // ================================================
    // REDUX UPDATE API
    // ================================================

    const result = await dispatch(
      updateDepartment(department._id, departmentData)
    )

    // ================================================
    // CLOSE MODAL AFTER SUCCESS
    // ================================================

    if (result.success) {
      onClose()
    }
  }

  // =====================================================
  // IF NO DEPARTMENT
  // =====================================================

  if (!department) {
    return null
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className='w-full'>
      {/* =================================================
                FORM
            ================================================= */}

      <form onSubmit={handleSubmit}>
        {/* =================================================
                    DEPARTMENT INFORMATION
                ================================================= */}

        <div className='rounded-2xl border border-gray-200 bg-white'>
          {/* HEADER */}

          <div className='border-b border-gray-100 px-5 py-4 sm:px-7'>
            <h2 className='text-lg font-semibold text-black'>
              Update Department
            </h2>

            <p className='mt-1 text-sm text-gray-500'>
              Update department information and status
            </p>
          </div>

          {/* FORM BODY */}

          <div className='space-y-5 px-5 py-5 sm:px-7'>
            {/* =================================================
                            DEPARTMENT NAME
                        ================================================= */}

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Department Name
              </label>

              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Enter department name'
                className='
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-black
                                    outline-none
                                    transition
                                    focus:border-black
                                    focus:bg-white
                                '
              />
            </div>

            {/* =================================================
                            DEPARTMENT CODE
                        ================================================= */}

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Department Code
              </label>

              <input
                type='text'
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder='Enter department code'
                className='
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-black
                                    outline-none
                                    transition
                                    focus:border-black
                                    focus:bg-white
                                '
              />
            </div>

            {/* =================================================
                            DESCRIPTION
                        ================================================= */}

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Description
              </label>

              <textarea
                rows='4'
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Enter department description'
                className='
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-black
                                    outline-none
                                    transition
                                    focus:border-black
                                    focus:bg-white
                                '
              />
            </div>

            {/* =================================================
                            STATUS
                        ================================================= */}

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Status
              </label>

              <div
                className='
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    px-4
                                    py-3
                                '
              >
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    Department Status
                  </p>

                  <p className='mt-1 text-xs text-gray-500'>
                    {status === 'active'
                      ? 'Department is currently active'
                      : 'Department is currently inactive'}
                  </p>
                </div>

                {/* TOGGLE */}

                <button
                  type='button'
                  onClick={handleStatusToggle}
                  disabled={updating}
                  aria-label='Toggle department status'
                  className={`
                                        relative
                                        h-7
                                        w-12
                                        shrink-0
                                        rounded-full
                                        transition-colors
                                        duration-200
                                        ${
                                          status === 'active'
                                            ? 'bg-black'
                                            : 'bg-gray-300'
                                        }
                                        ${
                                          updating
                                            ? 'cursor-not-allowed opacity-60'
                                            : 'cursor-pointer'
                                        }
                                    `}
                >
                  <span
                    className={`
                                            absolute
                                            top-1
                                            h-5
                                            w-5
                                            rounded-full
                                            bg-white
                                            shadow-sm
                                            transition-all
                                            duration-200
                                            ${
                                              status === 'active'
                                                ? 'left-6'
                                                : 'left-1'
                                            }
                                        `}
                  />
                </button>
              </div>

              {/* STATUS LABEL */}

              <div className='mt-2'>
                <span
                  className={`
                                        inline-flex
                                        rounded-full
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        ${
                                          status === 'active'
                                            ? 'bg-gray-100 text-black'
                                            : 'bg-gray-100 text-gray-500'
                                        }
                                    `}
                >
                  {status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* =================================================
                            DEPARTMENT ID
                        ================================================= */}

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Department ID
              </label>

              <div
                className='
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-100
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-gray-500
                                '
              >
                {department._id}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
                    BUTTONS
                ================================================= */}

        <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
          {/* CANCEL */}

          <button
            type='button'
            onClick={onClose}
            disabled={updating}
            className='
                            w-full
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:border-black
                            hover:bg-black
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            sm:w-auto
                        '
          >
            Cancel
          </button>

          {/* SAVE */}

          <button
            type='submit'
            disabled={updating}
            className='
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-black
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-gray-800
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            sm:w-auto
                        '
          >
            {updating ? (
              <>
                <span
                  className='
                                        h-4
                                        w-4
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-white
                                        border-t-transparent
                                    '
                />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DepartmentEditModal
