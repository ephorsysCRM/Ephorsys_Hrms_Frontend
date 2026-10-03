import api from "../../services/api";
import toast from "react-hot-toast";

import {
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

    // ERROR
    departmentFailure,
} from "./departmentSlice";


// =========================================================
// CREATE DEPARTMENT
// POST /department/create
// =========================================================

export const createDepartment =
    (departmentData) =>
        async (dispatch) => {

            try {

                dispatch(createDepartmentStart());

                const { data } = await api.post(
                    "/department/create",
                    departmentData
                );

                dispatch(
                    createDepartmentSuccess(data.data)
                );

                toast.success(
                    data.message ||
                    "Department created successfully"
                );

                return {
                    success: true,
                    data: data.data,
                };

            } catch (error) {

                const message =
                    error.response?.data?.message ||
                    "Failed to create department";

                dispatch(
                    departmentFailure(message)
                );

                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };


// =========================================================
// GET ALL DEPARTMENTS
// GET /department/all?page=1&limit=10
// =========================================================

export const getAllDepartments =
    (page = 1, limit = 10) =>
        async (dispatch) => {

            try {

                dispatch(getDepartmentsStart());

                const { data } = await api.get(
                    `/department/all?page=${page}&limit=${limit}`
                );

                dispatch(
                    getDepartmentsSuccess({
                        departments:
                            data.data?.departments || [],

                        pagination:
                            data.data?.pagination || {},
                    })
                );

                return {
                    success: true,
                    data: data.data,
                };

            } catch (error) {

                const message =
                    error.response?.data?.message ||
                    "Failed to load departments";

                dispatch(
                    departmentFailure(message)
                );

                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };


// =========================================================
// GET SINGLE DEPARTMENT
// GET /department/:id
// =========================================================

// GET SINGLE
export const getDepartment =
    (departmentId) =>
        async (dispatch) => {
            try {
                dispatch(getDepartmentStart());

                const { data } = await api.get(
                    `/department/${departmentId}`
                );

                dispatch(
                    getDepartmentSuccess(
                        data.data?.department || null
                    )
                );

                return {
                    success: true,
                    data: data.data,
                };
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Failed to load department";

                dispatch(departmentFailure(message));
                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };


// =========================================================
// UPDATE DEPARTMENT
// PUT /department/:id
// =========================================================

export const updateDepartment =
    (departmentId, departmentData) =>
        async (dispatch) => {

            try {

                dispatch(updateDepartmentStart());

                const { data } = await api.put(
                    `/department/${departmentId}`,
                    departmentData
                );

                dispatch(
                    updateDepartmentSuccess(data.data)
                );

                toast.success(
                    data.message ||
                    "Department updated successfully"
                );

                return {
                    success: true,
                    data: data.data,
                };

            } catch (error) {

                const message =
                    error.response?.data?.message ||
                    "Failed to update department";

                dispatch(
                    departmentFailure(message)
                );

                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };


// =========================================================
// DELETE DEPARTMENT
// DELETE /department/:id
// =========================================================

export const deleteDepartment =
    (departmentId) =>
        async (dispatch) => {

            try {

                dispatch(deleteDepartmentStart());

                const { data } = await api.delete(
                    `/department/${departmentId}`
                );

                dispatch(
                    deleteDepartmentSuccess(departmentId)
                );

                toast.success(
                    data.message ||
                    "Department deleted successfully"
                );

                return {
                    success: true,
                    data: data.data,
                };

            } catch (error) {

                const message =
                    error.response?.data?.message ||
                    "Failed to delete department";

                dispatch(
                    departmentFailure(message)
                );

                toast.error(message);

                return {
                    success: false,
                    message,
                };
            }
        };