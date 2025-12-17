import React from "react";
import { UseFormReturn, FieldValues, Path, FieldError, Controller } from "react-hook-form";
import { ValidationRule } from "../../../interfaces/interfaces";
import ErrorMessage from "../ErrorMessage";

interface CheckboxGroupProps<T extends FieldValues> {
  label: string;
  fieldName: Path<T>;
  formConfig: UseFormReturn<T>;
  options: string[];
  className?: string;
  rules?: ValidationRule;
}

const CheckboxGroup = <T extends FieldValues>({
  label,
  fieldName,
  formConfig,
  options,
  className = "",
  rules,
}: CheckboxGroupProps<T>) => {
  const { control, formState: { errors } } = formConfig;
  const error = errors[fieldName] as FieldError | undefined;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <Controller
        name={fieldName}
        control={control}
        rules={rules}
        render={({ field }) => {
          const currentValues = (field.value as string[]) || [];
          
          const handleCheckboxChange = (option: string) => {
            const current = new Set(currentValues);
            const isChecked = current.has(option);
            
            if (isChecked) {
              current.delete(option);
            } else {
              current.add(option);
            }
            
            field.onChange(Array.from(current));
          };

          return (
            <div className={className || "flex flex-wrap gap-4"}>
              {options.map((option) => {
                const isChecked = currentValues.includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(option)}
                      className="w-4 h-4 text-[#0B75C9] focus:ring-[#0B75C9] rounded border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 cursor-pointer">{option}</span>
                  </label>
                );
              })}
            </div>
          );
        }}
      />
      <ErrorMessage errorMsg={error?.message || ""} />
    </div>
  );
};

export default CheckboxGroup;

