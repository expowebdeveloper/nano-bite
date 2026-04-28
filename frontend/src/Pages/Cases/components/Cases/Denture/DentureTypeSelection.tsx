import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface DentureTypeSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const DENTURE_OPTIONS = [
    {
        value: "Conventional", // Maps to "New Denture"
        title: "New Denture",
        description:
            "A final full denture or implant-retained overdenture designed as a long-term prosthetic solution, restoring function, aesthetics, and occlusion.",
    },
    {
        value: "Immediate",
        title: "Immediate Denture",
        description:
            "A provisional full denture delivered immediately after extractions to maintain function and aesthetics during soft tissue healing, before transitioning to a final denture.",
    },
    {
        value: "Reline",
        title: "Denture Reline",
        description:
            "A reline improves the fit and retention of an existing denture by reshaping the intaglio surface to better adapt to changes in the patient's oral anatomy.",
    },
];

export const DentureTypeSelection = ({
    formConfig,
}: DentureTypeSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Denture"
                titleName={`What type of denture does ${patientName} need?`}
            />

            <Controller
                name="digitalType"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <div className="space-y-4 max-w-2xl mt-8">
                        {DENTURE_OPTIONS.map((option) => {
                            // Single-select semantics: only the first array value is the active choice.
                            const isSelected = value?.[0] === option.value;

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => onChange([option.value])} // Replace array with single value
                                    className={`
                    cursor-pointer
                    border rounded-lg p-6
                    flex items-start gap-4
                    transition-all duration-200
                    ${isSelected
                                            ? "border-[#0B75C9] bg-blue-50 ring-1 ring-[#0B75C9]"
                                            : "border-gray-200 hover:border-gray-300"
                                        }
                  `}
                                >
                                    <div className="mt-1 flex-shrink-0 text-[#0B75C9]">
                                        {isSelected ? (
                                            <Disc className="w-5 h-5 fill-current" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                            {option.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            />
        </div>
    );
};
