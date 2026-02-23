import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface OverdentureScanSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const SCAN_OPTIONS = [
    {
        value: "Intraoral scan",
        title: "Intraoral scan",
        description: "You'll scan the patient directly using an intraoral scanner",
        icon: (
            <svg width="140" height="120" viewBox="0 0 140 120" className="w-full h-auto">
                {/* Person profile - head outline */}
                <circle cx="35" cy="50" r="22" fill="none" stroke="#333" strokeWidth="2.5" />
                {/* Face outline */}
                <path d="M 20 50 Q 35 40 50 50" stroke="#333" strokeWidth="2" fill="none" />
                {/* Open mouth */}
                <ellipse cx="35" cy="58" rx="10" ry="7" fill="#333" />
                {/* Scanner device - Blue color scheme */}
                <rect x="50" y="35" width="35" height="10" rx="2" fill="#0B75C9" />
                <rect x="55" y="28" width="25" height="8" rx="1.5" fill="#3BA6E5" />
                <rect x="58" y="25" width="19" height="4" rx="1" fill="#0B75C9" />
                {/* Scanner tip entering mouth */}
                <rect x="42" y="55" width="15" height="5" rx="1" fill="#0B75C9" />
                {/* Hand holding scanner */}
                <ellipse cx="70" cy="42" rx="10" ry="15" fill="#fbbf24" />
                {/* Scanner cable */}
                <line x1="85" y1="40" x2="100" y2="30" stroke="#0B75C9" strokeWidth="2" />
            </svg>
        ),
    },
    {
        value: "Impression scan",
        title: "Impression scan",
        description: "You'll scan the physical impression using an intraoral scanner",
        isNew: true,
        icon: (
            <svg width="140" height="120" viewBox="0 0 140 120" className="w-full h-auto">
                {/* Physical impression (dental arch model) - white/gray */}
                <path
                    d="M 15 70 Q 25 55 35 60 Q 45 65 55 60 Q 65 65 75 60 Q 85 65 95 60 Q 105 65 115 60"
                    stroke="#ddd"
                    strokeWidth="3.5"
                    fill="none"
                />
                <path
                    d="M 15 70 Q 25 85 35 80 Q 45 85 55 80 Q 65 85 75 80 Q 85 85 95 80 Q 105 85 115 80"
                    stroke="#ddd"
                    strokeWidth="3.5"
                    fill="none"
                />
                {/* Base of impression */}
                <ellipse cx="65" cy="75" rx="50" ry="8" fill="#f0f0f0" stroke="#ddd" strokeWidth="2" />
                {/* Teeth on impression */}
                {[20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((x, i) => (
                    <rect
                        key={i}
                        x={x - 3}
                        y={65}
                        width="6"
                        height="10"
                        rx="1"
                        fill="#fff"
                        stroke="#ddd"
                        strokeWidth="1.5"
                    />
                ))}
                {/* Scanner scanning impression - Blue color scheme */}
                <rect x="55" y="15" width="35" height="10" rx="2" fill="#0B75C9" />
                <rect x="60" y="8" width="25" height="8" rx="1.5" fill="#3BA6E5" />
                <rect x="63" y="5" width="19" height="4" rx="1" fill="#0B75C9" />
                {/* Scanner tip pointing at impression */}
                <line x1="55" y1="20" x2="65" y2="60" stroke="#0B75C9" strokeWidth="3" />
                {/* Scanner cable */}
                <line x1="90" y1="20" x2="105" y2="10" stroke="#0B75C9" strokeWidth="2" />
            </svg>
        ),
    },
];

export const OverdentureScanSelection = ({
    formConfig,
}: OverdentureScanSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Denture"
                titleName={`How will you send us ${patientName}'s scans or impressions?`}
            />

            <Controller
                name="overdentureScanMethod"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl">
                        {SCAN_OPTIONS.map((option) => {
                            const isSelected = value === option.value;

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => onChange(option.value)}
                                    className={`
                                        relative cursor-pointer
                                        border-2 rounded-xl p-6
                                        flex flex-col items-center
                                        transition-all duration-200
                                        ${isSelected
                                            ? "border-[#0B75C9] bg-blue-50 ring-2 ring-[#0B75C9]"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                        }
                                    `}
                                >
                                    {/* Radio button */}
                                    <div className="absolute top-4 left-4">
                                        {isSelected ? (
                                            <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>

                                    {/* "New" badge */}
                                    {option.isNew && (
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-block px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold">
                                                New
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon/Illustration */}
                                    <div className="mt-8 mb-4 flex items-center justify-center w-full">
                                        {option.icon}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                        {option.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 text-center">
                                        {option.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            />
        </div>
    );
};
