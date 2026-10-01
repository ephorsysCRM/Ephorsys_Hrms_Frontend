import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // =====================================================
    // DEPARTMENT DATA
    // =====================================================

    departments: [],
    department: null,

    // =====================================================
    // PAGINATION
    // =====================================================

    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalDepartments: 0,
        limit: 10,
    },

    // =====================================================
    // STATES
    // =====================================================

    loading: false,
    error: null,

    // =====================================================
    // ACTION STATES
    // =====================================================

    creating: false,
    updating: false,
    deleting: false,
};

const departmentSlice = createSlice({
    name: "department",

    initialState,

    reducers: {

        // =====================================================
        // CREATE START
        // =====================================================

        createDepartmentStart: (state) => {
            state.creating = true;
            state.error = null;
        },

        // =====================================================
        // CREATE SUCCESS
        // =====================================================

        createDepartmentSuccess: (state, action) => {
            state.creating = false;
            state.error = null;

            state.departments.unshift(
                action.payload
            );
        },

        // =====================================================
        // GET ALL START
        // =====================================================

        getDepartmentsStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        // =====================================================
        // GET ALL SUCCESS
        // =====================================================

        getDepartmentsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;

            state.departments =
                action.payload.departments;

            state.pagination =
                action.payload.pagination;
        },

        // =====================================================
        // GET SINGLE START
        // =====================================================

        getDepartmentStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        // =====================================================
        // GET SINGLE SUCCESS
        // =====================================================

        getDepartmentSuccess: (state, action) => {
            state.loading = false;
            state.error = null;

            state.department =
                action.payload;
        },

        // =====================================================
        // UPDATE START
        // =====================================================

        updateDepartmentStart: (state) => {
            state.updating = true;
            state.error = null;
        },

        // =====================================================
        // UPDATE SUCCESS
        // =====================================================

        updateDepartmentSuccess: (state, action) => {
            state.updating = false;
            state.error = null;

            const updatedDepartment =
                action.payload;

            state.department =
                updatedDepartment;

            const index =
                state.departments.findIndex(
                    (department) =>
                        department._id ===
                        updatedDepartment._id
                );

            if (index !== -1) {
                state.departments[index] =
                    updatedDepartment;
            }
        },

        // =====================================================
        // DELETE START
        // =====================================================

        deleteDepartmentStart: (state) => {
            state.deleting = true;
            state.error = null;
        },

        // =====================================================
        // DELETE SUCCESS
        // =====================================================

        deleteDepartmentSuccess: (
            state,
            action
        ) => {
            state.deleting = false;
            state.error = null;

            state.departments =
                state.departments.filter(
                    (department) =>
                        department._id !==
                        action.payload
                );

            if (
                state.department?._id ===
                action.payload
            ) {
                state.department = null;
            }
        },

        // =====================================================
        // FAILURE
        // =====================================================

        departmentFailure: (
            state,
            action
        ) => {
            state.loading = false;
            state.creating = false;
            state.updating = false;
            state.deleting = false;

            state.error =
                action.payload;
        },

        // =====================================================
        // CLEAR ERROR
        // =====================================================

        clearDepartmentError: (
            state
        ) => {
            state.error = null;
        },

        // =====================================================
        // CLEAR SINGLE DEPARTMENT
        // =====================================================

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