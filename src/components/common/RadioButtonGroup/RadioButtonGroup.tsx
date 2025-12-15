import React from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface RadioButtonGroupProps<T extends FieldValues> {
  label: string;
  fieldName: Path<T>;
  formConfig: UseFormReturn<T>;
  options: string[];
  className?: string;
}

const RadioButtonGroup = <T extends FieldValues>({
  label,
  fieldName,
  formConfig,
  options,
  className = "",
}: RadioButtonGroupProps<T>) => {
  const { watch, setValue } = formConfig;
  const selectedValue = watch(fieldName) || "";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className={className || "flex flex-wrap gap-4"}>
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name={fieldName as string}
                value={option}
                checked={isSelected}
                onChange={() => setValue(fieldName, option as any)}
                className="w-4 h-4 text-[#0B75C9] focus:ring-[#0B75C9]"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RadioButtonGroup;

