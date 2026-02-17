import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc, Settings } from "lucide-react";

interface DentureKindSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const DENTURE_KIND_OPTIONS = [
    {
        value: "Signature Acrylic Denture",
        title: "Signature Acrylic Denture",
        description: "Digitally-designed acrylic base + 3D-printed teeth. Pairs lifelike gingiva with high-impact durability and comfort.",
        isRecommended: true,
    },
    {
        value: "Signature Printed Denture",
        title: "Signature Printed Denture",
        description: "3D-printed base and teeth. Offers high-impact durability and comfort.",
        isRecommended: false,
    },
    {
        value: "Aesthetic Denture",
        title: "Aesthetic Denture",
        description: "Milled base and teeth. Superior aesthetics with lifelike gingiva and enhanced translucency.",
        isRecommended: false,
    },
];

export const DentureKindSelection = ({
    formConfig,
}: DentureKindSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Wrapping up Denture"
                titleName="What kind of denture would you like?"
            />

            <Controller
                name="dentureKind"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <div className="space-y-4 max-w-3xl mt-8">
                        {DENTURE_KIND_OPTIONS.map((option) => {
                            const isSelected = value === option.value;

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => onChange(option.value)}
                                    className={`
                                        relative cursor-pointer
                                        border-2 rounded-lg p-6
                                        flex items-start gap-4
                                        transition-all duration-200
                                        ${isSelected
                                            ? "border-[#00a758] bg-green-50 ring-2 ring-[#00a758]"
                                            : "border-gray-200 hover:border-gray-300"
                                        }
                                    `}
                                >
                                    {option.isRecommended && (
                                        <div className="absolute top-4 right-4 flex items-center gap-2 text-[#00a758] text-sm font-semibold">
                                            <Settings className="w-4 h-4" />
                                            <span>Recommended</span>
                                        </div>
                                    )}
                                    <div className="mt-1 flex-shrink-0 text-[#00a758]">
                                        {isSelected ? (
                                            <Disc className="w-5 h-5 fill-current" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
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

            {/* Sidebar Info Panel */}
            <div className="mt-8 max-w-md ml-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-2 py-1 rounded">
                        NEW
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                    New Signature Acrylic Denture
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    The world's first digitally designed acrylic denture with lifelike aesthetics and high-impact durability (for the same price as Signature Printed)! Our new Signature Acrylic Denture improves fit, strengthens performance, and elevates standard of care.
                </p>
                <a href="#" className="text-[#00a758] text-sm font-medium hover:underline">
                    Learn more &gt;
                </a>
            </div>
        </div>
    );
};
