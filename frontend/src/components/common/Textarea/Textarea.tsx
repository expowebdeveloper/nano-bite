import { FieldError, FieldValues, Path, UseFormReturn } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ValidationRule } from "../../../interfaces/interfaces";

interface TextareaProps<T extends FieldValues> {
  label?: string;
  fieldName: Path<T>;
  formConfig: UseFormReturn<T>;
  rules?: ValidationRule;
  customClass?: string;
  placeholder?: string;
  rows?: number;
}

const Textarea = <T extends FieldValues>({
  label,
  fieldName,
  formConfig,
  rules,
  customClass = "",
  placeholder,
  rows = 4,
}: TextareaProps<T>) => {
  const {
    register,
    formState: { errors },
  } = formConfig;

  const error = errors[fieldName] as FieldError | undefined;
  const minHeight = rows * 20;
  const textareaClasses = `w-full rounded-2xl bg-[#f7f9fb] border border-[#e5edf5] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B75C9]/30 ${customClass}`;

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-[#6C6C6C] mb-1">{label}</label>}
      <textarea
        {...register(fieldName, rules)}
        className={textareaClasses}
        placeholder={placeholder || "Enter text here"}
        rows={rows}
        style={{ minHeight: `${minHeight}px` }}
      />
      <ErrorMessage errorMsg={error?.message || ""} />
    </div>
  );
};

export default Textarea;

