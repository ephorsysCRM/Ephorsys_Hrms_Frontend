import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // =====================================================
    // DEPARTMENT LIST
    // =====================================================

    departments: [],

    // =====================================================
    // SINGLE DEPARTMENT
    // =====================================================

    department: null,

    // =====================================================
    // EMPLOYEES FOR DEPARTMENT HEAD DROPDOWN
    // =====================================================

    departmentEmployees: [],

    // =====================================================
    // PAGINATION
    // =====================================================

    pagination: {
        currentPage: 1,
        limit: 10,
        totalDepartments: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    },

    // =====================================================
    // LOADING STATES
    // =====================================================

    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    fetchingSingle: false,
    fetchingDepartmentEmployees: false,

    // =====================================================
    // ERROR
    // =====================================================

    error: null,
};

const departmentSlice = createSlice({
    name: "department",

    initialState,

    reducers: {
        // =================================================
        // CREATE DEPARTMENT
        // =================================================

        createDepartmentStart: (state) => {
            state.creating = true;
            state.error = null;
        },

        createDepartmentSuccess: (state, action) => {
            state.creating = false;
            state.error = null;

            if (action.payload) {
                state.departments.unshift(action.payload);

                state.pagination.totalDepartments += 1;
            }
        },


        // =================================================
        // GET ALL DEPARTMENTS
        // =================================================

        getDepartmentsStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        getDepartmentsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;

            state.departments =
                action.payload.departments || [];

            state.pagination = {
                ...state.pagination,
                ...(action.payload.pagination || {}),
            };
        },


        // =================================================
        // GET SINGLE DEPARTMENT
        // =================================================

        getDepartmentStart: (state) => {
            state.fetchingSingle = true;
            state.error = null;
        },

        getDepartmentSuccess: (state, action) => {
            state.fetchingSingle = false;
            state.error = null;

            state.department = action.payload;
        },


        // =================================================
        // UPDATE DEPARTMENT
        // =================================================

        updateDepartmentStart: (state) => {
            state.updating = true;
            state.error = null;
        },

        updateDepartmentSuccess: (state, action) => {
            state.updating = false;
            state.error = null;

            const updatedDepartment = action.payload;

            state.department = updatedDepartment;

            const index = state.departments.findIndex(
                (department) =>
                    department._id === updatedDepartment?._id
            );

            if (index !== -1) {
                state.departments[index] = updatedDepartment;
            }
        },


        // =================================================
        // DELETE DEPARTMENT
        // =================================================

        deleteDepartmentStart: (state) => {
            state.deleting = true;
            state.error = null;
        },

        deleteDepartmentSuccess: (state, action) => {
            state.deleting = false;
            state.error = null;

            const deletedDepartmentId = action.payload;

            state.departments = state.departments.filter(
                (department) =>
                    department._id !== deletedDepartmentId
            );

            if (state.pagination.totalDepartments > 0) {
                state.pagination.totalDepartments -= 1;
            }

            if (
                state.department?._id === deletedDepartmentId
            ) {
                state.department = null;
            }
        },


        // =================================================
        // GET EMPLOYEES BY DEPARTMENT
        // =================================================

        getDepartmentEmployeesStart: (state) => {
            state.fetchingDepartmentEmployees = true;
            state.departmentEmployees = [];
            state.error = null;
        },

        getDepartmentEmployeesSuccess: (state, action) => {
            state.fetchingDepartmentEmployees = false;

            state.departmentEmployees =
                action.payload || [];
        },

        getDepartmentEmployeesFailure: (state, action) => {
            state.fetchingDepartmentEmployees = false;
            state.departmentEmployees = [];
            state.error = action.payload;
        },


        // =================================================
        // COMMON FAILURE
        // =================================================

        departmentFailure: (state, action) => {
            state.loading = false;
            state.creating = false;
            state.updating = false;
            state.deleting = false;
            state.fetchingSingle = false;

            state.error = action.payload;
        },


        // =================================================
        // CLEAR ERROR
        // =================================================

        clearDepartmentError: (state) => {
            state.error = null;
        },


        // =================================================
        // CLEAR SINGLE DEPARTMENT
        // =================================================

        clearDepartment: (state) => {
            state.department = null;
        },


        // =================================================
        // CLEAR DEPARTMENT EMPLOYEES
        // =================================================

        clearDepartmentEmployees: (state) => {
            state.departmentEmployees = [];
            state.fetchingDepartmentEmployees = false;
        },
    },
});

export const {
    // CREATE
    createDepartmentStart,
    createDepartmentSuccess,

    // GET ALL
    getDepartmentsStart,
    getDepartmentsSuccess,

    // GET SINGLE
    getDepartmentStart,
    getDepartmentSuccess,

    // UPDATE
    updateDepartmentStart,
    updateDepartmentSuccess,

    // DELETE
    deleteDepartmentStart,
    deleteDepartmentSuccess,

    // GET EMPLOYEES BY DEPARTMENT
    getDepartmentEmployeesStart,
    getDepartmentEmployeesSuccess,
    getDepartmentEmployeesFailure,
    clearDepartmentEmployees,

    // ERROR
    departmentFailure,
    clearDepartmentError,
    clearDepartment,
} = departmentSlice.actions;

export default departmentSlice.reducer;