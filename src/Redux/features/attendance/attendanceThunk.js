
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ==========================================
// CHECK-IN
// ==========================================
export const checkIn = createAsyncThunk(
    "attendance/checkIn",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post("/attendance/check-in", payload);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Check-in failed."
            );
        }
    }
);

// ==========================================
// CHECK-OUT
// ==========================================
export const checkOut = createAsyncThunk(
    "attendance/checkOut",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post("/attendance/check-out", payload);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Check-out failed."
            );
        }
    }
);

// ==========================================
// GET MY ATTENDANCE
// ==========================================
export const getMyAttendance = createAsyncThunk(
    "attendance/getMyAttendance",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get("/attendance/my-attendance", {
                params,
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch attendance."
            );
        }
    }
);

// ==========================================
// CREATE ATTENDANCE REQUEST
// ==========================================
export const createAttendanceRequest = createAsyncThunk(
    "attendance/createAttendanceRequest",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/attendance/requests",
                payload
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to submit attendance request."
            );
        }
    }
);

// ==========================================
// GET ALL ATTENDANCE — HR PANEL
// ==========================================
export const getAllAttendance = createAsyncThunk(
    "attendance/getAllAttendance",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get("/attendance/all", {
                params,
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch all attendance records."
            );
        }
    }
);

// ==========================================
// GET ATTENDANCE DETAILS BY ID — HR PANEL
// ==========================================
export const getAttendanceDetails = createAsyncThunk(
    "attendance/getAttendanceDetails",
    async (attendanceId, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `/attendance/details/${attendanceId}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch attendance details."
            );
        }
    }
);

// ==========================================
// UPDATE ATTENDANCE STATUS — HR / ADMIN
// PATCH /attendance/update-status/:attendanceId
// ==========================================
export const updateAttendanceStatus = createAsyncThunk(
    "attendance/updateAttendanceStatus",
    async (
        { attendanceId, status, reason = "" },
        { rejectWithValue }
    ) => {
        try {
            if (!attendanceId) {
                return rejectWithValue("Attendance ID is required.");
            }

            const response = await api.patch(
                `/attendance/update-status/${attendanceId}`,
                {
                    status,
                    reason,
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update attendance status."
            );
        }
    }
);
