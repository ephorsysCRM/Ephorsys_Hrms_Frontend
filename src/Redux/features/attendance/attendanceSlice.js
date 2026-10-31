
import { createSlice } from "@reduxjs/toolkit";

import {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    createAttendanceRequest,
    getAttendanceDetails,
    updateAttendanceStatus,
} from "./attendanceThunk";

// ==========================================
// DEFAULT PAGINATION
// ==========================================
const defaultPagination = {
    currentPage: 1,
    limit: 20,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
    attendance: [],
    pagination: null,
    summary: null,
    filters: null,

    allAttendance: [],
    allAttendancePagination: { ...defaultPagination },

    attendanceDetails: null,

    checkInData: null,
    checkOutData: null,
    createdRequest: null,

    // Attendance status update response
    updatedAttendance: null,

    loading: {
        checkIn: false,
        checkOut: false,
        getMyAttendance: false,
        getAllAttendance: false,
        getAttendanceDetails: false,
        createRequest: false,
        updateAttendanceStatus: false,
    },

    error: {
        checkIn: null,
        checkOut: null,
        getMyAttendance: null,
        getAllAttendance: null,
        getAttendanceDetails: null,
        createRequest: null,
        updateAttendanceStatus: null,
    },
};

// ==========================================
// ATTENDANCE SLICE
// ==========================================
const attendanceSlice = createSlice({
    name: "attendance",
    initialState,

    reducers: {
        clearAttendanceErrors: (state) => {
            Object.keys(state.error).forEach((key) => {
                state.error[key] = null;
            });
        },

        clearCreatedAttendanceRequest: (state) => {
            state.createdRequest = null;
        },

        clearAttendanceActionData: (state) => {
            state.checkInData = null;
            state.checkOutData = null;
            state.createdRequest = null;
            state.updatedAttendance = null;
        },

        clearAllAttendance: (state) => {
            state.allAttendance = [];
            state.allAttendancePagination = { ...defaultPagination };
            state.error.getAllAttendance = null;
        },

        clearAttendanceDetails: (state) => {
            state.attendanceDetails = null;
            state.error.getAttendanceDetails = null;
        },

        clearAttendanceStatusUpdate: (state) => {
            state.updatedAttendance = null;
            state.error.updateAttendanceStatus = null;
            state.loading.updateAttendanceStatus = false;
        },
    },

    extraReducers: (builder) => {
        // ==========================================
        // CHECK-IN
        // ==========================================
        builder
            .addCase(checkIn.pending, (state) => {
                state.loading.checkIn = true;
                state.error.checkIn = null;
            })
            .addCase(checkIn.fulfilled, (state, action) => {
                state.loading.checkIn = false;
                state.checkInData = action.payload;
                state.error.checkIn = null;
            })
            .addCase(checkIn.rejected, (state, action) => {
                state.loading.checkIn = false;
                state.error.checkIn =
                    action.payload || "Check-in failed.";
            });

        // ==========================================
        // CHECK-OUT
        // ==========================================
        builder
            .addCase(checkOut.pending, (state) => {
                state.loading.checkOut = true;
                state.error.checkOut = null;
            })
            .addCase(checkOut.fulfilled, (state, action) => {
                state.loading.checkOut = false;
                state.checkOutData = action.payload;
                state.error.checkOut = null;
            })
            .addCase(checkOut.rejected, (state, action) => {
                state.loading.checkOut = false;
                state.error.checkOut =
                    action.payload || "Check-out failed.";
            });

        // ==========================================
        // GET MY ATTENDANCE
        // ==========================================
        builder
            .addCase(getMyAttendance.pending, (state) => {
                state.loading.getMyAttendance = true;
                state.error.getMyAttendance = null;
            })
            .addCase(getMyAttendance.fulfilled, (state, action) => {
                state.loading.getMyAttendance = false;

                const response = action.payload;

                state.attendance = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.attendance)
                        ? response.attendance
                        : [];

                state.pagination = response?.pagination ?? null;
                state.summary = response?.summary ?? null;
                state.filters = response?.filters ?? null;

                state.error.getMyAttendance = null;
            })
            .addCase(getMyAttendance.rejected, (state, action) => {
                state.loading.getMyAttendance = false;
                state.error.getMyAttendance =
                    action.payload || "Failed to fetch attendance.";
            });

        // ==========================================
        // GET ALL ATTENDANCE — HR / ADMIN
        // ==========================================
        builder
            .addCase(getAllAttendance.pending, (state) => {
                state.loading.getAllAttendance = true;
                state.error.getAllAttendance = null;
            })
            .addCase(getAllAttendance.fulfilled, (state, action) => {
                state.loading.getAllAttendance = false;

                const response = action.payload;

                state.allAttendance = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.attendance)
                        ? response.attendance
                        : [];

                state.allAttendancePagination =
                    response?.pagination ?? { ...defaultPagination };

                state.error.getAllAttendance = null;
            })
            .addCase(getAllAttendance.rejected, (state, action) => {
                state.loading.getAllAttendance = false;
                state.error.getAllAttendance =
                    action.payload ||
                    action.error?.message ||
                    "Failed to fetch all attendance records.";
            });

        // ==========================================
        // GET ATTENDANCE DETAILS BY ID
        // ==========================================
        builder
            .addCase(getAttendanceDetails.pending, (state) => {
                state.loading.getAttendanceDetails = true;
                state.error.getAttendanceDetails = null;
                state.attendanceDetails = null;
            })
            .addCase(getAttendanceDetails.fulfilled, (state, action) => {
                state.loading.getAttendanceDetails = false;
                state.attendanceDetails = action.payload;
                state.error.getAttendanceDetails = null;
            })
            .addCase(getAttendanceDetails.rejected, (state, action) => {
                state.loading.getAttendanceDetails = false;
                state.error.getAttendanceDetails =
                    action.payload ||
                    action.error?.message ||
                    "Failed to fetch attendance details.";
            });

        // ==========================================
        // CREATE ATTENDANCE REQUEST
        // ==========================================
        builder
            .addCase(createAttendanceRequest.pending, (state) => {
                state.loading.createRequest = true;
                state.error.createRequest = null;
                state.createdRequest = null;
            })
            .addCase(createAttendanceRequest.fulfilled, (state, action) => {
                state.loading.createRequest = false;
                state.createdRequest =
                    action.payload?.data ?? action.payload;
                state.error.createRequest = null;
            })
            .addCase(createAttendanceRequest.rejected, (state, action) => {
                state.loading.createRequest = false;
                state.error.createRequest =
                    action.payload ||
                    "Failed to submit attendance request.";
            });

        // ==========================================
        // UPDATE ATTENDANCE STATUS — HR / ADMIN
        // ==========================================
        builder
            .addCase(updateAttendanceStatus.pending, (state) => {
                state.loading.updateAttendanceStatus = true;
                state.error.updateAttendanceStatus = null;
                state.updatedAttendance = null;
            })
            .addCase(updateAttendanceStatus.fulfilled, (state, action) => {
                state.loading.updateAttendanceStatus = false;

                const response = action.payload;
                const updatedRecord =
                    response?.attendance ??
                    response?.data?.attendance ??
                    response?.data ??
                    null;

                state.updatedAttendance = updatedRecord;

                // Update the matching record immediately in Redux.
                if (updatedRecord?._id) {
                    const index = state.allAttendance.findIndex(
                        (item) => item._id === updatedRecord._id
                    );

                    if (index !== -1) {
                        state.allAttendance[index] = {
                            ...state.allAttendance[index],
                            ...updatedRecord,
                        };
                    }

                    // Also update the details state if it is open.
                    if (
                        state.attendanceDetails?._id === updatedRecord._id
                    ) {
                        state.attendanceDetails = {
                            ...state.attendanceDetails,
                            ...updatedRecord,
                        };
                    }
                }

                state.error.updateAttendanceStatus = null;
            })
            .addCase(updateAttendanceStatus.rejected, (state, action) => {
                state.loading.updateAttendanceStatus = false;
                state.error.updateAttendanceStatus =
                    action.payload ||
                    action.error?.message ||
                    "Failed to update attendance status.";
            });
    },
});

// ==========================================
// EXPORT ACTIONS
// ==========================================
export const {
    clearAttendanceErrors,
    clearCreatedAttendanceRequest,
    clearAttendanceActionData,
    clearAllAttendance,
    clearAttendanceDetails,
    clearAttendanceStatusUpdate,
} = attendanceSlice.actions;

// ==========================================
// EXPORT REDUCER
// ==========================================
export default attendanceSlice.reducer;
