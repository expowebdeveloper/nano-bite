import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues, VITA_CLASSICAL_SHADES } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { useState, useRef, useEffect } from "react";

interface PartialDentureShadeSelectionProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const TISSUE_SHADE_OPTIONS = [
    { id: "Light Pink", label: "Light Pink" },
    { id: "Original", label: "Original" },
    { id: "Dark Pink", label: "Dark Pink" },
];

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filtered = options.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={containerRef} className="relative w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base shade <span className="text-red-500">Required</span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Type to search"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className="w-full h-[60px] rounded-2xl bg-[#f2f6f8] border-2 border-[#00a758] px-4 pr-10 text-base outline-none focus:ring-2 focus:ring-[#00a758]"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
            {open && filtered.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filtered.map((item) => (
                        <div
                            key={item}
                            onClick={() => {
                                onChange?.(item);
                                setSearch(item);
                                setOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            <span className="text-gray-900">{item}</span>
                            <span className="text-gray-500 ml-2">(Vita Classical)</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const PartialDentureShadeSelection = ({
    formConfig,
}: PartialDentureShadeSelectionProps) => {
    const { control, watch } = formConfig;
    const patientName = watch("patientName") || "the patient";

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Partial"
                titleName={`Select the shade for Partial`}
            />

            <div className="space-y-8 mt-8 max-w-3xl">
                <div>
                    <Controller
                        name="partialBaseShade"
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
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Select the tissue shade
                    </h3>
                    <Controller
                        name="partialTissueShade"
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
                                                cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center justify-center transition-all duration-200 hover:border-blue-400
                                                ${isSelected
                                                    ? "border-[#0B75C9] ring-1 ring-[#0B75C9] bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                                }
                                            `}
                                        >
                                            <div
                                                className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                                                style={{
                                                    backgroundColor:
                                                        option.id === "Light Pink"
                                                            ? "#FFB6C1"
                                                            : option.id === "Original"
                                                                ? "#FFC0CB"
                                                                : "#DC143C",
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
