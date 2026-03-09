import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { User, Play, Video, Expand } from "lucide-react";

interface DentureDesignPreviewSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const REVIEW_OPTIONS = [
    {
        id: "self-review",
        label: "Self review in portal",
        icon: <User className="w-5 h-5" />,
    },
    {
        id: "narrated-video",
        label: "1-min narrated walkthrough video",
        icon: <Play className="w-5 h-5" />,
    },
    {
        id: "video-call",
        label: "Video call with lab tech",
        icon: <Video className="w-5 h-5" />,
    },
];

const ADD_ON_OPTIONS = [
    {
        id: "narrated-video-addon",
        label: "Get a Narrated Video by Lab",
        description: "1-min narrated walkthrough video",
    },
    {
        id: "video-call-addon",
        label: "Schedule Video Call with Lab Tech",
        description: "Video call with lab tech",
    },
];

export const DentureDesignPreviewSelection = ({
    formConfig,
}: DentureDesignPreviewSelectionProps) => {
    const { control, watch } = formConfig;
    const wantsDesignPreview = watch("dentureWantsDesignPreview");
    // const selectedReviewOptions = watch("dentureReviewOptions") || [];

    // If wantsDesignPreview is not set, show the initial question
    if (wantsDesignPreview === undefined) {
        return (
            <div className="bg-white p-6 md:p-8 space-y-6">
                <CommanHeading
                    caseName="Wrapping up Denture"
                    titleName="Review & approve design before fabrication?"
                />

                <div className="mt-8 max-w-2xl">
                    <Controller
                        name="dentureWantsDesignPreview"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <div
                                onClick={() => onChange(!value)}
                                className="flex items-start gap-4 cursor-pointer p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all"
                            >
                                <input
                                    type="checkbox"
                                    checked={value === true}
                                    onChange={() => onChange(!value)}
                                    className="w-5 h-5 rounded border-gray-300 text-[#0B75C9] focus:ring-[#0B75C9] cursor-pointer mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900 text-lg">
                                            Yes, add Design Preview
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Design Previews are digital 3D models of your case. You will have 2 days to review the design.
                                    </p>
                                </div>
                            </div>
                        )}
                    />

                    {/* Additional Details Section */}
                    <div className="mt-6 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Additional Details
                        </h3>
                        <Controller
                            name="dentureAdditionalDetails"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <textarea
                                    value={value || ""}
                                    onChange={onChange}
                                    placeholder="Add any special instructions, notes, or preferences for the lab..."
                                    rows={4}
                                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-[#0B75C9] focus:outline-none focus:ring-1 focus:ring-[#0B75C9] resize-y"
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // If wantsDesignPreview is false (No), show simple layout
    if (wantsDesignPreview === false) {
        return (
            <div className="bg-white p-6 md:p-8 space-y-6">
                <CommanHeading
                    caseName="Wrapping up Denture"
                    titleName="Review & approve design before fabrication?"
                />

                <div className="mt-8 max-w-2xl">
                    <div className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-600">
                            Design Preview is not selected. You can proceed to the next step.
                        </p>
                    </div>

                    {/* Additional Details Section */}
                    <div className="mt-6 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Additional Details
                        </h3>
                        <Controller
                            name="dentureAdditionalDetails"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <textarea
                                    value={value || ""}
                                    onChange={onChange}
                                    placeholder="Add any special instructions, notes, or preferences for the lab..."
                                    rows={4}
                                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-[#0B75C9] focus:outline-none focus:ring-1 focus:ring-[#0B75C9] resize-y"
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // If wantsDesignPreview is true (Yes), show full layout with review options
    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Wrapping up Denture"
                titleName="Review & approve design before fabrication?"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Left Column - Design Preview Checkbox and Review Options */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 border-2 border-[#0B75C9] rounded-lg bg-blue-50">
                        <Controller
                            name="dentureWantsDesignPreview"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <div
                                    onClick={() => onChange(!value)}
                                    className="flex items-start gap-4 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={value === true}
                                        onChange={() => onChange(!value)}
                                        className="w-5 h-5 rounded border-gray-300 text-[#0B75C9] focus:ring-[#0B75C9] cursor-pointer mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-900 text-lg">
                                                Yes, add Design Preview
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Design Previews are digital 3D models of your case. You will have 2 days to review the design.
                                        </p>
                                    </div>
                                </div>
                            )}
                        />

                        {/* Review Options */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">
                                3 Review Options:
                            </h4>
                            <Controller
                                name="dentureReviewOptions"
                                control={control}
                                render={({ field: { value = [], onChange } }) => (
                                    <div className="flex flex-wrap gap-3">
                                        {REVIEW_OPTIONS.map((option) => {
                                            const isSelected = value.includes(option.id);
                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            onChange(value.filter((id) => id !== option.id));
                                                        } else {
                                                            onChange([...value, option.id]);
                                                        }
                                                    }}
                                                    className={`
                                                        flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                                                        ${isSelected
                                                            ? "border-[#0B75C9] bg-white text-[#0B75C9]"
                                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                                        }
                                                    `}
                                                >
                                                    {option.icon}
                                                    <span className="text-sm font-medium">{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Add-ons Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Would you also like to add-on the following?
                        </h3>
                        <Controller
                            name="dentureDesignPreviewAddOns"
                            control={control}
                            render={({ field: { value = [], onChange } }) => (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {ADD_ON_OPTIONS.map((addOn) => {
                                        const isSelected = value.includes(addOn.id);
                                        return (
                                            <div
                                                key={addOn.id}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        onChange(value.filter((id) => id !== addOn.id));
                                                    } else {
                                                        onChange([...value, addOn.id]);
                                                    }
                                                }}
                                                className={`
                                                    cursor-pointer border-2 rounded-lg p-4 transition-all
                                                    ${isSelected
                                                        ? "border-[#0B75C9] bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                                    }
                                                `}
                                            >
                                                <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                                                    <div className="text-gray-400 text-sm">Preview Image</div>
                                                </div>
                                                <p className="font-medium text-gray-900 text-sm">{addOn.label}</p>
                                                <p className="text-xs text-gray-500 mt-1">{addOn.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        />
                    </div>
                    {/* Additional Details Section */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Additional Details
                        </h3>
                        <Controller
                            name="dentureAdditionalDetails"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <textarea
                                    value={value || ""}
                                    onChange={onChange}
                                    placeholder="Add any special instructions, notes, or preferences for the lab..."
                                    rows={4}
                                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-[#0B75C9] focus:outline-none focus:ring-1 focus:ring-[#0B75C9] resize-y"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Right Column - Preview Card */}
                <div className="lg:col-span-1">
                    <div className="p-6 border-2 border-gray-200 rounded-lg bg-white sticky top-6">
                        <p className="text-sm text-gray-600 mb-4">
                            Preview your digital designs independently or with a lab tech for better results.
                        </p>
                        <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                            <div className="text-gray-400 text-sm">3D Model Preview</div>
                        </div>
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-[#0B75C9] text-[#0B75C9] rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            <span className="font-medium">Expand</span>
                            <Expand className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
