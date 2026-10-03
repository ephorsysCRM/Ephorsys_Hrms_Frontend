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

            // Add newly created department at top
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

            state.pagination =
                action.payload.pagination || state.pagination;
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

            // Update single department
            state.department = updatedDepartment;

            // Update department inside list
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

            state.departments =
                state.departments.filter(
                    (department) =>
                        department._id !== deletedDepartmentId
                );

            // Update total count
            if (state.pagination.totalDepartments > 0) {
                state.pagination.totalDepartments -= 1;
            }

            // If currently viewed department is deleted
            if (
                state.department?._id ===
                deletedDepartmentId
            ) {
                state.department = null;
            }
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

    },
});

export const {
    createDepartmentStart,
    createDepartmentSuccess,

    getDepartmentsStart,
    getDepartmentsSuccess,

    getDepartmentStart,
    getDepartmentSuccess,

    updateDepartmentStart,
    updateDepartmentSuccess,

    deleteDepartmentStart,
    deleteDepartmentSuccess,

    departmentFailure,

    clearDepartmentError,
    clearDepartment,

} = departmentSlice.actions;

export default departmentSlice.reducer;