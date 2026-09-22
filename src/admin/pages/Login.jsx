import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  loginAdmin,
  sendForgotPasswordOtp,
  verifyForgotOtp,
  resetForgotPassword,
} from "../../Redux/features/auth/authThunk";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [step, setStep] = useState("login");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ------------------------------------------------
  // Animation
  // ------------------------------------------------

  const slideVariants = {
    initial: {
      opacity: 0,
      x: 60,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -60,
    },
  };

  // ------------------------------------------------
  // LOGIN
  // POST /admin/login
  // ------------------------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      loginAdmin({
        email: email.trim(),
        password,
      })
    );

    // Login successful
    // Navigate to Dashboard
    if (result.success) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  };

  // ------------------------------------------------
  // FORGOT PASSWORD
  // POST /admin/forgot-password
  // ------------------------------------------------

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      sendForgotPasswordOtp(email.trim())
    );

    if (result.success) {
      setStep("otp");
    }
  };

  // ------------------------------------------------
  // VERIFY OTP
  // POST /admin/verify-otp
  // ------------------------------------------------

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      verifyForgotOtp(email.trim(), otp)
    );

    if (result.success) {
      setStep("reset");
    }
  };

  // ------------------------------------------------
  // RESET PASSWORD
  // POST /admin/reset-password
  // ------------------------------------------------

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const result = await dispatch(
      resetForgotPassword(
        email.trim(),
        newPassword,
        confirmPassword
      )
    );

    if (result.success) {
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

      setStep("login");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden">
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md border border-border overflow-hidden"
      >
        <div className="p-8">
          {/* Logo */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 flex items-center justify-center mb-4">
              <img
                src="./icon.png"
                alt="Ephorsys HRMS"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Slides */}
          <AnimatePresence mode="wait">

            {/* ================================================= */}
            {/* LOGIN SLIDE */}
            {/* ================================================= */}

            {step === "login" && (
              <motion.div
                key="login"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
              >
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-text-primary">
                    EPHORSYS HRMS
                  </h1>

                  <p className="text-text-muted mt-2 mb-8 text-sm leading-6">
                    Sign in to your account to access the Ephorsys HRMS
                    portal.
                  </p>
                </div>

                <form onSubmit={handleLogin}>
                  {/* Email */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-text-primary font-medium mb-1"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:border-border-dark transition-colors duration-200 disabled:opacity-60"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-2">
                    <label
                      htmlFor="password"
                      className="block text-text-primary font-medium mb-1"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        required
                        disabled={loading}
                        className="w-full border border-border rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-border-dark transition-colors duration-200 disabled:opacity-60"
                        placeholder="Enter your password"
                      />

                      <motion.button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        whileTap={{
                          scale: 0.85,
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      >
                        {showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end mb-5">
                    <button
                      type="button"
                      onClick={() => setStep("forgot")}
                      className="text-sm font-medium text-black hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 transition duration-200 bg-black text-white hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ================================================= */}
            {/* FORGOT PASSWORD SLIDE */}
            {/* ================================================= */}

            {step === "forgot" && (
              <motion.div
                key="forgot"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep("login")}
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-black mb-5"
                >
                  <ArrowLeft size={17} />

                  <span>Back to Login</span>
                </button>

                <div className="text-center mb-7">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Mail size={22} />
                  </div>

                  <h2 className="text-2xl font-bold text-text-primary">
                    Forgot Password?
                  </h2>

                  <p className="text-sm text-text-muted mt-2 leading-6">
                    Enter your registered email address and we will
                    send you an OTP to reset your password.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword}>
                  <div className="mb-5">
                    <label className="block text-text-primary font-medium mb-1">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      disabled={loading}
                      className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:border-border-dark transition-colors duration-200 disabled:opacity-60"
                      placeholder="Enter registered email"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-black text-white hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ================================================= */}
            {/* VERIFY OTP SLIDE */}
            {/* ================================================= */}

            {step === "otp" && (
              <motion.div
                key="otp"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep("forgot")}
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-black mb-5"
                >
                  <ArrowLeft size={17} />
                  <span>Change Email</span>
                </button>

                <div className="text-center mb-7">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <KeyRound size={22} />
                  </div>

                  <h2 className="text-2xl font-bold text-text-primary">
                    Verify OTP
                  </h2>

                  <p className="text-sm text-text-muted mt-2 leading-6">
                    Enter the verification code sent to
                  </p>

                  <p className="text-sm font-semibold text-black mt-1">
                    {email}
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp}>
                  <div className="mb-5">
                    <label className="block text-text-primary font-medium mb-1">
                      OTP
                    </label>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      required
                      maxLength={6}
                      disabled={loading}
                      className="w-full border border-border rounded-md px-3 py-3 text-center text-xl tracking-[10px] font-semibold focus:outline-none focus:border-border-dark disabled:opacity-60"
                      placeholder="000000"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="w-full flex items-center justify-center rounded-lg px-4 py-2.5 bg-black text-white hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </motion.button>

                  <div className="text-center mt-4">
                    <span className="text-sm text-text-muted">
                      Didn't receive OTP?{" "}
                    </span>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleForgotPassword}
                      className="text-sm font-medium text-black hover:underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ================================================= */}
            {/* RESET PASSWORD SLIDE */}
            {/* ================================================= */}

            {step === "reset" && (
              <motion.div
                key="reset"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep("otp")}
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-black mb-5"
                >
                  <ArrowLeft size={17} />
                  <span>Back</span>
                </button>

                <div className="text-center mb-7">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <LockKeyhole size={22} />
                  </div>

                  <h2 className="text-2xl font-bold text-text-primary">
                    Reset Password
                  </h2>

                  <p className="text-sm text-text-muted mt-2 leading-6">
                    Create a new password for your Ephorsys HRMS
                    account.
                  </p>
                </div>

                <form onSubmit={handleResetPassword}>
                  {/* New Password */}
                  <div className="mb-4">
                    <label className="block text-text-primary font-medium mb-1">
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        required
                        disabled={loading}
                        className="w-full border border-border rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-border-dark disabled:opacity-60"
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-black"
                      >
                        {showNewPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-5">
                    <label className="block text-text-primary font-medium mb-1">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        required
                        disabled={loading}
                        className="w-full border border-border rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-border-dark disabled:opacity-60"
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-black"
                      >
                        {showConfirmPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="w-full flex items-center justify-center rounded-lg px-4 py-2.5 bg-black text-white hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Resetting..."
                      : "Reset Password"}
                  </motion.button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;