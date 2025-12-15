import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/common/Input/Input";
import PhoneNumberField from "../../components/common/PhoneNumberField/PhoneNumberField";
import Button from "../../components/common/Buttons/Button";

export type AddQCFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  isActive: boolean;
};

type AddQCProps = {
  handleSubmit: (values: AddQCFormValues) => void;
  loading?: boolean;
  onCancel?: () => void;
  initialValues?: Partial<AddQCFormValues>;
  mode?: "add" | "edit";
};

const AddQC = ({
  handleSubmit,
  loading,
  onCancel,
  initialValues,
  mode = "add",
}: AddQCProps) => {
  const formConfig = useForm<AddQCFormValues>({
    defaultValues: {
      first_name: initialValues?.first_name || "",
      last_name: initialValues?.last_name || "",
      email: initialValues?.email || "",
      phone_number: initialValues?.phone_number || "",
      isActive: initialValues?.isActive ?? true,
    },
  });

  useEffect(() => {
    formConfig.reset({
      first_name: initialValues?.first_name || "",
      last_name: initialValues?.last_name || "",
      email: initialValues?.email || "",
      phone_number: initialValues?.phone_number || "",
      isActive: initialValues?.isActive ?? true,
    });
  }, [initialValues, formConfig]);

  const onSubmit = (values: AddQCFormValues) => {
    handleSubmit(values);
  };

  const { setValue, formState: { errors } } = formConfig;

  return (
    <form onSubmit={formConfig.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          fieldName="first_name"
          formConfig={formConfig}
          placeholder="Enter first name"
          rules={{ required: "First name is required" }}
        />
        <Input
          label="Last Name"
          fieldName="last_name"
          formConfig={formConfig}
          placeholder="Enter last name"
        />
      </div>

      <Input
        label="Email"
        fieldName="email"
        formConfig={formConfig}
        placeholder="Enter email"
        type="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
      />

      <PhoneNumberField
        label="Phone Number"
        fieldName="phone_number"
        formConfig={formConfig}
        placeholder="Enter phone number"
        disableCountryCode={false}
        customClassInput="!input-field !w-full !h-[50px] !bg-[#f2f6f8] !rounded-2xl !border !border-solid !border-[#dde4ec]"
      />

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Active</span>
        <button
          type="button"
          onClick={() => setValue("isActive", !formConfig.getValues("isActive"))}
          className={`h-7 w-12 rounded-full flex items-center px-1 transition ${
            formConfig.watch("isActive") ? "bg-[#1a9bf2]" : "bg-gray-300"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              formConfig.watch("isActive") ? "translate-x-5" : ""
            }`}
          />
        </button>
        {errors.isActive && (
          <span className="text-xs text-red-500">{errors.isActive.message}</span>
        )}
      </div>

      <div className="flex justify-center gap-3 pt-4">
        <Button
          btnType="button"
          btnText="Cancel"
          btnClick={onCancel}
          customClass="!py-3 !px-8 rounded-xl bg-gray-100 text-gray-700 border-none hover:bg-gray-200"
          backGround={false}
          border={false}
        />
        <Button
          btnType="submit"
          btnText={
            loading
              ? mode === "edit"
                ? "Updating..."
                : "Adding..."
              : mode === "edit"
                ? "Update QC"
                : "Add QC"
          }
          disable={loading}
          customClass="!py-3 !px-8 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white border-none"
          backGround={false}
          border={false}
        />
      </div>
    </form>
  );
};

export default AddQC;

