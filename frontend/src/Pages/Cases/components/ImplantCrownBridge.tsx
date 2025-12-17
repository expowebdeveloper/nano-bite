import { UseFormReturn } from "react-hook-form";
import Input from "../../../components/common/Input/Input";
import SelectField from "../../../components/common/SelectField";
import CheckboxGroup from "../../../components/common/CheckboxGroup/CheckboxGroup";
import {
  IMPLANT_RESTORATION_OPTIONS,
  EMERGENCE_OPTIONS,
  IMPLANT_REQUIRED_SCANS,
  IMPLANT_ABUTMENT_OPTIONS,
  IMPLANT_OCCLUSION_OPTIONS,
  IMPLANT_ALLOWED_OPTIONS,
  CaseFormValues,
} from "../../../Constants/Constants";

interface ImplantCrownBridgeProps {
  formConfig: UseFormReturn<CaseFormValues>;
}

const ImplantCrownBridge = ({
  formConfig,
}: ImplantCrownBridgeProps) => {
  const platformOptions = ["10mm", "11mm", "12mm"];
  const toothOptions = ["Anterior", "Posterior"];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Implant Crown / Implant Bridge</h2>

      {/* Select dropdowns at the top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Platform"
          fieldName="implantPlatform"
          formConfig={formConfig}
          selectedOption={platformOptions}
          isDefault="Select"
        />
        <SelectField
          label="Tooth"
          fieldName="implantTooth"
          formConfig={formConfig}
          selectedOption={toothOptions}
          isDefault="Select"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Brand"
          fieldName="implantBrand"
          formConfig={formConfig}
          placeholder="Brand"
        />
        <Input
          label="Connection"
          fieldName="implantConnection"
          formConfig={formConfig}
          placeholder="Connection"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxGroup
          label="Restoration"
          fieldName="implantRestoration"
          formConfig={formConfig}
          options={IMPLANT_RESTORATION_OPTIONS as unknown as string[]}
        />
        <CheckboxGroup
          label="Abutment"
          fieldName="implantAbutment"
          formConfig={formConfig}
          options={IMPLANT_ABUTMENT_OPTIONS as unknown as string[]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CheckboxGroup
          label="Emergence"
          fieldName="implantEmergence"
          formConfig={formConfig}
          options={EMERGENCE_OPTIONS as unknown as string[]}
        />
        <CheckboxGroup
          label="Occlusion"
          fieldName="implantOcclusion"
          formConfig={formConfig}
          options={IMPLANT_OCCLUSION_OPTIONS as unknown as string[]}
        />
        <CheckboxGroup
          label="Allowed"
          fieldName="implantAllowed"
          formConfig={formConfig}
          options={IMPLANT_ALLOWED_OPTIONS as unknown as string[]}
        />
      </div>

      <CheckboxGroup
        label="Required Scans"
        fieldName="implantRequiredScans"
        formConfig={formConfig}
        options={IMPLANT_REQUIRED_SCANS as unknown as string[]}
      />
    </div>
  );
};

export default ImplantCrownBridge;

