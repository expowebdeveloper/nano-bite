import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues, VITA_CLASSICAL_SHADES } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { useState, useRef, useEffect } from "react";

interface DentureShadeSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const TISSUE_SHADE_OPTIONS = [
    {
        id: "Light Pink",
        label: "Light Pink",
    },
    {
        id: "Original",
        label: "Original",
    },
    {
        id: "Dark Pink",
        label: "Dark Pink",
    },
];

// Searchable dropdown component for base shade
const SearchableShadeDropdown = ({
    value = "",
    onChange,
    options,
}: {
    value?: string;
    onChange?: (value: string) => void;
    options: readonly string[];
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearch(value);
    }, [value]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = options.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={containerRef} className="relative w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base shade
            </label>
            <input
                type="text"
                placeholder="Search shade (e.g., A1, A2, A3)"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                className="
                    w-full
                    h-[60px]
                    rounded-2xl
                    bg-[#f2f6f8]
                    border
                    border-[#dde4ec]
                    px-4
                    text-base
                    outline-none
                    focus:ring-2
                    focus:ring-[#0B75C9]
                "
            />

            {/* Dropdown */}
            {open && (
                <div
                    className="
                        absolute
                        z-10
                        mt-1
                        w-full
                        max-h-56
                        overflow-y-auto
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        shadow-lg
                    "
                >
                    {filtered.length > 0 ? (
                        filtered.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    setSearch(item);
                                    setOpen(false);
                                    onChange?.(item);
                                }}
                                className="
                                    w-full
                                    px-4
                                    py-2
                                    text-left
                                    text-sm
                                    text-gray-800
                                    hover:bg-gray-100
                                "
                            >
                                {item}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-400">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const DentureShadeSelection = ({
    formConfig,
}: DentureShadeSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Denture"
                titleName={`Select shade for ${patientName}'s denture`}
            />

            <div className="space-y-8 mt-8">
                {/* Base Shade Section */}
                <div>
                    <Controller
                        name="dentureBaseShade"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <SearchableShadeDropdown
                                value={value}
                                onChange={onChange}
                                options={VITA_CLASSICAL_SHADES}
                            />
                        )}
                    />
                </div>

                {/* Tissue Shade Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Select the tissue shade
                    </h3>
                    <Controller
                        name="dentureTissueShade"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {TISSUE_SHADE_OPTIONS.map((option) => {
                                    const isSelected = value === option.id;
                                    return (
                                        <div
                                            key={option.id}
                                            onClick={() => onChange(option.id)}
                                            className={`
                                                cursor-pointer
                                                rounded-xl
                                                border-2
                                                p-6
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                                transition-all
                                                duration-200
                                                hover:border-blue-400
                                                ${isSelected
                                                    ? "border-[#0B75C9] ring-1 ring-[#0B75C9] bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                                }
                                            `}
                                        >
                                            <div className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                                                style={{
                                                    backgroundColor: option.id === "Light Pink" 
                                                        ? "#FFB6C1" 
                                                        : option.id === "Original"
                                                        ? "#FFC0CB"
                                                        : "#DC143C"
                                                }}
                                            />
                                            <p className="font-medium text-gray-900 text-sm">
                                                {option.label}
                                            </p>
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
