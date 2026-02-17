import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface ImplantSupportedCheckProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

export const ImplantSupportedCheck = ({
    formConfig,
}: ImplantSupportedCheckProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Denture"
                titleName={`Will ${patientName}'s new denture be implant-supported?`}
            />

            <div className="mt-8 flex gap-8 items-start">
                <Controller
                    name="isImplantSupported"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <div className="space-y-4 max-w-2xl flex-1">
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
                                        Yes, it's an overdenture
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        The denture will feature recessed holes to simplify your
                                        chairside pickup of the housings
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
                                </div>
                            </div>
                        </div>
                    )}
                />

                {/* Right side info box - always shows */}
                <div className="flex-1 border rounded-xl p-6 bg-white hidden md:block">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
                            {/* Placeholder for the denture icon/image */}
                            <span className="text-2xl">🦷</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#004d40]">
                            We've updated the ordering flow for Overdentures
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Select Yes or click Switch below, and we'll tailor the questions
                            for overdentures.
                        </p>
                        <button
                            type="button"
                            className="text-[#004d40] font-semibold flex items-center gap-1 hover:underline mt-2"
                        >
                            Switch to Overdentures &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
