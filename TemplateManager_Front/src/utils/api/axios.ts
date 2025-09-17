import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://localhost:7065/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});
axiosInstance.interceptors.response.use(response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url != "/refresh") {
            originalRequest._retry = true;
            try {
                const refreshRes = await axiosInstance.get('/refresh');
                return refreshRes ? axiosInstance(originalRequest) : Promise.reject(error);
            }
            catch (error) {
                window.location.href = "/";
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)
export default axiosInstance;