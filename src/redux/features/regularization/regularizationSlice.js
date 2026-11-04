import { createSlice } from "@reduxjs/toolkit";

import {
    createRegularizationRequest,
    getMyRegularization,
    getAllRegularization,
    reviewRegularization,
} from "./regularizationThunk";

// ==========================================
// DEFAULT PAGINATION
// ==========================================
const defaultPagination = {
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
    myRequests: [],
    myRequestsPagination: { ...defaultPagination },
    myRequestsFilters: null,

    allRequests: [],
    allRequestsPagination: { ...defaultPagination },
    allRequestsFilters: null,

    createdRequest: null,
    reviewData: null,

    loading: {
        createRequest: false,
        getMyRequests: false,
        getAllRequests: false,
        reviewRequest: false,
    },

    error: {
        createRequest: null,
        getMyRequests: null,
        getAllRequests: null,
        reviewRequest: null,
    },
};

// ==========================================
// REGULARIZATION SLICE
// ==========================================
const regularizationSlice = createSlice({
    name: "regularization",
    initialState,

    reducers: {
        // Clear all regularization errors
        clearRegularizationErrors: (state) => {
            Object.keys(state.error).forEach((key) => {
                state.error[key] = null;
            });
        },

        // Clear newly created request
        clearCreatedRegularizationRequest: (state) => {
            state.createdRequest = null;
            state.error.createRequest = null;
        },

        // Clear review response
        clearRegularizationReview: (state) => {
            state.reviewData = null;
            state.error.reviewRequest = null;
        },

        // Clear employee requests
        clearMyRegularization: (state) => {
            state.myRequests = [];
            state.myRequestsPagination = { ...defaultPagination };
            state.myRequestsFilters = null;
            state.error.getMyRequests = null;
        },

        // Clear HR/Admin requests
        clearAllRegularization: (state) => {
            state.allRequests = [];
            state.allRequestsPagination = { ...defaultPagination };
            state.allRequestsFilters = null;
            state.error.getAllRequests = null;
        },
    },

    extraReducers: (builder) => {
        // ==========================================
        // CREATE REGULARIZATION REQUEST
        // ==========================================
        builder
            .addCase(createRegularizationRequest.pending, (state) => {
                state.loading.createRequest = true;
                state.error.createRequest = null;
                state.createdRequest = null;
            })
            .addCase(createRegularizationRequest.fulfilled, (state, action) => {
                state.loading.createRequest = false;

                state.createdRequest =
                    action.payload?.data ?? action.payload;

                // Add newly submitted request to employee list
                if (state.createdRequest?._id) {
                    state.myRequests = [
                        state.createdRequest,
                        ...state.myRequests.filter(
                            (item) => item._id !== state.createdRequest._id
                        ),
                    ];

                    state.myRequestsPagination.totalRecords += 1;
                }

                state.error.createRequest = null;
            })
            .addCase(createRegularizationRequest.rejected, (state, action) => {
                state.loading.createRequest = false;
                state.error.createRequest =
                    action.payload ||
                    "Failed to submit regularization request.";
            });

        // ==========================================
        // GET MY REGULARIZATION REQUESTS
        // ==========================================
        builder
            .addCase(getMyRegularization.pending, (state) => {
                state.loading.getMyRequests = true;
                state.error.getMyRequests = null;
            })
            .addCase(getMyRegularization.fulfilled, (state, action) => {
                state.loading.getMyRequests = false;

                const response = action.payload?.data ?? action.payload;

                state.myRequests = Array.isArray(response?.requests)
                    ? response.requests
                    : [];

                state.myRequestsPagination =
                    response?.pagination ?? { ...defaultPagination };

                state.myRequestsFilters = response?.filters ?? null;
                state.error.getMyRequests = null;
            })
            .addCase(getMyRegularization.rejected, (state, action) => {
                state.loading.getMyRequests = false;
                state.error.getMyRequests =
                    action.payload ||
                    "Failed to fetch your regularization requests.";
            });

        // ==========================================
        // GET ALL REGULARIZATION REQUESTS — HR / ADMIN
        // ==========================================
        builder
            .addCase(getAllRegularization.pending, (state) => {
                state.loading.getAllRequests = true;
                state.error.getAllRequests = null;
            })
            .addCase(getAllRegularization.fulfilled, (state, action) => {
                state.loading.getAllRequests = false;

                const response = action.payload?.data ?? action.payload;

                state.allRequests = Array.isArray(response?.requests)
                    ? response.requests
                    : [];

                state.allRequestsPagination =
                    response?.pagination ?? { ...defaultPagination };

                state.allRequestsFilters = response?.filters ?? null;
                state.error.getAllRequests = null;
            })
            .addCase(getAllRegularization.rejected, (state, action) => {
                state.loading.getAllRequests = false;
                state.error.getAllRequests =
                    action.payload ||
                    "Failed to fetch regularization requests.";
            });

        // ==========================================
        // APPROVE / REJECT REGULARIZATION REQUEST
        // ==========================================
        builder
            .addCase(reviewRegularization.pending, (state) => {
                state.loading.reviewRequest = true;
                state.error.reviewRequest = null;
                state.reviewData = null;
            })
            .addCase(reviewRegularization.fulfilled, (state, action) => {
                state.loading.reviewRequest = false;

                const response = action.payload;
                const result = response?.data ?? response;

                const updatedRequest = result?.regularization ?? null;

                state.reviewData = result;

                // Update matching HR/Admin request immediately
                if (updatedRequest?._id) {
                    const index = state.allRequests.findIndex(
                        (item) => item._id === updatedRequest._id
                    );

                    if (index !== -1) {
                        state.allRequests[index] = {
                            ...state.allRequests[index],
                            ...updatedRequest,
                        };
                    }

                    // Update employee list if available
                    const myIndex = state.myRequests.findIndex(
                        (item) => item._id === updatedRequest._id
                    );

                    if (myIndex !== -1) {
                        state.myRequests[myIndex] = {
                            ...state.myRequests[myIndex],
                            ...updatedRequest,
                        };
                    }
                }

                state.error.reviewRequest = null;
            })
            .addCase(reviewRegularization.rejected, (state, action) => {
                state.loading.reviewRequest = false;
                state.error.reviewRequest =
                    action.payload ||
                    "Failed to review regularization request.";
            });
    },
});

// ==========================================
// EXPORT ACTIONS
// ==========================================
export const {
    clearRegularizationErrors,
    clearCreatedRegularizationRequest,
    clearRegularizationReview,
    clearMyRegularization,
    clearAllRegularization,
} = regularizationSlice.actions;

// ==========================================
// EXPORT REDUCER
// ==========================================
export default regularizationSlice.reducer;