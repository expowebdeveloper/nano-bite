import { useState } from "react";
import { CommanHeading } from "../../../CommanHeading";

/* =======================
   Types
======================= */
type SelectFieldProps = {
  label: string;
  required?: boolean;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

/* =======================
   Reusable Select Field
======================= */
function SelectField({
  label,
  required,
  placeholder,
  options,
  value,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            h-11
            rounded-lg
            bg-gray-100
            text-sm
            text-gray-700
            px-4
            appearance-none
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          ▾
        </span>
      </div>
    </div>
  );
}

/* =======================
   Main Component
======================= */
export default function ShadeSelection({
  selectedTeeth = [],
}: {
  selectedTeeth?: number[];
}) {
  const [baseShade, setBaseShade] = useState("");
  const [gingivalShade, setGingivalShade] = useState("");
  const [incisalShade, setIncisalShade] = useState("");

  return (
    <div className="max-w-4xl space-y-6">
      <CommanHeading
        caseName="Adding an Implant Restoration"
        titleName={
          <>
            Select the shade for Implants Restoration{" "}
            {selectedTeeth.length > 0 && (
              <span className="text-blue-600">
                {selectedTeeth.join(", ")}
              </span>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Base Shade"
          required
          placeholder="Select Base Shade"
          value={baseShade}
          onChange={setBaseShade}
          options={["A1", "A2", "A3", "B1", "B2", "C1", "D2"]}
        />

        <SelectField
          label="Gingival shade"
          required
          placeholder="Select Gingival shade"
          value={gingivalShade}
          onChange={setGingivalShade}
          options={[
            "Light Pink",
            "Natural Pink",
            "Dark Pink",
            "Reddish Pink",
          ]}
        />

        <SelectField
          label="Incisal Shade"
          required
          placeholder="Select Incisal Shade"
          value={incisalShade}
          onChange={setIncisalShade}
          options={[
            "Translucent",
            "High Translucent",
            "Low Translucent",
            "Opalescent",
          ]}
        />
      </div>
    </div>
  );
}
