import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { createDepartment } from '../../Redux/features/department/departmentThunk'

const AddDepartment = ({ onClose }) => {
  const dispatch = useDispatch()

  // =====================================================
  // STATES
  // =====================================================

  const [departmentName, setDepartmentName] = useState('')

  const [departmentCode, setDepartmentCode] = useState('')

  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(false)

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setLoading(true)

      const departmentData = {
        name: departmentName.trim(),

        code: departmentCode.trim().toUpperCase(),

        description: description.trim()
      }

      const result = await dispatch(createDepartment(departmentData))

      if (result?.success) {
        setDepartmentName('')

        setDepartmentCode('')

        setDescription('')

        onClose()
      }
    } catch (error) {
      console.error('Create department error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {/* =====================================================
                DEPARTMENT NAME
            ===================================================== */}

      <div>
        <label
          className='
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    '
        >
          Department Name
        </label>

        <input
          type='text'
          value={departmentName}
          onChange={e => setDepartmentName(e.target.value)}
          placeholder='Enter department name'
          className='
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-black
                        focus:ring-1
                        focus:ring-black
                    '
          required
        />
      </div>

      {/* =====================================================
                DEPARTMENT CODE
            ===================================================== */}

      <div>
        <label
          className='
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    '
        >
          Department Code
        </label>

        <input
          type='text'
          value={departmentCode}
          onChange={e => setDepartmentCode(e.target.value)}
          placeholder='Enter department code'
          className='
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-black
                        focus:ring-1
                        focus:ring-black
                    '
          required
        />
      </div>

      {/* =====================================================
                DESCRIPTION
            ===================================================== */}

      <div>
        <label
          className='
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    '
        >
          Department Description
        </label>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='Enter department description'
          rows={4}
          className='
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-black
                        focus:ring-1
                        focus:ring-black
                    '
          required
        />
      </div>

      {/* =====================================================
                BUTTONS
            ===================================================== */}

      <div
        className='
                    flex
                    justify-end
                    gap-3
                    border-t
                    border-gray-100
                    pt-5
                '
      >
        {/* CANCEL */}

        <button
          type='button'
          onClick={onClose}
          disabled={loading}
          className='
                        rounded-xl
                        border
                        border-gray-200
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-gray-100
                        disabled:opacity-50
                    '
        >
          Cancel
        </button>

        {/* SUBMIT */}

        <button
          type='submit'
          disabled={loading}
          className='
                        rounded-xl
                        bg-black
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-gray-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    '
        >
          {loading ? 'Creating...' : 'Add Department'}
        </button>
      </div>
    </form>
  )
}

export default AddDepartment
