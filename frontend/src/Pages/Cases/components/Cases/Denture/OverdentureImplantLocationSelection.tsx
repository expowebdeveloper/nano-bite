import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { ToothIconSvg } from "../FixRestoration/ToothIconSvg";

interface OverdentureImplantLocationSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

type Jaw = "upper" | "lower";

interface Tooth {
    number: number;
    x: number;
    y: number;
    rotation: number;
    jaw: Jaw;
}

// Tooth positions matching ToothBlock.tsx
const teethData: Tooth[] = [
    // Upper Arch
    { number: 1, x: 20, y: 175, rotation: 180, jaw: "upper" },
    { number: 2, x: 23, y: 143, rotation: 180, jaw: "upper" },
    { number: 3, x: 33, y: 112, rotation: 180, jaw: "upper" },
    { number: 4, x: 40, y: 83, rotation: 180, jaw: "upper" },
    { number: 5, x: 55, y: 60, rotation: 180, jaw: "upper" },
    { number: 6, x: 71, y: 37, rotation: 180, jaw: "upper" },
    { number: 7, x: 95, y: 25, rotation: 180, jaw: "upper" },
    { number: 8, x: 120, y: 20, rotation: 140, jaw: "upper" },
    { number: 9, x: 144, y: 18, rotation: 180, jaw: "upper" },
    { number: 10, x: 170, y: 27, rotation: 180, jaw: "upper" },
    { number: 11, x: 193, y: 37, rotation: 180, jaw: "upper" },
    { number: 12, x: 210, y: 57, rotation: 180, jaw: "upper" },
    { number: 13, x: 220, y: 83, rotation: 180, jaw: "upper" },
    { number: 14, x: 230, y: 110, rotation: 180, jaw: "upper" },
    { number: 15, x: 240, y: 145, rotation: 180, jaw: "upper" },
    { number: 16, x: 245, y: 175, rotation: 180, jaw: "upper" },

    // Lower Arch
    { number: 32, x: 20, y: 255, rotation: 180, jaw: "lower" },
    { number: 31, x: 32, y: 290, rotation: 180, jaw: "lower" },
    { number: 30, x: 43, y: 325, rotation: 180, jaw: "lower" },
    { number: 29, x: 55, y: 350, rotation: 180, jaw: "lower" },
    { number: 28, x: 69, y: 370, rotation: 180, jaw: "lower" },
    { number: 27, x: 86, y: 384, rotation: 180, jaw: "lower" },
    { number: 26, x: 106, y: 390, rotation: 180, jaw: "lower" },
    { number: 25, x: 125, y: 396, rotation: 180, jaw: "lower" },
    { number: 24, x: 143, y: 395, rotation: 180, jaw: "lower" },
    { number: 23, x: 160, y: 390, rotation: 180, jaw: "lower" },
    { number: 22, x: 178, y: 384, rotation: 180, jaw: "lower" },
    { number: 21, x: 195, y: 370, rotation: 180, jaw: "lower" },
    { number: 20, x: 219, y: 350, rotation: 180, jaw: "lower" },
    { number: 19, x: 228, y: 325, rotation: 180, jaw: "lower" },
    { number: 18, x: 240, y: 289, rotation: 180, jaw: "lower" },
    { number: 17, x: 243, y: 255, rotation: 180, jaw: "lower" },
];

export const OverdentureImplantLocationSelection = ({
    formConfig,
}: OverdentureImplantLocationSelectionProps) => {
    const { control, watch, setValue } = formConfig;
    const selectedImplantLocations = watch("overdentureImplantLocations") || [];

    const toggleTooth = (number: number) => {
        const current = selectedImplantLocations as number[];
        const updated = current.includes(number)
            ? current.filter((n) => n !== number)
            : [...current, number];
        setValue("overdentureImplantLocations", updated);
    };

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding an Overdenture Reline"
                titleName="Select the areas where the implants are located"
            />

            <div className="mt-4 mb-6">
                <p className="text-gray-600 text-sm">
                    Where are the implants located that will support the overdenture?
                </p>
            </div>

            <div className="flex items-start justify-start">
                <div className="relative mx-auto border border-gray-200 rounded-3xl p-4 bg-gray-50" style={{ width: '280px', height: '420px' }}>
                    {/* Background SVG */}
                    <div className="absolute inset-0 z-0 opacity-40">
                        <ToothIconSvg />
                    </div>

                    {/* Interactive Overlay */}
                    <svg
                        viewBox="0 0 280 420"
                        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {teethData.map((tooth) => {
                            const isSelected = (selectedImplantLocations as number[]).includes(tooth.number);
                            const xOffset = tooth.x < 140 ? -18 : 18;
                            const yOffset = tooth.jaw === "upper" ? -5 : 5;

                            return (
                                <g
                                    key={tooth.number}
                                    className="cursor-pointer pointer-events-auto group"
                                    onClick={() => toggleTooth(tooth.number)}
                                >
                                    {/* Invisible Hit Area */}
                                    <circle cx={tooth.x} cy={tooth.y} r="15" className="fill-transparent" />

                                    {/* Selection Circle */}
                                    <circle
                                        cx={tooth.x}
                                        cy={tooth.y}
                                        r="8"
                                        className={`transition-all duration-200 ${
                                            isSelected
                                                ? "fill-[#0B75C9] stroke-[#0B75C9] shadow-sm"
                                                : "fill-white stroke-gray-300 group-hover:stroke-[#0B75C9]"
                                        }`}
                                        strokeWidth="1.5"
                                    />

                                    {/* Tooth Number */}
                                    <text
                                        x={tooth.x + xOffset}
                                        y={tooth.y + yOffset}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className={`text-[11px] font-bold select-none transition-colors duration-200 ${
                                            isSelected ? "fill-[#0B75C9]" : "fill-gray-600 group-hover:fill-gray-800"
                                        }`}
                                    >
                                        {tooth.number}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Labels */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-8 text-xs text-gray-600">
                        <span>Left</span>
                        <span>Right</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
