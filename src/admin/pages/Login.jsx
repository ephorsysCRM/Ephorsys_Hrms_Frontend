import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import logo from "../../../public/icon.png"
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-border"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.4,
              ease: "easeOut",
            }}
            className="flex justify-center"
          >
            <div className="w-20 h-20   flex items-center justify-center mb-4">
              <img
                src={logo}
                alt="Ephorsys HRMS"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-text-primary">
            EPHORSYS HRMS
          </h1>

          {/* Description */}
          <p className="text-text-muted mt-2 mb-8 text-sm leading-6">
            Sign in to your account to access the Ephorsys HRMS portal.
          </p>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mb-4"
        >
          <label
            htmlFor="email"
            className="block text-text-primary font-medium mb-1"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:border-border-dark transition-colors duration-200"
            placeholder="Enter your email"
          />
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mb-4"
        >
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
              className="w-full border border-border rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-border-dark transition-colors duration-200"
              placeholder="Enter your password"
            />

            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileTap={{ scale: 0.85 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Sign In Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition duration-200 bg-black text-white hover:bg-black/90"
        >
          Sign In
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;