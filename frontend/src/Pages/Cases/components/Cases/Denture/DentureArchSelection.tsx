import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Check, Edit } from "lucide-react";
import { useState } from "react";
import singleUpper from "../../../../../assets/images/single-upper.webp";
import singleLower from "../../../../../assets/images/single-lower.webp";
import dual from "../../../../../assets/images/dual.webp";

interface DentureArchSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
    onNext: () => void;
}

const ARCH_OPTIONS = [
    {
        id: "Dual arch",
        label: "Dual arch",
        image: dual,
    },
    {
        id: "Single arch: upper",
        label: "Single arch: upper",
        image: singleUpper,
    },
    {
        id: "Single arch: lower",
        label: "Single arch: lower",
        image: singleLower
    },
];

export const DentureArchSelection = ({
    formConfig,
    onNext,
}: DentureArchSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";
    const [showPopup, setShowPopup] = useState(false);

    // Helper to handle selection
    const handleSelect = (onChange: (val: string) => void, value: string) => {
        onChange(value);
        // Popup/scanning modal commented out - not required
        // if (value === "Dual arch") {
        //     setShowPopup(true);
        // } else {
        //     setShowPopup(true);
        // }
    };

    return (
        <div className="bg-white p-6 md:p-8 space-y-6 relative">
            <CommanHeading
                caseName="Adding a Denture"
                titleName={`Which arch(es) does ${patientName} need a Denture for?`}
            />

            <Controller
                name="dentureArch"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {ARCH_OPTIONS.map((option) => {
                            const isSelected = value === option.id;
                            return (
                                <div
                                    key={option.id}
                                    onClick={() => handleSelect(onChange, option.id)}
                                    className={`
                                        relative cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-end h-64 transition-all duration-200 hover:border-blue-400 bg-gray-50
                                        ${isSelected
                                            ? "border-[#0B75C9] ring-1 ring-[#0B75C9] bg-blue-50/10"
                                            : "border-gray-100"
                                        }
                                    `}
                                >
                                    <div className="absolute top-4 left-4">
                                        <div
                                            className={`
                                                w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                ${isSelected
                                                    ? "border-[#0B75C9] bg-[#0B75C9]"
                                                    : "border-gray-300"
                                                }
                                            `}
                                        >
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </div>

                                    {/* Image Container */}
                                    <div className="flex-1 flex items-center justify-center w-full mb-4">
                                        <img
                                            src={option.image}
                                            alt={option.label}
                                            className="h-32 w-auto object-contain"
                                        />
                                    </div>

                                    <p className="font-medium text-gray-900 mt-4 w-full text-left ml-2">
                                        {option.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            />

            {/* Popup Overlay - COMMENTED OUT: Scanning modal removed as per requirements */}
            {/* {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100 mx-4">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 relative">
                                <span className="text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">🦷</span>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-[#004d40]">
                                    Added Denture
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    Does {patientName} need anything else?
                                </p>
                            </div>

                            <button
                                onClick={onNext}
                                className="w-full bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] hover:shadow-lg text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <span>Start scanning</span>
                                <Check className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-[#0B75C9] font-medium flex items-center gap-2 hover:underline"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Denture
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};
