import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface PartialDentureReplacementCheckProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

export const PartialDentureReplacementCheck = ({
    formConfig,
}: PartialDentureReplacementCheckProps) => {
    const { control } = formConfig;

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Partial"
                titleName="Is this a replacement partial?"
            />

            <div className="mt-8 max-w-2xl">
                <Controller
                    name="partialIsReplacement"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <div className="flex flex-col gap-4">
                            <div
                                onClick={() => onChange(true)}
                                className={`
                                    flex items-center gap-3 cursor-pointer
                                    px-8 py-6 rounded-lg border-2 transition-all
                                    ${value === true
                                        ? "border-[#0B75C9] bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                    }
                                `}
                            >
                                {value === true ? (
                                    <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                )}
                                <span className="font-medium text-gray-900 text-lg">Yes</span>
                            </div>
                            <div
                                onClick={() => onChange(false)}
                                className={`
                                    flex items-center gap-3 cursor-pointer
                                    px-8 py-6 rounded-lg border-2 transition-all
                                    ${value === false
                                        ? "border-[#0B75C9] bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                    }
                                `}
                            >
                                {value === false ? (
                                    <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                )}
                                <span className="font-medium text-gray-900 text-lg">No</span>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
