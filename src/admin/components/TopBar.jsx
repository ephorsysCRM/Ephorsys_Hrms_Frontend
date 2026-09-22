import {
    Menu,
    User,
    Maximize,
    Minimize,
    Bell,
} from "lucide-react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TopBar = ({ setSidebarOpen }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // =========================================================
    // FULLSCREEN
    // =========================================================
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // =========================================================
    // DETECT FULLSCREEN CHANGE
    // =========================================================
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, []);

    // =========================================================
    // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
    // =========================================================
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".profile-dropdown")) {
                setProfileOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: "easeOut",
            }}
            className="
                relative
                z-10
                bg-white
                border-b
                border-black/10
                px-4
                sm:px-6
                h-16
                flex
                items-center
                justify-between
                shrink-0
            "
        >
            {/* =====================================================
                LEFT SECTION
            ===================================================== */}
            <div className="flex items-center gap-3">

                {/* Mobile Sidebar Button */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    className="
                        lg:hidden
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-black/10
                        text-black/70
                        hover:bg-black
                        hover:text-white
                        transition-all
                        duration-200
                        cursor-pointer
                    "
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open sidebar"
                >
                    <Menu size={18} />
                </motion.button>

                {/* Brand */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -10,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: "easeOut",
                    }}
                >
                    <h1
                        className="
                            text-[15px]
                            sm:text-[16px]
                            font-semibold
                            tracking-[0.18em]
                            text-black
                        "
                    >
                        EPHORSYS
                    </h1>

                    <p
                        className="
                            hidden
                            sm:block
                            text-[9px]
                            uppercase
                            tracking-[0.25em]
                            text-black/40
                            mt-0.5
                        "
                    >
                        HRMS
                    </p>
                </motion.div>
            </div>

            {/* =====================================================
                RIGHT SECTION
            ===================================================== */}
            <div className="flex items-center gap-2 sm:gap-3">

                {/* =================================================
                    FULLSCREEN BUTTON
                ================================================= */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={toggleFullscreen}
                    className="
                        w-9
                        h-9
                        rounded-lg
                        border
                        border-black/10
                        flex
                        items-center
                        justify-center
                        text-black/60
                        hover:bg-black
                        hover:text-white
                        transition-all
                        duration-200
                        cursor-pointer
                    "
                    aria-label="Toggle fullscreen"
                >
                    {isFullscreen ? (
                        <Minimize size={18} />
                    ) : (
                        <Maximize size={18} />
                    )}
                </motion.button>

                {/* =================================================
                    NOTIFICATION BUTTON
                ================================================= */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    className="
                        w-9
                        h-9
                        rounded-lg
                        border
                        border-black/10
                        flex
                        items-center
                        justify-center
                        text-black/60
                        hover:bg-black
                        hover:text-white
                        transition-all
                        duration-200
                        cursor-pointer
                    "
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                </motion.button>

                {/* =================================================
                    PROFILE
                ================================================= */}
                <div className="relative profile-dropdown">

                    {/* Profile Button */}
                    <motion.button
                        onClick={() =>
                            setProfileOpen((prev) => !prev)
                        }
                        whileTap={{ scale: 0.97 }}
                        className="
                            flex
                            items-center
                            gap-2
                            px-1.5
                            sm:px-2
                            py-1
                            rounded-xl
                            hover:bg-black/5
                            transition-all
                            duration-200
                            cursor-pointer
                        "
                    >
                        {/* User Information */}
                        <div className="hidden sm:block text-right">

                            <p
                                className="
                                    text-[13px]
                                    font-medium
                                    text-black
                                    leading-tight
                                "
                            >
                                Admin
                            </p>

                            <p
                                className="
                                    text-[10px]
                                    uppercase
                                    tracking-wider
                                    text-black/40
                                    leading-tight
                                    mt-0.5
                                "
                            >
                                Administrator
                            </p>

                        </div>

                        {/* User Icon */}
                        <div
                            className="
                                w-9
                                h-9
                                rounded-full
                                bg-black
                                border
                                border-black
                                flex
                                items-center
                                justify-center
                                text-white
                            "
                        >
                            <User size={18} />
                        </div>
                    </motion.button>

                    {/* =================================================
                        PROFILE DROPDOWN
                    ================================================= */}
                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -8,
                                    scale: 0.96,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -8,
                                    scale: 0.96,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                }}
                                className="
                                    absolute
                                    right-0
                                    mt-2.5
                                    w-56
                                    bg-white
                                    border
                                    border-black/10
                                    rounded-xl
                                    shadow-lg
                                    overflow-hidden
                                    z-50
                                "
                            >

                                {/* Identity */}
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3.5
                                        border-b
                                        border-black/10
                                    "
                                >
                                    {/* Avatar */}
                                    <div
                                        className="
                                            w-9
                                            h-9
                                            rounded-full
                                            bg-black
                                            flex
                                            items-center
                                            justify-center
                                            text-white
                                            text-[12px]
                                            font-semibold
                                            shrink-0
                                        "
                                    >
                                        AD
                                    </div>

                                    {/* User Details */}
                                    <div>
                                        <p
                                            className="
                                                text-[13px]
                                                font-semibold
                                                text-black
                                            "
                                        >
                                            Admin
                                        </p>

                                        <p
                                            className="
                                                text-[11px]
                                                text-black/40
                                                capitalize
                                                mt-0.5
                                            "
                                        >
                                            Administrator
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
};

export default TopBar;