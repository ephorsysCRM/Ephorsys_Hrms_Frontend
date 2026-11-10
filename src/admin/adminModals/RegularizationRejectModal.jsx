import React from 'react'
import { RefreshCw, XCircle } from 'lucide-react'

const RegularizationRejectModal = ({
  rejectionReason,
  setRejectionReason,
  handleReject,
  reviewLoading,
  onClose
}) => {
  return (
    <div>
      <p className='mb-4 text-sm text-gray-500'>
        Please provide a reason for rejecting this regularization request.
      </p>

      <label className='mb-2 block text-sm font-medium text-gray-700'>
        Rejection Reason
        <span className='text-red-500'> *</span>
      </label>

      <textarea
        rows={4}
        value={rejectionReason}
        onChange={e => setRejectionReason(e.target.value)}
        placeholder='Enter the reason for rejecting this request...'
        className='w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
      />

      <div className='mt-5 flex justify-end gap-3'>
        <button
          type='button'
          onClick={onClose}
          disabled={reviewLoading}
          className='rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50'
        >
          Cancel
        </button>

        <button
          type='button'
          onClick={handleReject}
          disabled={reviewLoading || !rejectionReason.trim()}
          className='inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {reviewLoading ? (
            <>
              <RefreshCw size={15} className='animate-spin' />
              Processing...
            </>
          ) : (
            <>
              <XCircle size={16} />
              Reject Request
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default RegularizationRejectModal
