import React from "react";
import Button from "../../components/common/Buttons/Button";

interface RoleSectionProps {
  setValue: (role: string) => void;
  currentRole: string;
}

const RoleSection: React.FC<RoleSectionProps> = ({ setValue, currentRole }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Role
      </label>
      <div className="flex gap-3">
        <Button
          btnType="button"
          btnClick={() => setValue("Dentist")}
          btnText="I'm a Dentist"
          customClass={`flex-1 h-[60px] rounded-2xl border border-solid border-[#dde4ec] [font-family:'Inter_Tight',Helvetica] font-normal text-base transition-all duration-300 ease-in-out ${
            currentRole === "Dentist"
              ? "bg-[#0B75C9] text-white hover:bg-[#0b75c9]/90 shadow-md scale-[1.02]"
              : "bg-[#f2f6f8] text-[#9ba7b4] hover:bg-[#f2f6f8]/80 scale-100"
          }`}
        />
        <Button
          btnType="button"
          btnClick={() => setValue("Designer")}
          btnText="I'm a Designer"
          customClass={`flex-1 h-[60px] rounded-2xl border border-solid border-[#dde4ec] [font-family:'Inter_Tight',Helvetica] font-normal text-base transition-all duration-300 ease-in-out ${
            currentRole === "Designer"
              ? "bg-[#0b75c9] text-white hover:bg-[#0b75c9]/90 shadow-md scale-[1.02]"
              : "bg-[#f2f6f8] text-[#9ba7b4] hover:bg-[#f2f6f8]/80 scale-100"
          }`}
        />
      </div>
    </div>
  );
};

export default RoleSection;

