import axios from "axios";

const api = axios.create({
    // Local Development
    // baseURL: "http://localhost:8800/api/v1",

    // Production
    // baseURL: "",

    withCredentials: true,
});

export default api;
