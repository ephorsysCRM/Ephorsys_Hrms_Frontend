import { Trash2 } from 'lucide-react'

const DeleteDepartmentModal = ({
  department,
  onClose,
  onConfirm,
  deleting
}) => {
  if (!department) {
    return null
  }

  return (
    <div className='w-full'>
      <div className='text-center'>
        {/* DELETE ICON */}

        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50'>
          <Trash2 size={22} className='text-red-600' />
        </div>

        {/* TITLE */}

        <h2 className='mt-2 text-lg font-semibold text-black'>
          Delete Department?
        </h2>

        {/* MESSAGE */}

        <p className='mt-2 text-sm text-gray-500'>
          Are you sure you want to delete{' '}
          <span className='font-semibold text-black'>
            {department.name}
          </span>
          ?
        </p>

        <p className='mt-1 text-xs text-gray-400'>
          This action cannot be undone.
        </p>
      </div>

      {/* BUTTONS */}

      <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
        {/* CANCEL */}

        <button
          type='button'
          disabled={deleting}
          onClick={onClose}
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

        {/* DELETE */}

        <button
          type='button'
          disabled={deleting}
          onClick={onConfirm}
          className='
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-red-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-red-700
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
          '
        >
          {deleting ? (
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

              Deleting...
            </>
          ) : (
            'Delete Department'
          )}
        </button>
      </div>
    </div>
  )
}

export default DeleteDepartmentModal