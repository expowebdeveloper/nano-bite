import { useForm } from "react-hook-form";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import Button from "../../components/common/Buttons/Button";
import Modal from "../../components/common/Modal/Modal";
// import CaseHeader from "./components/CaseHeader";
import PatientInformation from "./components/PatientInformation";
import SingleCrownOnlayVeneer from "./components/SingleCrownOnlayVeneer";
import ShortSpanBridge from "./components/ShortSpanBridge";
import ImplantCrownBridge from "./components/ImplantCrownBridge";
import FullArchImplantFixed from "./components/FullArchImplantFixed";
import DigitalCompleteDenture from "./components/DigitalCompleteDenture";
import PartialDenture from "./components/PartialDenture";
import {
  CaseFormValues,
  CASE_FORM_DEFAULT_VALUES,
} from "../../Constants/Constants";
import { confirmationMessage } from "../../components/common/ToastMessage";
import useUploads from "../../hooks/useUploads";
import type { CaseAttachment } from "../../interfaces/types";
import useCases from "../../hooks/useCases";
// import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { CommanHeading } from "./CommanHeading";
import ServicesPage from "./ServicesCard";
// import FixRestorationPage from "./components/Cases/FixRestoration/FixRestorationPage";
import NavigationButtons from "./components/NavigationButtons";
import { VerticalStepper } from "./components/Cases/FixRestoration/StepsBlock";
import TeethSelectionPage from "./components/Cases/FixRestoration/ToothBlock";
import ImplantSystemForm from "./components/Cases/ImplantsSolutions/ImplantSystemForm";
import AbutmentSelection from "./components/Cases/AbutmentSelection/AbutmentSelection";
import OptionalPhotos from "./components/Cases/ImplantsSolutions/OriginalPhoto";
import ShadeSelection from "./components/Cases/ImplantsSolutions/Shades";
import ImplantConfirmation from "./components/Cases/ImplantsSolutions/ImplantConfirmation";
import AddingCrown from "./components/Cases/FixRestoration/AddingCrown";
// import AddingImplantRestoration from "./components/Cases/FixRestoration/AddingImplantRestoration";
import { DentureTypeSelection } from "./components/Cases/Denture/DentureTypeSelection";
import { ExistingDentureCheck } from "./components/Cases/Denture/ExistingDentureCheck";
import { ImplantSupportedCheck } from "./components/Cases/Denture/ImplantSupportedCheck";
import { DentureArchSelection } from "./components/Cases/Denture/DentureArchSelection";
import { DentureShadeSelection } from "./components/Cases/Denture/DentureShadeSelection";
import { DentureKindSelection } from "./components/Cases/Denture/DentureKindSelection";
import { DentureSmileStyleSelection } from "./components/Cases/Denture/DentureSmileStyleSelection";
import { DentureFestooningSelection } from "./components/Cases/Denture/DentureFestooningSelection";
import { DentureSettingsSelection } from "./components/Cases/Denture/DentureSettingsSelection";
import { DentureOtherDetailsSelection } from "./components/Cases/Denture/DentureOtherDetailsSelection";
import { DentureDesignPreviewSelection } from "./components/Cases/Denture/DentureDesignPreviewSelection";
import { DentureReviewSummary } from "./components/Cases/Denture/DentureReviewSummary";
import { PartialDentureReplacementCheck } from "./components/Cases/Denture/PartialDentureReplacementCheck";
import { PartialDentureMaterialSelection } from "./components/Cases/Denture/PartialDentureMaterialSelection";
import { PartialDentureShadeSelection } from "./components/Cases/Denture/PartialDentureShadeSelection";
import { AddedItemModal } from "./components/Cases/Denture/AddedItemModal";

// Import servicesData
const servicesData = [
  {
    id: "fixed-restoration",
    title: "Fixed Restoration",
    description: "Crowns, Bridges, Inlays, Onlays and Veneers",
  },
  {
    id: "implants-solutions",
    title: "Implants Solutions",
    description: "Implant Crowns, Bridges and Surgical Guides",
  },
  {
    id: "splints-guards",
    title: "Splints, Guards & TMJ",
    description: "Night Guards, Sports Guards TMD/TMJ",
  },
  {
    id: "dentures",
    title: "Dentures",
    description: "Full Dentures, Partial Dentures and Overdentures",
  },
  {
    id: "wax-ups",
    title: "Wax-ups & Matrix",
    description: "Physical Wax-up, Digital Wax-Up and Study Model",
  },
];

const Cases = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [attachments, setAttachments] = useState<CaseAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPartialAddedModal, setShowPartialAddedModal] = useState(false);
  const { uploadFile, uploading } = useUploads();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { createCase } = useCases();
  const navigate = useNavigate();

  // const { casesListQuery} = useCases();
  // const { data, isLoading, error } = casesListQuery();

  const formConfig = useForm<CaseFormValues>({
    defaultValues: CASE_FORM_DEFAULT_VALUES,
    mode: "onChange", // Trigger validation on change
    reValidateMode: "onChange", // Re-validate on change
  });

  const { handleSubmit, watch, reset, trigger } = formConfig;
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


  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep((p) => p + 1);
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
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  /*
  useEffect(() => {
    if (!selectedOption) return;

    let newCaseType = "";
    switch (selectedOption) {
      case "Crown":
      case "Inlay":
      case "Onlay":
      case "Veneer":
        newCaseType = "Single Crown / Onlay / Veneer";
        break;
      case "Bridge":
        newCaseType = "Short-span Bridge";
        break;
      case "Implant Crown":
      case "Implant Bridge":
      case "Surgical Guide":
        newCaseType = "Implant Crown / Implant Bridge";
        break;
      case "Full Denture":
      case "Overdenture":
        newCaseType = "Digital Complete Denture";
        break;
      case "Partial Denture":
        newCaseType = "Partial Denture";
        break;
      // Add more mappings as necessary
    }

    if (newCaseType) {
      formConfig.setValue("caseType", newCaseType);
    }
  }, [selectedOption, formConfig]);
  */

  const getCaseTypeFromOption = (option: string | null) => {
    if (!option) return "Single Crown / Onlay / Veneer"; // Default fallback
    switch (option) {
      case "Crown":
      case "Inlay":
      case "Onlay":
      case "Veneer":
        return "Single Crown / Onlay / Veneer";
      case "Bridge":
        return "Short-span Bridge";
      case "Implant Crown":
      case "Implant Bridge":
      case "Surgical Guide":
        return "Implant Crown / Implant Bridge";
      case "Full Denture":
      case "Overdenture":
        return "Digital Complete Denture";
      case "Partial Denture":
        return "Partial Denture";
      default:
        // Handle other cases or return default
        return "Single Crown / Onlay / Veneer";
    }
  };

  const onSubmit = async (values: CaseFormValues) => {
    try {
      // Force caseType based on selectedOption ensures we are sending the correct type
      // regardless of form state which might be lagging or reset.
      const finalCaseType = getCaseTypeFromOption(selectedOption);

      const payload = {
        ...values,
        caseType: finalCaseType,
        attachments,
      };

      await createCase.mutateAsync(payload);
      
      // For Partial Denture, show the "Added Partial" modal after successful submission
      if (selectedOption === "Partial Denture") {
        setShowPartialAddedModal(true);
        // Don't reset/navigate yet - let user interact with modal first
        return;
      }
      
      // For other case types, proceed with normal flow
      // confirmationMessage("Case submitted successfully", "success");
      setAttachments([]);
      reset(CASE_FORM_DEFAULT_VALUES);
      setSelectedOption(null); // Reset option
      setCurrentStep(1); // Reset steps
      navigate("/cases");
    } catch (error) {
      // Errors are handled in the mutation onError
    }
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientInformation
            formConfig={formConfig}
            doctorSignatureValue={doctorSignature}
            dateValue={signatureDate}
            onUploadClick={() => setShowUploadModal(true)}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <>
            {/* <VerticalStepper activeStep={2} selectedTeeth={[]} /> */}
            <ServicesPage
              onOptionSelect={(label) => setSelectedOption(label)}
            />
          </>
        );
      case 3:
        if (["Partial Denture"].includes(selectedOption || "")) {
          return <PartialDentureMaterialSelection formConfig={formConfig} />;
        }
        if (
          ["Full Denture", "Overdenture"].includes(
            selectedOption || ""
          )
        ) {
          return <DentureTypeSelection formConfig={formConfig} />;
        }
        return (
          <>
            <TeethSelectionPage
              selectedTeeth={selectedTeeth}
              setSelectedTeeth={setSelectedTeeth}
            />
          </>
        );

      case 4:
        if (
          ["Crown", "Inlay", "Onlay", "Veneer", "Bridge"].includes(
            selectedOption || ""
          )
        ) {
          return (
            <OptionalPhotos
              attachments={attachments}
              setAttachments={setAttachments}
            />
          );
        }
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          // If "New Denture" (Conventional) is selected, ask about existing denture
          // digitalType is an array, but we are treating it as single select now
          const dentureType = watch("digitalType")?.[0];
          if (dentureType === "Conventional") {
            return <ExistingDentureCheck formConfig={formConfig} />;
          }
          // If Immediate or Reline, maybe go to scans or next steps.
          // For now, let's assume we proceed to the main form or photos?
          // User said "i will share the others once these are done".
          // Let's fallback to the DigitalCompleteDenture form for now if not "New Denture"
          // Or just placeholder.
          return <DigitalCompleteDenture formConfig={formConfig} />;
        }
        if (["Partial Denture"].includes(selectedOption || "")) {
          return <PartialDentureShadeSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ImplantSystemForm
              selectedTeeth={selectedTeeth}
              formConfig={formConfig}
            />
          </>
        );
      case 5:
        if (
          ["Full Denture", "Overdenture"].includes(selectedOption || "")
        ) {
          // Step 5: Implant Support Check
          // Only if we came from Existing Denture Check (Step 4)
          // If "New Denture" was selected in Step 3
          const dentureType = watch("digitalType")?.[0];
          if (dentureType === "Conventional") {
            return <ImplantSupportedCheck formConfig={formConfig} />;
          }

          return <DigitalCompleteDenture formConfig={formConfig} />;
        }
        if (["Partial Denture"].includes(selectedOption || "")) {
          return <PartialDentureReplacementCheck formConfig={formConfig} />;
        }

        return (
          <>
            <AbutmentSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 6:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          // Step 6: Arch Selection
          // Only if coming from step 5 (Implant Check or otherwise if skipping)
          // Check if we are in the "New Denture" flow
          const dentureType = watch("digitalType")?.[0];
          if (dentureType === "Conventional") {
            return <DentureArchSelection formConfig={formConfig} onNext={handleNext} />;
          }
          // If not conventional, we skip this step and go to photos (which is step 7)
          // But renderStep is called based on currentStep. 
          // We shouldn't be here if we skipped? 
          // Actually, if we are at step 6 and not conventional, we should have skipped 3->4->...
          // Wait, if not conventional, flow is: 
          // 1. Item -> 2. Teeth -> 3. Type (Immediate/Reline) -> 4. DigitalCompleteDenture (as placeholder)
          // So for Immediate/Reline, step 4 is the form. Step 5 is Photos?
          // Current TOTAL_STEPS=7 implies we expect 7 steps.
          // If Immediate, we might have fewer steps.
          // For now, let's just render the form again or photos if we end up here to be safe.
          return (
            <OptionalPhotos
              attachments={attachments}
              setAttachments={setAttachments}
            />
          );
        }
        // Photos step commented out for Partial Denture
        // if (["Partial Denture"].includes(selectedOption || "")) {
        //   return (
        //     <OptionalPhotos
        //       attachments={attachments}
        //       setAttachments={setAttachments}
        //     />
        //   );
        // }
        return (
          <>
            <AddingCrown />
          </>
        );
      case 7:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return <DentureShadeSelection formConfig={formConfig} />;
        }
        return (
          <>
            <OptionalPhotos
              attachments={attachments}
              setAttachments={setAttachments}
            />
          </>
        );
      case 8:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return <DentureKindSelection formConfig={formConfig} />;
        }
        // ... rest of case 8
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 9:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return <DentureSmileStyleSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 10:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return <DentureFestooningSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 11:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return <DentureSettingsSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 12:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return <DentureOtherDetailsSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 13:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return <DentureDesignPreviewSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 14:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return (
            <OptionalPhotos
              attachments={attachments}
              setAttachments={setAttachments}
            />
          );
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 15:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          return (
            <DentureReviewSummary
              formConfig={formConfig}
              onEditStep={(step) => setCurrentStep(step)}
            />
          );
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );

      case 9:
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
            <ImplantConfirmation selectedTeeth={selectedTeeth} />
          </>
        );
      default:
        return null;
    }
  };

  const isFixedRestoration = [
    "Crown",
    "Inlay",
    "Onlay",
    "Veneer",
    "Bridge",
  ].includes(selectedOption || "");

  const isDenture = [
    "Full Denture",
    "Overdenture",
    "Partial Denture",
  ].includes(selectedOption || "");

  const TOTAL_STEPS = isFixedRestoration ? 4 : isDenture ? (selectedOption === "Partial Denture" ? 5 : 15) : 9;
  const [currentStep, setCurrentStep] = useState(1);

  // Map currentStep to stepper step ID for dentures (accounting for steps not in stepper)
  const getStepperActiveStep = () => {
    if (isDenture) {
      if (selectedOption === "Partial Denture") {
        // Partial Denture flow mapping:
        // Step 2 (Services) → stepper id: 1 (Item)
        // Step 3 (PartialDentureMaterialSelection) → stepper id: 2 (Material)
        // Step 4 (PartialDentureShadeSelection) → stepper id: 3 (Shade)
        // Step 5 (PartialDentureReplacementCheck) → stepper id: 4 (Replacement)
        // Photos step is commented out - flow ends at step 5
        const partialStepMap: { [key: number]: number } = {
          2: 1, // Item
          3: 2, // Material
          4: 3, // Shade
          5: 4, // Replacement
          // 6: 5, // Photos - commented out
        };
        return partialStepMap[currentStep] || 1;
      }
      // Full Denture/Overdenture flow mapping:
      // Step 2 (Services) → stepper id: 1 (Item)
      // Step 3 (DentureTypeSelection) → stepper id: 2 (Type)
      // Step 4 (ExistingDentureCheck) → skip (not in stepper)
      // Step 5 (ImplantSupportedCheck) → skip (not in stepper)
      // Step 6 (DentureArchSelection) → stepper id: 3 (Arch)
      // Step 7 (DentureShadeSelection) → stepper id: 4 (Shade)
      // Step 8 (DentureKindSelection) → stepper id: 5 (Denture Type)
      // Step 9 (DentureSmileStyleSelection) → stepper id: 6 (Smile Style)
      // Step 10 (DentureFestooningSelection) → stepper id: 7 (Festooning)
      // Step 11 (DentureSettingsSelection) → stepper id: 8 (Settings)
      // Step 12 (DentureOtherDetailsSelection) → stepper id: 9 (Functional Preferences)
      // Step 13 (DentureDesignPreviewSelection) → stepper id: 10 (Design Preview)
      // Step 14 (OptionalPhotos) → stepper id: 11 (Photos)
      // Step 15 (DentureReviewSummary) → stepper id: 12 (Review)
      const stepMap: { [key: number]: number } = {
        2: 1, // Item
        3: 2, // Type
        6: 3, // Arch
        7: 4, // Shade
        8: 5, // Denture Type
        9: 6, // Smile Style
        10: 7, // Festooning
        11: 8, // Settings
        12: 9, // Functional Preferences
        13: 10, // Design Preview
        14: 11, // Photos
        15: 12, // Review
      };
      return stepMap[currentStep] || 1;
    }
    return currentStep - 1;
  };

  return (
    <div className="min-h-screen bg-[#fff] p-6 space-y-6">
      {/* <Button
        btnText="Back"
        backGround
        icon={<ArrowLeft />}
        customClass="!h-11 !px-6 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white border-none"
        btnClick={() => navigate("/cases")}
      /> */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
        <div className="flex items-start gap-4">
          {currentStep !== 1 && currentStep >= 2 && (
            <div className="sticky top-6 hidden lg:block">
              <VerticalStepper
                activeStep={getStepperActiveStep()}
                selectedTeeth={selectedTeeth}
                selectedOption={selectedOption}
              />
            </div>
          )}

          <div className="flex-1">{renderStep()}</div>
        </div>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrevious={() => setCurrentStep((p) => p - 1)}
          onNext={handleNext}
          isSubmitting={createCase.isPending}
        />
      </form>

      {/* Partial Denture Added Modal */}
      {showPartialAddedModal && selectedOption === "Partial Denture" && (
        <AddedItemModal
          isOpen={showPartialAddedModal}
          itemName="Partial"
          itemNameColor="text-red-600"
          patientName={watch("patientName") || "Training"}
          onStartScanning={() => {
            setShowPartialAddedModal(false);
            // Reset form and navigate to cases list after scanning
            setAttachments([]);
            reset(CASE_FORM_DEFAULT_VALUES);
            setSelectedOption(null);
            setCurrentStep(1);
            navigate("/cases");
          }}
          onAddAnotherItem={() => {
            setShowPartialAddedModal(false);
            // Reset form and go back to item selection
            reset(CASE_FORM_DEFAULT_VALUES);
            setSelectedOption(null);
            setCurrentStep(2);
          }}
        />
      )}

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
