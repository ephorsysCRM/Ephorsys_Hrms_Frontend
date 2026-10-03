import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // =====================================================
    // ADMIN
    // =====================================================

    admin: null,

    // =====================================================
    // STATES
    // =====================================================

    loading: false,
    error: null,
    isAuthenticated: false,
    authChecked: false,

    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

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

            state.isAuthenticated = true;
            state.authChecked = true;
        },

        // =====================================================
        // AUTH CHECKED
        // =====================================================

        authCheckComplete: (state) => {
            state.loading = false;
            state.authChecked = true;
        },

        // =====================================================
        // AUTH FAILURE
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
    authFailure,
    logoutSuccess,
    otpSentSuccess,
    otpVerifiedSuccess,
    passwordResetSuccess,
    clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;