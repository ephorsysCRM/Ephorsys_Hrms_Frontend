import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
}) => {

    // Modal Sizes
    const modalSizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-full mx-4",
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Modal Content */}
                    <motion.div
                        className={`w-full ${modalSizes[size]} rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 40 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header — fixed, never scrolls */}
                        <div className="flex items-center justify-between px-6 py-4 shrink-0">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {title}
                            </h2>

                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-2xl cursor-pointer transition hover:text-red-500"
                                >
                                    <X />
                                </button>
                            )}
                        </div>

                        {/* Body — scrollable, hidden scrollbar */}
                        <div
                            className="p-6 overflow-y-auto flex-1"
                            style={{
                                scrollbarWidth: "none",       /* Firefox */
                                msOverflowStyle: "none",      /* IE / Edge */
                            }}
                        >
                            {/* Chrome / Safari hidden scrollbar */}
                            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;



// use 
{/* <Modal
  isOpen={viewOpen}
  onClose={() => setViewOpen(false)}
  title="View Product"
  size="xl"
>
  <ViewProductModal
    productId={selectedProduct?._id}
  />
</Modal> */}