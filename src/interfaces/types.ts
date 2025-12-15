import type { User } from "./interfaces";

export type Login = {
    email: string;
    password: string;
  }
  
  export type LoginResponse = {
    user: User;
    message: string;
    access_token: string;
  };
  
  export type ResetPasswordRequest = {
    email: string;
  };
  
  export type ResetPasswordResponse = {
    message: string;
  };