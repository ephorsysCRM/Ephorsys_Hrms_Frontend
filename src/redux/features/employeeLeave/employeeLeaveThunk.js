import api from "../../services/api";

// =====================================================
// CREATE / ASSIGN EMPLOYEE LEAVE
// POST /employee-leave/create/:employeeId
// =====================================================

export const createEmployeeLeave = (
    employeeId,
    leaveData
) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employeeLeave/createEmployeeLeaveRequest",
            });

            const { data } = await api.post(
                `/employee-leave/create/${employeeId}`,
                leaveData
            );

            if (!data?.success) {
                throw new Error(
                    data?.message || "Failed to assign employee leave"
                );
            }

            dispatch({
                type: "employeeLeave/createEmployeeLeaveSuccess",
                payload: data,
            });

            return data;

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to assign employee leave";

            dispatch({
                type: "employeeLeave/createEmployeeLeaveFailure",
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
// UPDATE EMPLOYEE LEAVE
// PUT /employee-leave/update/:employeeId/:year
// =====================================================

export const updateEmployeeLeave = (
    employeeId,
    year,
    leaveData
) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employeeLeave/updateEmployeeLeaveRequest",
            });

            const { data } = await api.put(
                `/employee-leave/update/${employeeId}/${year}`,
                leaveData
            );

            if (!data?.success) {
                throw new Error(
                    data?.message || "Failed to update employee leave"
                );
            }

            dispatch({
                type: "employeeLeave/updateEmployeeLeaveSuccess",
                payload: data,
            });

            return data;

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update employee leave";

            dispatch({
                type: "employeeLeave/updateEmployeeLeaveFailure",
                payload: message,
            });

            return {
                success: false,
                message,
            };
        }
    };
};