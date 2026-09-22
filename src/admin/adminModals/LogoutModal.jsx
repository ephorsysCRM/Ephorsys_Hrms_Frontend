import { LogOut, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logOutAdmin } from "../../Redux/features/auth/authThunk";

const LogoutModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        const result = await dispatch(logOutAdmin());

        if (result.success) {
            onClose();

            navigate("/", {
                replace: true,
            });
        }
    };

    return (
        <div className="w-full">

            {/* =====================================================
                CONTENT
            ===================================================== */}
            <div className="mt-4 text-center">

                {/* Logout Icon */}
                <div
                    className="
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
                    "
                >
                    <LogOut size={22} />
                </div>

                {/* Title */}
                <h2
                    className="
                        text-lg
                        font-semibold
                        text-black
                    "
                >
                    Logout Account
                </h2>

                {/* Description */}
                <p
                    className="
                        text-sm
                        text-black/50
                        mt-1
                        leading-relaxed
                    "
                >
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
                    disabled={loading}
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
                        disabled:opacity-50
                        disabled:cursor-not-allowed
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
                    onClick={handleLogout}
                    disabled={loading}
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
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                >
                    <LogOut size={16} />

                    {loading ? "Logging out..." : "Logout"}
                </button>

            </div>
        </div>
    );
};

export default LogoutModal;