import { createSlice } from "@reduxjs/toolkit";

// =====================================================
// INITIAL STATE
// =====================================================

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
    // APPLY FOR LEAVE
    // =====================================================

    applyLeaveLoading: false,
    applyLeaveError: null,
    applyLeaveSuccess: false,
    appliedLeaveApplication: null,
    balanceCheck: null,

    // =====================================================
    // MY LEAVE APPLICATIONS
    // =====================================================

    myLeaveApplications: [],
    myApplicationsPagination: null,
    myApplicationsLoading: false,
    myApplicationsError: null,

    // =====================================================
    // ALL LEAVE APPLICATIONS (ADMIN / HR)
    // =====================================================

    allLeaveApplications: [],
    allApplicationsPagination: null,
    allApplicationsLoading: false,
    allApplicationsError: null,

    // =====================================================
    // REVIEW LEAVE APPLICATION (ADMIN / HR)
    // =====================================================

    reviewLeaveLoading: false,
    reviewLeaveError: null,
    reviewLeaveSuccess: false,

    // =====================================================
    // COMMON
    // =====================================================

    loading: false,
    error: null,
};

// =====================================================
// EXTRACT LEAVE RECORD
// =====================================================

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

// =====================================================
// EMPLOYEE LEAVE SLICE
// =====================================================

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
        // APPLY FOR LEAVE REQUEST
        // =================================================

        applyLeaveRequest: (state) => {
            state.applyLeaveLoading = true;
            state.applyLeaveError = null;
            state.applyLeaveSuccess = false;
        },

        // =================================================
        // APPLY FOR LEAVE SUCCESS
        // =================================================

        applyLeaveSuccess: (state, action) => {
            state.applyLeaveLoading = false;
            state.applyLeaveError = null;
            state.applyLeaveSuccess = true;

            const application = action.payload?.data?.application;

            state.appliedLeaveApplication = application || null;

            state.balanceCheck =
                action.payload?.data?.balanceCheck || null;

            if (application) {
                state.myLeaveApplications = [
                    application,
                    ...state.myLeaveApplications.filter(
                        (item) => item._id !== application._id
                    ),
                ];
            }
        },

        // =================================================
        // APPLY FOR LEAVE FAILURE
        // =================================================

        applyLeaveFailure: (state, action) => {
            state.applyLeaveLoading = false;
            state.applyLeaveSuccess = false;

            state.applyLeaveError =
                action.payload || "Failed to apply for leave.";
        },

        // =================================================
        // CLEAR APPLY LEAVE STATE
        // =================================================

        clearApplyLeaveState: (state) => {
            state.applyLeaveLoading = false;
            state.applyLeaveError = null;
            state.applyLeaveSuccess = false;
            state.appliedLeaveApplication = null;
            state.balanceCheck = null;
        },

        // =================================================
        // GET MY LEAVE APPLICATIONS REQUEST
        // =================================================

        getMyLeaveApplicationsRequest: (state) => {
            state.myApplicationsLoading = true;
            state.myApplicationsError = null;
        },

        // =================================================
        // GET MY LEAVE APPLICATIONS SUCCESS
        // =================================================

        getMyLeaveApplicationsSuccess: (state, action) => {
            state.myApplicationsLoading = false;
            state.myApplicationsError = null;

            state.myLeaveApplications =
                action.payload?.data?.applications || [];

            state.myApplicationsPagination =
                action.payload?.data?.pagination || null;
        },

        // =================================================
        // GET MY LEAVE APPLICATIONS FAILURE
        // =================================================

        getMyLeaveApplicationsFailure: (state, action) => {
            state.myApplicationsLoading = false;

            state.myApplicationsError =
                action.payload || "Failed to fetch leave applications.";
        },

        // =================================================
        // CLEAR MY LEAVE APPLICATIONS
        // =================================================

        clearMyLeaveApplications: (state) => {
            state.myLeaveApplications = [];
            state.myApplicationsPagination = null;
            state.myApplicationsError = null;
        },

        // =================================================
        // GET ALL LEAVE APPLICATIONS REQUEST (ADMIN / HR)
        // =================================================

        getAllLeaveApplicationsRequest: (state) => {
            state.allApplicationsLoading = true;
            state.allApplicationsError = null;
        },

        // =================================================
        // GET ALL LEAVE APPLICATIONS SUCCESS
        // =================================================

        getAllLeaveApplicationsSuccess: (state, action) => {
            state.allApplicationsLoading = false;
            state.allApplicationsError = null;

            state.allLeaveApplications =
                action.payload?.data?.applications || [];

            state.allApplicationsPagination =
                action.payload?.data?.pagination || null;
        },

        // =================================================
        // GET ALL LEAVE APPLICATIONS FAILURE
        // =================================================

        getAllLeaveApplicationsFailure: (state, action) => {
            state.allApplicationsLoading = false;

            state.allApplicationsError =
                action.payload || "Failed to fetch all leave applications.";
        },

        // =================================================
        // CLEAR ALL LEAVE APPLICATIONS
        // =================================================

        clearAllLeaveApplications: (state) => {
            state.allLeaveApplications = [];
            state.allApplicationsPagination = null;
            state.allApplicationsError = null;
        },

        // =================================================
        // REVIEW LEAVE APPLICATION REQUEST (ADMIN / HR)
        // =================================================

        reviewLeaveApplicationRequest: (state) => {
            state.reviewLeaveLoading = true;
            state.reviewLeaveError = null;
            state.reviewLeaveSuccess = false;
        },

        // =================================================
        // REVIEW LEAVE APPLICATION SUCCESS
        // Updates only the review fields so the populated
        // employee object in the list is never overwritten.
        // =================================================

        reviewLeaveApplicationSuccess: (state, action) => {
            state.reviewLeaveLoading = false;
            state.reviewLeaveError = null;
            state.reviewLeaveSuccess = true;

            const application = action.payload?.data?.application;

            if (application?._id) {
                const index = state.allLeaveApplications.findIndex(
                    (item) => item._id === application._id
                );

                if (index !== -1) {
                    const current = state.allLeaveApplications[index];

                    state.allLeaveApplications[index] = {
                        ...current,
                        status: application.status ?? current.status,
                        isUnpaidLeave:
                            application.isUnpaidLeave ?? current.isUnpaidLeave,
                        reviewedBy: application.reviewedBy ?? current.reviewedBy,
                        reviewedByType:
                            application.reviewedByType ?? current.reviewedByType,
                        reviewedAt: application.reviewedAt ?? current.reviewedAt,
                        rejectionReason:
                            application.rejectionReason ?? current.rejectionReason,
                    };
                }
            }
        },

        // =================================================
        // REVIEW LEAVE APPLICATION FAILURE
        // =================================================

        reviewLeaveApplicationFailure: (state, action) => {
            state.reviewLeaveLoading = false;
            state.reviewLeaveSuccess = false;

            state.reviewLeaveError =
                action.payload || "Failed to review leave application.";
        },

        // =================================================
        // CLEAR REVIEW LEAVE STATE
        // =================================================

        clearReviewLeaveState: (state) => {
            state.reviewLeaveLoading = false;
            state.reviewLeaveError = null;
            state.reviewLeaveSuccess = false;
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
            state.applyLeaveError = null;
            state.myApplicationsError = null;
            state.allApplicationsError = null;
            state.reviewLeaveError = null;
        },

        // =================================================
        // RESET EMPLOYEE LEAVE STATE
        // =================================================

        resetEmployeeLeaveState: () => {
            return initialState;
        },
    },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

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

    // APPLY LEAVE
    applyLeaveRequest,
    applyLeaveSuccess,
    applyLeaveFailure,
    clearApplyLeaveState,

    // MY APPLICATIONS
    getMyLeaveApplicationsRequest,
    getMyLeaveApplicationsSuccess,
    getMyLeaveApplicationsFailure,
    clearMyLeaveApplications,

    // ALL APPLICATIONS (ADMIN / HR)
    getAllLeaveApplicationsRequest,
    getAllLeaveApplicationsSuccess,
    getAllLeaveApplicationsFailure,
    clearAllLeaveApplications,

    // REVIEW APPLICATION (ADMIN / HR)
    reviewLeaveApplicationRequest,
    reviewLeaveApplicationSuccess,
    reviewLeaveApplicationFailure,
    clearReviewLeaveState,

    // CLEAR
    clearEmployeeLeave,
    clearEmployeeLeaveError,

    // RESET
    resetEmployeeLeaveState,

} = employeeLeaveSlice.actions;

export default employeeLeaveSlice.reducer;