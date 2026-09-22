import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,

    // Access token is kept in Redux memory.
    // Refresh token is stored only in HTTP-only cookie.
    accessToken: null,

    loading: false,
    error: null,
    isAuthenticated: false,

    // Used while checking existing session
    authChecked: false,

    // Forgot Password
    otpSent: false,
    otpVerified: false,
    resetEmail: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        // =====================================================
        // AUTH START
        // =====================================================

        authStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        // =====================================================
        // LOGIN SUCCESS
        // =====================================================

        loginSuccess: (state, action) => {
            state.loading = false;
            state.error = null;

            state.admin = action.payload.admin;
            state.accessToken = action.payload.accessToken;

            state.isAuthenticated = true;
            state.authChecked = true;
        },

        // =====================================================
        // SESSION RESTORED
        // =====================================================

        sessionRestored: (state, action) => {
            state.loading = false;
            state.error = null;

            state.admin = action.payload.admin;
            state.accessToken = action.payload.accessToken;

            state.isAuthenticated = true;
            state.authChecked = true;
        },

        // =====================================================
        // AUTH CHECKED BUT NOT LOGGED IN
        // =====================================================

        authCheckComplete: (state) => {
            state.loading = false;
            state.authChecked = true;
        },

        // =====================================================
        // ACCESS TOKEN UPDATED
        // =====================================================

        accessTokenUpdated: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },

        // =====================================================
        // FAILURE
        // =====================================================

        authFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // =====================================================
        // LOGOUT
        // =====================================================

        logoutSuccess: (state) => {
            state.admin = null;
            state.accessToken = null;

            state.loading = false;
            state.error = null;

            state.isAuthenticated = false;
            state.authChecked = true;

            state.otpSent = false;
            state.otpVerified = false;
            state.resetEmail = null;
        },

        // =====================================================
        // OTP SENT
        // =====================================================

        otpSentSuccess: (state, action) => {
            state.loading = false;
            state.error = null;

            state.otpSent = true;
            state.otpVerified = false;
            state.resetEmail = action.payload;
        },

        // =====================================================
        // OTP VERIFIED
        // =====================================================

        otpVerifiedSuccess: (state) => {
            state.loading = false;
            state.error = null;

            state.otpVerified = true;
        },

        // =====================================================
        // PASSWORD RESET
        // =====================================================

        passwordResetSuccess: (state) => {
            state.loading = false;
            state.error = null;

            state.otpSent = false;
            state.otpVerified = false;
            state.resetEmail = null;
        },

        // =====================================================
        // CLEAR ERROR
        // =====================================================

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
    accessTokenUpdated,
    authFailure,
    logoutSuccess,
    otpSentSuccess,
    otpVerifiedSuccess,
    passwordResetSuccess,
    clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;