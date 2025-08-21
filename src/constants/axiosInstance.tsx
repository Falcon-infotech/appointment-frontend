import { baseUrl } from "@/lib/base";
import axios from "axios";

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})

let isRefreshing: Boolean = false
let failedQueue: any[] = []


const processQUeue = (error: any, token: string | null) => {
    failedQueue.forEach((prom: any) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    })
    failedQueue = [];
}



api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessTokennew');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



api.interceptors.response.use((res) => res, async (error) => {
    const originalConfig = error.config;
    console.log("enterd here")
    if (error.response?.status === 401 && error.response?.data?.message === "TokenExpired" && !originalConfig._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalConfig.headers.Authorization = `Bearer ${token}`;
                    return api(originalConfig);
                })
                .catch((err) => {
                    console.log(err)
                    return Promise.reject(err);
                });
        }
        originalConfig._retry = true;
        isRefreshing = true;

        try {
            console.log("here creating new")
            const res = await axios.post(
                `${baseUrl}/api/auth/refreshToken`,
                {},
                { withCredentials: true }
            );
            const newAccessToken = res.data.accessToken;
            console.log(newAccessToken ," new accesstoken");
            localStorage.setItem('accessTokennew', newAccessToken);
            processQUeue(null, newAccessToken)
            originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalConfig);
        } catch (error) {
            processQUeue(error, null);
        }finally{
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
})


export default api;