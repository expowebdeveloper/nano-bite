import { ReactNode } from "react";
import { UseFormReturn, Path, FieldValues } from "react-hook-form";

type CheckboxProps<T extends FieldValues> = {
  label: ReactNode;
  value: string;
  fieldName: Path<T>;
  formConfig: UseFormReturn<T>;
  className?: string;
};

const Checkbox = <T extends FieldValues>({
  label,
  value,
  fieldName,
  formConfig,
  className = "",
}: CheckboxProps<T>) => {
  const { watch, setValue } = formConfig;

  const toggle = () => {
    const current = new Set((watch(fieldName) as unknown as string[]) || []);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    setValue(fieldName, Array.from(current) as any);
  };

  const checked = ((watch(fieldName) as unknown as string[]) || []).includes(value);

  return (
    <label className={`flex items-center gap-1 ${className}`}>
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        onChange={toggle}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;

