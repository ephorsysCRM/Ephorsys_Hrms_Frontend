
import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "https://ephorsys-hrms-backend.onrender.com",

    withCredentials: true,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {
        // Do not manually set Content-Type for FormData.
        // Browser/Axios must generate the multipart boundary.
        if (
            typeof FormData !== "undefined" &&
            config.data instanceof FormData
        ) {
            delete config.headers["Content-Type"];
        } else if (config.data != null) {
            config.headers.set
                ? config.headers.set("Content-Type", "application/json")
                : (config.headers["Content-Type"] = "application/json");
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
