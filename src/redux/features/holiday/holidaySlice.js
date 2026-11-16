
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // =====================================================
    // HOLIDAY LIST
    // =====================================================

    holidays: [],

    // =====================================================
    // SINGLE HOLIDAY
    // =====================================================

    holiday: null,

    // =====================================================
    // SELECTED YEAR
    // =====================================================

    selectedYear: new Date().getFullYear(),

    // =====================================================
    // PAGINATION
    // =====================================================

    pagination: {
        currentPage: 1,
        limit: 10,
        totalHolidays: 0,
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

const holidaySlice = createSlice({
    name: "holiday",

    initialState,

    reducers: {
        // =================================================
        // CREATE HOLIDAY
        // =================================================

        createHolidayStart: (state) => {
            state.creating = true;
            state.error = null;
        },

        createHolidaySuccess: (state, action) => {
            state.creating = false;
            state.error = null;

            if (action.payload) {
                state.holidays.unshift(action.payload);
                state.pagination.totalHolidays += 1;
            }
        },

        // =================================================
        // GET ALL HOLIDAYS BY YEAR
        // =================================================

        getHolidaysStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        getHolidaysSuccess: (state, action) => {
            state.loading = false;
            state.error = null;

            state.holidays = action.payload.holidays || [];

            state.selectedYear =
                action.payload.year || state.selectedYear;

            state.pagination = {
                ...state.pagination,
                ...(action.payload.pagination || {}),
            };
        },

        // =================================================
        // GET SINGLE HOLIDAY
        // =================================================

        getHolidayStart: (state) => {
            state.fetchingSingle = true;
            state.error = null;
        },

        getHolidaySuccess: (state, action) => {
            state.fetchingSingle = false;
            state.error = null;

            state.holiday = action.payload;
        },

        // =================================================
        // UPDATE HOLIDAY
        // =================================================

        updateHolidayStart: (state) => {
            state.updating = true;
            state.error = null;
        },

        updateHolidaySuccess: (state, action) => {
            state.updating = false;
            state.error = null;

            const updatedHoliday = action.payload;

            state.holiday = updatedHoliday;

            const index = state.holidays.findIndex(
                (holiday) =>
                    holiday._id === updatedHoliday?._id
            );

            if (index !== -1) {
                state.holidays[index] = updatedHoliday;
            }
        },

        // =================================================
        // DELETE HOLIDAY
        // =================================================

        deleteHolidayStart: (state) => {
            state.deleting = true;
            state.error = null;
        },

        deleteHolidaySuccess: (state, action) => {
            state.deleting = false;
            state.error = null;

            const deletedHolidayId = action.payload;

            state.holidays = state.holidays.filter(
                (holiday) =>
                    holiday._id !== deletedHolidayId
            );

            if (state.pagination.totalHolidays > 0) {
                state.pagination.totalHolidays -= 1;
            }

            if (state.holiday?._id === deletedHolidayId) {
                state.holiday = null;
            }
        },

        // =================================================
        // COMMON FAILURE
        // =================================================

        holidayFailure: (state, action) => {
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

        clearHolidayError: (state) => {
            state.error = null;
        },

        // =================================================
        // CLEAR SINGLE HOLIDAY
        // =================================================

        clearHoliday: (state) => {
            state.holiday = null;
        },

        // =================================================
        // CLEAR HOLIDAY LIST
        // =================================================

        clearHolidays: (state) => {
            state.holidays = [];
            state.pagination = initialState.pagination;
        },
    },
});

export const {
    // CREATE
    createHolidayStart,
    createHolidaySuccess,

    // GET ALL
    getHolidaysStart,
    getHolidaysSuccess,

    // GET SINGLE
    getHolidayStart,
    getHolidaySuccess,

    // UPDATE
    updateHolidayStart,
    updateHolidaySuccess,

    // DELETE
    deleteHolidayStart,
    deleteHolidaySuccess,

    // FAILURE
    holidayFailure,

    // CLEAR
    clearHolidayError,
    clearHoliday,
    clearHolidays,
} = holidaySlice.actions;

export default holidaySlice.reducer;
