import { UseFormReturn } from "react-hook-form";
import CheckboxGroup from "../../../components/common/CheckboxGroup/CheckboxGroup";
import {
  FULL_ARCH_DESIGN,
  FULL_ARCH_FRAMEWORK,
  FULL_ARCH_VDO,
  FULL_ARCH_OCCLUSION,
  FULL_ARCH_TOOTH_SIZE,
  FULL_ARCH_GINGIVA,
  FULL_ARCH_MIDLINE,
  FULL_ARCH_REQUIRED_SCANS,
  FULL_ARCH_REQUIRED_SCANS_TOP,
  CaseFormValues,
} from "../../../Constants/Constants";

interface FullArchImplantFixedProps {
  formConfig: UseFormReturn<CaseFormValues>;
}

const FullArchImplantFixed = ({
  formConfig,
}: FullArchImplantFixedProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Full Arch Implant Fixed</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxGroup
          label="Required Scans"
          fieldName="fullArchRequiredScansTop"
          formConfig={formConfig}
          options={FULL_ARCH_REQUIRED_SCANS_TOP as unknown as string[]}
        />
        <CheckboxGroup
          label="Design"
          fieldName="fullArchDesign"
          formConfig={formConfig}
          options={FULL_ARCH_DESIGN as unknown as string[]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxGroup
          label="VDO"
          fieldName="fullArchVdo"
          formConfig={formConfig}
          options={FULL_ARCH_VDO as unknown as string[]}
        />
        <CheckboxGroup
          label="Occlusion"
          fieldName="fullArchOcc"
          formConfig={formConfig}
          options={FULL_ARCH_OCCLUSION as unknown as string[]}
        />
      </div>

      <CheckboxGroup
        label="Framework"
        fieldName="fullArchFramework"
        formConfig={formConfig}
        options={FULL_ARCH_FRAMEWORK as unknown as string[]}
      />

      <CheckboxGroup
        label="Required Scans"
        fieldName="fullArchRequiredScans"
        formConfig={formConfig}
        options={FULL_ARCH_REQUIRED_SCANS as unknown as string[]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Esthetics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CheckboxGroup
            label="Tooth Size"
            fieldName="fullArchToothSize"
            formConfig={formConfig}
            options={FULL_ARCH_TOOTH_SIZE as unknown as string[]}
          />
          <CheckboxGroup
            label="Gingiva"
            fieldName="fullArchGingiva"
            formConfig={formConfig}
            options={FULL_ARCH_GINGIVA as unknown as string[]}
          />
        </div>
        <CheckboxGroup
          label="Midline"
          fieldName="fullArchMidline"
          formConfig={formConfig}
          options={FULL_ARCH_MIDLINE as unknown as string[]}
        />
      </div>
    </div>
  );
};

export default FullArchImplantFixed;

