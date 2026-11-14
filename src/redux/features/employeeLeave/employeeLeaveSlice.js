import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // =====================================================
    // LEAVE RECORD
    // =====================================================

    leaveRecord: null,
    leaveRecords: [],

    // =====================================================
    // CREATE / ASSIGN LEAVE
    // =====================================================

    createEmployeeLeaveLoading: false,
    createEmployeeLeaveError: null,
    createEmployeeLeaveSuccess: false,

    // =====================================================
    // UPDATE LEAVE
    // =====================================================

    updateEmployeeLeaveLoading: false,
    updateEmployeeLeaveError: null,
    updateEmployeeLeaveSuccess: false,

    // =====================================================
    // COMMON
    // =====================================================

    loading: false,
    error: null,
};

// Extract leave record from the API response.
// Supports common response property names.
const getLeaveRecord = (payload) => {
    const data = payload?.data;

    return (
        data?.employeeLeave ||
        data?.leaveRecord ||
        data?.leave ||
        data?.record ||
        null
    );
};

const employeeLeaveSlice = createSlice({
    name: "employeeLeave",

    initialState,

    reducers: {
        // =================================================
        // CREATE EMPLOYEE LEAVE REQUEST
        // =================================================

        createEmployeeLeaveRequest: (state) => {
            state.createEmployeeLeaveLoading = true;
            state.createEmployeeLeaveError = null;
            state.createEmployeeLeaveSuccess = false;
        },

        // =================================================
        // CREATE EMPLOYEE LEAVE SUCCESS
        // =================================================

        createEmployeeLeaveSuccess: (state, action) => {
            state.createEmployeeLeaveLoading = false;
            state.createEmployeeLeaveError = null;
            state.createEmployeeLeaveSuccess = true;

            const leaveRecord = getLeaveRecord(action.payload);

            if (leaveRecord) {
                state.leaveRecord = leaveRecord;

                const index = state.leaveRecords.findIndex(
                    (item) =>
                        item.employee?.toString() ===
                        leaveRecord.employee?.toString() &&
                        item.year === leaveRecord.year
                );

                if (index !== -1) {
                    state.leaveRecords[index] = leaveRecord;
                } else {
                    state.leaveRecords.unshift(leaveRecord);
                }
            }
        },

        // =================================================
        // CREATE EMPLOYEE LEAVE FAILURE
        // =================================================

        createEmployeeLeaveFailure: (state, action) => {
            state.createEmployeeLeaveLoading = false;
            state.createEmployeeLeaveSuccess = false;

            state.createEmployeeLeaveError =
                action.payload || "Failed to assign employee leave";
        },

        // =================================================
        // CLEAR CREATE LEAVE STATE
        // =================================================

        clearCreateEmployeeLeaveState: (state) => {
            state.createEmployeeLeaveLoading = false;
            state.createEmployeeLeaveError = null;
            state.createEmployeeLeaveSuccess = false;
        },

        // =================================================
        // UPDATE EMPLOYEE LEAVE REQUEST
        // =================================================

        updateEmployeeLeaveRequest: (state) => {
            state.updateEmployeeLeaveLoading = true;
            state.updateEmployeeLeaveError = null;
            state.updateEmployeeLeaveSuccess = false;
        },

        // =================================================
        // UPDATE EMPLOYEE LEAVE SUCCESS
        // =================================================

        updateEmployeeLeaveSuccess: (state, action) => {
            state.updateEmployeeLeaveLoading = false;
            state.updateEmployeeLeaveError = null;
            state.updateEmployeeLeaveSuccess = true;

            const leaveRecord = getLeaveRecord(action.payload);

            if (leaveRecord) {
                state.leaveRecord = leaveRecord;

                const index = state.leaveRecords.findIndex(
                    (item) =>
                        item.employee?.toString() ===
                        leaveRecord.employee?.toString() &&
                        item.year === leaveRecord.year
                );

                if (index !== -1) {
                    state.leaveRecords[index] = leaveRecord;
                } else {
                    state.leaveRecords.unshift(leaveRecord);
                }
            }
        },

        // =================================================
        // UPDATE EMPLOYEE LEAVE FAILURE
        // =================================================

        updateEmployeeLeaveFailure: (state, action) => {
            state.updateEmployeeLeaveLoading = false;
            state.updateEmployeeLeaveSuccess = false;

            state.updateEmployeeLeaveError =
                action.payload || "Failed to update employee leave";
        },

        // =================================================
        // CLEAR UPDATE LEAVE STATE
        // =================================================

        clearUpdateEmployeeLeaveState: (state) => {
            state.updateEmployeeLeaveLoading = false;
            state.updateEmployeeLeaveError = null;
            state.updateEmployeeLeaveSuccess = false;
        },

        // =================================================
        // CLEAR LEAVE RECORD
        // =================================================

        clearEmployeeLeave: (state) => {
            state.leaveRecord = null;
        },

        // =================================================
        // CLEAR LEAVE ERRORS
        // =================================================

        clearEmployeeLeaveError: (state) => {
            state.error = null;
            state.createEmployeeLeaveError = null;
            state.updateEmployeeLeaveError = null;
        },

        // =================================================
        // RESET EMPLOYEE LEAVE STATE
        // =================================================

        resetEmployeeLeaveState: () => {
            return initialState;
        },
    },
});

export const {
    // CREATE
    createEmployeeLeaveRequest,
    createEmployeeLeaveSuccess,
    createEmployeeLeaveFailure,
    clearCreateEmployeeLeaveState,

    // UPDATE
    updateEmployeeLeaveRequest,
    updateEmployeeLeaveSuccess,
    updateEmployeeLeaveFailure,
    clearUpdateEmployeeLeaveState,

    // CLEAR
    clearEmployeeLeave,
    clearEmployeeLeaveError,

    // RESET
    resetEmployeeLeaveState,
} = employeeLeaveSlice.actions;

export default employeeLeaveSlice.reducer;