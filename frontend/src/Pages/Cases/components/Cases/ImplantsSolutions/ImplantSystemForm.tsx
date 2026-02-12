import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CommanHeading } from "../../../CommanHeading";
import ManufacturerSelect from "./SelectSearch";

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

export default function ImplantSystemForm({
  selectedTeeth = [],
}: {
  selectedTeeth?: number[];
}) {
  const [ manufacturer, setManufacturer] = useState("");
  const [system, setSystem] = useState("");
  const [platformSize, setPlatformSize] = useState("");
  

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


           {/* <ManufacturerSelect
              value={manufacturer}
              onChange={setManufacturer}
            /> */}

            <p className="mt-4 text-sm">
              Selected: <strong>{manufacturer}</strong>
            </p>
           
      

        <SelectField
          label="Manufacture"
          placeholder="Select Manufacture"
          value={manufacturer}
          options={manufactures}
          onChange={setManufacturer}
        />

        {/* System */}
        <SelectField
          label="System"
          placeholder="Select System"
          value={system}
          options={systems}
          onChange={setSystem}
        />

        {/* Platform Size */}
        <SelectField
          label="Platform Size"
          placeholder="Select Platform Size"
          value={platformSize}
          options={platformSizes}
          onChange={setPlatformSize}
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
};

function SelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg cursor-pointer bg-[#F8F8F8] px-4 py-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
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
    </div>
  );
}
