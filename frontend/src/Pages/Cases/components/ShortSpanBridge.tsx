import { UseFormReturn } from "react-hook-form";
import Input from "../../../components/common/Input/Input";
import CheckboxGroup from "../../../components/common/CheckboxGroup/CheckboxGroup";
import {
  PONTIC_DESIGN_STD,
  PONTIC_CONTACT_OPTIONS,
  BRIDGE_MATERIAL_OPTIONS,
  BRIDGE_REQUIRED_SCANS,
  CaseFormValues,
} from "../../../Constants/Constants";

interface ShortSpanBridgeProps {
  formConfig: UseFormReturn<CaseFormValues>;
}

const ShortSpanBridge = ({
  formConfig,
}: ShortSpanBridgeProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Short-span Bridge</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Abutments"
          fieldName="abutmentsLeft"
          formConfig={formConfig}
          placeholder="Abutments"
        />
        <Input
          label="Pontic Teeth"
          fieldName="ponticTeeth"
          formConfig={formConfig}
          placeholder="Pontic Teeth"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <CheckboxGroup
            label="Pontic Design"
            fieldName="ponticDesign"
            formConfig={formConfig}
            options={PONTIC_DESIGN_STD as unknown as string[]}
          />
          <CheckboxGroup
            label="Contacts"
            fieldName="ponticContacts"
            formConfig={formConfig}
            options={PONTIC_CONTACT_OPTIONS as unknown as string[]}
          />
        </div>

        <div className="space-y-4">
          <CheckboxGroup
            label="Material"
            fieldName="bridgeMaterial"
            formConfig={formConfig}
            options={BRIDGE_MATERIAL_OPTIONS as unknown as string[]}
          />
          <CheckboxGroup
            label="Required Scans"
            fieldName="bridgeRequiredScans"
            formConfig={formConfig}
            options={BRIDGE_REQUIRED_SCANS as unknown as string[]}
          />
        </div>
      </div>
    </div>
  );
};

export default ShortSpanBridge;

