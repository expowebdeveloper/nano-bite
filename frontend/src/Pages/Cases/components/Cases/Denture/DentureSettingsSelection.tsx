import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues, DENTURE_ADD_ONS_OPTIONS } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface DentureSettingsSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

export const DentureSettingsSelection = ({
    formConfig,
}: DentureSettingsSelectionProps) => {
    const { control, watch, setValue } = formConfig;
    const patientName = watch("patientName") || "the patient";
    const wantsAddOns = watch("dentureWantsAddOns");
    const hasDiastema = watch("dentureHasDiastema");

    // If wantsAddOns is not set, show the initial question
    if (wantsAddOns === undefined) {
        return (
            <div className="bg-white p-6 md:p-8 space-y-6">
                <CommanHeading
                    caseName="Wrapping up Denture"
                    titleName="Any other settings or add-ons?"
                />

                <div className="mt-8 max-w-2xl">
                    <Controller
                        name="dentureWantsAddOns"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <div className="flex gap-4">
                                <div
                                    onClick={() => {
                                        onChange(true);
                                        // If Yes, set diastema to false initially
                                        setValue("dentureHasDiastema", false);
                                    }}
                                    className={`
                                        flex items-center gap-3 cursor-pointer
                                        px-8 py-6 rounded-lg border-2 transition-all
                                        ${value === true
                                            ? "border-[#0B75C9] bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
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
                                    onClick={() => {
                                        onChange(false);
                                        // If No, set diastema to false
                                        setValue("dentureHasDiastema", false);
                                    }}
                                    className={`
                                        flex items-center gap-3 cursor-pointer
                                        px-8 py-6 rounded-lg border-2 transition-all
                                        ${value === false
                                            ? "border-[#0B75C9] bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
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
    }

    // If wantsAddOns is false (No), show Image 1 layout
    if (wantsAddOns === false) {
        return (
            <div className="bg-white p-6 md:p-8 space-y-6">
                <CommanHeading
                    caseName="Wrapping up Denture"
                    titleName="Any other settings or add-ons?"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-5xl">
                    {/* Diastema Question */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Does {patientName} have diastema?
                        </h3>
                        <Controller
                            name="dentureHasDiastema"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <div className="flex gap-4">
                                    <div
                                        onClick={() => onChange(true)}
                                        className={`
                                            flex items-center gap-3 cursor-pointer
                                            px-6 py-4 rounded-lg border-2 transition-all
                                            ${value === true
                                                ? "border-[#0B75C9] bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }
                                        `}
                                    >
                                        {value === true ? (
                                            <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="font-medium text-gray-900">Yes</span>
                                    </div>
                                    <div
                                        onClick={() => onChange(false)}
                                        className={`
                                            flex items-center gap-3 cursor-pointer
                                            px-6 py-4 rounded-lg border-2 transition-all
                                            ${value === false
                                                ? "border-[#0B75C9] bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }
                                        `}
                                    >
                                        {value === false ? (
                                            <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="font-medium text-gray-900">No</span>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    {/* Add-ons */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Add-ons</h3>
                        <Controller
                            name="dentureAddOns"
                            control={control}
                            render={({ field: { value = [], onChange } }) => (
                                <div className="space-y-3">
                                    {DENTURE_ADD_ONS_OPTIONS.map((addOn) => {
                                        const isSelected = value.includes(addOn);
                                        return (
                                            <div
                                                key={addOn}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        onChange(value.filter((item) => item !== addOn));
                                                    } else {
                                                        onChange([...value, addOn]);
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
                                                <span className="font-medium text-gray-900">{addOn}</span>
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
            </div>
        );
    }

    // If wantsAddOns is true (Yes), show Image 2 layout with conditional diastema handling
    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Wrapping up Denture"
                titleName="Any other settings or add-ons?"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-5xl">
                {/* Diastema Question */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Does {patientName} have diastema?
                    </h3>
                    <Controller
                        name="dentureHasDiastema"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <>
                                <div className="flex gap-4">
                                    <div
                                        onClick={() => onChange(true)}
                                        className={`
                                            flex items-center gap-3 cursor-pointer
                                            px-6 py-4 rounded-lg border-2 transition-all
                                            ${value === true
                                                ? "border-[#0B75C9] bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }
                                        `}
                                    >
                                        {value === true ? (
                                            <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="font-medium text-gray-900">Yes</span>
                                    </div>
                                    <div
                                        onClick={() => {
                                            onChange(false);
                                            setValue("dentureDiastemaHandling", "");
                                        }}
                                        className={`
                                            flex items-center gap-3 cursor-pointer
                                            px-6 py-4 rounded-lg border-2 transition-all
                                            ${value === false
                                                ? "border-[#0B75C9] bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }
                                        `}
                                    >
                                        {value === false ? (
                                            <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="font-medium text-gray-900">No</span>
                                    </div>
                                </div>
                                
                                {/* Conditional follow-up when diastema is Yes */}
                                {value === true && (
                                    <div className="mt-6 space-y-4">
                                        <h4 className="text-base font-semibold text-gray-900">
                                            How do you want us to handle it?
                                        </h4>
                                        <Controller
                                            name="dentureDiastemaHandling"
                                            control={control}
                                            render={({ field: { value: handlingValue, onChange: handlingOnChange } }) => (
                                                <div className="flex gap-4">
                                                    <div
                                                        onClick={() => handlingOnChange("Keep it")}
                                                        className={`
                                                            flex items-center gap-3 cursor-pointer
                                                            px-6 py-4 rounded-lg border-2 transition-all
                                                            ${handlingValue === "Keep it"
                                                                ? "border-[#0B75C9] bg-blue-50"
                                                                : "border-gray-200 hover:border-gray-300"
                                                            }
                                                        `}
                                                    >
                                                        {handlingValue === "Keep it" ? (
                                                            <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                                        ) : (
                                                            <Circle className="w-5 h-5 text-gray-400" />
                                                        )}
                                                        <span className="font-medium text-gray-900">Keep it</span>
                                                    </div>
                                                    <div
                                                        onClick={() => handlingOnChange("Close it")}
                                                        className={`
                                                            flex items-center gap-3 cursor-pointer
                                                            px-6 py-4 rounded-lg border-2 transition-all
                                                            ${handlingValue === "Close it"
                                                                ? "border-[#0B75C9] bg-blue-50"
                                                                : "border-gray-200 hover:border-gray-300"
                                                            }
                                                        `}
                                                    >
                                                        {handlingValue === "Close it" ? (
                                                            <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                                        ) : (
                                                            <Circle className="w-5 h-5 text-gray-400" />
                                                        )}
                                                        <span className="font-medium text-gray-900">Close it</span>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Add-ons */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add-ons</h3>
                    <Controller
                        name="dentureAddOns"
                        control={control}
                        render={({ field: { value = [], onChange } }) => (
                            <div className="space-y-3">
                                {DENTURE_ADD_ONS_OPTIONS.map((addOn) => {
                                    const isSelected = value.includes(addOn);
                                    return (
                                        <div
                                            key={addOn}
                                            onClick={() => {
                                                if (isSelected) {
                                                    onChange(value.filter((item) => item !== addOn));
                                                } else {
                                                    onChange([...value, addOn]);
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
                                            <span className="font-medium text-gray-900">{addOn}</span>
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
        </div>
    );
};
