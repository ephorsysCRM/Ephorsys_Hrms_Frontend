const DocumentModal = ({ document, onClose }) => {
  const documentName = document?.name || 'Document'
  const documentUrl = document?.url || ''

  const isPdf =
    documentUrl &&
    (documentUrl.toLowerCase().includes('.pdf') ||
      documentUrl.toLowerCase().includes('/raw/upload/'))

  return (
    <div className='w-full'>
      {/* =====================================================
                DOCUMENT INFO
            ===================================================== */}
      <div className='mt-2'>
        <p className='text-sm text-black/50'>Selected Document</p>

        <h3 className='mt-1 text-lg font-semibold text-black'>
          {documentName}
        </h3>
      </div>

      {/* =====================================================
                DOCUMENT PREVIEW
            ===================================================== */}
      <div
        className='
                    mt-5
                    min-h-100
                    overflow-hidden
                    rounded-xl
                    border
                    border-black/10
                    bg-black/5
                '
      >
        {documentUrl ? (
          isPdf ? (
            <iframe
              src={documentUrl}
              title={documentName}
              className='h-125 w-full border-0'
            />
          ) : (
            <div className='flex min-h-100 items-center justify-center p-4'>
              <img
                src={documentUrl}
                alt={documentName}
                className='
                                    max-h-125
                                    max-w-full
                                    rounded-lg
                                    object-contain
                                '
              />
            </div>
          )
        ) : (
          <div className='flex min-h-100 items-center justify-center'>
            <p className='text-sm text-black/50'>Document not uploaded</p>
          </div>
        )}
      </div>

      {/* =====================================================
                ACTION
            ===================================================== */}
      <div className='mt-6 flex justify-end gap-3'>
        {documentUrl && (
          <a
            href={documentUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='
                            flex
                            h-11
                            items-center
                            rounded-xl
                            border
                            border-black/10
                            bg-white
                            px-6
                            text-sm
                            font-semibold
                            text-black
                            transition-all
                            duration-200
                            hover:bg-black/5
                        '
          >
            Open Document
          </a>
        )}

        <button
          type='button'
          onClick={onClose}
          className='
                        h-11
                        rounded-xl
                        bg-black
                        px-6
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        duration-200
                        hover:bg-black/80
                        cursor-pointer
                    '
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default DocumentModal
