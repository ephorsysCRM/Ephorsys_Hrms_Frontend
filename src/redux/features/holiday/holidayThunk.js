
import api from "../../services/api";
import toast from "react-hot-toast";

import {
    createHolidayStart,
    createHolidaySuccess,

    getHolidaysStart,
    getHolidaysSuccess,

    updateHolidayStart,
    updateHolidaySuccess,

    deleteHolidayStart,
    deleteHolidaySuccess,

    holidayFailure,
} from "./holidaySlice";

// =========================================================
// CREATE HOLIDAY
// POST /holiday/create
// =========================================================

export const createHoliday = (holidayData) => async (dispatch) => {
    try {
        dispatch(createHolidayStart());

        const { data } = await api.post(
            "/holiday/create",
            holidayData
        );

        const holiday = data.data?.holiday || data.data;

        dispatch(createHolidaySuccess(holiday));

        toast.success(
            data.message || "Holiday created successfully"
        );

        return {
            success: true,
            data: holiday,
        };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Failed to create holiday";

        dispatch(holidayFailure(message));
        toast.error(message);

        return {
            success: false,
            message,
        };
    }
};

// =========================================================
// GET ALL HOLIDAYS BY YEAR
// GET /holiday/year/:year
// =========================================================

export const getAllHolidays =
    (year = new Date().getFullYear(), page = 1, limit = 10) =>
        async (dispatch) => {
            try {
                dispatch(getHolidaysStart());

                const { data } = await api.get(
                    `/holiday/year/${year}?page=${page}&limit=${limit}`
                );

                dispatch(
                    getHolidaysSuccess({
                        holidays: data.data?.holidays || [],
                        pagination: data.data?.pagination || {},
                        year,
                    })
                );

                return {
                    success: true,
                    data: data.data,
                };
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Failed to load holidays";

                dispatch(holidayFailure(message));
                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };

// =========================================================
// UPDATE HOLIDAY
// PUT /holiday/:id
// =========================================================

export const updateHoliday =
    (holidayId, holidayData) =>
        async (dispatch) => {
            try {
                dispatch(updateHolidayStart());

                const { data } = await api.put(
                    `/holiday/${holidayId}`,
                    holidayData
                );

                const updatedHoliday =
                    data.data?.holiday || data.data;

                dispatch(updateHolidaySuccess(updatedHoliday));

                toast.success(
                    data.message || "Holiday updated successfully"
                );

                return {
                    success: true,
                    data: updatedHoliday,
                };
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Failed to update holiday";

                dispatch(holidayFailure(message));
                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };

// =========================================================
// DELETE HOLIDAY
// DELETE /holiday/:id
// =========================================================

export const deleteHoliday =
    (holidayId) =>
        async (dispatch) => {
            try {
                dispatch(deleteHolidayStart());

                const { data } = await api.delete(
                    `/holiday/${holidayId}`
                );

                dispatch(deleteHolidaySuccess(holidayId));

                toast.success(
                    data.message || "Holiday deleted successfully"
                );

                return {
                    success: true,
                    data: data.data,
                };
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Failed to delete holiday";

                dispatch(holidayFailure(message));
                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };
