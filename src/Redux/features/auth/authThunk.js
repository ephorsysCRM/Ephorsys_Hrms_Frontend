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
  sessionRestored,
  authCheckComplete,
} from "./authSlice";

// =====================================================
// LOGIN
// =====================================================

export const loginAdmin = (formData) => async (dispatch) => {
  try {
    dispatch(authStart());

    const { data } = await api.post(
      "/admin/login",
      formData
    );

    dispatch(
      loginSuccess({
        admin: data.data.admin,
        accessToken: data.data.accessToken,
      })
    );

    toast.success(
      data.message || "Login successful"
    );

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      "Login failed";

    dispatch(authFailure(msg));

    toast.error(msg);

    return {
      success: false,
      message: msg,
    };
  }
};

// =====================================================
// RESTORE SESSION
// =====================================================
//
// Called when application starts/reloads.
//
// Refresh token is automatically sent by browser
// because api.js has withCredentials: true.
//

export const restoreAdminSession = () => async (dispatch) => {
  try {
    dispatch(authStart());

    const { data } = await api.post(
      "/admin/refresh-token"
    );

    const accessToken = data.data.accessToken;

    // Fetch current admin profile
    // const profileResponse = await api.get(
    //   "/admin/profile",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );

    dispatch(
      sessionRestored({
        admin: profileResponse.data.data,
        accessToken,
      })
    );

    return {
      success: true,
    };
  } catch (error) {
    dispatch(authCheckComplete());

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
    const { data } = await api.post(
      "/admin/logout"
    );

    dispatch(logoutSuccess());

    toast.success(
      data.message || "Logout successful"
    );

    return {
      success: true,
    };
  } catch (error) {
    // Even if server logout fails,
    // clear frontend authentication state.

    dispatch(logoutSuccess());

    const msg =
      error.response?.data?.message ||
      "Logout failed";

    toast.error(msg);

    return {
      success: false,
      message: msg,
    };
  }
};

// =====================================================
// SEND FORGOT PASSWORD OTP
// =====================================================

export const sendForgotPasswordOtp =
  (email) => async (dispatch) => {
    try {
      dispatch(authStart());

      const { data } = await api.post(
        "/admin/forgot-password",
        {
          email,
        }
      );

      dispatch(
        otpSentSuccess(
          email
        )
      );

      toast.success(
        data.message ||
        "OTP sent successfully"
      );

      return {
        success: true,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to send OTP";

      dispatch(authFailure(msg));

      toast.error(msg);

      return {
        success: false,
        message: msg,
      };
    }
  };

// =====================================================
// VERIFY OTP
// =====================================================

export const verifyForgotOtp =
  (email, otp) => async (dispatch) => {
    try {
      dispatch(authStart());

      const { data } = await api.post(
        "/admin/verify-otp",
        {
          email,
          otp,
        }
      );

      dispatch(
        otpVerifiedSuccess()
      );

      toast.success(
        data.message ||
        "OTP verified successfully"
      );

      return {
        success: true,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Invalid OTP";

      dispatch(authFailure(msg));

      toast.error(msg);

      return {
        success: false,
        message: msg,
      };
    }
  };

// =====================================================
// RESET PASSWORD
// =====================================================

export const resetForgotPassword =
  (
    email,
    newPassword,
    confirmPassword
  ) =>
    async (dispatch) => {
      try {
        dispatch(authStart());

        const { data } = await api.post(
          "/admin/reset-password",
          {
            email,
            newPassword,
            confirmPassword,
          }
        );

        dispatch(
          passwordResetSuccess()
        );

        toast.success(
          data.message ||
          "Password reset successfully"
        );

        return {
          success: true,
        };
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          "Password reset failed";

        dispatch(authFailure(msg));

        toast.error(msg);

        return {
          success: false,
          message: msg,
        };
      }
    };