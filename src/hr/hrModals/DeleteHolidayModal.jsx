
import React from 'react'

const DeleteHolidayModal = ({
  activeDeleteHoliday,
  closeDeleteModal,
  handleDeleteHoliday,
  deleting
}) => {
  return (
    <div className='space-y-4'>
      {/* CONFIRMATION MESSAGE */}
      <div className='rounded-xl border border-red-100 bg-red-50 p-4'>
        <p className='text-sm font-semibold text-black'>
          Are you sure you want to delete this holiday?
        </p>

        <p className='mt-1 text-xs text-gray-600'>
          <span className='font-semibold'>
            {activeDeleteHoliday?.name || 'This holiday'}
          </span>{' '}
          will be removed from the active holiday list.
        </p>
      </div>

      {/* BUTTONS */}
      <div className='flex justify-end gap-2 border-t border-gray-100 pt-4'>
        <button
          type='button'
          onClick={closeDeleteModal}
          disabled={deleting}
          className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
        >
          Cancel
        </button>

        <button
          type='button'
          onClick={handleDeleteHoliday}
          disabled={deleting}
          className='rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {deleting ? 'Deleting...' : 'Delete Holiday'}
        </button>
      </div>
    </div>
  )
}

export default DeleteHolidayModal
