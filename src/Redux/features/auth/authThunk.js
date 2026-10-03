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

export const loginAdmin =
  (formData) =>
    async (dispatch) => {
      try {
        dispatch(authStart());

        const { data } = await api.post(
          "/admin/login",
          formData
        );

        // =====================================================
        // SAVE ADMIN ONLY
        // =====================================================
        //
        // JWT is stored inside HTTP-only cookie by backend.
        // Frontend does NOT receive or store the token.
        //

        dispatch(
          loginSuccess({
            admin: data.data.admin,
          })
        );

        toast.success(
          data.message ||
          "Login successful"
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

export const restoreAdminSession =
  () =>
    async (dispatch) => {
      try {
        dispatch(authStart());

        // =====================================================
        // GET ADMIN PROFILE
        // =====================================================
        //
        // Browser automatically sends the HTTP-only
        // "token" cookie because axios uses:
        //
        // withCredentials: true
        //

        const { data } = await api.get(
          "/admin/profile"
        );

        dispatch(
          sessionRestored({
            admin: data.data,
          })
        );

        return {
          success: true,
        };

      } catch (error) {
        // =====================================================
        // NO VALID SESSION
        // =====================================================

        dispatch(authCheckComplete());

        return {
          success: false,
        };
      }
    };


// =====================================================
// GET ADMIN PROFILE
// =====================================================

export const getAdminProfile =
  () =>
    async (dispatch) => {
      try {
        dispatch(authStart());

        const { data } = await api.get(
          "/admin/profile"
        );

        dispatch(
          sessionRestored({
            admin: data.data,
          })
        );

        return {
          success: true,
          data: data.data,
        };

      } catch (error) {
        const msg =
          error.response?.data?.message ||
          "Failed to load profile";

        dispatch(authFailure(msg));

        return {
          success: false,
          message: msg,
        };
      }
    };


// =====================================================
// UPDATE ADMIN PROFILE
// =====================================================

export const updateAdminProfile =
  (adminId, formData) =>
    async (dispatch) => {
      try {
        dispatch(authStart());

        const { data } =
          await api.put(
            `/admin/profile/${adminId}`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        dispatch(
          sessionRestored({
            admin: data.data,
          })
        );

        toast.success(
          data.message ||
          "Profile updated successfully"
        );

        return {
          success: true,
          data: data.data,
        };

      } catch (error) {
        const msg =
          error.response?.data?.message ||
          "Profile update failed";

        dispatch(authFailure(msg));

        toast.error(msg);

        return {
          success: false,
          message: msg,
        };
      }
    };


// =====================================================
// LOGOUT
// =====================================================

export const logOutAdmin =
  () =>
    async (dispatch) => {
      try {
        const { data } =
          await api.post(
            "/admin/logout"
          );

        // =====================================================
        // BACKEND CLEARS HTTP-ONLY COOKIE
        // =====================================================

        dispatch(logoutSuccess());

        toast.success(
          data.message ||
          "Logout successful"
        );

        return {
          success: true,
        };

      } catch (error) {
        // =====================================================
        // CLEAR REDUX EVEN IF API FAILS
        // =====================================================

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
  (email) =>
    async (dispatch) => {
      try {
        dispatch(authStart());

        const { data } =
          await api.post(
            "/admin/forgot-password",
            {
              email,
            }
          );

        dispatch(
          otpSentSuccess(email)
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
  (email, otp) =>
    async (dispatch) => {
      try {
        dispatch(authStart());

        const { data } =
          await api.post(
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

        const { data } =
          await api.post(
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