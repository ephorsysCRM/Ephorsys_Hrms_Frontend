import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Current authenticated user
    user: null,
    userType: null,
    role: null,

    // Backward compatibility with existing Admin components
    admin: null,

    // Authentication
    loading: false,
    error: null,
    isAuthenticated: false,
    authChecked: false,

    // Forgot password
    otpSent: false,
    otpVerified: false,
    resetEmail: null,
};

const getAuthData = (payload = {}) => {
    const user = payload.user || payload.admin || null;

    const userType =
        payload.userType ||
        (payload.admin
            ? "admin"
            : user?.officialEmail
                ? "employee"
                : user?.email
                    ? "admin"
                    : null);

    return {
        user,
        userType,
        role: payload.role || user?.role || null,
    };
};

const clearUserSession = (state) => {
    state.user = null;
    state.userType = null;
    state.role = null;
    state.admin = null;
    state.isAuthenticated = false;
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        // AUTH START
        authStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        // LOGIN SUCCESS
        loginSuccess: (state, action) => {
            const { user, userType, role } = getAuthData(
                action.payload
            );

            state.loading = false;
            state.error = null;

            state.user = user;
            state.userType = userType;
            state.role = role;
            state.admin = userType === "admin" ? user : null;

            state.isAuthenticated = Boolean(user && userType);
            state.authChecked = true;
        },

        // SESSION RESTORED
        sessionRestored: (state, action) => {
            const { user, userType, role } = getAuthData(
                action.payload
            );

            state.loading = false;
            state.error = null;

            if (!user || !userType) {
                clearUserSession(state);
                state.authChecked = true;
                return;
            }

            state.user = user;
            state.userType = userType;
            state.role = role;
            state.admin = userType === "admin" ? user : null;

            state.isAuthenticated = true;
            state.authChecked = true;
        },

        // AUTH CHECK COMPLETE
        authCheckComplete: (state) => {
            state.loading = false;
            state.authChecked = true;
        },

        // AUTH FAILURE
        authFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        },

        // LOGOUT
        logoutSuccess: (state) => {
            clearUserSession(state);

            state.loading = false;
            state.error = null;
            state.authChecked = true;

            state.otpSent = false;
            state.otpVerified = false;
            state.resetEmail = null;
        },

        // OTP SENT
        otpSentSuccess: (state, action) => {
            state.loading = false;
            state.error = null;

            state.otpSent = true;
            state.otpVerified = false;
            state.resetEmail = action.payload;
        },

        // OTP VERIFIED
        otpVerifiedSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.otpVerified = true;
        },

        // PASSWORD RESET
        passwordResetSuccess: (state) => {
            state.loading = false;
            state.error = null;

            state.otpSent = false;
            state.otpVerified = false;
            state.resetEmail = null;
        },

        // CLEAR ERROR
        clearAuthError: (state) => {
            state.error = null;
        },
    },
});

export const {
    authStart,
    loginSuccess,
    sessionRestored,
    authCheckComplete,
    authFailure,
    logoutSuccess,
    otpSentSuccess,
    otpVerifiedSuccess,
    passwordResetSuccess,
    clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;