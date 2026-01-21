import { FieldError, FieldValues, Path, UseFormReturn } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ValidationRule } from "../../../interfaces/interfaces";

interface InputFieldProps<T extends FieldValues> {
    label?: string;
    fieldName: Path<T>;
    formConfig: UseFormReturn<T>;
    rules?: ValidationRule;
    customClass?: string;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
  }
  
  const Input = <T extends FieldValues>({
  label, 
  fieldName, 
  formConfig, 
  rules,
  customClass = "",
  placeholder,
  type,
  disabled,
  ...props 
}: InputFieldProps<T>) => {
  const {
    register,
    formState: { errors },
  } = formConfig;
  
  const error = errors[fieldName] as FieldError | undefined;
  // Match placeholder size to phone number field (14px)
  const inputClasses = `w-full h-[50px] bg-[#f2f6f8] rounded-2xl border border-solid border-[#dde4ec] [font-family:'Inter_Tight',Helvetica] font-normal text-[14px] placeholder:text-[14px] placeholder:text-[#6C6C6C] px-4 ${customClass}`;

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-[#6C6C6C] mb-1">{label}</label>}
      <input
        {...register(fieldName, rules)}
        className={inputClasses}
        placeholder={placeholder || "Enter text here"}
        type={type || "text"}
        {...props}
      />
      <ErrorMessage errorMsg={error?.message || ""} />
    </div>
  );
};

export default Input;