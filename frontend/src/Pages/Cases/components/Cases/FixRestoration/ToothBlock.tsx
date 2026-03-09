import { ToothIconSvg } from "./ToothIconSvg";

/* =======================
   Types
======================= */
type Jaw = "upper" | "lower";
type ToothType = "incisor" | "canine" | "premolar" | "molar";

interface Tooth {
  number: number;
  x: number;
  y: number;
  rotation: number;
  jaw: Jaw;
  type: ToothType;
}

/* =======================
   MANUAL POSITIONS (REVISED)
   Coordinates moved to the OUTER edge of the paths
======================= */
const teethData: Tooth[] = [
  // Upper Arch (Outer Curve)
  { number: 1,  x: 20,  y: 175, rotation: 180, jaw: "upper", type: "molar" },
  { number: 2,  x: 23,  y: 143, rotation: 180, jaw: "upper", type: "molar" },
  { number: 3,  x: 33,  y: 112, rotation: 180, jaw: "upper", type: "molar" },
  { number: 4,  x: 40,  y: 83, rotation: 180, jaw: "upper", type: "premolar" },
  { number: 5,  x: 55,  y: 60,  rotation: 180, jaw: "upper", type: "premolar" },
  { number: 6,  x: 71,  y: 37,  rotation: 180, jaw: "upper", type: "canine" },
  { number: 7,  x: 95, y: 25,  rotation: 180, jaw: "upper", type: "incisor" },
  { number: 8,  x: 120, y: 20,  rotation: 140, jaw: "upper", type: "incisor" },
  { number: 9,  x: 144, y: 18,  rotation: 180, jaw: "upper", type: "incisor" },
  { number: 10, x: 170, y: 27,  rotation: 180, jaw: "upper", type: "incisor" },
  { number: 11, x: 193, y: 37,  rotation: 180, jaw: "upper", type: "canine" },
  { number: 12, x: 210, y: 57,  rotation: 180, jaw: "upper", type: "premolar" },
  { number: 13, x: 220, y: 83, rotation: 180, jaw: "upper", type: "premolar" },
  { number: 14, x: 230, y: 110, rotation: 180, jaw: "upper", type: "molar" },
  { number: 15, x: 240, y: 145, rotation: 180, jaw: "upper", type: "molar" },
  { number: 16, x: 245, y: 175, rotation: 180, jaw: "upper", type: "molar" },

  // Lower Arch (Outer Curve)
  { number: 32, x: 20,  y: 255, rotation: 180, jaw: "lower", type: "molar" },
  { number: 31, x: 32,  y: 290, rotation: 180, jaw: "lower", type: "molar" },
  { number: 30, x: 43,  y: 325, rotation: 180, jaw: "lower", type: "molar" },
  { number: 29, x: 55,  y: 350, rotation: 180, jaw: "lower", type: "premolar" },
  { number: 28, x: 69,  y: 370, rotation: 180, jaw: "lower", type: "premolar" },
  { number: 27, x: 86,  y: 384, rotation: 180, jaw: "lower", type: "canine" },
  { number: 26, x: 106, y: 390, rotation: 180, jaw: "lower", type: "incisor" },
  { number: 25, x: 125, y: 396, rotation: 180, jaw: "lower", type: "incisor" },
  { number: 24, x: 143, y: 395, rotation: 180, jaw: "lower", type: "incisor" },
  { number: 23, x: 160, y: 390, rotation: 180, jaw: "lower", type: "incisor" },
  { number: 22, x: 178, y: 384, rotation: 180, jaw: "lower", type: "canine" },
  { number: 21, x: 195, y: 370, rotation: 180, jaw: "lower", type: "premolar" },
  { number: 20, x: 219, y: 350, rotation: 180, jaw: "lower", type: "premolar" },
  { number: 19, x: 228, y: 325, rotation: 180, jaw: "lower", type: "molar" },
  { number: 18, x: 240, y: 289, rotation: 180, jaw: "lower", type: "molar" },
  { number: 17, x: 243, y: 255, rotation: 180, jaw: "lower", type: "molar" },
];

const TeethSelectionPage = ({ selectedTeeth, setSelectedTeeth }: { selectedTeeth: number[], setSelectedTeeth: (teeth: number[]) => void }) => {
  const toggleTooth = (number: number) => {
    setSelectedTeeth(
      selectedTeeth.includes(number)
        ? selectedTeeth.filter((n) => n !== number)
        : [...selectedTeeth, number]
    );
  };

  return (
    <div className="flex items-start justify-start p-4">
      <div>
        <div className="relative mx-auto border border-slate-50 rounded-3xl p-4 bg-slate-50/10" style={{ width: '280px', height: '420px' }}>
          
          {/* Layer 1: Background SVG */}
          <div className="absolute inset-0 z-0 opacity-40">
            <ToothIconSvg />
          </div>

          {/* Layer 2: Interactive Overlay */}
          <svg
            viewBox="0 0 280 420"
            className="absolute inset-0 z-10 w-full h-full pointer-events-none toothBlockSvg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {teethData.map((tooth) => {
              const isSelected = selectedTeeth.includes(tooth.number);
              
              /* Dynamic Offset Logic:
                 To match the image, numbers move AWAY from the center.
                 Left side teeth move further left, Right side move further right.
              */
              // const xOffset = tooth.x < 140 ? -18 : 18; 
              // const yOffset = tooth.jaw === "upper" ? -5 : 5;

              return (
                <g 
                  key={tooth.number} 
                  className="cursor-pointer pointer-events-auto group"
                  onClick={() => toggleTooth(tooth.number)}
                >
                  {/* Invisible Hit Area */}
                  <circle cx={tooth.x} cy={tooth.y} r="15" className="fill-transparent" />
                  
                  {/* The Selection Circle (The "Button" on the tooth) */}
                  <circle
                    cx={tooth.x}
                    cy={tooth.y}
                    r="8"
                    className={`transition-all duration-200 w-[10px] h-[10px] ${
                      isSelected 
                        ? "fill-blue-600 stroke-blue-700 shadow-sm w-[10px] h-[10px]" 
                        : "fill-white  group-hover:stroke-blue-400"
                    }`}
                    strokeWidth="1.5"
                  />

                  {/* The Tooth Number (Positioned outside the arch) */}
                  {/* <text
                    x={tooth.x + xOffset}
                    y={tooth.y + yOffset}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`text-[11px] font-bold select-none transition-colors duration-200 ${
                      isSelected ? "fill-blue-600" : "fill-slate-400 group-hover:fill-slate-600"
                    }`}
                  >
                    {tooth.number}
                  </text> */}
                </g>
              );
            })}
          </svg>
        </div>

       
      </div>
    </div>
  );
};

export default TeethSelectionPage;