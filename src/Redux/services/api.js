import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5506/api/v1",

    // IMPORTANT:
    // Browser will automatically send the HTTP-only
    // authentication cookie with API requests.
    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});

export default api;