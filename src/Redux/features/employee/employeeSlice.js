import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // =====================================================
    // EMPLOYEE LIST
    // =====================================================

    employees: [],

    // =====================================================
    // SINGLE EMPLOYEE
    // =====================================================

    employee: null,

    getEmployeeByIdLoading: false,
    getEmployeeByIdError: null,

    // =====================================================
    // GET ALL EMPLOYEES
    // =====================================================

    getAllEmployeesLoading: false,
    getAllEmployeesError: null,

    pagination: {
        currentPage: 1,
        limit: 10,
        totalEmployees: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    },

    // =====================================================
    // CREATE EMPLOYEE
    // =====================================================

    createEmployeeLoading: false,
    createEmployeeError: null,
    createEmployeeSuccess: false,

    // =====================================================
    // COMMON
    // =====================================================

    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: "employee",

    initialState,

    reducers: {
        // =================================================
        // GET ALL EMPLOYEES
        // =================================================

        getAllEmployeesRequest: (state) => {
            state.getAllEmployeesLoading = true;
            state.getAllEmployeesError = null;
        },

        getAllEmployeesSuccess: (
            state,
            action
        ) => {
            state.getAllEmployeesLoading = false;
            state.getAllEmployeesError = null;

            state.employees =
                action.payload?.data?.employees ||
                [];

            state.pagination =
                action.payload?.data?.pagination || {
                    currentPage: 1,
                    limit: 10,
                    totalEmployees: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                };
        },

        getAllEmployeesFailure: (
            state,
            action
        ) => {
            state.getAllEmployeesLoading = false;

            state.getAllEmployeesError =
                action.payload ||
                "Failed to fetch employees";
        },

        // =================================================
        // GET SINGLE EMPLOYEE
        // =================================================

        getEmployeeByIdRequest: (state) => {
            state.getEmployeeByIdLoading = true;
            state.getEmployeeByIdError = null;
            state.employee = null;
        },

        getEmployeeByIdSuccess: (
            state,
            action
        ) => {
            state.getEmployeeByIdLoading = false;
            state.getEmployeeByIdError = null;

            state.employee =
                action.payload?.data?.employee ||
                null;
        },

        getEmployeeByIdFailure: (
            state,
            action
        ) => {
            state.getEmployeeByIdLoading = false;

            state.getEmployeeByIdError =
                action.payload ||
                "Failed to fetch employee";
        },

        // =================================================
        // CREATE EMPLOYEE
        // =================================================

        createEmployeeRequest: (state) => {
            state.createEmployeeLoading = true;
            state.createEmployeeError = null;
            state.createEmployeeSuccess = false;
        },

        createEmployeeSuccess: (
            state,
            action
        ) => {
            state.createEmployeeLoading = false;
            state.createEmployeeError = null;
            state.createEmployeeSuccess = true;

            const employee =
                action.payload?.data?.employee;

            state.employee = employee || null;

            if (employee) {
                state.employees.unshift(employee);
            }
        },

        createEmployeeFailure: (
            state,
            action
        ) => {
            state.createEmployeeLoading = false;
            state.createEmployeeSuccess = false;

            state.createEmployeeError =
                action.payload ||
                "Failed to create employee";
        },

        // =================================================
        // CLEAR CREATE EMPLOYEE STATE
        // =================================================

        clearCreateEmployeeState: (
            state
        ) => {
            state.createEmployeeLoading = false;
            state.createEmployeeError = null;
            state.createEmployeeSuccess = false;
        },

        // =================================================
        // CLEAR SINGLE EMPLOYEE
        // =================================================

        clearEmployee: (state) => {
            state.employee = null;
            state.getEmployeeByIdLoading = false;
            state.getEmployeeByIdError = null;
        },

        // =================================================
        // CLEAR EMPLOYEE ERROR
        // =================================================

        clearEmployeeError: (state) => {
            state.error = null;

            state.getAllEmployeesError =
                null;

            state.getEmployeeByIdError =
                null;

            state.createEmployeeError =
                null;
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
    getAllEmployeesRequest,
    getAllEmployeesSuccess,
    getAllEmployeesFailure,

    getEmployeeByIdRequest,
    getEmployeeByIdSuccess,
    getEmployeeByIdFailure,

    createEmployeeRequest,
    createEmployeeSuccess,
    createEmployeeFailure,

    clearCreateEmployeeState,
    clearEmployee,
    clearEmployeeError,
    resetEmployeeState,
} = employeeSlice.actions;

export default employeeSlice.reducer;