import { useState } from "react";
import { CommanHeading } from "../../../CommanHeading";
import { TeethIcon } from "./TeethIcon";

type Option = {
  id: string;
  label: string;
  recommended?: boolean;
};
type OptionCardProps = {
  title: string;
  options: {
    id: string;
    label: string;
    recommended?: boolean;
  }[];
  selected: string | null;
  onSelect: (id: string) => void;
};

const retentionOptions: Option[] = [
  { id: "screw", label: "Screw retained", recommended: true },
  { id: "cement", label: "Cement-retained" },
  { id: "screwmentable", label: "Screwmentable" },
];

const materialOptions: Option[] = [
  { id: "labs", label: "Lab's Choice", recommended: true },
  { id: "titanium", label: "Custom Titanium" },
  { id: "zirconia", label: "Custom Zirconia Hybrid" },
  { id: "tbase", label: "Ti-base" },
];

export default function AbutmentSelection({
  selectedTeeth = [],
}: {
  selectedTeeth?: number[];
}) {
  const [retention, setRetention] = useState<string | null>("screw");
  const [material, setMaterial] = useState<string | null>("labs");

  return (
    <div className="max-w-5xl space-y-8">
      {/* Heading */}
      <CommanHeading
        caseName="Adding an Implant Restoration"
        titleName={
          <>
            What abutment option do you prefer on{" "}
            {selectedTeeth.length > 0 && (
              <span className="text-blue-600">
                {selectedTeeth.join(", ")}
              </span>
            )}?
          </>
        }
      />

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OptionCard
          title="Retention"
          options={retentionOptions}
          selected={retention}
          onSelect={setRetention}
        />

        <OptionCard
          title="Abutment Material"
          options={materialOptions}
          selected={material}
          onSelect={setMaterial}
        />
      </div>
    </div>
  );
}

function OptionCard({ title, options, selected, onSelect }: OptionCardProps) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>

      <div className="space-y-2">
        {options.map((option) => {
          const isActive = selected === option.id;

          return (
            <>
              {option.recommended && (
                <span
                  className={`flex gap-2 items-center ps-2 text-xs  py-2 rounded-t-lg w-full block !bg-[#0d77ca] text-white rounded-b-none px-10 py-2

                      ${isActive
                      ? "bg-white text-blue-600"
                      : "bg-blue-100 text-blue-600"
                    }`}
                >
                  <TeethIcon />
                  Recommended
                </span>
              )}
              <button
                type="button"
                key={option.id}
                onClick={() => onSelect(option.id)}
                className={`!mt-0 first:rounded-t-none !mb-2 w-full rounded-lg px-3 py-2 text-blue-600 text-left text-sm transition
                ${isActive
                    ? "bg-[#ffffff] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <div className="flex flex-row items-center justify-start gap-3">
                  {isActive && (
                    <div className="inline-block w-[20px] h-[10px] border-2 border-[#0d77ca] rotate-[-45deg] border-t-0 border-r-0"></div>
                  )}
                  <span className={`${isActive
                      ? "block text-gray-700"
                      : "text-gray-700"
                    }`}>{option.label}</span>


                </div>
              </button>
            </>

          );
        })}
      </div>
    </div>
  );
}
