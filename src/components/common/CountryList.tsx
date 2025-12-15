import ReactFlagsSelect from "react-flags-select";
import { Controller, FieldError, FieldValues, Path, UseFormReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import { LoginValidations } from "../../validations/validation";

interface props<T extends FieldValues = FieldValues> {
  formConfig: UseFormReturn<T>;
  fieldName: Path<T>;
  customClass?: string;
  isRequired?: boolean;
  label?: string;
}

const CountryFlagSelect = <T extends FieldValues = FieldValues>({
  formConfig,
  fieldName,
  customClass = "",
  isRequired = false,
  label,
}: props<T>) => {
  const {
    control,
    formState: { errors },
  } = formConfig;

  const error = errors[fieldName] as FieldError | undefined;
  return (
    <div className={customClass}>
    {label && <label className="block text-sm font-medium text-[#6C6C6C] mb-1">{label}</label>}

      <Controller
        control={control}
        name={fieldName}
        rules={isRequired ? LoginValidations["countryList"] : undefined}
        render={({ field }) => (
          <ReactFlagsSelect
            selected={field.value || ""}
            searchable
            // countries={["IN", "SE", "US", "GB", "FR", "IT"]}
            onSelect={(code) => field.onChange(code)}
            className="text-black p-0 h-[60px] bg-[#f2f6f8] rounded-2xl border border-solid border-[#dde4ec]"
          />
        )}
      />
      <ErrorMessage errorMsg={error?.message || ""} />
    </div>
  );
};

export default CountryFlagSelect;
