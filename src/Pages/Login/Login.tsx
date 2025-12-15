import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../../components/common/Buttons/Button";
import Input from "../../components/common/Input/Input";
import main from "../../assets/images/main2.png";
import logo from "../../assets/images/logo.png";
import useUser from "../../hooks/useUser";
import { Login } from "../../interfaces/types";
import ScreenLoader from "../../components/common/ScreenLoader/ScreenLoader";

interface FormValues {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const { login } = useUser();
  const formConfig = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = formConfig;
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data: FormValues) => {
    const loginPayload: Login = {
      email: data.email,
      password: data.password,
    };

    // Call the login mutation
    login.mutate(loginPayload);
  };

  return (
    <>
      {login.isPending && <ScreenLoader isLoading={login.isPending} />}
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
          <div className="mb-2 ">
            <div className="flex justify-self-start">
              <img src={logo} className="mx-auto w-40 h-40 object-contain" />
            </div>

            <h3 className="text-3xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5]">
              Welcome to NanoBite
            </h3>
            <p className="text-[#6C6C6C] text-sm mb-5">
              Sign in to manage cases, collaborate, and streamline your dental
              workflow.
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-5">
                Enter Password
              </label>
              <div className="relative">
                <Input
                  fieldName="password"
                  formConfig={formConfig}
                  rules={{
                    required: "Password is required",
                    validate: (value: string) => {
                      if (value.length < 8) {
                        return "Password must be at least 8 characters";
                      }
                      return true;
                    },
                  }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
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

            <div className="py-5">
              <Link
                to="/reset-password"
                className="text-left text-[#0B75C9] font-semibold hover:underline"
              >
                Reset your password
              </Link>
            </div>
            <Button
              btnType="submit"
              btnText={login.isPending ? "Logging..." : "Login your account"}
              btnLoader={login.isPending}
              disable={login.isPending}
              customClass="w-full h-[52px] rounded-[10px] shadow-[0px_6px_18px_#006bc933] bg-[linear-gradient(90deg,rgba(59,166,229,1)_0%,rgba(11,117,201,1)_100%)] [font-family:'Inter_Tight',Helvetica] font-medium text-white text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <p className="text-center text-[14px] text-gray-600 py-5">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#0B75C9] font-semibold hover:underline"
              >
                Create an account
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
