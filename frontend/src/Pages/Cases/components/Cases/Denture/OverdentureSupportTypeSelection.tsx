import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface OverdentureSupportTypeSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const SUPPORT_TYPE_OPTIONS = [
    {
        value: "Implant-supported",
        title: "Implant-supported",
        description: "The overdenture will include recessed holes to simplify chairside pickup of the implant housings.",
    },
    {
        value: "Tooth-supported",
        title: "Tooth-supported",
        description: "The overdenture will include recessed holes that allow the metal-covered natural tooth to engage and disengage with the denture.",
    },
];

export const OverdentureSupportTypeSelection = ({
    formConfig,
}: OverdentureSupportTypeSelectionProps) => {
    const { control } = formConfig;
    // const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding an Overdenture Reline"
                titleName="How will the new overdenture be supported?"
            />

            <Controller
                name="overdentureSupportType"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <div className="space-y-4 max-w-3xl mt-8">
                        {SUPPORT_TYPE_OPTIONS.map((option) => {
                            const isSelected = value === option.value;

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => onChange(option.value)}
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
