import api from "../../services/api";
import toast from "react-hot-toast";

import {
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
    getDepartmentEmployeesStart,
    getDepartmentEmployeesSuccess,
    getDepartmentEmployeesFailure,
    departmentFailure,
} from "./departmentSlice";

// =========================================================
// CREATE DEPARTMENT
// =========================================================

export const createDepartment = (departmentData) => async (dispatch) => {
    try {
        dispatch(createDepartmentStart());

        const { data } = await api.post(
            "/department/create",
            departmentData
        );

        dispatch(createDepartmentSuccess(data.data));

        toast.success(data.message || "Department created successfully");

        return { success: true, data: data.data };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Failed to create department";

        dispatch(departmentFailure(message));
        toast.error(message);

        return { success: false, message };
    }
};

// =========================================================
// GET ALL DEPARTMENTS
// =========================================================

export const getAllDepartments =
    (page = 1, limit = 10) =>
        async (dispatch) => {
            try {
                dispatch(getDepartmentsStart());

                const { data } = await api.get(
                    `/department/all?page=${page}& limit=${limit} `
                );

                dispatch(
                    getDepartmentsSuccess({
                        departments: data.data?.departments || [],
                        pagination: data.data?.pagination || {},
                    })
                );

                return { success: true, data: data.data };
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Failed to load departments";

                dispatch(departmentFailure(message));
                toast.error(message);

                return { success: false, message };
            }
        };

// =========================================================
// GET SINGLE DEPARTMENT
// =========================================================

export const getDepartment = (departmentId) => async (dispatch) => {
    try {
        dispatch(getDepartmentStart());

        const { data } = await api.get(`/department/${departmentId} `);

        const department = data.data?.department || null;

        dispatch(getDepartmentSuccess(department));

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

        return { success: false, message };
    }
};

// =========================================================
// UPDATE DEPARTMENT
// Supports assigning / changing / removing Department Head
// =========================================================

export const updateDepartment =
    (departmentId, departmentData) =>
        async (dispatch) => {
            try {
                dispatch(updateDepartmentStart());

                // Normalize the Department Head value.
                // It must be an Employee MongoDB ObjectId or null.
                const payload = {
                    ...departmentData,
                    ...(departmentData.departmentHead !== undefined && {
                        departmentHead:
                            departmentData.departmentHead || null,
                    }),
                };

                console.log("Updating Department ID:", departmentId);
                console.log("Department Update Payload:", payload);

                const { data } = await api.put(
                    `/department/${departmentId} `,
                    payload
                );

                console.log("Department Update API Response:", data);
                console.log(
                    "Saved Department Head:",
                    data.data?.departmentHead
                );

                dispatch(updateDepartmentSuccess(data.data));

                toast.success(
                    data.message || "Department updated successfully"
                );

                return {
                    success: true,
                    data: data.data,
                };
            } catch (error) {
                console.error(
                    "Update Department Error:",
                    error.response?.data || error
                );

                const message =
                    error.response?.data?.message ||
                    "Failed to update department";

                dispatch(departmentFailure(message));
                toast.error(message);

                return { success: false, message };
            }
        };

// =========================================================
// DELETE DEPARTMENT
// =========================================================

export const deleteDepartment = (departmentId) => async (dispatch) => {
    try {
        dispatch(deleteDepartmentStart());

        const { data } = await api.delete(`/department/${departmentId} `);

        dispatch(deleteDepartmentSuccess(departmentId));

        toast.success(data.message || "Department deleted successfully");

        return { success: true, data: data.data };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Failed to delete department";

        dispatch(departmentFailure(message));
        toast.error(message);

        return { success: false, message };
    }
};

// =========================================================
// GET EMPLOYEES BY DEPARTMENT
// Used for Department Head dropdown
// =========================================================

export const getEmployeesByDepartment =
    (departmentId) =>
        async (dispatch) => {
            try {
                if (!departmentId) {
                    const message = "Department ID is required";

                    dispatch(getDepartmentEmployeesFailure(message));

                    return { success: false, message };
                }

                dispatch(getDepartmentEmployeesStart());

                const { data } = await api.get(
                    `/employee/department/${departmentId} `
                );

                const employees =
                    data.data?.employees ||
                    data.employees ||
                    [];

                console.log("Department Employees:", employees);

                dispatch(getDepartmentEmployeesSuccess(employees));

                return {
                    success: true,
                    data: employees,
                };
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Failed to load department employees";

                dispatch(getDepartmentEmployeesFailure(message));
                toast.error(message);

                return { success: false, message };
            }
        };