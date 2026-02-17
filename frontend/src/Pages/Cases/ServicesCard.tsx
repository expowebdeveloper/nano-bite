import React, { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { CommanHeading } from "./CommanHeading";
import { VerticalStepper } from "./components/Cases/FixRestoration/StepsBlock";

/* =======================
   Types
======================= */
interface ServiceItem {
  id: string;
  title: string;
  description: string;
}

interface ServiceOption {
  id: string;
  label: string;
}

/* =======================
   Service-Specific Data
======================= */
const serviceStepData: Record<string, { title: string; options: ServiceOption[] }> = {
  "fixed-restoration": {
    title: "Fixed Restoration - Select Type",
    options: [
      { id: "crown", label: "Crown" },
      { id: "inlay", label: "Inlay" },
      { id: "onlay", label: "Onlay" },
      { id: "veneer", label: "Veneer" },
      { id: "bridge", label: "Bridge" },
    ],
  },
  "implants-solutions": {
    title: "Implants Solutions - Select Type",
    options: [
      { id: "implant-crown", label: "Implant Crown" },
      { id: "implant-bridge", label: "Implant Bridge" },
      { id: "surgical-guide", label: "Surgical Guide" },
    ],
  },
  "splints-guards": {
    title: "Splints, Guards & TMJ - Select Type",
    options: [
      { id: "night-guard", label: "Night Guard" },
      { id: "sports-guard", label: "Sports Guard" },
      { id: "tmd-guard", label: "TMD/TMJ Guard" },
    ],
  },
  dentures: {
    title: "Dentures - Select Type",
    options: [
      { id: "full-denture", label: "Full Denture" },
      { id: "partial-denture", label: "Partial Denture" },
      { id: "overdenture", label: "Overdenture" },
    ],
  },
  "wax-ups": {
    title: "Wax-ups & Matrix - Select Type",
    options: [
      { id: "physical-wax-up", label: "Physical Wax-up" },
      { id: "digital-wax-up", label: "Digital Wax-Up" },
      { id: "study-model", label: "Study Model" },
    ],
  },
};

/* =======================
   Dynamic Data
======================= */
const servicesData: ServiceItem[] = [
  // {
  //   id: "fixed-restoration",
  //   title: "Fixed Restoration",
  //   description: "Crowns, Bridges, Inlays, Onlays and Veneers",
  // },
  // {
  //   id: "implants-solutions",
  //   title: "Implants Solutions",
  //   description: "Implant Crowns, Bridges and Surgical Guides",
  // },
  // {
  //   id: "splints-guards",
  //   title: "Splints, Guards & TMJ",
  //   description: "Night Guards, Sports Guards TMD/TMJ",
  // },
  {
    id: "dentures",
    title: "Dentures",
    description: "Full Dentures, Partial Dentures and Overdentures",
  },
  // {
  //   id: "wax-ups",
  //   title: "Wax-ups & Matrix",
  //   description: "Physical Wax-up, Digital Wax-Up and Study Model",
  // },
];

/* =======================
   Card Component
======================= */
interface ServiceCardProps extends ServiceItem {
  isSelected: boolean;
  onSelect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer
        flex flex-col items-center justify-end
        text-center
        rounded-3xl
        px-6 py-8
        min-h-[170px]
        aspect-square
        transition-all duration-300
        ${
          isSelected
            ? "border-2 border-[#0B75C9] bg-[#f0f8ff] shadow-lg"
            : "border border-gray-300 bg-white hover:shadow-lg hover:border-gray-400"
        }
      `}
    >
      {/* Check Icon */}
      {isSelected && (
        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#0B75C9] flex items-center justify-center">
          <Check className="text-white h-4 w-4" />
        </div>
      )}

      <h3 className="font-interTight font-medium text-[18px] text-gray-900 mb-2">
        {title}
      </h3>

      <p className="font-interTight font-normal text-[14px] leading-[20px] text-gray-600">
        {description}
      </p>
    </div>
  );
};

/* =======================
   Option Card Component
======================= */
interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  label,
  selected,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`
      relative cursor-pointer flex items-center justify-center
      aspect-square rounded-[20px] border-2 transition-all duration-300
      ${selected ? "border-blue-600 bg-blue-50 shadow-lg" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"}
    `}
  >
    {selected && (
      <div className="absolute top-3 right-3 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
        <Check className="h-3 w-3 text-white" />
      </div>
    )}
    <span
      className={`text-sm font-semibold text-center px-2 ${selected ? "text-blue-700" : "text-gray-800"}`}
    >
      {label}
    </span>
  </div>
);

/* =======================
   Page Component
======================= */
interface ServicesPageProps {
  onServiceSelect?: (service: string) => void;
  onOptionSelect?: (optionLabel: string) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onServiceSelect, onOptionSelect }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedOption(null); // Reset option when service changes
    if (onServiceSelect) {
      onServiceSelect(serviceId);
    }
  };

  const handleOptionSelect = (optionId: string, optionLabel: string) => {
    setSelectedOption(optionId);
    setSelectedOptionLabel(optionLabel);
    if (onOptionSelect) {
      onOptionSelect(optionLabel);
    }
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setSelectedOption(null);
    setSelectedOptionLabel(null);
  };

  // Show service options if a service is selected
  
  if (selectedService) {
    const stepData = serviceStepData[selectedService];
    return (
      <div className="bg-white">
        <div className="mx-auto px-4 py-0 flex gap-8">
             {/* <VerticalStepper activeStep={2} selectedTeeth={[]} /> */}
            <div className="flex-1">
              <div className="flex flex-col items-start gap-2 mb-6">
            <button
              onClick={handleBackToServices}
              className="text-[#2b89d2] flex items-center gap-2 text-blue-600 p-2 hover:underline rounded-lg transition-colors "
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 " /> 
              Back to Services
            </button>
            <CommanHeading
              caseName={`New Case - ${servicesData.find(s => s.id === selectedService)?.title || ""}`}
              titleName="What do you want to order?"
            />
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-[35px] crownb">
            {stepData.options.map((option) => (
              <OptionCard
                key={option.id}
                label={option.label}
                selected={selectedOption === option.id}
                onClick={() => handleOptionSelect(option.id, option.label)}
              />
            ))}
          </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto px-4 py-0">
        <CommanHeading
          caseName="New Case"
          titleName="What do you want to order?"
        />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-[35px]">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              isSelected={selectedService === service.id}
              onSelect={() => handleServiceSelect(service.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
