import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface DentureOtherDetailsSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const BITE_ADJUSTMENT_OPTIONS = [
    "Leave as is",
    "Open",
    "Close",
] as const;

const MIDLINE_CORRECTION_OPTIONS = [
    "Leave as is",
    "Shift to patient's left",
    "Shift to patient's right",
    "Match upper midline",
    "Match lower midline",
] as const;

const OTHER_DETAILS_OPTIONS = [
    "Correct occlusal scheme to Class I",
    "Post-dam",
] as const;

export const DentureOtherDetailsSelection = ({
    formConfig,
}: DentureOtherDetailsSelectionProps) => {
    const { control } = formConfig;
    // const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Wrapping up Denture"
                titleName="Anything else we should know?"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-5xl">
                {/* Bite Adjustment */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Would you like to adjust the bite?
                    </h3>
                    <Controller
                        name="dentureBiteAdjustment"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <div className="space-y-3">
                                {BITE_ADJUSTMENT_OPTIONS.map((option) => {
                                    const isSelected = value === option;
                                    return (
                                        <div
                                            key={option}
                                            onClick={() => onChange(option)}
                                            className={`
                                                flex items-center gap-3 cursor-pointer
                                                px-6 py-4 rounded-lg border-2 transition-all
                                                ${isSelected
                                                    ? "border-[#0B75C9] bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                                }
                                            `}
                                        >
                                            {isSelected ? (
                                                <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span className="font-medium text-gray-900">{option}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    />
                </div>

                {/* Midline Correction */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Would you like to correct the midline?
                    </h3>
                    <Controller
                        name="dentureMidlineCorrection"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <div className="space-y-3">
                                {MIDLINE_CORRECTION_OPTIONS.map((option) => {
                                    const isSelected = value === option;
                                    return (
                                        <div
                                            key={option}
                                            onClick={() => onChange(option)}
                                            className={`
                                                flex items-center gap-3 cursor-pointer
                                                px-6 py-4 rounded-lg border-2 transition-all
                                                ${isSelected
                                                    ? "border-[#0B75C9] bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                                }
                                            `}
                                        >
                                            {isSelected ? (
                                                <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span className="font-medium text-gray-900">{option}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Any other details */}
            <div className="mt-8 max-w-5xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Any other details?
                </h3>
                <Controller
                    name="dentureOtherDetails"
                    control={control}
                    render={({ field: { value = [], onChange } }) => (
                        <div className="space-y-3">
                            {OTHER_DETAILS_OPTIONS.map((detail) => {
                                const isSelected = value.includes(detail);
                                return (
                                    <div
                                        key={detail}
                                        onClick={() => {
                                            if (isSelected) {
                                                onChange(value.filter((item) => item !== detail));
                                            } else {
                                                onChange([...value, detail]);
                                            }
                                        }}
                                        className={`
                                            flex items-center justify-between
                                            px-4 py-3 rounded-lg border-2 cursor-pointer
                                            transition-all
                                            ${isSelected
                                                ? "border-[#0B75C9] bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300 bg-white"
                                            }
                                        `}
                                    >
                                        <span className="font-medium text-gray-900">{detail}</span>
                                        <div className={`
                                            w-12 h-6 rounded-full relative transition-colors
                                            ${isSelected ? "bg-[#0B75C9]" : "bg-gray-300"}
                                        `}>
                                            <div className={`
                                                absolute top-1 left-1 w-4 h-4 bg-white rounded-full
                                                transition-transform
                                                ${isSelected ? "translate-x-6" : "translate-x-0"}
                                            `} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
