import axios from "axios";

console.log("hellooooo");
const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/",
});

axiosInstance.interceptors.request.use((config) => {
    if (JSON.parse(localStorage.getItem("userData") || "{}")?.accessToken) {
        console.log("helloooo333333");
        config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userData") || "{}")?.accessToken
            }`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("helloooo444444");
        const originalRequest = error.config;
        console.log("Error:");
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("You are not authorized. Please log in again.");
            originalRequest._retry = true;
            console.log("Retrying request...");
            try {
                console.log("Attempting to refresh access token...");
                const res = await axiosInstance.post(
                    "auth/generate-new-token",
                    {
                        refreshToken: JSON.parse(localStorage.getItem("userData") || "{}")?.refreshToken
                    }
                );
                const newAccessToken = res.data.accessToken;
                localStorage.setItem("userData", JSON.stringify({ ...JSON.parse(localStorage.getItem("userData") || "{}"), accessToken: newAccessToken }));
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (err) {
                console.log(
                    "Failed to refresh access token. You will be logged out.",
                    err
                );
                // 🚨 Refresh token is expired or invalid
                localStorage.removeItem("accessToken"); // window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
