import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/",
    // baseURL: "https://crm-admin-temp-backend.onrender.com/api/",
});

axiosInstance.interceptors.request.use((config) => {
    if (JSON.parse(localStorage.getItem("userData") || "{}")?.accessToken) {
        config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userData") || "{}")?.accessToken
            }`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
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
                // 🚨 Refresh token is expired or invalid
                localStorage.removeItem("accessToken"); // window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
