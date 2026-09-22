import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,
    loading: false,
    error: null,
    isAuthenticated: false,

    // Forgot Password
    otpSent: false,
    otpVerified: false,
    resetEmail: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // -----------------------------------------
        // START
        // -----------------------------------------

        authStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        // -----------------------------------------
        // LOGIN SUCCESS
        // -----------------------------------------

        loginSuccess: (state, action) => {
            state.loading = false;

            state.admin = action.payload;
            state.isAuthenticated = true;
        },

        // -----------------------------------------
        // FAILURE
        // -----------------------------------------

        authFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // -----------------------------------------
        // LOGOUT
        // -----------------------------------------

        logoutSuccess: (state) => {
            state.admin = null;
            state.loading = false;
            state.error = null;
            state.isAuthenticated = false;
            state.otpSent = false;
            state.otpVerified = false;
            state.resetEmail = null;
        },

        // -----------------------------------------
        // OTP SENT
        // -----------------------------------------

        otpSentSuccess: (state, action) => {
            state.loading = false;
            state.otpSent = true;
            state.resetEmail = action.payload;
        },

        // -----------------------------------------
        // OTP VERIFIED
        // -----------------------------------------

        otpVerifiedSuccess: (state) => {
            state.loading = false;
            state.otpVerified = true;
        },

        // -----------------------------------------
        // PASSWORD RESET
        // -----------------------------------------

        passwordResetSuccess: (state) => {
            state.loading = false;
            state.otpSent = false;
            state.otpVerified = false;
            state.resetEmail = null;
        },
    },
});

export const {
    authStart,
    loginSuccess,
    authFailure,
    logoutSuccess,

    otpSentSuccess,
    otpVerifiedSuccess,
    passwordResetSuccess,
} = authSlice.actions;

export default authSlice.reducer;