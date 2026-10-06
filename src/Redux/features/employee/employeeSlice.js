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
    // UPDATE EMPLOYEE
    // =====================================================

    updateEmployeeLoading: false,
    updateEmployeeError: null,
    updateEmployeeSuccess: false,

    updatedEmployee: null,

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
        // UPDATE EMPLOYEE
        // =================================================

        updateEmployeeRequest: (state) => {
            state.updateEmployeeLoading = true;
            state.updateEmployeeError = null;
            state.updateEmployeeSuccess = false;
            state.updatedEmployee = null;
        },

        updateEmployeeSuccess: (
            state,
            action
        ) => {
            state.updateEmployeeLoading = false;
            state.updateEmployeeError = null;
            state.updateEmployeeSuccess = true;

            const employee =
                action.payload?.data?.employee || null;

            state.updatedEmployee = employee;

            // ---------------------------------------------
            // Update currently selected employee
            // ---------------------------------------------

            if (employee) {
                state.employee = employee;
            }

            // ---------------------------------------------
            // Update employee inside employee list
            // ---------------------------------------------

            if (employee?._id) {
                const index =
                    state.employees.findIndex(
                        (item) =>
                            item._id === employee._id
                    );

                if (index !== -1) {
                    state.employees[index] =
                        employee;
                }
            }
        },

        updateEmployeeFailure: (
            state,
            action
        ) => {
            state.updateEmployeeLoading = false;
            state.updateEmployeeSuccess = false;

            state.updateEmployeeError =
                action.payload ||
                "Failed to update employee";
        },

        // =================================================
        // CLEAR UPDATE EMPLOYEE STATE
        // =================================================

        clearUpdateEmployeeState: (
            state
        ) => {
            state.updateEmployeeLoading = false;
            state.updateEmployeeError = null;
            state.updateEmployeeSuccess = false;
            state.updatedEmployee = null;
        },

        // =================================================
        // CLEAR SINGLE EMPLOYEE
        // =================================================

        clearEmployee: (state) => {
            state.employee = null;

            state.getEmployeeByIdLoading = false;
            state.getEmployeeByIdError = null;

            state.updatedEmployee = null;
        },

        // =================================================
        // CLEAR EMPLOYEE ERROR
        // =================================================

        clearEmployeeError: (state) => {
            state.error = null;

            state.getAllEmployeesError = null;

            state.getEmployeeByIdError = null;

            state.createEmployeeError = null;

            state.updateEmployeeError = null;
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
    // GET ALL
    getAllEmployeesRequest,
    getAllEmployeesSuccess,
    getAllEmployeesFailure,

    // GET SINGLE
    getEmployeeByIdRequest,
    getEmployeeByIdSuccess,
    getEmployeeByIdFailure,

    // CREATE
    createEmployeeRequest,
    createEmployeeSuccess,
    createEmployeeFailure,

    // UPDATE
    updateEmployeeRequest,
    updateEmployeeSuccess,
    updateEmployeeFailure,

    // CLEAR
    clearCreateEmployeeState,
    clearUpdateEmployeeState,
    clearEmployee,
    clearEmployeeError,

    // RESET
    resetEmployeeState,
} = employeeSlice.actions;

export default employeeSlice.reducer;