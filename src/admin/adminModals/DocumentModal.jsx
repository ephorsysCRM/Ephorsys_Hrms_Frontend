const DocumentModal = ({ document, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

          <h2 className="text-lg font-semibold text-black">
            {document}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* Document Preview */}
        <div className="flex min-h-100 items-center justify-center p-6">

          <p className="text-sm text-gray-500">
            Document preview will appear here
          </p>

        </div>

      </div>

    </div>
  );
};

export default DocumentModal;