import { UseFormReturn } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Edit, Plus, DollarSign } from "lucide-react";
import { useState, useMemo } from "react";
import { calculateDenturePrice, formValuesToPricingInput } from "../../../../../utils/denturePricing";

interface DentureReviewSummaryProps {
    formConfig: UseFormReturn<CaseFormValues>;
    onEditStep: (step: number) => void;
    selectedOption?: string | null;
}

interface SummaryItem {
    label: string;
    value: string | string[] | boolean | undefined;
    step: number;
}

export const DentureReviewSummary = ({
    formConfig,
    onEditStep,
    selectedOption,
}: DentureReviewSummaryProps) => {
    const { watch, setValue } = formConfig;
    const rxInstructions = watch("dentureRxInstructions") || "";
    const [showRxInstructions, setShowRxInstructions] = useState(!!rxInstructions);

    // Get all form values
    const formValues = watch();

    // Format values for display
    const formatValue = (value: string | string[] | boolean | undefined): string => {
        if (value === undefined || value === null) return "Not selected";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (Array.isArray(value)) {
            if (value.length === 0) return "None";
            return value.join(", ");
        }
        return value || "Not selected";
    };

    // Determine if the current flow includes steps 7-13 (only Reline flow does)
    const dentureType = formValues.digitalType?.[0];
    const hasDesignSteps = dentureType === "Reline" && selectedOption === "Full Denture";

    // Build summary items
    const getSummaryItems = (): SummaryItem[] => {
        const items: SummaryItem[] = [];

        // Type
        if (selectedOption) {
            items.push({
                label: "Type",
                value: selectedOption,
                step: 3,
            });
        }

        // Arch
        if (formValues.dentureArch) {
            items.push({
                label: "Arch",
                value: formValues.dentureArch,
                step: 6,
            });
        }

        // Steps 7-13 only exist in the Reline flow — skip for Conventional/Immediate
        if (hasDesignSteps) {
            // Shade
            const shadeParts: string[] = [];
            if (formValues.dentureBaseShade) {
                shadeParts.push(`Base: ${formValues.dentureBaseShade}`);
            }
            if (formValues.dentureTissueShade) {
                shadeParts.push(`Tissue: ${formValues.dentureTissueShade}`);
            }
            if (shadeParts.length > 0) {
                items.push({
                    label: "Shade",
                    value: shadeParts.join(", "),
                    step: 7,
                });
            }

            // Denture Type
            if (formValues.dentureKind) {
                items.push({
                    label: "Denture Type",
                    value: formValues.dentureKind,
                    step: 8,
                });
            }

            // Smile Style
            if (formValues.dentureSmileStyle) {
                items.push({
                    label: "Smile Style",
                    value: formValues.dentureSmileStyle,
                    step: 9,
                });
            }

            // Festooning Level
            if (formValues.dentureFestooningLevel) {
                items.push({
                    label: "Festooning Level",
                    value: formValues.dentureFestooningLevel,
                    step: 10,
                });
            }

            // Other settings/add-ons
            const settingsParts: string[] = [];
            if (formValues.dentureHasDiastema !== undefined) {
                if (formValues.dentureHasDiastema) {
                    settingsParts.push(`Diastema: Yes`);
                    if (formValues.dentureDiastemaHandling) {
                        settingsParts.push(`Diastema Handling: ${formValues.dentureDiastemaHandling}`);
                    }
                } else {
                    settingsParts.push(`Diastema: No`);
                }
            }
            if (formValues.dentureAddOns && formValues.dentureAddOns.length > 0) {
                formValues.dentureAddOns.forEach((addOn) => {
                    settingsParts.push(`${addOn}: Yes`);
                });
            }
            // Show "No" for unchecked add-ons
            const allAddOns = ["Stippling", "Cu-sil gasket", "Metal framework", "Metal mesh", "Softliner"];
            allAddOns.forEach((addOn) => {
                if (!formValues.dentureAddOns?.includes(addOn)) {
                    settingsParts.push(`${addOn}: No`);
                }
            });
            if (settingsParts.length > 0) {
                items.push({
                    label: "Other settings/add-ons",
                    value: settingsParts.join(", "),
                    step: 11,
                });
            }

            // Functional Preferences
            const functionalParts: string[] = [];
            if (formValues.dentureBiteAdjustment) {
                functionalParts.push(`Bite Adjustment: ${formValues.dentureBiteAdjustment}`);
            }
            if (formValues.dentureMidlineCorrection) {
                functionalParts.push(`Midline Correction: ${formValues.dentureMidlineCorrection}`);
            }
            if (formValues.dentureOtherDetails && formValues.dentureOtherDetails.length > 0) {
                formValues.dentureOtherDetails.forEach((detail) => {
                    functionalParts.push(`${detail}: Yes`);
                });
            }
            // Show "No" for unchecked other details
            const allOtherDetails = ["Correct occlusal scheme to Class I", "Post-dam"];
            allOtherDetails.forEach((detail) => {
                if (!formValues.dentureOtherDetails?.includes(detail)) {
                    functionalParts.push(`${detail}: No`);
                }
            });
            if (functionalParts.length > 0) {
                items.push({
                    label: "Functional Preferences",
                    value: functionalParts.join(", "),
                    step: 12,
                });
            }

            // Design Preview
            if (formValues.dentureWantsDesignPreview !== undefined) {
                const previewParts: string[] = [];
                previewParts.push(`Design Preview: ${formValues.dentureWantsDesignPreview ? "Yes" : "No"}`);
                if (formValues.dentureReviewOptions && formValues.dentureReviewOptions.length > 0) {
                    previewParts.push(`Review Options: ${formValues.dentureReviewOptions.join(", ")}`);
                }
                if (formValues.dentureDesignPreviewAddOns && formValues.dentureDesignPreviewAddOns.length > 0) {
                    previewParts.push(`Add-ons: ${formValues.dentureDesignPreviewAddOns.join(", ")}`);
                }
                items.push({
                    label: "Design Preview",
                    value: previewParts.join(", "),
                    step: 13,
                });
            }
        }

        // Photos
        const photoCount = formValues.attachments?.length || 0;
        items.push({
            label: "Photos",
            value: photoCount > 0 ? `${photoCount} photo(s)` : "None",
            step: 14,
        });

        return items;
    };

    const summaryItems = getSummaryItems();

    const pricing = useMemo(() => {
        const input = formValuesToPricingInput(formValues, selectedOption ?? undefined);
        return calculateDenturePrice(input);
    }, [formValues, selectedOption]);

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Wrapping up Denture"
                titleName="Review your order"
            />

            <div className="mt-6 mb-4">
                <p className="text-gray-600 text-sm">
                    This is all the information that the lab tech will see. Please review and make any necessary edits.
                </p>
            </div>

            {/* Practice Price Guide – estimated lab fee */}
            <div className="rounded-2xl border border-[#d6e8f5] bg-[#f0f7ff] p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-[#0B75C9]" />
                    <h3 className="text-lg font-semibold text-gray-900">Estimated lab fee</h3>
                </div>
                {pricing.breakdown.length > 0 ? (
                    <div className="space-y-2 text-sm">
                        {pricing.breakdown.map((line, i) => (
                            <div key={i} className="flex justify-between text-gray-700">
                                <span>{line.label}</span>
                                <span className="font-medium">${line.amount.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t-2 border-[#2B89D2] mt-2">
                            <span>Total</span>
                            <span>${pricing.total.toFixed(2)}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">
                        Select denture type and options above to see the estimated fee. Rush fees apply based on due date (Same Day 0–24h: $50, Next Day 24–48h: $25, Standard 48+h: $0).
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Left Column */}
                <div className="space-y-4">
                    {summaryItems
                        .filter((_, index) => index % 2 === 0)
                        .map((item, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-700 mb-1">
                                            {item.label}:
                                        </p>
                                        <p className="text-sm text-gray-900 break-words">
                                            {formatValue(item.value)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onEditStep(item.step)}
                                        className="flex-shrink-0 text-[#0B75C9] hover:text-[#0084c7] transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {summaryItems
                        .filter((_, index) => index % 2 === 1)
                        .map((item, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-700 mb-1">
                                            {item.label}:
                                        </p>
                                        <p className="text-sm text-gray-900 break-words">
                                            {formatValue(item.value)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onEditStep(item.step)}
                                        className="flex-shrink-0 text-[#0B75C9] hover:text-[#0084c7] transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Rx-specific instructions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                {!showRxInstructions ? (
                    <button
                        type="button"
                        onClick={() => setShowRxInstructions(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white rounded-lg hover:shadow-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">Add Rx-specific instructions</span>
                    </button>
                ) : (
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                            Rx-specific instructions
                        </label>
                        <textarea
                            value={rxInstructions}
                            onChange={(e) => setValue("dentureRxInstructions", e.target.value)}
                            placeholder="Enter any specific instructions for the lab tech..."
                            className="w-full min-h-[120px] px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0B75C9] focus:ring-2 focus:ring-[#0B75C9]/20 outline-none resize-y"
                        />
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setValue("dentureRxInstructions", "");
                                    setShowRxInstructions(false);
                                }}
                                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowRxInstructions(false);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white rounded-lg hover:shadow-lg transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
