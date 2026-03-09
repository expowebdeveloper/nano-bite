import { useState, useRef, useEffect } from "react";

const MANUFACTURERS = [
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
];

type ManufacturerSelectProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function ManufacturerSelect({
  value = "",
  onChange,
}: ManufacturerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const filtered = MANUFACTURERS.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Input */}
     <div className="mb-1 text-sm text-gray-900">
       
        {/* <span className=""> Manufacture</span> */}
         <input
        type="text"
        placeholder="Manufacturer"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="
          w-full
          h-11
          rounded-lg
          border
          border-green-500
          px-4
          text-sm
          outline-none
          focus:ring-2
          focus:ring-green-400
          :focus:ring-green-400
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
     
    </div>
  );
}
