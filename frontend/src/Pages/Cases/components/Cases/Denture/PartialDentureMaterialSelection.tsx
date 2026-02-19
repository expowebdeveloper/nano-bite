import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";

interface PartialDentureMaterialSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const METAL_PARTIAL_OPTIONS = [
    {
        value: "Titanium Metal",
        title: "Titanium Metal",
        description: "Biocompatible (suitable for nickel allergies) and lightweight.",
        category: "Metal Partial Dentures",
        categoryDescription: "Provide the most strength and are ideal for long-term use.",
    },
    {
        value: "Chrome Cobalt Metal",
        title: "Chrome Cobalt Metal",
        description: "Most cost-effective.",
        category: "Metal Partial Dentures",
        categoryDescription: "Provide the most strength and are ideal for long-term use.",
    },
];

const FLEXIBLE_PARTIAL_OPTIONS = [
    {
        value: "TCS / Valplast",
        title: "TCS / Valplast",
        description: "Available in translucent pink hues.",
        category: "Flexible Partial Dentures",
        categoryDescription: "Provide the most comfort and are ideal for short-term aesthetic use. Easy to seat when placed in hot water.",
    },
    {
        value: "Duraflex",
        title: "Duraflex",
        description: "Available in opaque orange hues.",
        category: "Flexible Partial Dentures",
        categoryDescription: "Provide the most comfort and are ideal for short-term aesthetic use. Easy to seat when placed in hot water.",
    },
];

const OTHER_OPTIONS = [
    {
        value: "Acrylic",
        title: "Acrylic",
        description: "Cost-effective. Best for temporary use and/or immediate extractions.",
        category: "Other",
    },
    {
        value: "Acetal",
        title: "Acetal",
        description: "Requires the entire framework to be tooth colored (i.e. white/off-white).",
        category: "Other",
    },
];

export const PartialDentureMaterialSelection = ({
    formConfig,
}: PartialDentureMaterialSelectionProps) => {
    const { control } = formConfig;

    const renderCategory = (
        title: string,
        description: string | undefined,
        options: typeof METAL_PARTIAL_OPTIONS,
        selectedValue: string | undefined
    ) => {
        return (
            <div className="space-y-4">
                {title && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                        {description && (
                            <p className="text-sm text-gray-600">{description}</p>
                        )}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option) => {
                        const isSelected = selectedValue === option.value;
                        return (
                            <div
                                key={option.value}
                                onClick={() => formConfig.setValue("partialMaterial", option.value)}
                                className={`
                                    cursor-pointer border-2 rounded-lg p-4 transition-all
                                    ${isSelected
                                        ? "border-[#0B75C9] bg-blue-50 ring-2 ring-[#0B75C9]"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                    }
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                        {isSelected ? (
                                            <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                                            <div className="text-gray-400 text-xs">Partial Image</div>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{option.title}</h4>
                                        <p className="text-sm text-gray-600">{option.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Partial"
                titleName="Which material is the partial?"
            />

            <Controller
                name="partialMaterial"
                control={control}
                render={({ field: { value } }) => (
                    <div className="mt-8 space-y-8 max-w-5xl">
                        {renderCategory(
                            METAL_PARTIAL_OPTIONS[0].category,
                            METAL_PARTIAL_OPTIONS[0].categoryDescription,
                            METAL_PARTIAL_OPTIONS,
                            value
                        )}
                        {renderCategory(
                            FLEXIBLE_PARTIAL_OPTIONS[0].category,
                            FLEXIBLE_PARTIAL_OPTIONS[0].categoryDescription,
                            FLEXIBLE_PARTIAL_OPTIONS,
                            value
                        )}
                        {renderCategory(
                            OTHER_OPTIONS[0].category,
                            undefined,
                            OTHER_OPTIONS,
                            value
                        )}
                    </div>
                )}
            />
        </div>
    );
};
