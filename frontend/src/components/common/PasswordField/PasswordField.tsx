import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import Input from "../Input/Input";
import { ValidationRule } from "../../../interfaces/interfaces";

interface PasswordFieldProps<T extends FieldValues> {
  label?: string;
  fieldName: Path<T>;
  formConfig: UseFormReturn<T>;
  rules?: ValidationRule;
  placeholder?: string;
  customClass?: string;
}

const PasswordField = <T extends FieldValues>({
  label = "Enter Password",
  fieldName,
  formConfig,
  rules,
  placeholder = "Enter Password",
  customClass = "",
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
      )}
      <div className="relative">
        <Input
          fieldName={fieldName}
          formConfig={formConfig}
          rules={rules}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          customClass={`pr-12 ${customClass}`}
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
  );
};

export default PasswordField;

