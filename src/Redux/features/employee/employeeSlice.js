import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    employees: [],
    employee: null,

    loading: false,
    error: null,

    createEmployeeLoading: false,
    createEmployeeError: null,
    createEmployeeSuccess: false,
};

const employeeSlice = createSlice({
    name: "employee",

    initialState,

    reducers: {

        // =================================================
        // CREATE EMPLOYEE REQUEST
        // =================================================

        createEmployeeRequest: (state) => {
            state.createEmployeeLoading = true;
            state.createEmployeeError = null;
            state.createEmployeeSuccess = false;
        },

        // =================================================
        // CREATE EMPLOYEE SUCCESS
        // =================================================

        createEmployeeSuccess: (state, action) => {
            state.createEmployeeLoading = false;
            state.createEmployeeError = null;
            state.createEmployeeSuccess = true;

            const response = action.payload;

            // API response:
            // {
            //     success: true,
            //     message: "...",
            //     data: employee
            // }

            if (response?.data) {
                state.employee = response.data;

                state.employees.unshift(
                    response.data
                );
            }
        },

        // =================================================
        // CREATE EMPLOYEE FAILURE
        // =================================================

        createEmployeeFailure: (state, action) => {
            state.createEmployeeLoading = false;
            state.createEmployeeError =
                action.payload || "Failed to create employee";

            state.createEmployeeSuccess = false;
        },

        // =================================================
        // CLEAR CREATE EMPLOYEE STATE
        // =================================================

        clearCreateEmployeeState: (state) => {
            state.createEmployeeLoading = false;
            state.createEmployeeError = null;
            state.createEmployeeSuccess = false;
        },

        // =================================================
        // CLEAR EMPLOYEE ERROR
        // =================================================

        clearEmployeeError: (state) => {
            state.error = null;
            state.createEmployeeError = null;
        },

        // =================================================
        // RESET EMPLOYEE STATE
        // =================================================

        resetEmployeeState: () => {
            return initialState;
        },
    },
});

export const {
    createEmployeeRequest,
    createEmployeeSuccess,
    createEmployeeFailure,
    clearCreateEmployeeState,
    clearEmployeeError,
    resetEmployeeState,
} = employeeSlice.actions;

export default employeeSlice.reducer;