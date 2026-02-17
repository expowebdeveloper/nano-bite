import { Control, Controller, UseFormReturn } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { CommanHeading } from "../../../CommanHeading";
import { CaseFormValues } from "../../../../../Constants/Constants";

type Option = {
  label: string;
  value: string;
};

const manufactures: Option[] = [
  { label: "Straumann", value: "straumann" },
  { label: "Nobel Biocare", value: "nobel" },
  { label: "Zimmer", value: "zimmer" },
];

const systems: Option[] = [
  { label: "Bone Level", value: "bone_level" },
  { label: "Tissue Level", value: "tissue_level" },
];

const platformSizes: Option[] = [
  { label: "Small", value: "small" },
  { label: "Regular", value: "regular" },
  { label: "Wide", value: "wide" },
];

interface ImplantSystemFormProps {
  selectedTeeth?: number[];
  formConfig: UseFormReturn<CaseFormValues>;
}

export default function ImplantSystemForm({
  selectedTeeth = [],
  formConfig,
}: ImplantSystemFormProps) {
  const { control } = formConfig;

  return (
    <div className=" space-y-6 bg-white">
      {/* Heading */}
      <div className="space-y-2">
        <CommanHeading
          caseName="Adding an Implant Restoration"
          titleName={
            <>
              What implant system is being used on{" "}
              {selectedTeeth.length > 0 && (
                <>
                  <span className="text-blue-600">
                    {selectedTeeth.join(", ")}
                  </span>
                </>
              )}
            </>
          }
        />

        <p className="text-sm text-gray-500 mt-[40px]">
          You can find information about your implant system on your Oral
          surgeon’s surgery report.
        </p>
      </div>

      <div className="w-full max-w-[522px] flex flex-col gap-6">
        {/* Manufacture */}
        <p className="mt-4 text-sm hidden">
          Selected: <strong>{formConfig.watch("implantBrand")}</strong>
        </p>

        <Controller
          name="implantBrand"
          control={control}
          rules={{ required: "Manufacturer is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <SelectField
              label="Manufacture"
              placeholder="Select Manufacture"
              value={value || ""}
              options={manufactures}
              onChange={onChange}
              error={error?.message}
            />
          )}
        />

        {/* System */}
        <Controller
          name="implantConnection"
          control={control}
          rules={{ required: "System is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <SelectField
              label="System"
              placeholder="Select System"
              value={value || ""}
              options={systems}
              onChange={onChange}
              error={error?.message}
            />
          )}
        />

        {/* Platform Size */}
        <Controller
          name="implantPlatform"
          control={control}
          rules={{ required: "Platform Size is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <SelectField
              label="Platform Size"
              placeholder="Select Platform Size"
              value={value || ""}
              options={platformSizes}
              onChange={onChange}
              error={error?.message}
            />
          )}
        />
      </div>
    </div>
  );
}

/* -----------------------------
   Reusable Select Component
------------------------------ */

type SelectProps = {
  label: string;
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
};

function SelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-lg cursor-pointer bg-[#F8F8F8] px-4 py-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none ${error ? "border border-red-500" : ""}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
