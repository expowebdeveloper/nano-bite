import { useForm } from "react-hook-form";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
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
import { confirmationMessage } from "../../components/common/ToastMessage";
import useUploads from "../../hooks/useUploads";
import type { CaseAttachment } from "../../interfaces/types";
import useCases from "../../hooks/useCases";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cases = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [attachments, setAttachments] = useState<CaseAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { uploadFile, uploading } = useUploads();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { createCase } = useCases();
  const navigate = useNavigate()

  const formConfig = useForm<CaseFormValues>({
    defaultValues: CASE_FORM_DEFAULT_VALUES,
    mode: "onChange", // Trigger validation on change
    reValidateMode: "onChange", // Re-validate on change
  });

  const { handleSubmit, watch, reset } = formConfig;
  const caseType = watch("caseType");
  const doctorSignature = watch("doctorSignature");
  const signatureDate = watch("date");
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

  useEffect(() => {
    formConfig.setValue("attachments", attachments);
  }, [attachments, formConfig]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadError(null);

    try {
      const uploaded = await uploadFile(file);
      setAttachments((prev) => [...prev, uploaded]);
      confirmationMessage("File uploaded successfully", "success");
      setShowUploadModal(false);
    } catch (error: any) {
      const message = error?.message || "Unable to upload file.";
      setUploadError(message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      event.target.value = "";
    }
  };

  const onSubmit = async (values: CaseFormValues) => {
    try {
      await createCase.mutateAsync({ ...values, attachments });
      setAttachments([]);
      reset(CASE_FORM_DEFAULT_VALUES);
    } catch (error) {
      // Errors are handled in the mutation onError
    }
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
      <Button 
       btnText="Back"
       backGround
       icon={<ArrowLeft/>}
       customClass="!h-11 !px-6 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white border-none"
       btnClick={()=>navigate("/dashboard")}

        />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Information - FIRST */}
        <PatientInformation
                formConfig={formConfig}
          doctorSignatureValue={doctorSignature}
          dateValue={signatureDate}
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
                btnText={createCase.isPending ? "Submitting..." : "Submit"}
                customClass="!h-11 !px-6 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white border-none"
                backGround={false}
                border={false}
                disable={createCase.isPending}
              />
            </div>
          </div>
        )}
      </form>

      {attachments.length > 0 && (
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded files
          </h3>
          <ul className="space-y-3">
            {attachments.map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between text-sm text-gray-800"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="inline-flex items-center rounded-full bg-[#e8f4ff] px-2 py-1 text-[11px] font-semibold uppercase text-[#0B75C9]">
                    {item.type}
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="text-gray-500">
                  {(item.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        open={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadError(null);
        }}
        widthClass="max-w-md"
        showHeader={false}
      >
        <div className="mx-auto text-center space-y-6">
          <div className="border-2 border-dashed border-[#d6dde6] rounded-2xl p-8 bg-white flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload files to S3
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Supported: Images (JPG, PNG, GIF), PDF, STL
            </p>
            <p className="text-sm text-gray-700 font-semibold mb-4">
              We will request a signed URL and upload directly to S3.
            </p>
            <div className="flex justify-center">
              <Button
                btnType="button"
                btnText={uploading ? "Uploading..." : "Browse Files"}
                customClass="!py-3 !px-6 rounded-lg bg-transparent text-[#0B75C9] border border-[#0B75C9] hover:bg-[#0B75C9] hover:text-white disabled:opacity-60"
                backGround={false}
                border={false}
                btnClick={() => {
                  if (!uploading) {
                    fileInputRef.current?.click();
                  }
                }}
                disable={uploading}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.stl"
                onChange={handleFileChange}
              />
            </div>
            {uploadError && (
              <p className="text-sm text-red-600 mt-4">{uploadError}</p>
            )}
            {!uploadError && uploading && (
              <p className="text-sm text-gray-600 mt-4">Uploading...</p>
            )}
            <p className="text-xs text-gray-500 mt-4">Maximum Size: 25 MB</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cases;
