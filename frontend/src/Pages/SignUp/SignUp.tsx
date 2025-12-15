import { useForm } from "react-hook-form";
import { useQueryState } from "nuqs";
import Button from "../../components/common/Buttons/Button";
import Input from "../../components/common/Input/Input";
import PhoneNumberField from "../../components/common/PhoneNumberField/PhoneNumberField";
import CountryFlagSelect from "../../components/common/CountryList";
import useUser from "../../hooks/useUser";
import { User } from "../../interfaces/interfaces";
import ScreenLoader from "../../components/common/ScreenLoader/ScreenLoader";
import { passwordRules } from "../../Constants/Constants";
import RoleSection from "./RoleSection";
import SignUpHeader from "./SignUpHeader";
import SignUpLeftSection from "./SignUpLeftSection";
import CheckboxGroup from "../../components/common/CheckboxGroup/CheckboxGroup";
import PasswordField from "../../components/common/PasswordField/PasswordField";
import AuthLink from "../../components/common/AuthLink/AuthLink";
import { useSignUp } from "../../contexts/SignUpContext";
import { useEffect, useRef } from "react";

interface FormValues {
  fullName: string;
  email: string;
  countryCode: string;
  country: string;
  phone: string;
  licenseNumber: string;
  role: string;
  preferredContactMethod: string[];
  specialty: string[];
  address: string;
  state: string;
  city: string;
  password: string;
}
export const Signup = () => {
  const [, setStep] = useQueryState("step");
  const { updateFormData, getStepData } = useSignUp();
  const { signup } = useUser();

  // Step 1: Basic Information Form ONLY

  // Load saved data into form
  const savedStepData = getStepData(1);
  const formConfig = useForm<FormValues>({
    defaultValues: {
      fullName: savedStepData.fullName || "",
      email: savedStepData.email || "",
      countryCode: "+1",
      country: savedStepData.country || "",
      phone: savedStepData.phone || "",
      licenseNumber: savedStepData.licenseNumber || "",
      role: savedStepData.role || "Dentist",
      preferredContactMethod: savedStepData.preferredContactMethod || [],
      specialty: savedStepData.specialty || [],
      address: savedStepData.address || "",
      state: savedStepData.state || "",
      city: savedStepData.city || "",
      password: savedStepData.password || "",
    },
  });

  // Update form when saved data changes (when navigating back)
  useEffect(() => {
    const savedData = getStepData(1);
    // Only update if there's saved data and form is empty or different
    Object.entries(savedData).forEach(([key, value]) => {
      const currentValue = formConfig.getValues(key as keyof FormValues);
      if (value && value !== currentValue) {
        formConfig.setValue(key as keyof FormValues, value as any);
      }
    });
  }, []);

  const { handleSubmit, watch, setValue } = formConfig;

  // Watch form changes and save to context in real-time
  const watchedValues = watch();
  const prevValuesRef = useRef<string>("");

  useEffect(() => {
    // Serialize current values to compare
    const currentValuesStr = JSON.stringify(watchedValues);
    
    // Only update if values actually changed
    if (prevValuesRef.current !== currentValuesStr) {
      prevValuesRef.current = currentValuesStr;
      
      // Save form data to context whenever values change
      const phone_number = watchedValues.phone || "";
      updateFormData({
        fullName: watchedValues.fullName || "",
        email: watchedValues.email || "",
        phone: phone_number,
        licenseNumber: watchedValues.licenseNumber || "",
        role: watchedValues.role || "Dentist",
        preferredContactMethod: watchedValues.preferredContactMethod || [],
        specialty: watchedValues.specialty || [],
        address: watchedValues.address || "",
        state: watchedValues.state || "",
        city: watchedValues.city || "",
        country: watchedValues.country || "",
        password: watchedValues.password || "",
      });
    }
  }, [watchedValues, updateFormData]);

  const watchRole = watch("role");

  const onSubmit = (data: FormValues) => {
    // Phone number from PhoneNumberField already includes country code with +
    // So we can use it directly
    const phone_number = data.phone || "";

    // Base payload fields that are common for both roles
    const basePayload = {
      fullName: data.fullName,
      email: data.email,
      phone_number,
      password: data.password,
      role: data.role,
    };

    // Transform form data to match User interface based on role
    const userPayload = data.role === "Dentist"
      ? {
        ...basePayload,
        address: "",
        state: "",
        city: "",
        country: data.country || "",
        zipCode: "",
        licenseNumber: data.licenseNumber || "",
        preferredContactMethod: data.preferredContactMethod || [],
        specialty: data.specialty || [],
      }
      : {
        ...basePayload,
        address: data.address || "",
        state: data.state || "",
        city: data.city || "",
        country: data.country || "",
        zipCode: "",
        licenseNumber: "",
        preferredContactMethod: [],
        specialty: [],
      };

    // Save form data to context
    updateFormData({
      fullName: data.fullName,
      email: data.email,
      phone: phone_number,
      licenseNumber: data.licenseNumber,
      role: data.role,
      preferredContactMethod: data.preferredContactMethod,
      specialty: data.specialty,
      address: data.address || "",
      state: data.state || "",
      city: data.city || "",
      country: data.country || "",
      password: data.password,
    });

    // Call the signup mutation
    if (data.role === "Dentist") {
      // For Dentist, navigate to clinic information page with step query param
      setStep("2");
    } else {
      // For Designer, submit directly
      signup.mutate(userPayload as unknown as User);
    }
  };

  return (
    <>
      {signup.isPending && <ScreenLoader isLoading={signup.isPending} />}
      {/* <div className="h-full bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4"> */}
      <div className="w-full bg-white gap-5 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <SignUpLeftSection />

        <div className="md:w-1/2 m-6 pr-5">
          <SignUpHeader />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <RoleSection
              setValue={(role) => setValue("role", role)}
              currentRole={watchRole}
            />

            <Input
              label="Full Name"
              fieldName="fullName"
              formConfig={formConfig}
              rules={{
                required: "Full name is required",
                validate: (value: string) => {
                  if (value.length < 2) {
                    return "Name must be at least 2 characters";
                  }
                  return true;
                },
              }}
              placeholder="Enter Full Name"
            />

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

            <PhoneNumberField
              fieldName="phone"
              label="Phone Number"
              formConfig={formConfig}
              placeholder="Enter Phone Number"
              customClassInput="!input-field !w-full !h-[50px] !bg-[#f2f6f8] !rounded-2xl !border !border-solid !border-[#dde4ec]"
              disableCountryCode={false}
            />

            {/* Dentist-specific fields */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${watchRole === "Dentist"
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
                }`}
            >
              {watchRole === "Dentist" && (
                <div className="space-y-4">
                  <Input
                    label="License #"
                    fieldName="licenseNumber"
                    formConfig={formConfig}
                    rules={{
                      required: "License number is required",
                    }}
                    placeholder="Enter License Number"
                  />

                  <CheckboxGroup
                    label="Preferred Contact Method"
                    fieldName="preferredContactMethod"
                    formConfig={formConfig}
                    options={["Phone", "Text", "Email"]}
                    className="flex gap-4"
                    rules={{
                      required: "Please select at least one preferred contact method",
                      validate: (value: string[]) => {
                        if (!value || value.length === 0) {
                          return "Please select at least one preferred contact method";
                        }
                        return true;
                      },
                    }}
                  />

                  <CheckboxGroup
                    label="Specialty"
                    fieldName="specialty"
                    formConfig={formConfig}
                    options={["GP", "Prosthodontist", "Oral Surgeon", "Others"]}
                    rules={{
                      required: "Please select at least one specialty",
                      validate: (value: string[]) => {
                        if (!value || value.length === 0) {
                          return "Please select at least one specialty";
                        }
                        return true;
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {/* Designer-specific fields */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${watchRole === "Designer"
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
                }`}
            >
              {watchRole === "Designer" && (
                <div className="space-y-4">
                  <Input
                    label="Address"
                    fieldName="address"
                    formConfig={formConfig}
                    rules={{
                      required: "Address is required",
                      validate: (value: string) => {
                        if (value.length < 5) {
                          return "Address must be at least 5 characters";
                        }
                        return true;
                      },
                    }}
                    placeholder="Enter Address"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <CountryFlagSelect
                      fieldName="country"
                      label="Country"
                      formConfig={formConfig}
                      customClass="white-text"
                      isRequired={true}
                    />
                    <Input
                      label="State"
                      fieldName="state"
                      formConfig={formConfig}
                      rules={{
                        required: "State is required",
                      }}
                      placeholder="Enter State"
                    />
                  </div>
                </div>
              )}
            </div>

            <PasswordField
              label="Enter Password"
              fieldName="password"
              formConfig={formConfig}
              rules={passwordRules}
              placeholder="Enter Password"
            />

            <Button
              btnType="submit"
              btnText={
                signup.isPending
                  ? "Creating Account..."
                  : watchRole === "Dentist"
                    ? "Next : Clinic & Scanner Information"
                    : "Create your account"
              }
              btnLoader={signup.isPending}
              disable={signup.isPending}
              customClass="w-full h-[52px] rounded-[10px] shadow-[0px_6px_18px_#006bc933] bg-[linear-gradient(90deg,rgba(59,166,229,1)_0%,rgba(11,117,201,1)_100%)] [font-family:'Inter_Tight',Helvetica] font-medium text-white text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {watchRole === "Dentist" && (
              <AuthLink
                text="Have an account?"
                path="/login"
                linkText="Login"
              />
            )}

            <p className="text-left text-[14px] text-[#797979] mt-4">
              © 2025 NanoBite, All right reserved
            </p>
          </form>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};
