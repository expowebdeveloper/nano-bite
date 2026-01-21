import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Buttons/Button";
import useUser from "../../hooks/useUser";
import type { UserProfile } from "../../interfaces/types";

const Settings = () => {
  const { profileQuery, updateProfileMutation } = useUser();

  const formConfig = useForm<UserProfile>({
    defaultValues: {
      fullName: "",
      email: "",
      phone_number: "",
      address: "",
      state: "",
      city: "",
      zipCode: "",
      country: "",
    },
  });

  const { handleSubmit, setValue } = formConfig;

  useEffect(() => {
    if (profileQuery.data) {
      const profile = profileQuery.data;
      setValue("fullName", profile.fullName || "");
      setValue("email", profile.email || "");
      setValue("phone_number", profile.phone_number || "");
      setValue("address", profile.address || "");
      setValue("state", profile.state || "");
      setValue("city", profile.city || "");
      setValue("zipCode", profile.zipCode || "");
      setValue("country", profile.country || "");
    }
  }, [profileQuery.data, setValue]);

  const onSubmit = async (values: UserProfile) => {
    await updateProfileMutation.mutateAsync(values);
  };

  return (
    <div className="min-h-screen bg-[#fbfeff] p-8">
      <div className="mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

          {profileQuery.isLoading ? (
            <p className="text-sm text-gray-600">Loading profile...</p>
          ) : profileQuery.isError ? (
            <p className="text-sm text-red-600">
              Unable to load profile. Please try again.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  fieldName="fullName"
                  formConfig={formConfig}
                  placeholder="Full Name"
                />
                <Input
                  label="Email"
                  fieldName="email"
                  formConfig={formConfig}
                  placeholder="Email"
                  type="email"
                  customClass="bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  fieldName="phone_number"
                  formConfig={formConfig}
                  placeholder="Phone Number"
                />
                <Input
                  label="Country"
                  fieldName="country"
                  formConfig={formConfig}
                  placeholder="Country"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="State"
                  fieldName="state"
                  formConfig={formConfig}
                  placeholder="State"
                />
                <Input
                  label="City"
                  fieldName="city"
                  formConfig={formConfig}
                  placeholder="City"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Address"
                  fieldName="address"
                  formConfig={formConfig}
                  placeholder="Address"
                />
                <Input
                  label="Zip Code"
                  fieldName="zipCode"
                  formConfig={formConfig}
                  placeholder="Zip Code"
                />
              </div>

              <div className="pt-4">
                <Button
                  btnType="submit"
                  btnText={
                    updateProfileMutation.isPending ? "Saving..." : "Save Changes"
                  }
                  customClass="!h-11 !px-6 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white border-none"
                  backGround={false}
                  border={false}
                  disable={updateProfileMutation.isPending}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

