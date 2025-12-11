import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Buttons/Button";
import Input from "../../components/common/Input/Input";
import main from "../../assets/images/main2.png";
import logo from "../../assets/images/logo.png";
import useUser from "../../hooks/useUser";
import ScreenLoader from "../../components/common/ScreenLoader/ScreenLoader";
import { passwordRules } from "../../Constants/Constants";

interface FormValues {
  password: string;
  confirmPassword: string;
}

export const SetPassword = () => {
  const { setPassword } = useUser();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const challenge = searchParams.get("challenge") || "";

  const formConfig = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, watch } = formConfig;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");

  const onSubmit = (data: FormValues) => {
    if (!email || !challenge) {
      console.error("Email or challenge token is missing from URL");
      return;
    }

    const setPasswordPayload = {
      email: email,
      challenge: challenge,
      newPassword: data.password,
    };

    // Call the setPassword mutation
    setPassword.mutate(setPasswordPayload);
  };

  return (
    <>
      {setPassword.isPending && <ScreenLoader isLoading={setPassword.isPending} />}
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
          Set New Password
          </h3>
          <p className="text-[#6C6C6C] text-sm mb-5">
          Enter your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
          

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter New Password
          </label>
          <div className="relative">
            <Input
              fieldName="password"
              formConfig={formConfig}
              rules={passwordRules}
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              customClass="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[18px] top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOffIcon className="w-6 h-6 text-[#9ba7b4]" />
              ) : (
                <EyeIcon className="w-6 h-6 text-[#9ba7b4]" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              fieldName="confirmPassword"
              formConfig={formConfig}
              rules={{
                required: "Please confirm your password",
                validate: (value: string) => {
                  if (value !== password) {
                    return "Passwords do not match";
                  }
                  return true;
                },
              }}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              customClass="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-[18px] top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="w-6 h-6 text-[#9ba7b4]" />
              ) : (
                <EyeIcon className="w-6 h-6 text-[#9ba7b4]" />
              )}
            </button>
          </div>
        </div>
        
<div className="py-8">
          <Button
            btnType="submit"
            btnText={setPassword.isPending ? "Setting Password..." : "Set New Password"}
            btnLoader={setPassword.isPending}
            disable={setPassword.isPending}
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
