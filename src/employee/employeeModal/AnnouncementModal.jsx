import {
  CalendarDays,
  Clock3,
  MapPin
} from 'lucide-react'

const AnnouncementModal = ({ announcement, onClose }) => {
  if (!announcement) return null

  return (
    <div className='space-y-5'>

      {/* Category */}
      <div className='flex flex-wrap gap-2'>
        <span className='rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700'>
          {announcement.category}
        </span>

        {announcement.priority && (
          <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'>
            {announcement.priority}
          </span>
        )}
      </div>

      {/* Title and Description */}
      <div>
        <h3 className='text-lg font-bold leading-7 text-gray-900'>
          {announcement.title}
        </h3>

        <p className='mt-3 whitespace-pre-line text-sm leading-6 text-gray-600'>
          {announcement.description ||
            announcement.message ||
            'No additional details available.'}
        </p>
      </div>

      {/* Date and Time */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>

        <div className='flex items-start gap-3 rounded-xl border border-gray-200 p-4'>
          <CalendarDays
            size={18}
            className='mt-0.5 shrink-0 text-gray-500'
          />

          <div>
            <p className='text-xs font-medium text-gray-400'>
              Date
            </p>

            <p className='mt-1 text-sm font-semibold text-gray-800'>
              {announcement.date}
            </p>
          </div>
        </div>

        <div className='flex items-start gap-3 rounded-xl border border-gray-200 p-4'>
          <Clock3
            size={18}
            className='mt-0.5 shrink-0 text-gray-500'
          />

          <div>
            <p className='text-xs font-medium text-gray-400'>
              Time
            </p>

            <p className='mt-1 text-sm font-semibold text-gray-800'>
              {announcement.time || 'Not specified'}
            </p>
          </div>
        </div>

      </div>

      {/* Location */}
      {announcement.location && (
        <div className='flex items-start gap-3 rounded-xl border border-gray-200 p-4'>
          <MapPin
            size={18}
            className='mt-0.5 shrink-0 text-gray-500'
          />

          <div>
            <p className='text-xs font-medium text-gray-400'>
              Location
            </p>

            <p className='mt-1 text-sm font-semibold text-gray-800'>
              {announcement.location}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className='flex justify-end gap-3 border-t border-gray-100 pt-5'>
        <button
          type='button'
          onClick={onClose}
          className='rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
        >
          Cancel
        </button>

        <button
          type='button'
          onClick={onClose}
          className='rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800'
        >
          Close
        </button>
      </div>

    </div>
  )
}

export default AnnouncementModal