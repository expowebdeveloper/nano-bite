import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Buttons/Button";
import CheckboxGroup from "../../components/common/CheckboxGroup/CheckboxGroup";
import CountryFlagSelect from "../../components/common/CountryList";
import useUser from "../../hooks/useUser";
import type { UserProfile } from "../../interfaces/types";

const PREFERRED_CONTACT_OPTIONS = ["Phone", "Text", "Email"];
const SPECIALTY_OPTIONS = ["GP", "Prosthodontist", "Oral Surgeon", "Others"];

const defaultProfile: Partial<UserProfile> = {
  fullName: "",
  email: "",
  phone_number: "",
  address: "",
  state: "",
  city: "",
  zipCode: "",
  country: "",
  licenseNumber: "",
  assistantName: "",
  assistantPhone: "",
  officeManager: "",
  officeManagerPhone: "",
  whoApprovesDesigns: "",
  contactTimeWindow: "",
  standardOcclusalPreference: "",
  standardShadesUsed: "",
  clinicName: "",
  clinicPhone: "",
  clinicAddress: "",
  clinicCountry: "",
  clinicState: "",
  clinicCity: "",
  zipcode: "",
  scannerType: "",
  preferredContactMethod: [],
  specialty: [],
  preferredFileTransfer: [],
};

const Settings = () => {
  const { profileQuery, updateProfileMutation } = useUser();

  const formConfig = useForm<UserProfile>({
    defaultValues: defaultProfile as UserProfile,
  });

  const { handleSubmit, reset } = formConfig;

  useEffect(() => {
    if (!profileQuery.data) return;
    const p = profileQuery.data as UserProfile & { dentistProfile?: Partial<UserProfile> | null };
    const dp = p.dentistProfile || {};
    reset({
      fullName: p.fullName ?? "",
      email: p.email ?? "",
      phone_number: p.phone_number ?? "",
      address: p.address ?? "",
      state: p.state ?? "",
      city: p.city ?? "",
      zipCode: p.zipCode ?? "",
      country: p.country ?? "",
      licenseNumber: dp.licenseNumber ?? p.licenseNumber ?? "",
      assistantName: dp.assistantName ?? p.assistantName ?? "",
      assistantPhone: dp.assistantPhone ?? p.assistantPhone ?? "",
      officeManager: dp.officeManager ?? p.officeManager ?? "",
      officeManagerPhone: dp.officeManagerPhone ?? p.officeManagerPhone ?? "",
      whoApprovesDesigns: dp.whoApprovesDesigns ?? p.whoApprovesDesigns ?? "",
      contactTimeWindow: dp.contactTimeWindow ?? p.contactTimeWindow ?? "",
      standardOcclusalPreference: dp.standardOcclusalPreference ?? p.standardOcclusalPreference ?? "",
      standardShadesUsed: dp.standardShadesUsed ?? p.standardShadesUsed ?? "",
      clinicName: dp.clinicName ?? p.clinicName ?? "",
      clinicPhone: dp.clinicPhone ?? p.clinicPhone ?? "",
      clinicAddress: dp.clinicAddress ?? p.clinicAddress ?? "",
      clinicCountry: dp.clinicCountry ?? p.clinicCountry ?? "",
      clinicState: dp.clinicState ?? p.clinicState ?? "",
      clinicCity: dp.clinicCity ?? p.clinicCity ?? "",
      zipcode: dp.zipcode ?? p.zipcode ?? "",
      scannerType: dp.scannerType ?? p.scannerType ?? "",
      preferredContactMethod: Array.isArray(dp.preferredContactMethod) ? dp.preferredContactMethod : (p.preferredContactMethod ?? []),
      specialty: Array.isArray(dp.specialty) ? dp.specialty : (p.specialty ?? []),
      preferredFileTransfer: Array.isArray(dp.preferredFileTransfer) ? dp.preferredFileTransfer : (p.preferredFileTransfer ?? []),
    });
  }, [profileQuery.data, reset]);

  const onSubmit = async (values: UserProfile) => {
    await updateProfileMutation.mutateAsync({
      fullName: values.fullName,
      email: values.email,
      phone_number: values.phone_number,
      address: values.address,
      state: values.state,
      city: values.city,
      zipCode: values.zipCode,
      country: values.country,
      licenseNumber: values.licenseNumber,
      assistantName: values.assistantName,
      assistantPhone: values.assistantPhone,
      officeManager: values.officeManager,
      officeManagerPhone: values.officeManagerPhone,
      whoApprovesDesigns: values.whoApprovesDesigns,
      contactTimeWindow: values.contactTimeWindow,
      standardOcclusalPreference: values.standardOcclusalPreference,
      standardShadesUsed: values.standardShadesUsed,
      clinicName: values.clinicName,
      clinicPhone: values.clinicPhone,
      clinicAddress: values.clinicAddress,
      clinicCountry: values.clinicCountry,
      clinicState: values.clinicState,
      clinicCity: values.clinicCity,
      zipcode: values.zipcode,
      scannerType: values.scannerType,
      preferredContactMethod: values.preferredContactMethod ?? [],
      specialty: values.specialty ?? [],
      preferredFileTransfer: values.preferredFileTransfer ?? [],
    });
  };

  const isDentist = (profileQuery.data as { role?: string })?.role === "Dentist";

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6 md:p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

        {profileQuery.isLoading && (
          <p className="text-sm text-gray-600">Loading profile...</p>
        )}
        {profileQuery.isError && (
          <p className="text-sm text-red-600">Unable to load profile. Please try again.</p>
        )}
        {!profileQuery.isLoading && !profileQuery.isError && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Account / Personal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account &amp; contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" fieldName="fullName" formConfig={formConfig} placeholder="Full Name" />
                <Input label="Email" fieldName="email" formConfig={formConfig} type="email" customClass="bg-gray-100 cursor-not-allowed" disabled />
                <Input label="Phone Number" fieldName="phone_number" formConfig={formConfig} placeholder="Phone Number" />
                <Input label="Country" fieldName="country" formConfig={formConfig} placeholder="Country" />
                <Input label="State" fieldName="state" formConfig={formConfig} placeholder="State" />
                <Input label="City" fieldName="city" formConfig={formConfig} placeholder="City" />
                <Input label="Address" fieldName="address" formConfig={formConfig} placeholder="Address" className="md:col-span-2" />
                <Input label="Zip Code" fieldName="zipCode" formConfig={formConfig} placeholder="Zip Code" />
              </div>
            </div>

            {/* Clinic & team – show for Dentist (or if they have dentist profile data) */}
            {isDentist && (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinic details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Clinic Name" fieldName="clinicName" formConfig={formConfig} placeholder="Clinic Name" />
                    <Input label="Clinic Phone" fieldName="clinicPhone" formConfig={formConfig} placeholder="Clinic Phone" />
                    <Input label="Clinic Address" fieldName="clinicAddress" formConfig={formConfig} placeholder="Address" className="md:col-span-2" />
                    <CountryFlagSelect fieldName="clinicCountry" label="Country" formConfig={formConfig} customClass="white-text" isRequired={false} />
                    <Input label="State" fieldName="clinicState" formConfig={formConfig} placeholder="State" />
                    <Input label="City" fieldName="clinicCity" formConfig={formConfig} placeholder="City" />
                    <Input label="Zip Code (clinic)" fieldName="zipcode" formConfig={formConfig} placeholder="Zip Code" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Team contact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Assistant Name" fieldName="assistantName" formConfig={formConfig} placeholder="Assistant Name" />
                    <Input label="Assistant Phone" fieldName="assistantPhone" formConfig={formConfig} placeholder="Assistant Phone" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">License &amp; practice</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="License Number" fieldName="licenseNumber" formConfig={formConfig} placeholder="License Number" />
                  </div>
                  <div className="mt-4 space-y-4">
                    <CheckboxGroup
                      label="Preferred contact method"
                      fieldName="preferredContactMethod"
                      formConfig={formConfig}
                      options={PREFERRED_CONTACT_OPTIONS}
                      className="flex gap-4"
                    />
                    <CheckboxGroup
                      label="Specialty"
                      fieldName="specialty"
                      formConfig={formConfig}
                      options={SPECIALTY_OPTIONS}
                      className="flex gap-4"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end">
              <Button
                btnType="submit"
                btnText={updateProfileMutation.isPending ? "Saving..." : "Save changes"}
                customClass="!h-11 !px-6 rounded-xl bg-[#2B89D2] hover:bg-[#2369a8] text-white border-none"
                backGround={false}
                border={false}
                disable={updateProfileMutation.isPending}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
