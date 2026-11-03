import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    userType: null,
    role: null,
    admin: null,

    loading: false,
    error: null,
    isAuthenticated: false,
    authChecked: false,

    otpSent: false,
    otpVerified: false,
    resetEmail: null,
}

const getAuthData = (payload = {}) => {
    const user =
        payload.user ||
        payload.admin ||
        payload.employee ||
        payload.data?.user ||
        payload.data?.admin ||
        payload.data?.employee ||
        null

    const userType =
        payload.userType ||
        payload.data?.userType ||
        (payload.admin ? 'admin' : null) ||
        (payload.employee ? 'employee' : null) ||
        (user?.officialEmail ? 'employee' : null) ||
        (user?.email ? 'admin' : null)

    return {
        user,
        userType,
        role: payload.role || payload.data?.role || user?.role || null,
    }
}

const clearUserSession = state => {
    state.user = null
    state.userType = null
    state.role = null
    state.admin = null
    state.isAuthenticated = false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        authStart: state => {
            state.loading = true
            state.error = null
        },

        loginSuccess: (state, action) => {
            const { user, userType, role } = getAuthData(action.payload)

            state.loading = false
            state.error = null
            state.user = user
            state.userType = userType
            state.role = role
            state.admin = userType === 'admin' ? user : null
            state.isAuthenticated = Boolean(user && userType)
            state.authChecked = true
        },

        sessionRestored: (state, action) => {
            const { user, userType, role } = getAuthData(action.payload)

            state.loading = false
            state.error = null

            if (!user || !userType) {
                clearUserSession(state)
                state.authChecked = true
                return
            }

            state.user = user
            state.userType = userType
            state.role = role
            state.admin = userType === 'admin' ? user : null
            state.isAuthenticated = true
            state.authChecked = true
        },

        authCheckComplete: state => {
            state.loading = false
            state.authChecked = true
        },

        authFailure: (state, action) => {
            state.loading = false
            state.error = action.payload || 'Something went wrong'
        },

        logoutSuccess: state => {
            clearUserSession(state)

            state.loading = false
            state.error = null
            state.authChecked = true
            state.otpSent = false
            state.otpVerified = false
            state.resetEmail = null
        },

        otpSentSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.otpSent = true
            state.otpVerified = false
            state.resetEmail = action.payload
        },

        otpVerifiedSuccess: state => {
            state.loading = false
            state.error = null
            state.otpVerified = true
        },

        passwordResetSuccess: state => {
            state.loading = false
            state.error = null
            state.otpSent = false
            state.otpVerified = false
            state.resetEmail = null
        },

        clearAuthError: state => {
            state.error = null
        },
    },
})

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
} = authSlice.actions

export default authSlice.reducer