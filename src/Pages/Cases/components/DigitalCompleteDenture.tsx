import { UseFormReturn } from "react-hook-form";
import Input from "../../../components/common/Input/Input";
import CheckboxGroup from "../../../components/common/CheckboxGroup/CheckboxGroup";
import Textarea from "../../../components/common/Textarea/Textarea";
import {
  DIGITAL_DENTURE_TYPE,
  DIGITAL_DENTURE_ARCH,
  DIGITAL_DENTURE_VDO,
  DIGITAL_DENTURE_TOOTH_SETUP,
  DIGITAL_DENTURE_BASE,
  DIGITAL_DENTURE_COPY,
  DIGITAL_DENTURE_REQUIRED_SCANS,
  CaseFormValues,
} from "../../../Constants/Constants";

interface DigitalCompleteDentureProps {
  formConfig: UseFormReturn<CaseFormValues>;
}

const DigitalCompleteDenture = ({
  formConfig,
}: DigitalCompleteDentureProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Digital Complete Denture</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CheckboxGroup
          label="Type"
          fieldName="digitalType"
          formConfig={formConfig}
          options={DIGITAL_DENTURE_TYPE as unknown as string[]}
        />
        <CheckboxGroup
          label="Arch"
          fieldName="digitalArch"
          formConfig={formConfig}
          options={DIGITAL_DENTURE_ARCH as unknown as string[]}
        />
        <CheckboxGroup
          label="VDO"
          fieldName="digitalVdo"
          formConfig={formConfig}
          options={DIGITAL_DENTURE_VDO as unknown as string[]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="New Record"
            fieldName="digitalNewRecord"
            formConfig={formConfig}
            placeholder="10mm"
          />
        </div>
        <CheckboxGroup
          label="Tooth Setup"
          fieldName="digitalToothSetup"
          formConfig={formConfig}
          options={DIGITAL_DENTURE_TOOTH_SETUP as unknown as string[]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Shade"
          fieldName="digitalShade"
          formConfig={formConfig}
          placeholder="Shade"
        />
        <CheckboxGroup
          label="Base"
          fieldName="digitalBase"
          formConfig={formConfig}
          options={DIGITAL_DENTURE_BASE as unknown as string[]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxGroup
          label="Copy Denture"
          fieldName="digitalCopy"
          formConfig={formConfig}
          options={DIGITAL_DENTURE_COPY as unknown as string[]}
        />
        <div>
          <Textarea
            label="Changes"
            fieldName="digitalChanges"
            formConfig={formConfig}
            placeholder="Changes"
            rows={3}
          />
        </div>
      </div>

      <CheckboxGroup
        label="Required Scans"
        fieldName="digitalRequiredScans"
        formConfig={formConfig}
        options={DIGITAL_DENTURE_REQUIRED_SCANS as unknown as string[]}
      />
    </div>
  );
};

export default DigitalCompleteDenture;

