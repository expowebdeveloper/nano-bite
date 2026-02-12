import { useState } from "react";

type MaterialOption = {
  id: string;
  label: string;
};

const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: "zirconia_monolithic", label: "Zirconia Monolithic" },
  { id: "zirconia_translucent", label: "Zirconia Translucent Aesthetic" },
  { id: "emax_full_contour", label: "Emax Full Contour" },
  { id: "pfz_layered", label: "Porcelain Fused Zirconia (PFZ, Layered)" },
  { id: "pfm_emax_gold", label: "PFM, E.Max, Gold, PMMA and Metal" },
];

export default function AddingCrown() {
  const [useSameMaterial, setUseSameMaterial] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");

  return (
    <div className="w-full max-w-xl rounded-xl  bg-white  space-y-4">
      {/* Toggle Header */}
      <div className="flex items-center justify-start gap-[15px]">
          {/* Toggle */}
        <button
          onClick={() => setUseSameMaterial(!useSameMaterial)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
            useSameMaterial ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              useSameMaterial ? "translate-x-4" : "translate-x-1"
            }`}
          />
        </button>
        <div>
          <p className="text-sm font-medium text-gray-900">
            Use the same material for all crowns
          </p>
          <p className="text-xs text-gray-500">
            Now editing teeth 4, 10, 13, 20, 23, 28 and 31
          </p>
        </div>

     
      </div>

      {/* Options */}
      <div className="space-y-2">
        {MATERIAL_OPTIONS.map((option, index) => (
          <label
            key={option.id}
            className={`flex items-center gap-3 rounded-lg  px-3 py-2 cursor-pointer transition ${
              index === MATERIAL_OPTIONS.length - 1 ? "justify-center" : ""
            } ${
              selectedMaterial === option.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            {index < MATERIAL_OPTIONS.length - 1 && (
              <input
                type="radio"
                name="material"
                value={option.id}
                checked={selectedMaterial === option.id}
                onChange={() => setSelectedMaterial(option.id)}
                className="h-4 w-4 text-blue-600"
              />
            )}
            <span className="text-sm text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
