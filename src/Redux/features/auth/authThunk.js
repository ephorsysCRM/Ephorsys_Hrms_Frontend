import api from "../../services/api";

import toast from "react-hot-toast";

import {
  authFailure,
  authStart,
  loginSuccess,
  logoutSuccess,
  otpSentSuccess,
  otpVerifiedSuccess,
  passwordResetSuccess,
} from "./authSlice";

// =====================================================
// LOGIN
// =====================================================

export const loginAdmin = (formData) => async (dispatch) => {
  try {
    dispatch(authStart());

    const { data } = await api.post("/admin/login", formData);

    dispatch(loginSuccess(data.data));

    toast.success(data.message || "Login successful");

    return {
      success: true,
    };
  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong";

    dispatch(authFailure(msg));

    toast.error(msg);

    return {
      success: false,
    };
  }
};

// =====================================================
// LOGOUT
// =====================================================

export const logOutAdmin = () => async (dispatch) => {
  try {
    const { data } = await api.post("/admin/logout");

    dispatch(logoutSuccess());

    toast.success(data.message || "Logout successful");

    return {
      success: true,
    };
  } catch (error) {
    const msg = error.response?.data?.message || "Logout failed";

    toast.error(msg);

    return {
      success: false,
    };
  }
};

// =====================================================
// SEND OTP
// =====================================================

export const sendForgotPasswordOtp = (email) => async (dispatch) => {
  try {
    dispatch(authStart());

    const { data } = await api.post("/admin/forgot-password", {
      email,
    });

    dispatch(otpSentSuccess(email));

    toast.success(data.message);

    return {
      success: true,
    };
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to send OTP";

    dispatch(authFailure(msg));

    toast.error(msg);

    return {
      success: false,
    };
  }
};

// =====================================================
// VERIFY OTP
// =====================================================

export const verifyForgotOtp = (email, otp) => async (dispatch) => {
  try {
    dispatch(authStart());

    const { data } = await api.post("/admin/verify-otp", {
      email,
      otp,
    });

    dispatch(otpVerifiedSuccess());

    toast.success(data.message);

    return {
      success: true,
    };
  } catch (error) {
    const msg = error.response?.data?.message || "Invalid OTP";

    dispatch(authFailure(msg));

    toast.error(msg);

    return {
      success: false,
    };
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

export const resetForgotPassword =
  (email, otp, password, confirmPassword) => async (dispatch) => {
    try {
      dispatch(authStart());

      const { data } = await api.post("/admin/reset-password", {
        email,
        otp,
        password,
        confirmPassword,
      });

      dispatch(passwordResetSuccess());

      toast.success(data.message);

      return {
        success: true,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Password reset failed";

      dispatch(authFailure(msg));

      toast.error(msg);

      return {
        success: false,
      };
    }
  };
