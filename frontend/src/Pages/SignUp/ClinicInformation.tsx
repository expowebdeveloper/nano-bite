import { useForm } from "react-hook-form";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import Button from "../../components/common/Buttons/Button";
import Input from "../../components/common/Input/Input";
import PhoneNumberField from "../../components/common/PhoneNumberField/PhoneNumberField";
import SelectField from "../../components/common/SelectField";
import RadioButtonGroup from "../../components/common/RadioButtonGroup/RadioButtonGroup";
import Checkbox from "../../components/common/Checkbox/Checkbox";
import SignUpHeader from "./SignUpHeader";
import SignUpLeftSection from "./SignUpLeftSection";
import { useSignUp } from "../../contexts/SignUpContext";

interface ClinicFormValues {
  clinicName: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  scannerType: string;
  preferredFileTransfer: string[];
}

const ClinicInformation = () => {
  const [, setStep] = useQueryState("step");
  const { formData, updateFormData, getStepData } = useSignUp();
  
  // Load saved data into form
  const savedStepData = getStepData(2);
  const formConfig = useForm<ClinicFormValues>({
    defaultValues: {
      clinicName: savedStepData.clinicName || "",
      phone: savedStepData.clinicPhone || "",
      address: savedStepData.clinicAddress || "",
      state: savedStepData.clinicState || "",
      city: savedStepData.clinicCity || "",
      zipcode: savedStepData.zipcode || "",
      scannerType: savedStepData.scannerType || "",
      preferredFileTransfer: savedStepData.preferredFileTransfer || [],
    },
  });

  // Update form when saved data changes (when navigating back)
  useEffect(() => {
    const savedData = getStepData(2);
    // Only update if there's saved data and form is empty or different
    Object.entries(savedData).forEach(([key, value]) => {
      if (key === "clinicPhone") {
        const currentValue = formConfig.getValues("phone");
        if (value && value !== currentValue) {
          formConfig.setValue("phone", value as string);
        }
      } else if (key === "clinicAddress") {
        const currentValue = formConfig.getValues("address");
        if (value && value !== currentValue) {
          formConfig.setValue("address", value as string);
        }
      } else if (key === "clinicState") {
        const currentValue = formConfig.getValues("state");
        if (value && value !== currentValue) {
          formConfig.setValue("state", value as string);
        }
      } else if (key === "clinicCity") {
        const currentValue = formConfig.getValues("city");
        if (value && value !== currentValue) {
          formConfig.setValue("city", value as string);
        }
      } else {
        const currentValue = formConfig.getValues(key as keyof ClinicFormValues);
        if (value && value !== currentValue) {
          formConfig.setValue(key as keyof ClinicFormValues, value as any);
        }
      }
    });
  }, []);

  // Watch form changes and save to context in real-time
  const { watch } = formConfig;
  const watchedValues = watch();

  useEffect(() => {
    // Save form data to context whenever values change
    updateFormData({
      clinicName: watchedValues.clinicName || "",
      clinicPhone: watchedValues.phone || "",
      clinicAddress: watchedValues.address || "",
      clinicState: watchedValues.state || "",
      clinicCity: watchedValues.city || "",
      zipcode: watchedValues.zipcode || "",
      scannerType: watchedValues.scannerType || "",
      preferredFileTransfer: watchedValues.preferredFileTransfer || [],
    });
  }, [watchedValues, updateFormData]);

  const { handleSubmit } = formConfig;

  const onSubmit = (data: ClinicFormValues) => {
    // Save form data to context
    updateFormData({
      clinicName: data.clinicName,
      clinicPhone: data.phone,
      clinicAddress: data.address,
      clinicState: data.state,
      clinicCity: data.city,
      zipcode: data.zipcode,
      scannerType: data.scannerType,
      preferredFileTransfer: data.preferredFileTransfer,
    });

    // Navigate to next step
    setStep("3");
  };

  const handlePrevious = () => {
    setStep("1");
  };

  // Mock data for dropdowns - replace with actual data
  const stateOptions = ["California", "New York", "Texas", "Florida"];
  const cityOptions = ["Los Angeles", "San Francisco", "New York", "Houston"];

  return (
    <div className="w-full bg-white gap-5 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
      <SignUpLeftSection />

      <div className="md:w-1/2 m-6 pr-5">
        <SignUpHeader
          title="Dentist: Clinic Information"
          subtitle="Enter your clinic management"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#0B75C9]">
              Clinic Information
            </h3>
          </div>

          <Input
            label="Clinic Name"
            fieldName="clinicName"
            formConfig={formConfig}
            rules={{
              required: "Clinic name is required",
            }}
            placeholder="Enter Clinic Name"
          />

          <PhoneNumberField
            fieldName="phone"
            label="Phone Number"
            formConfig={formConfig}
            placeholder="Enter Phone Number"
            customClassInput="!input-field !w-full !h-[50px] !bg-[#f2f6f8] !rounded-2xl !border !border-solid !border-[#dde4ec]"
            disableCountryCode={false}
          />

          <Input
            label="Address"
            fieldName="address"
            formConfig={formConfig}
            rules={{
              required: "Address is required",
            }}
            placeholder="Enter Clinic Address"
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="State"
              fieldName="state"
              formConfig={formConfig}
              selectedOption={stateOptions}
              isDefault="Select State"
              rules={{ required: "State is required" }}
            />
            <SelectField
              label="City"
              fieldName="city"
              formConfig={formConfig}
              selectedOption={cityOptions}
              isDefault="Select City"
              rules={{ required: "City is required" }}
            />
          </div>

          <Input
            label="Zipcode"
            fieldName="zipcode"
            formConfig={formConfig}
            rules={{
              required: "Zipcode is required",
            }}
            placeholder="Enter Zipcode"
          />

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#0B75C9]">
              Scanner Information
            </h3>
          </div>

          <RadioButtonGroup
            label="Scanner Type"
            fieldName="scannerType"
            formConfig={formConfig}
            options={["iTuero", "Trios", "Medios", "Primescan", "Others"]}
            className="flex flex-wrap gap-4"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred File Transfer
            </label>
            <Checkbox
              label="Cloud Shared Folder"
              value="Cloud Shared Folder"
              fieldName="preferredFileTransfer"
              formConfig={formConfig}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              btnType="button"
              btnClick={handlePrevious}
              btnText="Previous"
              customClass="flex-1 h-[52px] rounded-[10px] border border-solid border-[#0B75C9] bg-white text-[#0B75C9] [font-family:'Inter_Tight',Helvetica] font-medium text-base hover:bg-[#f2f6f8] transition-colors"
            />
            <Button
              btnType="submit"
              btnText="Next : Team Contacts & Preferences Information"
              customClass="flex-1 h-[52px] rounded-[10px] shadow-[0px_6px_18px_#006bc933] bg-[linear-gradient(90deg,rgba(59,166,229,1)_0%,rgba(11,117,201,1)_100%)] [font-family:'Inter_Tight',Helvetica] font-medium text-white text-base hover:opacity-90 transition-opacity"
            />
          </div>

          <p className="text-left text-[14px] text-[#797979] mt-4">
            © 2025 NanoBite, All right reserved
          </p>
        </form>
      </div>
    </div>
  );
};

export default ClinicInformation;

