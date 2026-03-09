import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import singleUpper from "../../../../../assets/images/single-upper.webp";
import singleLower from "../../../../../assets/images/single-lower.webp";
import dual from "../../../../../assets/images/dual.webp";

interface OverdentureRelineArchSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const ARCH_OPTIONS = [
    {
        id: "Dual arch",
        label: "Dual arch",
        image: dual,
    },
    {
        id: "Single arch: upper",
        label: "Single arch: upper",
        image: singleUpper,
    },
    {
        id: "Single arch: lower",
        label: "Single arch: lower",
        image: singleLower
    },
];

export const OverdentureRelineArchSelection = ({
    formConfig,
}: OverdentureRelineArchSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding an Overdenture Reline"
                titleName={`Which arch(es) does ${patientName} need a Overdenture Reline for?`}
            />

            <Controller
                name="overdentureRelineArch"
                control={control}
                rules={{ required: "Please select an arch option" }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {ARCH_OPTIONS.map((option) => {
                                const isSelected = value === option.id;
                                return (
                                    <div
                                        key={option.id}
                                        onClick={() => onChange(option.id)}
                                        className={`
                                            relative cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-end h-64 transition-all duration-200 hover:border-[#0B75C9] bg-gray-50
                                            ${isSelected
                                                ? "border-[#0B75C9] ring-1 ring-[#0B75C9] bg-blue-50/10"
                                                : "border-gray-100"
                                            }
                                        `}
                                    >
                                        <div className="absolute top-4 left-4">
                                            <div
                                                className={`
                                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                    ${isSelected
                                                        ? "border-[#0B75C9] bg-[#0B75C9]"
                                                        : "border-gray-300"
                                                    }
                                                `}
                                            >
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </div>

                                        {/* Image Container */}
                                        <div className="flex-1 flex items-center justify-center w-full mb-4">
                                            <img
                                                src={option.image}
                                                alt={option.label}
                                                className="h-32 w-auto object-contain"
                                            />
                                        </div>

                                        <p className="font-medium text-gray-900 mt-4 w-full text-left ml-2">
                                            {option.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        {error && (
                            <span className="text-xs text-red-500 mt-2 block">
                                {error.message}
                            </span>
                        )}
                    </>
                )}
            />
        </div>
    );
};
