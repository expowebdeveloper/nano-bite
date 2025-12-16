import { UseFormReturn } from "react-hook-form";
import Input from "../../../components/common/Input/Input";
import CheckboxGroup from "../../../components/common/CheckboxGroup/CheckboxGroup";
import Textarea from "../../../components/common/Textarea/Textarea";
import {
  RESTORATION_TYPES,
  MATERIAL_OPTIONS,
  RESTORATION_PREP_OPTIONS,
  CONTACT_OPTIONS,
  OCCLUSION_OPTIONS,
  REQUIRED_SCAN_OPTIONS,
  CaseFormValues,
} from "../../../Constants/Constants";

interface SingleCrownOnlayVeneerProps {
  formConfig: UseFormReturn<CaseFormValues>;
}

const SingleCrownOnlayVeneer = ({
  formConfig,
}: SingleCrownOnlayVeneerProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Single Crown / Onlay / Veneer</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Input
          label="Tooth & Type"
          fieldName="toothType"
          formConfig={formConfig}
          placeholder="Tooth & Type"
          rules={{ required: "Tooth & Type is required" }}
        />
        <div className="space-y-3">
          <CheckboxGroup
            label="Restoration"
            fieldName="restorationTypes"
            formConfig={formConfig}
            options={RESTORATION_TYPES as unknown as string[]}
            className="flex items-center gap-3 flex-wrap"
            rules={{
              validate: (value: string[]) => {
                if (!value || value.length === 0) {
                  return "Please select at least one option";
                }
                return true;
              },
            }}
          />
          <CheckboxGroup
            label="Material"
            fieldName="materialOptions"
            formConfig={formConfig}
            options={MATERIAL_OPTIONS as unknown as string[]}
            className="flex items-center gap-3 flex-wrap"
            rules={{
              validate: (value: string[]) => {
                if (!value || value.length === 0) {
                  return "Please select at least one option";
                }
                return true;
              },
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Final Shade"
            fieldName="finalShade"
            formConfig={formConfig}
            placeholder="Final Shade"
          />
          <Input
            label="Stump Shade"
            fieldName="stumpShade"
            formConfig={formConfig}
            placeholder="Stump Shade"
          />
        </div>
      </div>

      <CheckboxGroup
        label="Preparation"
        fieldName="restorationPrep"
        formConfig={formConfig}
        options={RESTORATION_PREP_OPTIONS as unknown as string[]}
        rules={{
          validate: (value: string[]) => {
            if (!value || value.length === 0) {
              return "Please select at least one option";
            }
            return true;
          },
        }}
      />

      <Textarea
        label="Noted"
        fieldName="noted"
        formConfig={formConfig}
        placeholder="Noted"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CheckboxGroup
          label="Contacts"
          fieldName="contacts"
          formConfig={formConfig}
          options={CONTACT_OPTIONS as unknown as string[]}
          rules={{
            validate: (value: string[]) => {
              if (!value || value.length === 0) {
                return "Please select at least one option";
              }
              return true;
            },
          }}
        />
        <CheckboxGroup
          label="Occlusion"
          fieldName="occlusion"
          formConfig={formConfig}
          options={OCCLUSION_OPTIONS as unknown as string[]}
          rules={{
            validate: (value: string[]) => {
              if (!value || value.length === 0) {
                return "Please select at least one option";
              }
              return true;
            },
          }}
        />
        <CheckboxGroup
          label="Required Scans"
          fieldName="requiredScans"
          formConfig={formConfig}
          options={REQUIRED_SCAN_OPTIONS as unknown as string[]}
          rules={{
            validate: (value: string[]) => {
              if (!value || value.length === 0) {
                return "Please select at least one option";
              }
              return true;
            },
          }}
        />
      </div>
    </div>
  );
};

export default SingleCrownOnlayVeneer;

