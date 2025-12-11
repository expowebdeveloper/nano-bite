import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../../components/common/Buttons/Button";
import Input from "../../components/common/Input/Input";
import main from "../../assets/images/main2.png";
import logo from "../../assets/images/logo.png";
import useUser from "../../hooks/useUser";
import { ResetPasswordRequest } from "../../interfaces/types";
import ScreenLoader from "../../components/common/ScreenLoader/ScreenLoader";

interface FormValues {
  email: string;
}

export const ResetPassword = () => {
  const { resetPassword } = useUser();
  const formConfig = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit } = formConfig;

  const onSubmit = (data: FormValues) => {
    const resetPasswordPayload: ResetPasswordRequest = {
      email: data.email,
    };

    // Call the resetPassword mutation
    resetPassword.mutate(resetPasswordPayload);
  };

  return (
    <>
      {resetPassword.isPending && <ScreenLoader isLoading={resetPassword.isPending} />}
      {/* <div className="h-full bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4"> */}
      <div className="w-full bg-white gap-5 min-h-screen rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
      {/* Left Section */}
      <div
        className="
        md:w-1/2 
        m-6   
        flex flex-col items-center justify-center 
        relative rounded-[29px]
        bg-gradient-to-b
        from-[rgba(59,166,229,0.15)]
        via-[rgba(11,117,201,0.46)]
        to-[rgba(11,117,201,0.46)]
    "
      >
        <div className="text-center mb-8">
          <img src={main} className="mx-auto max-w-[80%] h-auto" />
        </div>

        <div className="absolute bottom-8 text-3xl md:text-6xl lg:text-8xl font-bold text-[#3388CC] opacity-20">
          NANOBITE
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 m-6 pr-5 pt-10 flex flex-col min-h-full">
        <div className="mb-2 py-8">
          <div className="flex justify-self-start">
            <img src={logo} className="mx-auto w-40 h-40 object-contain" />
          </div>

          <h3 className="text-3xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5]">
          Reset Your Password
          </h3>
          <p className="text-[#6C6C6C] text-sm mb-5">
          Enter your registered email and we’ll send you a secure reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
          

          <Input
            label="Email Address"
            fieldName="email"
            formConfig={formConfig}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            type="email"
            placeholder="Enter Email Address"
          />

        
<div className="py-8">
          <Button
            btnType="submit"
            btnText={resetPassword.isPending ? "Sending Link..." : "Send Reset Link"}
            btnLoader={resetPassword.isPending}
            disable={resetPassword.isPending}
            customClass="w-full h-[52px]  rounded-[10px] shadow-[0px_6px_18px_#006bc933] bg-[linear-gradient(90deg,rgba(59,166,229,1)_0%,rgba(11,117,201,1)_100%)] [font-family:'Inter_Tight',Helvetica] font-medium text-white text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          />
          </div>

          <p className="text-center text-[14px] text-gray-600 py-5">
            Back to{" "}
            <Link
              to="/login"
              className="text-[#0B75C9] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>

        <p className="text-left text-[14px] text-[#797979] mb-14">
          © 2025 NanoBite. All rights reserved.
        </p>
      </div>
      </div>
    </>
  );
};
