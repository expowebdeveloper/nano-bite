import { UseFormReturn } from "react-hook-form";
import Input from "../../../components/common/Input/Input";
import CheckboxGroup from "../../../components/common/CheckboxGroup/CheckboxGroup";
import Textarea from "../../../components/common/Textarea/Textarea";
import Button from "../../../components/common/Buttons/Button";
import {
  SEX_OPTIONS,
  BRUXISM_OPTIONS,
  SMILE_STYLE_OPTIONS,
  MIDLINE_OPTIONS,
  PHOTO_OPTIONS,
  SCAN_OPTIONS,
  CaseFormValues,
} from "../../../Constants/Constants";

interface PatientInformationProps {
  formConfig: UseFormReturn<CaseFormValues>;
  onUploadClick: () => void;
  doctorSignatureValue?: string;
  dateValue?: string;
}

const PatientInformation = ({
  formConfig,
  onUploadClick,
  doctorSignatureValue,
  dateValue,
}: PatientInformationProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Patient Information</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Patient Name"
            fieldName="patientName"
            formConfig={formConfig}
            placeholder="Name"
            rules={{ required: "Patient name is required" }}
          />
          <Input
            label="Age"
            fieldName="age"
            formConfig={formConfig}
            placeholder="Age"
            rules={{ required: "Age is required" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <CheckboxGroup
              label="Sex"
              fieldName="sex"
              formConfig={formConfig}
              options={SEX_OPTIONS as unknown as string[]}
              className="flex items-center gap-4 justify-start flex-nowrap"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            fieldName="dueDate"
            formConfig={formConfig}
            placeholder="Due Date"
            type="date"
            rules={{ required: "Due date is required" }}
          />
          <div className="w-full">
            <CheckboxGroup
              label="Bruxism"
              fieldName="bruxism"
              formConfig={formConfig}
              options={BRUXISM_OPTIONS as unknown as string[]}
              className="flex items-center gap-4 justify-start flex-nowrap"
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

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Esthetic Notes (If Applicable)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CheckboxGroup
              label="Smile Style"
              fieldName="smileStyle"
              formConfig={formConfig}
              options={SMILE_STYLE_OPTIONS as unknown as string[]}
            />
            <CheckboxGroup
              label="Midline"
              fieldName="midline"
              formConfig={formConfig}
              options={MIDLINE_OPTIONS as unknown as string[]}
            />
          </div>
          <Textarea
            label="Additional Esthetic Notes"
            fieldName="estheticNotes"
            formConfig={formConfig}
            placeholder="-"
            rows={5}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Photos</h2>
          <CheckboxGroup
            label="Check All Provided"
            fieldName="photos"
            formConfig={formConfig}
            options={PHOTO_OPTIONS as unknown as string[]}
            rules={{
              validate: (value: string[]) => {
                if (!value || value.length === 0) {
                  return "Please select at least one option";
                }
                return true;
              },
            }}
          />
          <div className="flex justify-end">
            <Button
              btnType="button"
              btnText="Upload Link or Cloud Folder"
              customClass="!py-2 !px-4 rounded-lg bg-transparent text-[#0B75C9] border border-[#0B75C9] hover:bg-[#0B75C9] hover:text-white"
              backGround={false}
              border={false}
              btnClick={onUploadClick}
            />
          </div>
        </div>

        <CheckboxGroup
          label="Scans Provided"
          fieldName="scans"
          formConfig={formConfig}
          options={SCAN_OPTIONS as unknown as string[]}
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
          label="Additional Notes"
          fieldName="additionalNotes"
          formConfig={formConfig}
          placeholder="-"
          rows={6}
        />

        {/* Doctor Signature and Date - At the end of Patient Information, on the right */}
        <div className="flex justify-end gap-8 md:gap-10 pt-4">
          <div className="flex flex-col items-center relative">
            <span className="absolute -top-6 text-sm text-gray-700 font-semibold">
              {doctorSignatureValue || "Signature"}
            </span>
            <div className="w-32 border-b-2 border-dashed border-gray-300 mb-2"></div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Doctor Signature</label>
            <Input
              fieldName="doctorSignature"
              formConfig={formConfig}
              placeholder=""
              customClass="!h-auto !border-none !bg-transparent !px-0 !text-center !w-32 !shadow-none !rounded-none"
            />
          </div>
          <div className="flex flex-col items-center relative">
            <span className="absolute -top-6 text-sm text-gray-700 font-semibold">
              {dateValue || "Date"}
            </span>
            <div className="w-24 border-b-2 border-dashed border-gray-300 mb-2"></div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Date</label>
            <Input
              fieldName="date"
              formConfig={formConfig}
              type="date"
              placeholder="mm/dd/yyyy"
              customClass="!h-auto !border-none !bg-transparent !px-0 !text-center !w-24 !shadow-none !rounded-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInformation;

