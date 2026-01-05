import { useMutation, useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/user/userSlice";
import type { User } from "../interfaces/interfaces";
import type { Login, LoginResponse } from "../interfaces/types";
import { confirmationMessage } from "../components/common/ToastMessage";
import { useShowErrorMessage } from "../components/common/ShowErrorMessage";


const useUser = () => {
  const { request } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showErrorMessage = useShowErrorMessage();
 const { user } = useSelector((state: any) => state.user);

  // Placeholder for user-related logic
  // Mutations
  const signup = useMutation({
    mutationFn: async (payload: User | any) => {
      const response = await request.post("/accounts/signup", payload);
      return response.data;
    },
    onSuccess: (data) => {
      confirmationMessage("User created successfully. Please verify your email to activate the account.", "success");
      navigate("/login");
      console.log("User signed up:", data);
    },
    onError: (error: any) => {
      showErrorMessage(error?.response?.data?.message || error?.response?.data?.error || "Error signing up user");
      console.log("Error signing up user:", error);
    },
    onSettled: () => {
      console.log("Signup mutation settled.");
    },
  });

  const login = useMutation({
    mutationFn: async (payload: Login) => {
      const response = await request.post("/accounts/login/", payload);
      return response.data as LoginResponse;
    },
    onSuccess: (data: LoginResponse) => {
      const token = data?.access_token || "";

      if (!token) {
        showErrorMessage("Token not found");
        console.error("Token not found");
        return;
      }
      const userId = data?.user?.id || "";
      if (!userId) {
        showErrorMessage("User id not found");
        return;
      }
      confirmationMessage("Logged In successfully!", "success");
      dispatch(loginUser({ ...data.user, userId: data.user.id, token }));
      navigate("/dashboard");
    },
    onError: (error: any) => {
      showErrorMessage(error?.response?.data?.message || error?.response?.data?.error || "Error signing up user");

      console.log("Error logging in user:", error);
    },
    onSettled: () => {
      console.log("Login mutation settled.");
    },
  });

  const resetPassword = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await request.post("/accounts/reset-password", payload);
      return response.data;
    },
    onSuccess: (data) => {
      confirmationMessage("Password reset link sent! Please check your email.", "success");
      navigate("/set-password");
      console.log("Password reset link sent:", data);
    },
    onError: (error: any) => {
      showErrorMessage(error?.response?.data?.message || error?.response?.data?.error || "Error sending password reset link");
      console.log("Error sending password reset link:", error);
    },
    onSettled: () => {
      console.log("Reset password mutation settled.");
    },
  });

  const setPassword = useMutation({
    mutationFn: async (payload: { email: string, challenge: string; newPassword: string }) => {
      const response = await request.post("/accounts/set-password", payload);
      return response.data;
    },
    onSuccess: (data) => {
      confirmationMessage("Password has been reset successfully! You can login now.", "success");
      navigate("/login");
      console.log("Password reset successfully:", data);
    },
    onError: (error: any) => {
      showErrorMessage(error?.response?.data?.message || error?.response?.data?.error || "Error resetting password");
      console.log("Error resetting password:", error);
    },
    onSettled: () => {
      console.log("Set password mutation settled.");
    },
  });

  const verifyEmail = useMutation({
    mutationFn: async (payload: { email: string; token: string }) => {
      const response = await request.get("/accounts/verify-email", {
        params: payload,
      });
      return response.data;
    },
  });

  const designersQuery = useQuery({
  queryKey: ["users", "designers"],
  queryFn: async () => {
    console.log("User Role in designersQuery:", user?.role);
    if(user.role== 'ADMIN' || user.role== 'QC'){
    const response = await request.get("/users/designers");
    return response.data?.data ?? [];
    } else {
      return
    }
  },
  onError: (error: any) => {
    showErrorMessage(
      error?.response?.data?.message || "Failed to fetch designers"
    );
  },
  refetchOnWindowFocus: false,
  // staleTime: 5 * 60 * 1000, // cache designers
});



const assignCase = useMutation({

  mutationFn: async (payload: {
    caseId: string;
    designerId?: string;
    qcId?: string;
  }) => {
    console.log("User Role in assignCase Mutation:",payload.caseId);
    const response = await request.post(`/cases/${payload.caseId}/assign`, payload);
    
    return response.data;
  },
  onSuccess: () => {
    confirmationMessage("Case assigned successfully", "success");
  },
  onError: (error: any) => {
    showErrorMessage(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to assign case"
    );
  },
});

  return {
    signup,
    login,
    resetPassword,
    setPassword,
    verifyEmail,
    designersQuery,
    assignCase
  };
};

export default useUser;
