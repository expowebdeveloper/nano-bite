import { UseFormReturn } from "react-hook-form";
import SelectField from "../../../components/common/SelectField";
import { CASE_TYPE_OPTIONS, CaseFormValues } from "../../../Constants/Constants";

interface CaseHeaderProps {
  formConfig: UseFormReturn<CaseFormValues>;
}

const CaseHeader = ({ formConfig }: CaseHeaderProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
      <SelectField
        label="Case Type"
        fieldName="caseType"
        formConfig={formConfig}
        selectedOption={CASE_TYPE_OPTIONS as unknown as string[]}
        isDefault="Case Type"
        customClass="!h-11 !bg-[#0b75c9] !border-[#0b75c9] !text-white [&>option]:!text-gray-900"
      />
    </div>
  );
};

export default CaseHeader;

