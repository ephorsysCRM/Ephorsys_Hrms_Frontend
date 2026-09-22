import React from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">

        {/* 404 */}
        <div className="relative mb-6">
          <h1 className="text-[140px] sm:text-[180px] font-black leading-none tracking-tighter text-black">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white px-4">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
                Page Not Found
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-black">
            Something went wrong
          </h2>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-black/50">
            The page you are looking for doesn't exist or
            may have been moved to another location.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">

          {/* Go Back */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
                            w-full sm:w-auto
                            h-11
                            px-6
                            rounded-xl
                            border border-black/10
                            bg-white
                            text-black
                            text-sm
                            font-medium
                            flex
                            items-center
                            justify-center
                            gap-2
                            hover:bg-black/5
                            transition-all duration-200
                            cursor-pointer
                        "
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          {/* Dashboard */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="
                            w-full sm:w-auto
                            h-11
                            px-6
                            rounded-xl
                            bg-black
                            text-white
                            text-sm
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                            hover:bg-black/80
                            transition-all duration-200
                            cursor-pointer
                        "
          >
            <Home size={17} />
            Go to Dashboard
          </button>

        </div>

        {/* Bottom Branding */}
        <div className="mt-12">
          <div className="w-10 h-[2px] bg-black mx-auto mb-3" />

          <p className="text-xs font-medium tracking-wider uppercase text-black/30">
            HRMS • Human Resource Management System
          </p>
        </div>

      </div>
    </div>
  );
};

export default NotFound;