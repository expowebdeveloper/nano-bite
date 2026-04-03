// import React from "react";

// const PRICING_DATA = [
//   {
//     title: "Full Denture Design",
//     items: [
//       { service: "Full Denture Design", unit: "Per Arch", fee: "$55" },
//       { service: "Immediate Denture Design", unit: "Per Arch", fee: "$60" },
//       { service: "Reference Denture Workflow", unit: "Per Arch", fee: "$50" },
//       { service: "Wax Rim / Bite Rim Design", unit: "Per Arch", fee: "$45" },
//     ],
//   },
//   {
//     title: "Partial Denture Design",
//     items: [
//       { service: "Acrylic Partial Design", unit: "Per Case", fee: "$45" },
//       { service: "Flexible Partial Design", unit: "Per Case", fee: "$50" },
//       { service: "Cast Metal Partial Design", unit: "Per Case", fee: "$75" },
//       { service: "Hybrid Partial Design", unit: "Per Case", fee: "$80" },
//     ],
//   },
//   {
//     title: "Try-In / Setup",
//     items: [
//       { service: "Monolithic Try-In Design", unit: "Per Arch", fee: "$40" },
//       { service: "Setup Modification / Adjustment", unit: "Per Case", fee: "$25" },
//     ],
//   },
//   {
//     title: "Optional Add-Ons",
//     items: [
//       { service: "Teeth Setup Modification", unit: "Per Case", fee: "$25" },
//       { service: "Digital Reline Design", unit: "Per Arch", fee: "$35" },
//       { service: "Implant Overdenture Design", unit: "Per Case", fee: "$90" },
//     ],
//   },
// ];

// const PricingGuide = () => {
//   return (
//     <div className="min-h-screen bg-[#fbfeff] p-6">
//       <div className="max-w-6xl mx-auto space-y-8">
        
//         {/* Header */}
//         <div className="px-2">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Pricing Guide
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Transparent pricing for all design services
//           </p>
//         </div>

//         {/* Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {PRICING_DATA.map((section, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 hover:shadow-xl transition"
//             >
//               <div className="bg-[#1f1f1f] rounded-2xl overflow-hidden">
                
//                 {/* Title */}
//                 <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
//                   <h3 className="text-white text-lg font-semibold">
//                     {section.title}
//                   </h3>

//                   {index === 0 && (
//                     <span className="text-xs bg-[#0B75C9] text-white px-2 py-1 rounded-md">
//                       Popular
//                     </span>
//                   )}
//                 </div>

//                 {/* Table Header */}
//                 <div className="px-6 py-3 text-xs md:text-sm text-gray-400 flex justify-between border-b border-gray-700 uppercase tracking-wide">
//                   <span>Service</span>
//                   <span>Unit</span>
//                   <span>Fee</span>
//                 </div>

//                 {/* Rows */}
//                 {section.items.map((item, i) => (
//                   <div
//                     key={i}
//                     className="px-6 py-3 text-sm flex justify-between items-center text-gray-200 border-b border-gray-800 last:border-none"
//                   >
//                     <span>{item.service}</span>
//                     <span className="text-gray-400">{item.unit}</span>
//                     <span className="text-white font-semibold">
//                       {item.fee}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer Note */}
//         <div className="bg-white rounded-2xl shadow p-4 text-sm text-gray-500 text-center">
//           * Prices are subject to change based on case complexity and requirements.
//         </div>

//       </div>
//     </div>
//   );
// };

// export default PricingGuide;


const PRICING_DATA = [
  {
    title: "Full Denture Design",
    items: [
      { service: "Full Denture Design", unit: "Per Arch", fee: "$55" },
      { service: "Immediate Denture Design", unit: "Per Arch", fee: "$60" },
      { service: "Reference Denture Workflow", unit: "Per Arch", fee: "$50" },
      { service: "Wax Rim / Bite Rim Design", unit: "Per Arch", fee: "$45" },
    ],
  },
  {
    title: "Partial Denture Design",
    items: [
      { service: "Acrylic Partial Design", unit: "Per Case", fee: "$45" },
      { service: "Flexible Partial Design", unit: "Per Case", fee: "$50" },
      { service: "Cast Metal Partial Design", unit: "Per Case", fee: "$75" },
      { service: "Hybrid Partial Design", unit: "Per Case", fee: "$80" },
    ],
  },
  {
    title: "Try-In / Setup",
    items: [
      { service: "Monolithic Try-In Design", unit: "Per Arch", fee: "$40" },
      { service: "Setup Modification / Adjustment", unit: "Per Case", fee: "$25" },
    ],
  },
  {
    title: "Optional Add-Ons",
    items: [
      { service: "Teeth Setup Modification", unit: "Per Case", fee: "$25" },
      { service: "Digital Reline Design", unit: "Per Arch", fee: "$35" },
      { service: "Implant Overdenture Design", unit: "Per Case", fee: "$90" },
    ],
  },
];

const PricingGuide = () => {
  return (
    <div className="min-h-screen bg-[#fbfeff] p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="px-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Pricing Guide
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Transparent pricing for all services
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {PRICING_DATA.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col h-[380px]"
            >
              {/* Title */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>

                {index === 0 && (
                  <span className="text-xs bg-[#0B75C9] text-white px-2 py-1 rounded-md">
                    Popular
                  </span>
                )}
              </div>

              {/* Table */}
              <div className="border border-[#e5edf5] rounded-xl overflow-hidden flex-1 flex flex-col">
                
                {/* Header */}
                <div className="grid grid-cols-3 bg-[#f7f9fb] text-gray-600 text-xs font-semibold px-4 py-3 border-b">
                  <span>Service</span>
                  <span className="text-center">Unit</span>
                  <span className="text-right">Fee</span>
                </div>

                {/* Body (scroll if needed) */}
                <div className="flex-1 overflow-y-auto">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-3 px-4 py-3 text-sm items-center border-b last:border-none
                        ${i % 2 === 0 ? "bg-white" : "bg-[#fbfdff]"}`}
                    >
                      <span className="text-gray-800">
                        {item.service}
                      </span>
                      <span className="text-center text-gray-500">
                        {item.unit}
                      </span>
                      <span className="text-right font-medium text-gray-900">
                        {item.fee}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow p-4 text-sm text-gray-500 text-center">
          * Prices may vary based on case complexity.
        </div>

      </div>
    </div>
  );
};

export default PricingGuide;