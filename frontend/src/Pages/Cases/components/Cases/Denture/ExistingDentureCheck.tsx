import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface ExistingDentureCheckProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

export const ExistingDentureCheck = ({
    formConfig,
}: ExistingDentureCheckProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";
    const hasExistingDenture = watch("hasExistingDenture");

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Denture"
                titleName={`Let's get ${patientName} a new denture`}
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900">
                        Does {patientName} have an existing denture?
                    </h3>

                    <Controller
                        name="hasExistingDenture"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <div className="space-y-4">
                                {/* YES Option */}
                                <div
                                    onClick={() => onChange(true)}
                                    className={`
                  cursor-pointer
                  border rounded-lg p-6
                  flex items-start gap-4
                  transition-all duration-200
                  ${value === true
                                            ? "border-[#0B75C9] bg-blue-50 ring-1 ring-[#0B75C9]"
                                            : "border-gray-200 hover:border-gray-300"
                                        }
                `}
                                >
                                    <div className="mt-1 flex-shrink-0 text-[#0B75C9]">
                                        {value === true ? (
                                            <Disc className="w-5 h-5 fill-current" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                            Yes
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            I will use the existing denture to establish {patientName}'s
                                            bite and vertical dimension
                                        </p>
                                    </div>
                                </div>

                                {/* NO Option */}
                                <div
                                    onClick={() => onChange(false)}
                                    className={`
                  cursor-pointer
                  border rounded-lg p-6
                  flex items-start gap-4
                  transition-all duration-200
                  ${value === false
                                            ? "border-[#0B75C9] bg-blue-50 ring-1 ring-[#0B75C9]"
                                            : "border-gray-200 hover:border-gray-300"
                                        }
                `}
                                >
                                    <div className="mt-1 flex-shrink-0 text-[#0B75C9]">
                                        {value === false ? (
                                            <Disc className="w-5 h-5 fill-current" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                            No
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {patientName} has no existing denture to establish bite or
                                            vertical dimensions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>

                {hasExistingDenture === true && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                        <h3 className="text-xl font-medium text-gray-900">
                            Would you like an exact copy?
                        </h3>

                        <Controller
                            name="isExactCopy"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <div className="space-y-4">
                                    {/* YES Option */}
                                    <div
                                        onClick={() => onChange(true)}
                                        className={`
                    cursor-pointer
                    border rounded-lg p-6
                    flex items-center gap-4
                    transition-all duration-200
                    h-[92px] 
                    ${value === true
                                                ? "border-[#0B75C9] bg-blue-50 ring-1 ring-[#0B75C9]"
                                                : "border-gray-200 hover:border-gray-300"
                                            }
                  `}
                                    >
                                        <div className="flex-shrink-0 text-[#0B75C9]">
                                            {value === true ? (
                                                <Disc className="w-5 h-5 fill-current" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                Yes
                                            </h3>
                                        </div>
                                    </div>

                                    {/* NO Option */}
                                    <div
                                        onClick={() => onChange(false)}
                                        className={`
                    cursor-pointer
                    border rounded-lg p-6
                    flex items-center gap-4
                    transition-all duration-200
                    h-[92px]
                    ${value === false
                                                ? "border-[#0B75C9] bg-blue-50 ring-1 ring-[#0B75C9]"
                                                : "border-gray-200 hover:border-gray-300"
                                            }
                  `}
                                    >
                                        <div className="flex-shrink-0 text-[#0B75C9]">
                                            {value === false ? (
                                                <Disc className="w-5 h-5 fill-current" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                No
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
