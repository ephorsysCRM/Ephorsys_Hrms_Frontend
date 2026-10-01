import api from "../../services/api";

import toast from "react-hot-toast";


// =====================================================
// CREATE DEPARTMENT
// =====================================================

export const createDepartment =
    (departmentData) =>
        async () => {

            try {

                const { data } =
                    await api.post(
                        "/department/create",
                        departmentData
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

                const msg =
                    error.response?.data?.message ||
                    "Failed to create department";


                toast.error(msg);


                return {

                    success: false,

                    message: msg,

                };
            }
        };