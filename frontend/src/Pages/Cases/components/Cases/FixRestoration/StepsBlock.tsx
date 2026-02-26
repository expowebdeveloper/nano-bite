import React from "react";
import { Check, Camera, Layers, Activity, Palette } from "lucide-react";

/* =======================
   Types & Constants
======================= */
export interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

export const STEPS: Step[] = [
  { id: 1, label: "Item", icon: <Layers size={16} /> },
  { id: 2, label: "Teeth", icon: <Activity size={16} /> },
  { id: 3, label: "Implant", icon: <Camera size={16} /> },
  { id: 4, label: "Abutment", icon: <Layers size={16} /> },
  { id: 5, label: "Material", icon: <Activity size={16} /> },
  { id: 6, label: "Photos", icon: <Camera size={16} /> },
  { id: 7, label: "Shades", icon: <Camera size={16} /> },
  { id: 8, label: "Confirm", icon: <Check size={16} /> },
];

const CROWN_STEPS: Step[] = [
  { id: 1, label: "Item", icon: <Layers size={16} /> },
  { id: 2, label: "Teeth", icon: <Activity size={16} /> },
  { id: 3, label: "Photos", icon: <Camera size={16} /> }, // Map step 4 to id 3 visually or handle mapping
];

const DENTURE_STEPS: Step[] = [
  { id: 1, label: "Item", icon: <Layers size={16} /> },
  { id: 2, label: "Type", icon: <Activity size={16} /> },
  { id: 3, label: "Arch", icon: <Activity size={16} /> },
  // { id: 4, label: "Shade", icon: <Palette size={16} /> }, // Shade step commented out - not required
  // Steps commented out for Full Denture/Overdenture Conventional flow:
  // { id: 4, label: "Denture Type", icon: <Layers size={16} /> },
  // { id: 5, label: "Smile Style", icon: <Activity size={16} /> },
  // { id: 6, label: "Festooning", icon: <Activity size={16} /> },
  // { id: 7, label: "Settings", icon: <Activity size={16} /> },
  // { id: 8, label: "Functional Preferences", icon: <Activity size={16} /> },
  // { id: 4, label: "Design Preview", icon: <Activity size={16} /> }, // Design Preview commented out - not required
  { id: 4, label: "Photos", icon: <Camera size={16} /> },
  { id: 5, label: "Review", icon: <Check size={16} /> },
];

const PARTIAL_DENTURE_STEPS: Step[] = [
  { id: 1, label: "Item", icon: <Layers size={16} /> },
  { id: 2, label: "Material", icon: <Activity size={16} /> },
  // { id: 3, label: "Shade", icon: <Palette size={16} /> }, // Shade step commented out - not required
  { id: 3, label: "Replacement", icon: <Activity size={16} /> },
  // Photos step commented out for Partial Denture
  // { id: 5, label: "Photos", icon: <Camera size={16} /> },
];

const OVERDENTURE_IMMEDIATE_STEPS: Step[] = [
  { id: 1, label: "Item", icon: <Layers size={16} /> },
  { id: 2, label: "Type", icon: <Activity size={16} /> },
  { id: 3, label: "Scan/Impression", icon: <Camera size={16} /> },
];

const OVERDENTURE_RELINE_IMPLANT_STEPS: Step[] = [
  { id: 1, label: "Item", icon: <Layers size={16} /> },
  { id: 2, label: "Type", icon: <Activity size={16} /> },
  { id: 3, label: "Reline Check", icon: <Activity size={16} /> },
  { id: 4, label: "Support Type", icon: <Activity size={16} /> },
  { id: 5, label: "Implant Locations", icon: <Activity size={16} /> },
  { id: 6, label: "Implant Details", icon: <Activity size={16} /> },
  { id: 7, label: "Arch Selection", icon: <Activity size={16} /> },
];

const OVERDENTURE_RELINE_STEPS: Step[] = [
  { id: 1, label: "Item", icon: <Layers size={16} /> },
  { id: 2, label: "Type", icon: <Activity size={16} /> },
  { id: 3, label: "Reline Check", icon: <Activity size={16} /> },
  { id: 4, label: "Support Type", icon: <Activity size={16} /> },
  { id: 5, label: "Arch Selection", icon: <Activity size={16} /> },
];

const DENTURE_CONVENTIONAL_STEPS: Step[] = [
  { id: 1, label: "Item", icon: <Layers size={16} /> },
  { id: 2, label: "Type", icon: <Activity size={16} /> },
  { id: 3, label: "Arch", icon: <Activity size={16} /> },
  // Steps commented out for Full Denture/Overdenture Conventional flow:
  // { id: 4, label: "Denture Type", icon: <Layers size={16} /> },
  // { id: 5, label: "Smile Style", icon: <Activity size={16} /> },
  // { id: 6, label: "Festooning", icon: <Activity size={16} /> },
  // { id: 7, label: "Settings", icon: <Activity size={16} /> },
  // { id: 8, label: "Functional Preferences", icon: <Activity size={16} /> },
  // { id: 4, label: "Design Preview", icon: <Activity size={16} /> }, // Design Preview commented out - not required
  { id: 4, label: "Photos", icon: <Camera size={16} /> },
  { id: 5, label: "Review", icon: <Check size={16} /> },
];

/* =======================
   VerticalStepper Component
======================= */
export const VerticalStepper: React.FC<{


  activeStep: number;
  selectedTeeth: number[];
  selectedOption?: any;
  dentureType?: string;
  overdentureSupportType?: string;
}> = ({ activeStep, selectedTeeth, selectedOption, dentureType, overdentureSupportType }) => {





  const isFixedRestoration = [
    "Crown",
    "Inlay",
    "Onlay",
    "Veneer",
    "Bridge",
  ].includes(selectedOption || "");

  const isDenture = [
    "Full Denture",
    "Overdenture",
    "Partial Denture",
  ].includes(selectedOption || "");

  const isPartialDenture = selectedOption === "Partial Denture";
  const isOverdentureImmediate = selectedOption === "Overdenture" && dentureType === "Immediate";
  const isOverdentureReline = selectedOption === "Overdenture" && dentureType === "Reline";
  const isOverdentureRelineImplant = isOverdentureReline && overdentureSupportType === "Implant-supported";
  const isOverdentureRelineTooth = isOverdentureReline && overdentureSupportType === "Tooth-supported";
  const isDentureConventional = isDenture && (dentureType === "Conventional" || !dentureType);
  const isFullDentureImmediate = selectedOption === "Full Denture" && dentureType === "Immediate";

  const stepsToRender = isFixedRestoration
    ? CROWN_STEPS
    : isPartialDenture
      ? PARTIAL_DENTURE_STEPS
      : isOverdentureImmediate
        ? OVERDENTURE_IMMEDIATE_STEPS
        : isOverdentureRelineImplant
          ? OVERDENTURE_RELINE_IMPLANT_STEPS
          : isOverdentureReline
            ? OVERDENTURE_RELINE_STEPS // Show reline steps even if support type not selected yet
            : isFullDentureImmediate
              ? DENTURE_CONVENTIONAL_STEPS // Use simplified steps for Full Denture Immediate flow (same as Conventional)
              : isDentureConventional
                ? DENTURE_CONVENTIONAL_STEPS // Use simplified steps for Conventional flow
                : isDenture
                  ? DENTURE_STEPS // Use full steps for other denture types (Reline)
                  : STEPS;

  return (
    <div className="bg-[#F8F8F8] rounded-[32px] p-3 min-w-[200px]  max-w-[200px] h-fit sticky top-6 border border-gray-100 shadow-sm">
      {stepsToRender.map((step, index) => {
        const isCompleted = step.id < activeStep;
        const isActive = step.id === activeStep;

        return (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`
                  h-[27px] w-[27px] flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 flex-shrink-0
                  ${isCompleted ? "bg-blue-500 text-white" : ""}
                  ${isActive ? "bg-blue-600 text-white ring-4 ring-blue-50" : ""}
                  ${!isActive && !isCompleted ? "border-2 border-gray-100 text-gray-400 bg-white" : ""}
                `}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.id}
              </div>
              {index < stepsToRender.length - 1 && (
                <div
                  className={`h-12 w-[2px] my-1 transition-colors duration-300 ${isCompleted ? "bg-blue-500" : "bg-gray-100"}`}
                />
              )}
            </div>
            <div className="flex flex-col pt-1 flex-1 min-w-0">
              <span
                className={`font-inter font-normal text-sm leading-5 tracking-normal align-middle
                ${isActive ? "text-blue-600" : isCompleted ? "text-gray-700" : "text-gray-400"}`}
              >
                {step.label}
              </span>
              {step.id === 1 && selectedOption && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold text-xs whitespace-nowrap">
                    {selectedOption}
                  </span>
                </div>
              )}
              {step.id === 2 && selectedTeeth.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTeeth
                    .sort((a, b) => a - b)
                    .map((num) => (
                      <span
                        key={num}
                        className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold text-xs whitespace-nowrap"
                      >
                        {num}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
