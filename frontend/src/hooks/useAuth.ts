import axios, { type AxiosRequestConfig } from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/user/userSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const userId = user?.userId ?? null;

  const config: AxiosRequestConfig = {
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: user?.token
      ? { Authorization: `Bearer ${user.token}` }
      : {},
  };

  const request = axios.create(config);

  request.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const code = error.response?.data?.code;
      console.log("Interceptor caught an error:", error);
      if (status === 401 && code === "TOKEN_EXPIRED") {
        dispatch(loginUser(null));
        localStorage.clear();
        window.location.href = "/login"; // or navigate with router
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  return { request, userId };
}