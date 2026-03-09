import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface OverdentureImplantDetailsProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

const MANUFACTURERS = [
    "AB Dental®",
    "Ace Southern",
    "Adin®",
    "Alfa-Gate",
    "Alpha Bio Tec",
    "American Dental Implant",
    "Argon®",
    "Avia Biomed",
    "B&W Implant System",
    "BioHorizons",
    "Biomet 3i",
    "Camlog",
    "Dentsply Sirona",
    "DIO Implant",
    "Dyna Dental",
    "GC Implant",
    "GMI",
    "Get Implant",
    "Glidewell®",
    "Hi-Tec",
    "Hiossen® (Osstem)",
    "iDo Biotech",
    "IBS Implant (Innoisurg)",
    "IQ Implants",
    "Implant Club",
    "Implant Direct™",
    "Implant Innovations",
    "Keystone Dental",
    "MegaGen",
    "Neodent",
    "Nobel Biocare",
    "Osstem",
    "Straumann",
    "Zimmer Biomet",
] as const;

const SYSTEMS = [
    "Multi-Unit",
    "Tapered 3.0",
    "Tapered 3.4",
    "Tapered Internal",
    "Tapered External",
    "Bone Level",
    "Tissue Level",
    "Conical Connection",
] as const;

const PLATFORM_SIZES = [
    "3.0mm",
    "3.4mm",
    "3.75mm",
    "4.0mm",
    "4.1mm",
    "4.3mm",
    "4.5mm",
    "4.8mm",
    "5.0mm",
    "5.5mm",
    "6.0mm",
] as const;

// Searchable Manufacturer Dropdown Component
const SearchableManufacturerDropdown = ({
    value = "",
    onChange,
}: {
    value?: string;
    onChange?: (value: string) => void;
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

    const filtered = MANUFACTURERS.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={containerRef} className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
            </label>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Manufacturer"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className="w-full h-11 rounded-lg border-2 border-[#0B75C9] px-4 text-sm outline-none focus:ring-2 focus:ring-[#0B75C9]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
            </div>
            {open && filtered.length > 0 && (
                <div className="absolute z-10 w-full mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {filtered.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => {
                                onChange?.(item);
                                setSearch(item);
                                setOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// System Dropdown Component
const SystemDropdown = ({
    value = "",
    onChange,
}: {
    value?: string;
    onChange?: (value: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    return (
        <div ref={containerRef} className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                System
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full h-11 rounded-lg border-2 border-gray-200 px-4 text-sm text-left flex items-center justify-between hover:border-[#0B75C9] focus:border-[#0B75C9] focus:ring-2 focus:ring-[#0B75C9]"
                >
                    <span className={value ? "text-gray-900" : "text-gray-400"}>
                        {value || "System"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {open && (
                    <div className="absolute z-10 w-full mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {SYSTEMS.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    onChange?.(item);
                                    setOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Platform Size Dropdown Component
const PlatformSizeDropdown = ({
    value = "",
    onChange,
}: {
    value?: string;
    onChange?: (value: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    return (
        <div ref={containerRef} className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Size
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full h-11 rounded-lg border-2 border-gray-200 px-4 text-sm text-left flex items-center justify-between hover:border-[#0B75C9] focus:border-[#0B75C9] focus:ring-2 focus:ring-[#0B75C9]"
                >
                    <span className={value ? "text-gray-900" : "text-gray-400"}>
                        {value || "Platform Size"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {open && (
                    <div className="absolute z-10 w-full mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {PLATFORM_SIZES.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    onChange?.(item);
                                    setOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const OverdentureImplantDetails = ({
    formConfig,
}: OverdentureImplantDetailsProps) => {
    const { control, watch } = formConfig;
    const selectedImplantLocations = (watch("overdentureImplantLocations") || []) as number[];
    // const useSameForAll = watch("overdentureUseSameImplantSystem") || false;
    const [wantsNotification, setWantsNotification] = useState(false);

    // Format selected teeth for display (e.g., "2, 5 and 13")
    const formatTeethDisplay = (teeth: number[]): string => {
        if (teeth.length === 0) return "";
        if (teeth.length === 1) return `${teeth[0]}`;
        if (teeth.length === 2) return `${teeth[0]} and ${teeth[1]}`;
        const sorted = [...teeth].sort((a, b) => a - b);
        const last = sorted.pop();
        return `${sorted.join(", ")} and ${last}`;
    };

    const teethDisplay = formatTeethDisplay(selectedImplantLocations);

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding an Overdenture Reline"
                titleName={`Tell us more about the implants on ${teethDisplay}`}
            />

            <div className="mt-4 mb-6">
                <p className="text-sm text-gray-600">
                    Note: We are not providing hardware for this case. To help us plan future offerings, please indicate the implants used. You can find information about your implant system on your Oral Surgeon's surgery report or implant packaging.
                </p>
            </div>

            <div className="flex gap-8 items-start">
                {/* Left Column - Form Fields */}
                <div className="flex-1 max-w-2xl space-y-6">
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Tell us about the implant system:
                        </h3>

                        {/* Manufacturer */}
                        <Controller
                            name="overdentureImplantManufacturer"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <SearchableManufacturerDropdown
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />

                        {/* System */}
                        <Controller
                            name="overdentureImplantSystem"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <SystemDropdown
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />

                        {/* Platform Size */}
                        <Controller
                            name="overdentureImplantPlatformSize"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <PlatformSizeDropdown
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    </div>

                    {/* Cuff Height */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            What is the cuff height? <span className="text-red-500">Required</span>
                        </label>
                        <Controller
                            name="overdentureImplantCuffHeight"
                            control={control}
                            rules={{ required: "Cuff height is required" }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="2.5mm"
                                        value={value || ""}
                                        onChange={onChange}
                                        className={`w-full h-11 rounded-lg border-2 px-4 text-sm outline-none ${
                                            error
                                                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                                : "border-gray-200 focus:border-[#0B75C9] focus:ring-2 focus:ring-[#0B75C9]"
                                        }`}
                                    />
                                    {error && (
                                        <span className="text-xs text-red-500 mt-1 block">
                                            {error.message}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* Right Column - Toggle and Notification */}
                <div className="flex-1 max-w-md space-y-6">
                    {/* Use Same for All Toggle */}
                    <div className="border rounded-xl p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-gray-900">
                                Use the same implant system and collar height for all implant restorations. Now editing teeth {teethDisplay}.
                            </label>
                            <Controller
                                name="overdentureUseSameImplantSystem"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <button
                                        type="button"
                                        onClick={() => onChange(!value)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            value ? "bg-[#0B75C9]" : "bg-gray-300"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                value ? "translate-x-6" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                )}
                            />
                        </div>
                    </div>

                    {/* Notification Box */}
                    <div className="border-2 border-[#0B75C9] rounded-xl p-6 bg-blue-50">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">
                            Interested in an overdenture system?
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            We're planning a future option to include the hardware with your overdenture order. Would you like to be notified when this bundle is available?
                        </p>
                        <button
                            type="button"
                            onClick={() => setWantsNotification(!wantsNotification)}
                            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                                wantsNotification
                                    ? "bg-[#0B75C9] text-white hover:bg-[#0084c7]"
                                    : "bg-white border-2 border-[#0B75C9] text-[#0B75C9] hover:bg-blue-50"
                            }`}
                        >
                            {wantsNotification ? "Notification Enabled" : "Yes, notify me"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
