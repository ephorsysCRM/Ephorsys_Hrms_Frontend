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
// HELPER: NORMALIZE PROFILE RESPONSE
// Supports { user, userType, role } and legacy responses
// =====================================================

const normalizeAuthData = (responseData) => {
    const result = responseData?.data;

    if (!result) {
        throw new Error("Invalid response from server");
    }

    // New backend format
    if (result.user && result.userType) {
        return {
            user: result.user,
            userType: result.userType,
            role: result.role || result.user.role,
        };
    }

    // Legacy Admin profile response
    if (result._id && result.email) {
        return {
            user: result,
            userType: "admin",
            role: result.role,
        };
    }

    throw new Error("Invalid authentication data from server");
};

// =====================================================
// LOGIN — ADMIN / SUPER ADMIN / HR / MANAGER / EMPLOYEE
// =====================================================

export const loginAdmin = (formData) => async (dispatch) => {
    try {
        dispatch(authStart());

        const { data } = await api.post(
            "/admin/login",
            formData
        );

        const authData = normalizeAuthData(data);

        dispatch(loginSuccess(authData));

        toast.success(data.message || "Login successful");

        return {
            success: true,
            data: authData,
        };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Login failed";

        dispatch(authFailure(message));
        toast.error(message);

        return {
            success: false,
            message,
        };
    }
};

// =====================================================
// RESTORE SESSION ON APP REFRESH
// HTTP-ONLY COOKIE IS SENT BY THE API CLIENT
// =====================================================

export const restoreAdminSession = () => async (dispatch) => {
    try {
        dispatch(authStart());

        const { data } = await api.get("/admin/profile");
        const authData = normalizeAuthData(data);

        dispatch(sessionRestored(authData));

        return {
            success: true,
            data: authData,
        };
    } catch (error) {
        const status = error.response?.status;

        // Clear Redux identity when the server explicitly rejects
        // the session. For temporary server/network errors, preserve
        // the current state and finish the auth check.
        if (status === 401 || status === 403) {
            dispatch(logoutSuccess());
        } else {
            dispatch(authCheckComplete());
        }

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Session restore failed",
        };
    }
};

// =====================================================
// GET CURRENT USER PROFILE
// =====================================================

export const getAdminProfile = () => async (dispatch) => {
    try {
        const { data } = await api.get("/admin/profile");
        const authData = normalizeAuthData(data);

        dispatch(sessionRestored(authData));

        return {
            success: true,
            data: authData,
        };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Failed to load profile";

        dispatch(authFailure(message));

        return {
            success: false,
            message,
        };
    }
};

// =====================================================
// UPDATE PROFILE
// NOTE: Endpoint and response must support the logged-in
// user type on the backend.
// =====================================================

export const updateAdminProfile =
    (userId, formData) => async (dispatch) => {
        try {
            dispatch(authStart());

            const { data } = await api.put(
                `/ admin / profile / ${ userId } `,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const authData = normalizeAuthData(data);

            dispatch(sessionRestored(authData));

            toast.success(
                data.message || "Profile updated successfully"
            );

            return {
                success: true,
                data: authData,
            };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Profile update failed";

            dispatch(authFailure(message));
            toast.error(message);

            return {
                success: false,
                message,
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

        return { success: true };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Logout failed";

        // Clear local Redux identity even if the request fails.
        dispatch(logoutSuccess());

        toast.error(message);

        return {
            success: false,
            message,
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
                { email }
            );

            dispatch(otpSentSuccess(email));

            toast.success(
                data.message || "OTP sent successfully"
            );

            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to send OTP";

            dispatch(authFailure(message));
            toast.error(message);

            return {
                success: false,
                message,
            };
        }
    };

// =====================================================
// VERIFY FORGOT PASSWORD OTP
// =====================================================

export const verifyForgotOtp =
    (email, otp) => async (dispatch) => {
        try {
            dispatch(authStart());

            const { data } = await api.post(
                "/admin/verify-otp",
                { email, otp }
            );

            dispatch(otpVerifiedSuccess());

            toast.success(
                data.message || "OTP verified successfully"
            );

            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Invalid OTP";

            dispatch(authFailure(message));
            toast.error(message);

            return {
                success: false,
                message,
            };
        }
    };

// =====================================================
// RESET FORGOT PASSWORD
// =====================================================

export const resetForgotPassword =
    (email, newPassword, confirmPassword) =>
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

                dispatch(passwordResetSuccess());

                toast.success(
                    data.message || "Password reset successfully"
                );

                return { success: true };
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Password reset failed";

                dispatch(authFailure(message));
                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };