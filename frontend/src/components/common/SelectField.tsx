import { FieldError, FieldValues, Path, UseFormReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import { ValidationRule } from "../../interfaces/interfaces";

interface props<T extends FieldValues = FieldValues> {
  rules?: ValidationRule;
  fieldName: Path<T>;
  formConfig: UseFormReturn<T>;
  selectedOption: string[] | undefined;
  isDefault: string | undefined;
  isDisabled?: boolean;
  customClass?: string;
  label?: string;
}

const SelectField = <T extends FieldValues = FieldValues>({
  rules,
  fieldName,
  formConfig,
  selectedOption,
  isDefault,
  isDisabled = false,
  customClass = "",
  label,
}: props<T>) => {
  const {
    register,
    formState: { errors },
  } = formConfig;

  const error = errors[fieldName] as FieldError | undefined;

  const selectClasses = `w-full h-[60px] bg-[#f2f6f8] rounded-2xl border border-solid border-[#dde4ec] [font-family:'Inter_Tight',Helvetica] font-normal text-base text-black px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0b75c9] disabled:opacity-50 disabled:cursor-not-allowed ${customClass}`;

  return (
    <div className="flex flex-col w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select 
        {...register(fieldName, rules)} 
        className={selectClasses}
        disabled={isDisabled}
      >
        {isDefault && (
          <option value="" disabled hidden>
            {isDefault}
          </option>
        )}
        {selectedOption?.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ErrorMessage errorMsg={error?.message || ""} />
    </div>
  );
};

export default SelectField;
