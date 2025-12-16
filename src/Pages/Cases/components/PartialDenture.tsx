import { UseFormReturn } from "react-hook-form";
import Input from "../../../components/common/Input/Input";
import CheckboxGroup from "../../../components/common/CheckboxGroup/CheckboxGroup";
import {
  PARTIAL_TYPES,
  PARTIAL_FRAMEWORK,
  PARTIAL_REQUIRED_SCANS,
  PARTIAL_AESTHETICS,
  CaseFormValues,
} from "../../../Constants/Constants";

interface PartialDentureProps {
  formConfig: UseFormReturn<CaseFormValues>;
}

const PartialDenture = ({
  formConfig,
}: PartialDentureProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Partial Denture</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxGroup
          label="Type"
          fieldName="partialType"
          formConfig={formConfig}
          options={PARTIAL_TYPES as unknown as string[]}
        />
        <CheckboxGroup
          label="Framework"
          fieldName="partialFramework"
          formConfig={formConfig}
          options={PARTIAL_FRAMEWORK as unknown as string[]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Design</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Major Connector"
            fieldName="partialMajorConnector"
            formConfig={formConfig}
            placeholder="Major Connector"
          />
          <Input
            label="Clasps (Tooth/Type)"
            fieldName="partialClasps"
            formConfig={formConfig}
            placeholder="Clasps (Tooth/Type)"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Rests"
            fieldName="partialRests"
            formConfig={formConfig}
            placeholder="Rests"
          />
          <Input
            label="Base Areas"
            fieldName="partialBaseAreas"
            formConfig={formConfig}
            placeholder="Base Areas"
          />
        </div>
      </div>

      <Input
        label="Shade"
        fieldName="partialShade"
        formConfig={formConfig}
        placeholder="Shade"
      />

      <CheckboxGroup
        label="Required Scans"
        fieldName="partialRequiredScans"
        formConfig={formConfig}
        options={PARTIAL_REQUIRED_SCANS as unknown as string[]}
      />

      <CheckboxGroup
        label="Aesthetics"
        fieldName="partialAesthetics"
        formConfig={formConfig}
        options={PARTIAL_AESTHETICS as unknown as string[]}
      />
    </div>
  );
};

export default PartialDenture;

