


// =====================================================
// CREATE EMPLOYEE
// =====================================================

import api from "../../services/api";

export const createEmployee =
    (employeeData) =>
        async (dispatch) => {

            try {

                dispatch({
                    type:
                        "employee/createEmployeeRequest",
                });


                // =========================================
                // DEBUG
                // =========================================

                console.log(
                    "================================"
                );

                console.log(
                    "EMPLOYEE FORMDATA"
                );

                console.log(
                    "================================"
                );


                for (
                    const [
                        key,
                        value
                    ] of employeeData.entries()
                ) {

                    if (
                        value instanceof File
                    ) {

                        console.log(
                            key,
                            {
                                name:
                                    value.name,

                                type:
                                    value.type,

                                size:
                                    value.size,
                            }
                        );

                    } else {

                        console.log(
                            key,
                            value
                        );

                    }

                }


                // =========================================
                // API REQUEST
                // =========================================

                const {
                    data,
                } = await api.post(
                    "/employee/create",
                    employeeData
                );


                // =========================================
                // RESPONSE
                // =========================================

                console.log(
                    "CREATE EMPLOYEE RESPONSE:",
                    data
                );


                if (
                    !data?.success
                ) {

                    throw new Error(
                        data?.message ||
                        "Failed to create employee"
                    );

                }


                // =========================================
                // SUCCESS
                // =========================================

                dispatch({
                    type:
                        "employee/createEmployeeSuccess",
                    payload:
                        data,
                });


                return data;

            } catch (error) {

                console.error(
                    "================================"
                );

                console.error(
                    "CREATE EMPLOYEE ERROR"
                );

                console.error(
                    "================================"
                );

                console.error(
                    error?.response?.data ||
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create employee";


                dispatch({
                    type:
                        "employee/createEmployeeFailure",
                    payload:
                        message,
                });


                return {
                    success: false,
                    message,
                };

            }

        };