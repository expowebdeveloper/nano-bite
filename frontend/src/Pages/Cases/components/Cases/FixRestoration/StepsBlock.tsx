import React from "react";
import { Check, Camera, Layers, Activity } from "lucide-react";

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
  { id: 4, label: "Photos", icon: <Camera size={16} /> },
];

/* =======================
   VerticalStepper Component
======================= */
export const VerticalStepper: React.FC<{


  activeStep: number;
  selectedTeeth: number[];
  selectedOption?: any;
}> = ({ activeStep, selectedTeeth, selectedOption }) => {





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

  const stepsToRender = isFixedRestoration
    ? CROWN_STEPS
    : isDenture
      ? DENTURE_STEPS
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
                  ${isCompleted ? "bg-green-500 text-white" : ""}
                  ${isActive ? "bg-blue-600 text-white ring-4 ring-blue-50" : ""}
                  ${!isActive && !isCompleted ? "border-2 border-gray-100 text-gray-400 bg-white" : ""}
                `}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.id}
              </div>
              {index < stepsToRender.length - 1 && (
                <div
                  className={`h-12 w-[2px] my-1 transition-colors duration-300 ${isCompleted ? "bg-green-500" : "bg-gray-100"}`}
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
