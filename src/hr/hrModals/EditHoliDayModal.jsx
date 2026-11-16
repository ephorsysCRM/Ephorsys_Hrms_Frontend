const EditHoliDayModal = ({
  formData,
  setFormData,
  closeEditModal,
  handleUpdateHoliday,
  updating
}) => {
  return (
    <div className='space-y-4'>
      {/* HOLIDAY NAME */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          Holiday Name <span className='text-red-500'>*</span>
        </label>

        <input
          type='text'
          value={formData.name}
          onChange={event =>
            setFormData(previous => ({
              ...previous,
              name: event.target.value
            }))
          }
          placeholder='Enter holiday name'
          className='h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-blue-100'
        />
      </div>

      {/* HOLIDAY DATE */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          Holiday Date <span className='text-red-500'>*</span>
        </label>

        <input
          type='date'
          value={formData.date}
          onChange={event =>
            setFormData(previous => ({
              ...previous,
              date: event.target.value
            }))
          }
          className='h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-blue-100'
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          Description <span className='text-red-500'>*</span>
        </label>

        <textarea
          rows={4}
          value={formData.description}
          onChange={event =>
            setFormData(previous => ({
              ...previous,
              description: event.target.value
            }))
          }
          placeholder='Enter holiday description'
          className='w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-blue-100'
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className='flex justify-end gap-2 border-t border-gray-100 pt-4'>
        <button
          type='button'
          onClick={closeEditModal}
          disabled={updating}
          className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
        >
          Cancel
        </button>

        <button
          type='button'
          onClick={handleUpdateHoliday}
          disabled={
            updating ||
            !formData.name.trim() ||
            !formData.date ||
            !formData.description.trim()
          }
          className='rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {updating ? 'Updating...' : 'Update Holiday'}
        </button>
      </div>
    </div>
  )
}

export default EditHoliDayModal
