import React, { useState } from "react";
import { Check } from "lucide-react";
import { CommanHeading } from "../../../CommanHeading";
import TeethSelectionPage from "./ToothBlock";
import { VerticalStepper } from "./StepsBlock";
// import Checkbox from "../../../../../components/common/Checkbox/Checkbox";
// import CheckboxGroup from "../../../../../components/common/CheckboxGroup/CheckboxGroup";
import AddingCrown from "./AddingCrown";
// import toothImage from "../../../../assets/images/";
/* =======================
   Types & Constants
======================= */


interface OrderItem {
  id: string;
  label: string;
}

const ORDER_ITEMS: OrderItem[] = [
  { id: "crown", label: "Crown" },
  { id: "inlay", label: "Inlay" },
  { id: "onlay", label: "Onlay" },
  { id: "veneer", label: "Veneer" },
  { id: "bridge", label: "Bridge" },
];


const ORDER_ITEMS_Implants_Solutions: OrderItem[] = [
  { id: "Implants", label: "Implants" },
  { id: "ImplantsBridges", label: "ImplantsBridges" },
  { id: "SurgicalGuide", label: "SurgicalGuide" },

];

const ORDER_ITEMS_Splints_TMJ: OrderItem[] = [
  { id: "SplintsGuards_1", label: "SplintsGuards_1" },
  { id: "SplintsGuards_2", label: "SplintsGuards_2" },
  { id: "SplintsGuards_3", label: "SplintsGuards_3" },

];


const SUB_OPTIONS: Record<string, string[]> = {
  crown: [
    "Full Contour Zirconia",
    "Layered Zirconia",
    "PFM (Porcelain Fused to Metal)",
    "E-Max Lithium Disilicate",
  ],
  inlay: ["Composite Inlay", "Ceramic Inlay", "Gold Inlay"],
  onlay: ["Composite Onlay", "Ceramic Onlay", "Gold Onlay"],
  veneer: [
    "Prep-less Veneer",
    "Minimal Prep Veneer",
    "Diagnostic Wax-up Veneer",
  ],
  bridge: [
    "Traditional Bridge",
    "Cantilever Bridge",
    "Maryland Bridge",
    "Implant-Supported Bridge",
  ],
};

/* =======================
   Sub-Components
======================= */

const ItemCard: React.FC<{
  label: string;
  selected: boolean;
  onClick?: () => void;
}> = ({ label, selected, onClick }) => (
  <div
    className={`
      relative flex items-end justify-center aspect-square rounded-[32px] border-2 transition-all duration-300
      ${selected ? "border-blue-600 bg-blue-50 shadow-xl scale-[1.02]" : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-md"}
    `}
  >
    {selected && (
      <div className="absolute top-5 right-5 h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
        <Check className="h-4 w-4 text-white" />
      </div>
    )}
    <span
      className={`mb-8 font-semibold text-[17px] ${selected ? "text-blue-700" : "text-gray-800"}`}
    >
      {label}
    </span>
  </div>
);

/* =======================
   Main Page
======================= */

const OrderItemPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [innerStep, setInnerStep] = useState(1); // Nested Step logic
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<string | null>(
    null,
  );
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);

  // Computed Values
  // const availableSubOptions = useMemo(() => (selectedItem ? SUB_OPTIONS[selectedItem] : []), [selectedItem]);

  // Navigation Logic
  const handleNext = () => {
    if (currentStep === 1 && innerStep === 1 && selectedItem) {
      setInnerStep(2);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (currentStep === 1 && innerStep === 2) {
      setInnerStep(1);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        if (innerStep === 1) {
          return (
            <div className="mt-[33px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CommanHeading
                caseName="New Case - Fixed Restoration"
                titleName="What do you want to order?"
              />
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-[35px] sss">
                {ORDER_ITEMS.map((item) => (
                  <ItemCard
                    key={item.id}
                    label={item.label}
                    selected={selectedItem === item.id}
                    onClick={() => {
                      setSelectedItem(item.id);
                      setInnerStep(2); // Automatically move to inner step
                    }}
                  />
                ))}
              </div>
            </div>
          );
        }  else {
          return (
            <div className="mt-[35px] animate-in fade-in slide-in-from-right-4 duration-500">
              <CommanHeading
                caseName="New Case - Fixed Restoration"
                titleName="What do you want to order?"
              />

              <div className="grid gap-4 grid-cols-1 mt-[35px]">
                <TeethSelectionPage
                  selectedTeeth={selectedTeeth}
                  setSelectedTeeth={setSelectedTeeth}
                />
              </div>
            </div>
          );
        }
      case 2:
        return (
          <>
            <CommanHeading
              caseName="Adding Crown"
              titleName="Select the material for Crowns "
            />
            <div className="getting tooth values"></div>"
            <AddingCrown />
          </>
        );
      default:
        return (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-300">
              Step {currentStep} Content Placeholder
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen   font-sans text-gray-900">
      <div className=" mx-auto flex flex-col lg:flex-row gap-16">
        {/* Progress Sidebar */}
        <div className="hidden lg:block">
          <VerticalStepper
            activeStep={currentStep}
            selectedTeeth={selectedTeeth}
          />
        </div>

        {/* Form Area */}
        <div className="flex-1 flex flex-col justify-between min-h-[600px]">
          <div>
            {/* <CommanHeading
              caseName="New Case - Fixed Restoration"
              titleName="What do you want to order?"
            /> */}

            {renderStepContent()}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-16 pt-10 gap-6 ">
            <button
              onClick={handleBack}
              className={`w-[180px] h-[48px] rounded-lg border border-gray-300 text-gray-700 font-semibold bg-white hover:bg-gray-50 transition-colors 
                ${
                  currentStep === 1 && innerStep === 1
                    ? "hidden pointer-events-none"
                    : "block"
                }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && innerStep === 1 && !selectedItem) ||
                (currentStep === 1 && innerStep === 2 && !selectedTeeth.length)
              }
              className={`w-[180px] h-[48px] rounded-lg font-semibold transition-all ${
                (currentStep === 1 && innerStep === 1 && !selectedItem) ||
                (currentStep === 1 && innerStep === 2 && !selectedTeeth.length)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white hover:shadow-lg"
              }
               ${
                 currentStep === 1 && innerStep === 1
                   ? "hidden pointer-events-none"
                   : "block"
               }
              `}
            >
              {currentStep === 3 ? "Finish Case" : "Next"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 pt-4">
            <input
              className="w-4 h-4 text-[#0B75C9] focus:ring-[#0B75C9] rounded border-gray-300 cursor-pointer"
              type="checkbox"
            />
            <p className="font-poppins font-normal text-sm leading-none tracking-normal text-gray-700">
              This is crown under a partial denture
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemPage;
