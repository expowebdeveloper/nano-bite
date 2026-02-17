import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc, Settings, Sparkles } from "lucide-react";
import { useState } from "react";

interface DentureSmileStyleSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const SMILE_STYLE_OPTIONS = [
    {
        value: "Lab choice",
        title: "Lab choice",
        description: "Our technicians will use Walter's age and facial features to determine which smile style will look best.",
        isRecommended: true,
        icon: <Sparkles className="w-16 h-16 text-[#00a758]" />,
    },
    {
        value: "Hollywood",
        title: "Hollywood",
        description: "",
        isRecommended: false,
        icon: "🦷",
    },
    {
        value: "Mature",
        title: "Mature",
        description: "",
        isRecommended: false,
        icon: "🦷",
    },
    {
        value: "Youthful",
        title: "Youthful",
        description: "",
        isRecommended: false,
        icon: "🦷",
    },
];

export const DentureSmileStyleSelection = ({
    formConfig,
}: DentureSmileStyleSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Wrapping up Denture"
                titleName={`What smile style do you want for this denture?`}
            />

            <Controller
                name="dentureSmileStyle"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl">
                        {SMILE_STYLE_OPTIONS.map((option) => {
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
                                        min-h-[200px]
                                        ${isSelected
                                            ? "border-[#00a758] bg-green-50 ring-2 ring-[#00a758]"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                        }
                                    `}
                                >
                                    {option.isRecommended && (
                                        <div className="absolute top-4 left-4 flex items-center gap-2 text-[#00a758] text-sm font-semibold">
                                            <Settings className="w-4 h-4" />
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
                                    <div className="mb-4 flex items-center justify-center">
                                        {typeof option.icon === "string" ? (
                                            <span className="text-6xl">{option.icon}</span>
                                        ) : (
                                            option.icon
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                        {option.title}
                                    </h3>
                                    {option.description && (
                                        <div className="relative">
                                            <span
                                                className="text-sm text-gray-600 cursor-help"
                                                onMouseEnter={() => setShowTooltip(true)}
                                                onMouseLeave={() => setShowTooltip(false)}
                                            >
                                                {option.description}
                                            </span>
                                            {showTooltip && option.value === "Lab choice" && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-10">
                                                    {option.description}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                                        <div className="border-4 border-transparent border-t-gray-900"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            />
        </div>
    );
};
