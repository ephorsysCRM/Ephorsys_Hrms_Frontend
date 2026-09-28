const DocumentModal = ({ document, onClose }) => {
    return (
        <div className="w-full">

            {/* =====================================================
                DOCUMENT INFO
            ===================================================== */}
            <div className="mt-2">

                <p className="text-sm text-black/50">
                    Selected Document
                </p>

                <h3 className="mt-1 text-lg font-semibold text-black">
                    {document}
                </h3>

            </div>

            {/* =====================================================
                DOCUMENT PREVIEW
            ===================================================== */}
            <div
                className="
                    mt-5
                    flex
                    min-h-100
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-black/10
                    bg-black/5
                "
            >
                <p className="text-sm text-black/50">
                    Document preview will appear here
                </p>
            </div>

            {/* =====================================================
                ACTION
            ===================================================== */}
            <div className="mt-6 flex justify-end">

                <button
                    type="button"
                    onClick={onClose}
                    className="
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
                    "
                >
                    Close
                </button>

            </div>

        </div>
    );
};

export default DocumentModal;