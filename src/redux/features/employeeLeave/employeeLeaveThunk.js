
import api from "../../services/api";

// =====================================================
// CREATE / ASSIGN EMPLOYEE LEAVE
// POST /employee-leave/create/:employeeId
// =====================================================

export const createEmployeeLeave = (employeeId, leaveData) => {
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

            return { success: false, message };
        }
    };
};


// =====================================================
// UPDATE EMPLOYEE LEAVE
// PUT /employee-leave/update/:employeeId/:year
// =====================================================

export const updateEmployeeLeave = (employeeId, year, leaveData) => {
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

            return { success: false, message };
        }
    };
};


// =====================================================
// APPLY FOR LEAVE
// POST /employee-leave/apply
// Employee and HR
// =====================================================

export const applyForLeave = (leaveData) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employeeLeave/applyLeaveRequest",
            });

            const { data } = await api.post(
                "/employee-leave/apply",
                leaveData
            );

            if (!data?.success) {
                throw new Error(
                    data?.message || "Failed to apply for leave"
                );
            }

            dispatch({
                type: "employeeLeave/applyLeaveSuccess",
                payload: data,
            });

            return data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to apply for leave";

            dispatch({
                type: "employeeLeave/applyLeaveFailure",
                payload: message,
            });

            return { success: false, message };
        }
    };
};


// =====================================================
// GET MY LEAVE APPLICATIONS
// GET /employee-leave/my-applications
// Employee and HR
// =====================================================

export const getMyLeaveApplications = (params = {}) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employeeLeave/getMyLeaveApplicationsRequest",
            });

            const { data } = await api.get(
                "/employee-leave/my-applications",
                {
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        ...(params.status && {
                            status: params.status,
                        }),
                        ...(params.leaveType && {
                            leaveType: params.leaveType,
                        }),
                    },
                }
            );

            if (!data?.success) {
                throw new Error(
                    data?.message || "Failed to fetch leave applications"
                );
            }

            dispatch({
                type: "employeeLeave/getMyLeaveApplicationsSuccess",
                payload: data,
            });

            return data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch leave applications";

            dispatch({
                type: "employeeLeave/getMyLeaveApplicationsFailure",
                payload: message,
            });

            return { success: false, message };
        }
    };
};


// =====================================================
// GET ALL LEAVE APPLICATIONS
// GET /employee-leave/all-applications
// Admin: All requests
// HR: Employee requests only
// =====================================================

export const getAllLeaveApplications = (params = {}) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employeeLeave/getAllLeaveApplicationsRequest",
            });

            const { data } = await api.get(
                "/employee-leave/all-applications",
                {
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,

                        ...(params.status && {
                            status: params.status,
                        }),

                        ...(params.leaveType && {
                            leaveType: params.leaveType,
                        }),
                    },
                }
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "Failed to fetch all leave applications"
                );
            }

            dispatch({
                type: "employeeLeave/getAllLeaveApplicationsSuccess",
                payload: data,
            });

            return data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch all leave applications";

            dispatch({
                type: "employeeLeave/getAllLeaveApplicationsFailure",
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
// REVIEW LEAVE APPLICATION (APPROVE / REJECT)
// PATCH /employee-leave/:applicationId/review
// Admin and HR
// =====================================================

export const reviewLeaveApplication = (applicationId, reviewData) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "employeeLeave/reviewLeaveApplicationRequest",
            });

            const { data } = await api.patch(
                `/employee-leave/${applicationId}/review`,
                reviewData
            );

            if (!data?.success) {
                throw new Error(
                    data?.message || "Failed to review leave application"
                );
            }

            dispatch({
                type: "employeeLeave/reviewLeaveApplicationSuccess",
                payload: data,
            });

            return data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to review leave application";

            dispatch({
                type: "employeeLeave/reviewLeaveApplicationFailure",
                payload: message,
            });

            return {
                success: false,
                message,
            };
        }
    };
};
