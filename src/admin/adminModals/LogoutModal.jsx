import { LogOut, X } from "lucide-react";

const LogoutModal = ({ onClose }) => {
    return (
        <div className="w-full">

            {/* =====================================================
                CONTENT
            ===================================================== */}
            <div className="mt-4 text-center">

                {/* Logout Icon */}
                <div className="
                    mx-auto
                    mb-4
                    w-12
                    h-12
                    rounded-full
                    bg-black
                    flex
                    items-center
                    justify-center
                    text-white
                ">
                    <LogOut size={22} />
                </div>

                {/* Title */}
                <h2 className="
                    text-lg
                    font-semibold
                    text-black
                ">
                    Logout Account
                </h2>

                {/* Description */}
                <p className="
                    text-sm
                    text-black/50
                    mt-1
                    leading-relaxed
                ">
                    Are you sure you want to logout
                    from your account?
                </p>
            </div>

            {/* =====================================================
                ACTIONS
            ===================================================== */}
            <div className="grid grid-cols-2 gap-3 mt-6">

                {/* =================================================
                    CANCEL
                ================================================= */}
                <button
                    type="button"
                    onClick={onClose}
                    className="
                        h-11
                        rounded-xl
                        border
                        border-black/10
                        bg-white
                        hover:bg-black/5
                        text-sm
                        font-medium
                        text-black/70
                        hover:text-black
                        transition-all
                        duration-200
                        cursor-pointer
                        flex
                        items-center
                        justify-center
                        gap-2
                    "
                >
                    <X size={16} />
                    Cancel
                </button>

                {/* =================================================
                    LOGOUT
                ================================================= */}
                <button
                    type="button"
                    className="
                        h-11
                        rounded-xl
                        bg-black
                        hover:bg-black/80
                        text-white
                        text-sm
                        font-semibold
                        transition-all
                        duration-200
                        cursor-pointer
                        flex
                        items-center
                        justify-center
                        gap-2
                    "
                >
                    <LogOut size={16} />
                    Logout
                </button>

            </div>
        </div>
    );
};

export default LogoutModal;