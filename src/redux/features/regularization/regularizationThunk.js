import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ==========================================
// CREATE REGULARIZATION REQUEST — EMPLOYEE
// POST /regularization/request
// ==========================================
export const createRegularizationRequest = createAsyncThunk(
    "regularization/createRegularizationRequest",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/regularization/request",
                payload
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to submit regularization request."
            );
        }
    }
);

// ==========================================
// GET MY REGULARIZATION REQUESTS — EMPLOYEE
// GET /regularization/my-requests
// ==========================================
export const getMyRegularization = createAsyncThunk(
    "regularization/getMyRegularization",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(
                "/regularization/my-requests",
                { params }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch your regularization requests."
            );
        }
    }
);

// ==========================================
// GET ALL REGULARIZATION REQUESTS — HR / ADMIN
// GET /regularization/all
// ==========================================
export const getAllRegularization = createAsyncThunk(
    "regularization/getAllRegularization",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(
                "/regularization/all",
                { params }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch regularization requests."
            );
        }
    }
);

// ==========================================
// APPROVE / REJECT — HR / ADMIN
// PATCH /regularization/review/:regularizationId
// ==========================================
export const reviewRegularization = createAsyncThunk(
    "regularization/reviewRegularization",
    async (
        { regularizationId, status, rejectionReason = "" },
        { rejectWithValue }
    ) => {
        try {
            if (!regularizationId) {
                return rejectWithValue(
                    "Regularization request ID is required."
                );
            }

            const response = await api.patch(
                `/regularization/review/${regularizationId}`,
                {
                    status,
                    ...(status === "rejected" && { rejectionReason }),
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to review regularization request."
            );
        }
    }
);