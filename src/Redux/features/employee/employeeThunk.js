
import api from "../../services/api";

// =====================================================
// CREATE EMPLOYEE
// =====================================================

export const createEmployee = (employeeData) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employee/createEmployeeRequest",
            });

            const { data } = await api.post(
                "/employee/create",
                employeeData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                        "Failed to create employee"
                );
            }

            dispatch({
                type: "employee/createEmployeeSuccess",
                payload: data,
            });

            return data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to create employee";

            dispatch({
                type: "employee/createEmployeeFailure",
                payload: message,
            });

            return {
                success: false,
                message,
            };
        }
    };
};

// =====================================================
// GET ALL EMPLOYEES
// =====================================================

export const getAllEmployees = (
    page = 1,
    limit = 10
) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employee/getAllEmployeesRequest",
            });

            const { data } = await api.get(
                "/employee/all",
                {
                    params: {
                        page,
                        limit,
                    },
                }
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                        "Failed to fetch employees"
                );
            }

            dispatch({
                type: "employee/getAllEmployeesSuccess",
                payload: data,
            });

            return data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch employees";

            dispatch({
                type: "employee/getAllEmployeesFailure",
                payload: message,
            });

            return {
                success: false,
                message,
            };
        }
    };
};

// =====================================================
// GET SINGLE EMPLOYEE
// =====================================================

export const getEmployeeById = (
    employeeId
) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employee/getEmployeeByIdRequest",
            });

            const { data } = await api.get(
                `/employee/${employeeId}`
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                        "Failed to fetch employee"
                );
            }

            dispatch({
                type: "employee/getEmployeeByIdSuccess",
                payload: data,
            });

            return data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch employee";

            dispatch({
                type: "employee/getEmployeeByIdFailure",
                payload: message,
            });

            return {
                success: false,
                message,
            };
        }
    };
};