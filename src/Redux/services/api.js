import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5506/api/v1",

    withCredentials: true,
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {

        /*
         * For normal JSON requests
         */
        if (
            config.data &&
            !(config.data instanceof FormData)
        ) {

            config.headers[
                "Content-Type"
            ] = "application/json";

        }


        /*
         * For FormData requests
         *
         * IMPORTANT:
         * Do not manually set multipart/form-data.
         *
         * Browser/Axios will automatically add
         * the correct boundary.
         */

        if (
            config.data instanceof FormData
        ) {

            delete config.headers[
                "Content-Type"
            ];

        }


        return config;

    },

    (error) => {
        return Promise.reject(error);
    }
);


export default api;