import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc, Settings } from "lucide-react";

interface DentureFestooningSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const FESTOONING_OPTIONS = [
    {
        value: "Soft",
        title: "Soft",
        description: "Smooth gum line with subtle indentations",
        isRecommended: false,
    },
    {
        value: "Medium",
        title: "Medium",
        description: "Distinct and sculpted festoons with clear definitions",
        isRecommended: true,
    },
    {
        value: "Heavy",
        title: "Heavy",
        description: "Pronounced and deeply sculpted festoons",
        isRecommended: false,
    },
];

export const DentureFestooningSelection = ({
    formConfig,
}: DentureFestooningSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Wrapping up Denture"
                titleName="What festooning level are you looking for?"
            />

            <Controller
                name="dentureFestooningLevel"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl">
                        {FESTOONING_OPTIONS.map((option) => {
                            const isSelected = value === option.value;

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => onChange(option.value)}
                                    className={`
                                        relative cursor-pointer
                                        border-2 rounded-xl p-6
                                        flex flex-col items-center justify-center
                                        transition-all duration-200
                                        min-h-[250px]
                                        ${isSelected
                                            ? "border-[#00a758] bg-green-50 ring-2 ring-[#00a758]"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                        }
                                    `}
                                >
                                    {option.isRecommended && (
                                        <div className="absolute top-4 left-4 flex items-center gap-2 text-white text-sm font-semibold">
                                            <span>Recommended</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        {isSelected ? (
                                            <Disc className="w-5 h-5 fill-[#00a758] text-[#00a758]" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    {/* Teeth illustration */}
                                    <div className="mt-8 mb-4">
                                        <svg width="120" height="60" viewBox="0 0 120 60" className="w-full h-auto">
                                            {/* Gums */}
                                            <path
                                                d={`M 10 30 Q 20 ${option.value === "Soft" ? "28" : option.value === "Medium" ? "25" : "22"}, 30 30 Q 40 ${option.value === "Soft" ? "28" : option.value === "Medium" ? "25" : "22"}, 50 30 Q 60 ${option.value === "Soft" ? "28" : option.value === "Medium" ? "25" : "22"}, 70 30 Q 80 ${option.value === "Soft" ? "28" : option.value === "Medium" ? "25" : "22"}, 90 30 Q 100 ${option.value === "Soft" ? "28" : option.value === "Medium" ? "25" : "22"}, 110 30`}
                                                fill="#FFB6C1"
                                                stroke="#FFB6C1"
                                                strokeWidth="2"
                                            />
                                            {/* Teeth */}
                                            {[20, 35, 50, 65, 80, 95].map((x, i) => (
                                                <rect
                                                    key={i}
                                                    x={x - 5}
                                                    y={30}
                                                    width="10"
                                                    height="20"
                                                    fill="white"
                                                    stroke="#ddd"
                                                    strokeWidth="1"
                                                    rx="2"
                                                />
                                            ))}
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-lg mt-4">
                                        {option.title}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>
                )}
            />
        </div>
    );
};
