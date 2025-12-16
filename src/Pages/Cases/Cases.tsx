import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import Button from "../../components/common/Buttons/Button";
import Modal from "../../components/common/Modal/Modal";
import CaseHeader from "./components/CaseHeader";
import PatientInformation from "./components/PatientInformation";
import SingleCrownOnlayVeneer from "./components/SingleCrownOnlayVeneer";
import ShortSpanBridge from "./components/ShortSpanBridge";
import ImplantCrownBridge from "./components/ImplantCrownBridge";
import FullArchImplantFixed from "./components/FullArchImplantFixed";
import DigitalCompleteDenture from "./components/DigitalCompleteDenture";
import PartialDenture from "./components/PartialDenture";
import { CaseFormValues, CASE_FORM_DEFAULT_VALUES } from "../../Constants/Constants";

const Cases = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formConfig = useForm<CaseFormValues>({
    defaultValues: CASE_FORM_DEFAULT_VALUES,
    mode: "onChange", // Trigger validation on change
    reValidateMode: "onChange", // Re-validate on change
  });

  const { handleSubmit, watch, reset } = formConfig;
  const caseType = watch("caseType");
  const prevCaseTypeRef = useRef<string>(caseType || "");

  // Reset case-specific fields when case type changes
  useEffect(() => {
    if (prevCaseTypeRef.current && prevCaseTypeRef.current !== caseType) {
      // Get current form values
      const currentValues = formConfig.getValues();
      
      // Reset all case-specific fields to default values
      const resetValues: Partial<CaseFormValues> = {
        // Single Crown / Onlay / Veneer
        toothType: "",
        finalShade: "",
        stumpShade: "",
        restorationTypes: [],
        materialOptions: [],
        restorationPrep: [],
        noted: "",
        contacts: [],
        occlusion: [],
        requiredScans: [],
        // Short-span bridge
        abutmentsLeft: "",
        abutmentsRight: "",
        ponticDesign: [],
        ponticContacts: [],
        ponticTeeth: "",
        bridgeMaterial: [],
        bridgeRequiredScans: [],
        // Implant crown/bridge
        implantBrand: "",
        implantPlatform: "",
        implantConnection: "",
        implantTooth: "",
        implantRestoration: [],
        implantEmergence: [],
        implantRequiredScans: [],
        implantAbutment: [],
        implantOcclusion: [],
        implantAllowed: [],
        // Full Arch Implant Fixed
        fullArchDesign: [],
        fullArchFramework: [],
        fullArchVdo: [],
        fullArchOcc: [],
        fullArchToothSize: [],
        fullArchGingiva: [],
        fullArchMidline: [],
        fullArchRequiredScansTop: [],
        fullArchRequiredScans: [],
        // Digital Complete Denture
        digitalType: [],
        digitalArch: [],
        digitalVdo: [],
        digitalToothSetup: [],
        digitalShade: "",
        digitalBase: [],
        digitalCopy: [],
        digitalRequiredScans: [],
        digitalNewRecord: "",
        digitalChanges: "",
        // Partial denture
        partialType: [],
        partialFramework: [],
        partialMajorConnector: "",
        partialRests: "",
        partialShade: "",
        partialClasps: "",
        partialBaseAreas: "",
        partialAesthetics: [],
        partialRequiredScans: [],
      };

      // Keep patient information and header fields, only reset case-specific fields
      reset({
        ...currentValues,
        ...resetValues,
      });
    }
    prevCaseTypeRef.current = caseType || "";
  }, [caseType, reset, formConfig]);

  const onSubmit = (values: CaseFormValues) => {
    console.log("Case form submit", values);
  };

  const renderCaseTypeSection = () => {
    switch (caseType) {
      case "Single Crown / Onlay / Veneer":
        return <SingleCrownOnlayVeneer formConfig={formConfig} />;
      case "Short-span Bridge":
        return <ShortSpanBridge formConfig={formConfig} />;
      case "Implant Crown / Implant Bridge":
        return <ImplantCrownBridge formConfig={formConfig} />;
      case "Full Arch Implant Fixed":
        return <FullArchImplantFixed formConfig={formConfig} />;
      case "Digital Complete Denture":
        return <DigitalCompleteDenture formConfig={formConfig} />;
      case "Partial Denture":
        return <PartialDenture formConfig={formConfig} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Information - FIRST */}
        <PatientInformation
                formConfig={formConfig}
          onUploadClick={() => setShowUploadModal(true)}
        />

        {/* Case Header with Case Type and Doctor Signature/Date - AFTER Patient Information */}
        <CaseHeader formConfig={formConfig} />

        {/* Case Type Specific Sections - Show based on selection */}
        {caseType && (
            <div>
            {renderCaseTypeSection()}
              </div>
        )}

        {/* Submit Button */}
        {caseType && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="flex justify-end">
              <Button
                btnType="submit"
                btnText="Submit"
                customClass="!h-11 !px-6 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white border-none"
                backGround={false}
                border={false}
              />
            </div>
          </div>
        )}
      </form>

      {/* Upload Modal */}
      <Modal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        widthClass="max-w-md"
        showHeader={false}
      >
        <div className="mx-auto text-center space-y-6">
          <div className="border-2 border-dashed border-[#d6dde6] rounded-2xl p-8 bg-white flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Link or Cloud Folder
            </h3>
            <p className="text-sm text-gray-600 mb-2">File Supported: JPG, PNG, GIF</p>
            <p className="text-sm text-gray-700 font-semibold mb-4">Or</p>
            <div className="flex justify-center">
              <Button
                btnType="button"
                btnText="Browse Files"
                customClass="!py-3 !px-6 rounded-lg bg-transparent text-[#0B75C9] border border-[#0B75C9] hover:bg-[#0B75C9] hover:text-white"
                backGround={false}
                border={false}
                btnClick={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif"
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">Maximum Size: 10 mb</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cases;
