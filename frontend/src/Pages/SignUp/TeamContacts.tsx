
import { useForm } from "react-hook-form";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import Button from "../../components/common/Buttons/Button";
import Input from "../../components/common/Input/Input";
import PhoneNumberField from "../../components/common/PhoneNumberField/PhoneNumberField";
import RadioButtonGroup from "../../components/common/RadioButtonGroup/RadioButtonGroup";
import SignUpHeader from "./SignUpHeader";
import SignUpLeftSection from "./SignUpLeftSection";
import { useSignUp } from "../../contexts/SignUpContext";
import useUser from "../../hooks/useUser";
import { User } from "../../interfaces/interfaces";
import ScreenLoader from "../../components/common/ScreenLoader/ScreenLoader";

interface TeamContactsFormValues {
  assistantName: string;
  assistantPhone: string;
  officeManager: string;
  officeManagerPhone: string;
  whoApprovesDesigns: string;
  contactTimeWindow: string;
  standardOcclusalPreference: string;
  standardShadesUsed: string;
}

const TeamContacts = () => {
  const [, setStep] = useQueryState("step");
  const { formData, updateFormData, getStepData, resetFormData } = useSignUp();
  const { signup } = useUser();
  
  // Load saved data into form
  const savedStepData = getStepData(3);
  const formConfig = useForm<TeamContactsFormValues>({
    defaultValues: {
      assistantName: savedStepData.assistantName || "",
      assistantPhone: savedStepData.assistantPhone || "",
      officeManager: savedStepData.officeManager || "",
      officeManagerPhone: savedStepData.officeManagerPhone || "",
      whoApprovesDesigns: savedStepData.whoApprovesDesigns || "",
      contactTimeWindow: savedStepData.contactTimeWindow || "",
      standardOcclusalPreference: savedStepData.standardOcclusalPreference || "",
      standardShadesUsed: savedStepData.standardShadesUsed || "",
    },
  });

  // Update form when saved data changes (when navigating back)
  useEffect(() => {
    const savedData = getStepData(3);
    // Only update if there's saved data and form is empty or different
    Object.entries(savedData).forEach(([key, value]) => {
      const currentValue = formConfig.getValues(key as keyof TeamContactsFormValues);
      if (value && JSON.stringify(value) !== JSON.stringify(currentValue)) {
        formConfig.setValue(key as keyof TeamContactsFormValues, value as any);
      }
    });
  }, []);

  // Watch form changes and save to context in real-time
  const { watch } = formConfig;
  const watchedValues = watch();

  useEffect(() => {
    // Save form data to context whenever values change
    updateFormData({
      assistantName: watchedValues.assistantName || "",
      assistantPhone: watchedValues.assistantPhone || "",
      officeManager: watchedValues.officeManager || "",
      officeManagerPhone: watchedValues.officeManagerPhone || "",
      whoApprovesDesigns: watchedValues.whoApprovesDesigns || "",
      contactTimeWindow: watchedValues.contactTimeWindow || "",
      standardOcclusalPreference: watchedValues.standardOcclusalPreference || "",
      standardShadesUsed: watchedValues.standardShadesUsed || "",
    });
  }, [watchedValues, updateFormData]);

  const { handleSubmit } = formConfig;

  const onSubmit = (data: TeamContactsFormValues) => {
    // Save form data to context
    updateFormData({
      assistantName: data.assistantName,
      assistantPhone: data.assistantPhone,
      officeManager: data.officeManager,
      officeManagerPhone: data.officeManagerPhone,
      whoApprovesDesigns: data.whoApprovesDesigns,
      contactTimeWindow: data.contactTimeWindow,
      standardOcclusalPreference: data.standardOcclusalPreference,
      standardShadesUsed: data.standardShadesUsed,
    });

    // Combine all form data - get latest from context after update
    // Note: formData will be updated by updateFormData, but we construct it here for immediate use
    const updatedFormData = {
      ...formData,
      assistantName: data.assistantName,
      assistantPhone: data.assistantPhone,
      officeManager: data.officeManager,
      officeManagerPhone: data.officeManagerPhone,
      whoApprovesDesigns: data.whoApprovesDesigns,
      contactTimeWindow: data.contactTimeWindow,
      standardOcclusalPreference: data.standardOcclusalPreference,
      standardShadesUsed: data.standardShadesUsed,
    };

    const phone_number = updatedFormData.phone || "";

    const userPayload = {
      fullName: updatedFormData.fullName,
      email: updatedFormData.email,
      phone_number,
      address: "",
      state: "",
      city: "",
      country: updatedFormData.country || "",
      zipCode: "",
      password: updatedFormData.password,
      role: updatedFormData.role,
      licenseNumber: updatedFormData.licenseNumber || "",
      preferredContactMethod: updatedFormData.preferredContactMethod || [],
      specialty: updatedFormData.specialty || [],
      // Clinic and team data will be saved separately or added to user model later
    };

    // Console log ALL combined data from all three steps
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📋 COMPLETE SIGNUP DATA - ALL THREE STEPS COMBINED");
    console.log("═══════════════════════════════════════════════════════════");
    
    console.log("\n📝 STEP 1: Basic Information");
    console.log("─────────────────────────────────────────────────────────");
    console.log({
      fullName: updatedFormData.fullName,
      email: updatedFormData.email,
      phone: updatedFormData.phone,
      country: updatedFormData.country,
      licenseNumber: updatedFormData.licenseNumber,
      role: updatedFormData.role,
      preferredContactMethod: updatedFormData.preferredContactMethod,
      specialty: updatedFormData.specialty,
      password: "***hidden***",
    });

    console.log("\n🏥 STEP 2: Clinic Information");
    console.log("─────────────────────────────────────────────────────────");
    console.log({
      clinicName: updatedFormData.clinicName,
      clinicPhone: updatedFormData.clinicPhone,
      clinicAddress: updatedFormData.clinicAddress,
      clinicState: updatedFormData.clinicState,
      clinicCity: updatedFormData.clinicCity,
      zipcode: updatedFormData.zipcode,
      scannerType: updatedFormData.scannerType,
      preferredFileTransfer: updatedFormData.preferredFileTransfer,
    });

    console.log("\n👥 STEP 3: Team Contacts");
    console.log("─────────────────────────────────────────────────────────");
    console.log({
      assistantName: updatedFormData.assistantName,
      assistantPhone: updatedFormData.assistantPhone,
      officeManager: updatedFormData.officeManager,
      officeManagerPhone: updatedFormData.officeManagerPhone,
      whoApprovesDesigns: updatedFormData.whoApprovesDesigns,
      contactTimeWindow: updatedFormData.contactTimeWindow,
      standardOcclusalPreference: updatedFormData.standardOcclusalPreference,
      standardShadesUsed: updatedFormData.standardShadesUsed,
    });

    console.log("\n🔗 COMPLETE COMBINED DATA (All Steps)");
    console.log("─────────────────────────────────────────────────────────");
    console.log(updatedFormData);

    console.log("\n📤 FINAL PAYLOAD FOR API");
    console.log("─────────────────────────────────────────────────────────");
    console.log(userPayload);

    console.log("\n═══════════════════════════════════════════════════════════");

    // Submit to API
    signup.mutate(userPayload as unknown as User, {
      onSuccess: () => {
        // Clear form data on success
        resetFormData();
      },
    });
  };

  const handlePrevious = () => {
    setStep("2");
  };

  return (
    <>
      {signup.isPending && <ScreenLoader isLoading={signup.isPending} />}
      <div className="w-full bg-white gap-5 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <SignUpLeftSection />

        <div className="md:w-1/2 m-6 pr-5">
        <SignUpHeader
          title="Dentist: Team Contacts"
          subtitle="Enter your team contact"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#0B75C9]">
              Team Contacts
            </h3>
          </div>

          <Input
            label="Assistant Name"
            fieldName="assistantName"
            formConfig={formConfig}
            placeholder="Enter Assistant Name"
          />

          <PhoneNumberField
            fieldName="assistantPhone"
            label="Assistant Phone Number"
            formConfig={formConfig}
            placeholder="Enter Phone Number"
            customClassInput="!input-field !w-full !h-[50px] !bg-[#f2f6f8] !rounded-2xl !border !border-solid !border-[#dde4ec]"
            disableCountryCode={false}
            isRequired={false}
          />

          <Input
            label="Office Manager"
            fieldName="officeManager"
            formConfig={formConfig}
            placeholder="Enter Office Manager"
          />

          <PhoneNumberField
            fieldName="officeManagerPhone"
            label="Office Manager Phone Number"
            formConfig={formConfig}
            placeholder="Enter Phone Number"
            customClassInput="!input-field !w-full !h-[50px] !bg-[#f2f6f8] !rounded-2xl !border !border-solid !border-[#dde4ec]"
            disableCountryCode={false}
            isRequired={false}
          />

          <RadioButtonGroup
            label="Who Approves Designs?"
            fieldName="whoApprovesDesigns"
            formConfig={formConfig}
            options={["Dentist", "Designer", "Both"]}
            className="flex flex-wrap gap-4"
          />

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#0B75C9]">
              Preference Information
            </h3>
          </div>

          <Input
            label="Contact Time Window"
            fieldName="contactTimeWindow"
            formConfig={formConfig}
            rules={{
              required: "Contact time window is required",
            }}
            placeholder="Enter Contact Time Window"
          />

          <RadioButtonGroup
            label="Standard Occlusal Preference"
            fieldName="standardOcclusalPreference"
            formConfig={formConfig}
            options={["Maintain Existing", "Light Occlusion"]}
            className="flex flex-wrap gap-4"
          />

          <Input
            label="Standard Shades Used"
            fieldName="standardShadesUsed"
            formConfig={formConfig}
            rules={{
              required: "Standard shades used is required",
            }}
            placeholder="Enter Standard Shades Used"
          />

          <div className="flex gap-3 pt-4">
            <Button
              btnType="button"
              btnClick={handlePrevious}
              btnText="Previous"
              customClass="flex-1 h-[52px] rounded-[10px] border border-solid border-[#0B75C9] bg-white text-[#0B75C9] [font-family:'Inter_Tight',Helvetica] font-medium text-base hover:bg-[#f2f6f8] transition-colors"
            />
            <Button
              btnType="submit"
              btnText="Create Dentist Account"
              customClass="flex-1 h-[52px] rounded-[10px] shadow-[0px_6px_18px_#006bc933] bg-[linear-gradient(90deg,rgba(59,166,229,1)_0%,rgba(11,117,201,1)_100%)] [font-family:'Inter_Tight',Helvetica] font-medium text-white text-base hover:opacity-90 transition-opacity"
            />
          </div>

          <p className="text-left text-[14px] text-[#797979] mt-4">
            © 2025 NanoBite, All right reserved
          </p>
        </form>
        </div>
      </div>
    </>
  );
};

export default TeamContacts;

