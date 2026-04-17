import { useForm } from "react-hook-form";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import Button from "../../components/common/Buttons/Button";
import Modal from "../../components/common/Modal/Modal";
// import CaseHeader from "./components/CaseHeader";
import PatientInformation from "./components/PatientInformation";
import DigitalCompleteDenture from "./components/DigitalCompleteDenture";
import {
  CaseFormValues,
  CASE_FORM_DEFAULT_VALUES,
} from "../../Constants/Constants";
import { confirmationMessage } from "../../components/common/ToastMessage";
import useUploads from "../../hooks/useUploads";
import type { CaseAttachment } from "../../interfaces/types";
import useCases from "../../hooks/useCases";
import useUser from "../../hooks/useUser";
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
// import AddingImplantRestoration from "./components/Cases/FixRestoration/AddingImplantRestoration";
import { DentureTypeSelection } from "./components/Cases/Denture/DentureTypeSelection";
import { ExistingDentureCheck } from "./components/Cases/Denture/ExistingDentureCheck";
import { ImplantSupportedCheck } from "./components/Cases/Denture/ImplantSupportedCheck";
import { DentureArchSelection } from "./components/Cases/Denture/DentureArchSelection";
import { DentureKindSelection } from "./components/Cases/Denture/DentureKindSelection";
import { DentureSmileStyleSelection } from "./components/Cases/Denture/DentureSmileStyleSelection";
import { DentureFestooningSelection } from "./components/Cases/Denture/DentureFestooningSelection";
import { DentureSettingsSelection } from "./components/Cases/Denture/DentureSettingsSelection";
import { DentureOtherDetailsSelection } from "./components/Cases/Denture/DentureOtherDetailsSelection";
// import { DentureDesignPreviewSelection } from "./components/Cases/Denture/DentureDesignPreviewSelection"; // Design Preview commented out - not required
import { DentureReviewSummary } from "./components/Cases/Denture/DentureReviewSummary";
import { PartialDentureReplacementCheck } from "./components/Cases/Denture/PartialDentureReplacementCheck";
import { PartialDentureMaterialSelection } from "./components/Cases/Denture/PartialDentureMaterialSelection";
import { AddedItemModal } from "./components/Cases/Denture/AddedItemModal";
import { OverdentureScanSelection } from "./components/Cases/Denture/OverdentureScanSelection";
import { OverdentureRelineImplantCheck } from "./components/Cases/Denture/OverdentureRelineImplantCheck";
import { SwitchToOverdentureModal } from "./components/Cases/Denture/SwitchToOverdentureModal";
import { OverdentureSupportTypeSelection } from "./components/Cases/Denture/OverdentureSupportTypeSelection";
import { OverdentureImplantLocationSelection } from "./components/Cases/Denture/OverdentureImplantLocationSelection";
import { OverdentureImplantDetails } from "./components/Cases/Denture/OverdentureImplantDetails";
import { OverdentureRelineArchSelection } from "./components/Cases/Denture/OverdentureRelineArchSelection";
import { OverdentureRelineAddedModal } from "./components/Cases/Denture/OverdentureRelineAddedModal";

// Import servicesData
// const servicesData = [
//   {
//     id: "fixed-restoration",
//     title: "Fixed Restoration",
//     description: "Crowns, Bridges, Inlays, Onlays and Veneers",
//   },
//   {
//     id: "implants-solutions",
//     title: "Implants Solutions",
//     description: "Implant Crowns, Bridges and Surgical Guides",
//   },
//   {
//     id: "splints-guards",
//     title: "Splints, Guards & TMJ",
//     description: "Night Guards, Sports Guards TMD/TMJ",
//   },
//   {
//     id: "dentures",
//     title: "Dentures",
//     description: "Full Dentures, Partial Dentures and Overdentures",
//   },
//   {
//     id: "wax-ups",
//     title: "Wax-ups & Matrix",
//     description: "Physical Wax-up, Digital Wax-Up and Study Model",
//   },
// ];

const Cases = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [attachments, setAttachments] = useState<CaseAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPartialAddedModal, setShowPartialAddedModal] = useState(false);
  const [showSwitchToOverdentureModal, setShowSwitchToOverdentureModal] = useState(false);
  const [showOverdentureRelineAddedModal, setShowOverdentureRelineAddedModal] = useState(false);
  const { uploadFile, uploading } = useUploads();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { createCase } = useCases();
  const { profileQuery } = useUser();
  const navigate = useNavigate();

  const showCloudFolderOption =
    (profileQuery.data as { dentistProfile?: { preferredFileTransfer?: string[] } } | undefined)
      ?.dentistProfile?.preferredFileTransfer?.includes("Cloud Shared Folder") ?? false;

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

  const [dragOver, setDragOver] = useState(false);

  const processFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;
    setUploadError(null);
    try {
      for (const file of fileList) {
        const uploaded = await uploadFile(file);
        setAttachments((prev) => [...prev, uploaded]);
      }
      confirmationMessage(
        fileList.length === 1 ? "File uploaded successfully" : `${fileList.length} files uploaded successfully`,
        "success"
      );
      setShowUploadModal(false);
    } catch (error: any) {
      const message = error?.message || "Unable to upload file.";
      setUploadError(message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    await processFiles(files);
    event.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };


  // Track whether we're editing from the review page
  const [editingFromReview, setEditingFromReview] = useState(false);

  const handleNext = async () => {
    if (currentStep === 2 && !selectedOption) {
      confirmationMessage("Please select an option before continuing.", "error");
      return;
    }
    if (
      currentStep === 3 &&
      ["Full Denture", "Overdenture"].includes(selectedOption || "") &&
      !watch("digitalType")?.[0]
    ) {
      confirmationMessage(
        "Please select New Denture, Immediate Denture, or Denture Reline before continuing.",
        "error"
      );
      return;
    }
    const isValid = await trigger();
    if (isValid) {
      // If editing from review, return to the review step after one edit
      if (editingFromReview) {
        setEditingFromReview(false);
        setCurrentStep(TOTAL_STEPS); // Go back to review (last step)
        return;
      }

      setCurrentStep((p) => {
        const nextStep = p + 1;
        const dentureType = watch("digitalType")?.[0];

        // For Full Denture + Immediate, skip steps 4 and 5 (Digital Complete Denture form)
        // Go directly from step 3 (Type) to step 6 (Arch)
        if (nextStep === 4 && selectedOption === "Full Denture" && dentureType === "Immediate") {
          return 6; // Skip to Arch selection
        }

        // For all Full Denture/Overdenture flows, skip steps 7-13 (intermediate steps + Design Preview)
        // Go directly from step 6 (Arch) to step 14 (Photos)
        // Exception: Overdenture Reline has its own unique flow through steps 7-8
        if (nextStep >= 7 && nextStep <= 13 && ["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          const isOverdentureReline = selectedOption === "Overdenture" && dentureType === "Reline";
          if (!isOverdentureReline) {
            return 14; // Skip to Photos
          }
        }

        // For Partial Denture, skip from step 4 to step 14 (Photos)
        if (nextStep === 5 && selectedOption === "Partial Denture") {
          return 14;
        }

        return nextStep;
      });
    }
  };

  const handleBack = () => {
    // If editing from review, cancel the edit and return to review
    if (editingFromReview) {
      setEditingFromReview(false);
      setCurrentStep(TOTAL_STEPS); // Go back to review (last step)
      return;
    }

    setCurrentStep((p) => {
      const prevStep = p - 1;
      const dentureType = watch("digitalType")?.[0];

      // For Full Denture + Immediate, skip steps 5 and 4 backwards (from 6 to 3)
      if ((prevStep === 5 || prevStep === 4) && selectedOption === "Full Denture" && dentureType === "Immediate") {
        return 3; // Skip back to Type selection
      }

      // For all Full Denture/Overdenture flows, skip steps 13-7 backwards (from 14 to 6)
      // Exception: Overdenture Reline has its own unique flow through steps 7-8
      if (prevStep >= 7 && prevStep <= 13 && ["Full Denture", "Overdenture"].includes(selectedOption || "")) {
        const isOverdentureReline = selectedOption === "Overdenture" && dentureType === "Reline";
        if (!isOverdentureReline) {
          return 6; // Skip back to Arch
        }
      }

      // For Partial Denture, skip back from step 14 (Photos) to step 4 (Replacement Check)
      // Note: prevStep would be 13 when backing from 14.
      if (prevStep === 13 && selectedOption === "Partial Denture") {
        return 4;
      }

      return prevStep;
    });
  };


  // const renderCaseTypeSection = () => {
  //   switch (caseType) {
  //     case "Single Crown / Onlay / Veneer":
  //       return <SingleCrownOnlayVeneer formConfig={formConfig} />;
  //     case "Short-span Bridge":
  //       return <ShortSpanBridge formConfig={formConfig} />;
  //     case "Implant Crown / Implant Bridge":
  //       return <ImplantCrownBridge formConfig={formConfig} />;
  //     case "Full Arch Implant Fixed":
  //       return <FullArchImplantFixed formConfig={formConfig} />;
  //     case "Digital Complete Denture":
  //       return <DigitalCompleteDenture formConfig={formConfig} />;
  //     case "Partial Denture":
  //       return <PartialDenture formConfig={formConfig} />;
  //     default:
  //       return null;
  //   }
  // };
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



      // For Overdenture Reline, show the "Added Overdenture Reline" modal after successful submission
      const dentureType = watch("digitalType")?.[0];
      if (selectedOption === "Overdenture" && dentureType === "Reline") {
        setShowOverdentureRelineAddedModal(true);
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
            showCloudFolderOption={showCloudFolderOption}
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
          // For Overdenture + Immediate Denture, FIRST show scan/impression selection (Step 1)
          if (selectedOption === "Overdenture" && dentureType === "Immediate") {
            return <OverdentureScanSelection formConfig={formConfig} />;
          }
          // For Overdenture + Reline, show implant-supported check with switch option
          if (selectedOption === "Overdenture" && dentureType === "Reline") {
            return (
              <OverdentureRelineImplantCheck
                formConfig={formConfig}
                onSwitchToOverdenture={() => setShowSwitchToOverdentureModal(true)}
              />
            );
          }
          // For Full Denture + Immediate, skip Digital Complete Denture form and go to Arch selection
          if (selectedOption === "Full Denture" && dentureType === "Immediate") {
            // Skip to Arch selection (step 6)
            return null; // Will be handled by step 6
          }
          // If Reline for Full Denture, show Digital Complete Denture form
          if (selectedOption === "Full Denture" && dentureType === "Reline") {
            return <DigitalCompleteDenture formConfig={formConfig} />;
          }
          // Default: show Digital Complete Denture form for other cases
          return <DigitalCompleteDenture formConfig={formConfig} />;
        }
        if (["Partial Denture"].includes(selectedOption || "")) {
          // Shade step commented out - not required
          // return <PartialDentureShadeSelection formConfig={formConfig} />;
          // Skip to next step
          return <PartialDentureReplacementCheck formConfig={formConfig} />;
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
          // Step 5: Implant Support Check OR Digital Complete Denture form OR Overdenture Support Type
          const dentureType = watch("digitalType")?.[0];
          // If "New Denture" (Conventional) was selected, show Implant Support Check
          if (dentureType === "Conventional") {
            return <ImplantSupportedCheck formConfig={formConfig} />;
          }
          // For Overdenture + Immediate Denture, flow ends at step 4 (scan selection), so this step shouldn't be reached
          if (selectedOption === "Overdenture" && dentureType === "Immediate") {
            return null; // Flow should have ended at step 4
          }
          // For Overdenture + Reline, show support type selection (after switch confirmation)
          if (selectedOption === "Overdenture" && dentureType === "Reline") {
            return <OverdentureSupportTypeSelection formConfig={formConfig} />;
          }
          // For Full Denture + Immediate, skip Digital Complete Denture form and go to Arch selection
          if (selectedOption === "Full Denture" && dentureType === "Immediate") {
            // Skip to Arch selection (step 6)
            return null; // Will be handled by step 6
          }
          // For Full Denture + Reline, show Digital Complete Denture form
          if (selectedOption === "Full Denture" && dentureType === "Reline") {
            return <DigitalCompleteDenture formConfig={formConfig} />;
          }
          // Default: show Digital Complete Denture form for other cases
          return <DigitalCompleteDenture formConfig={formConfig} />;
        }
        return (
          <>
            <AbutmentSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 6:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          const dentureType = watch("digitalType")?.[0];
          // For Overdenture + Reline + Implant-supported, show implant location selection
          if (selectedOption === "Overdenture" && dentureType === "Reline") {
            const supportType = watch("overdentureSupportType");
            if (supportType === "Implant-supported") {
              return <OverdentureImplantLocationSelection formConfig={formConfig} />;
            }
            // For Overdenture + Reline + Tooth-supported, show arch selection
            if (supportType === "Tooth-supported") {
              return <OverdentureRelineArchSelection formConfig={formConfig} />;
            }
          }
          // Continue with normal flow for other cases
          return <DentureArchSelection formConfig={formConfig} onNext={handleNext} />;
        }
        return (
          <>
            <AbutmentSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 7:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          const dentureType = watch("digitalType")?.[0];
          // For Overdenture + Reline + Implant-supported, show implant details form
          if (selectedOption === "Overdenture" && dentureType === "Reline") {
            const supportType = watch("overdentureSupportType");
            if (supportType === "Implant-supported") {
              return <OverdentureImplantDetails formConfig={formConfig} />;
            }
          }
          // For Full Denture/Overdenture Conventional OR Immediate flow, skip these steps
          if (dentureType === "Conventional" || !dentureType || dentureType === "Immediate") {
            // Steps commented out for Full Denture/Overdenture Conventional/Immediate:
            // - Denture Type (DentureKindSelection)
            // - Smile Style (DentureSmileStyleSelection)
            // - Festooning (DentureFestooningSelection)
            // - Settings (DentureSettingsSelection)
            // - Functional Preferences (DentureOtherDetailsSelection)
            // - Design Preview (DentureDesignPreviewSelection) — commented out
            // Flow: Arch → Photos
            // return <DentureDesignPreviewSelection formConfig={formConfig} />;
            return null;
          }
          // For other denture types (Reline), continue with normal flow
          // Shade step commented out - not required
          // return <DentureShadeSelection formConfig={formConfig} />;
          // Skip shade and go to Denture Type selection
          return <DentureKindSelection formConfig={formConfig} />;
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
          const dentureType = watch("digitalType")?.[0];
          // For Full Denture/Overdenture Conventional flow, these steps are commented out
          if (dentureType === "Conventional" || !dentureType) {
            // Denture Type step commented out — Design Preview also commented out
            // return <DentureDesignPreviewSelection formConfig={formConfig} />;
            return null;
          }
          // For other flows, continue normally
          return <DentureSmileStyleSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 9:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          const dentureType = watch("digitalType")?.[0];
          // For Full Denture/Overdenture Conventional OR Immediate flow, these steps are commented out
          if (dentureType === "Conventional" || !dentureType || dentureType === "Immediate") {
            // Smile Style step commented out — Design Preview also commented out
            // return <DentureDesignPreviewSelection formConfig={formConfig} />;
            return null;
          }
          // For other flows, continue normally
          return <DentureFestooningSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
            <ImplantConfirmation selectedTeeth={selectedTeeth} />
          </>
        );
      case 10:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          const dentureType = watch("digitalType")?.[0];
          // For Full Denture/Overdenture Conventional OR Immediate flow, these steps are commented out
          if (dentureType === "Conventional" || !dentureType || dentureType === "Immediate") {
            // Festooning step commented out — Design Preview also commented out
            // return <DentureDesignPreviewSelection formConfig={formConfig} />;
            return null;
          }
          // For other flows, continue normally
          return <DentureFestooningSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 11:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          const dentureType = watch("digitalType")?.[0];
          // For Full Denture/Overdenture Conventional OR Immediate flow, these steps are commented out
          if (dentureType === "Conventional" || !dentureType || dentureType === "Immediate") {
            // Settings step commented out — Design Preview also commented out
            // return <DentureDesignPreviewSelection formConfig={formConfig} />;
            return null;
          }
          // For other flows, continue normally
          return <DentureSettingsSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 12:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          const dentureType = watch("digitalType")?.[0];
          // For Full Denture/Overdenture Conventional OR Immediate flow, these steps are commented out
          if (dentureType === "Conventional" || !dentureType || dentureType === "Immediate") {
            // Functional Preferences step commented out — Design Preview also commented out
            // return <DentureDesignPreviewSelection formConfig={formConfig} />;
            return null;
          }
          // For other flows, continue normally
          return <DentureOtherDetailsSelection formConfig={formConfig} />;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 13:
        if (["Full Denture", "Overdenture"].includes(selectedOption || "")) {
          // Design Preview step commented out — not required
          // return <DentureDesignPreviewSelection formConfig={formConfig} />;
          return null;
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
          </>
        );
      case 14:
        if (["Full Denture", "Overdenture", "Partial Denture"].includes(selectedOption || "")) {
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
        if (["Full Denture", "Overdenture", "Partial Denture"].includes(selectedOption || "")) {
          return (
            <DentureReviewSummary
              formConfig={formConfig}
              onEditStep={(step) => {
                setEditingFromReview(true);
                setCurrentStep(step);
              }}
              selectedOption={selectedOption}
            />
          );
        }
        return (
          <>
            <ShadeSelection selectedTeeth={selectedTeeth} />
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

  // Calculate TOTAL_STEPS based on flow
  const dentureType = watch("digitalType")?.[0];
  const isOverdentureImmediate = selectedOption === "Overdenture" && dentureType === "Immediate";
  const isOverdentureReline = selectedOption === "Overdenture" && dentureType === "Reline";
  const supportType = watch("overdentureSupportType");
  const isOverdentureRelineImplant = isOverdentureReline && supportType === "Implant-supported";

  // Check if it's Conventional denture type for Full Denture/Overdenture
  const isDentureConventional = isDenture && (dentureType === "Conventional" || !dentureType);
  const isFullDentureImmediate = selectedOption === "Full Denture" && dentureType === "Immediate";

  const TOTAL_STEPS = isFixedRestoration
    ? 4
    : isDenture
      ? (selectedOption === "Partial Denture"
        ? 15  // Partial Denture: Step 2 (Services) → Step 3 (Material) → Step 4 (Replacement) → Step 14 (Photos) → Step 15 (Review)
        : isOverdentureImmediate
          ? 4  // Overdenture + Immediate: Step 2 (Services) → Step 3 (Type) → Step 4 (Scan) = 4 steps total
          : isOverdentureRelineImplant
            ? 8  // Overdenture + Reline + Implant: Step 2 → Step 3 → Step 4 → Step 5 (Support Type) → Step 6 (Implant Locations) → Step 7 (Implant Details) → Step 8 (Arch Selection) = 8 steps total
            : isOverdentureReline
              ? 6  // Overdenture + Reline: Step 2 → Step 3 → Step 4 → Step 5 (Support Type) → Step 6 (Arch Selection) = 6 steps total
              : isFullDentureImmediate
                ? 15  // Full Denture + Immediate: Step 2 (Services) → Step 3 (Type) → Step 6 (Arch) → Step 13 (Design Preview) → Step 14 (Photos) → Step 15 (Review) = last step is 15
                : isDentureConventional
                  ? 15  // Full Denture/Overdenture Conventional: Step 2 (Services) → Step 3 (Type) → Step 6 (Arch) → Step 13 (Design Preview) → Step 14 (Photos) → Step 15 (Review) = last step is 15
                  : 15) // Other denture types (Reline): last step is 15 (Review)
      : 9;
  const [currentStep, setCurrentStep] = useState(1);

  // Map currentStep to stepper step ID for dentures (accounting for steps not in stepper)
  const getStepperActiveStep = () => {
    if (isDenture) {
      const dentureType = watch("digitalType")?.[0];
      const isOverdentureImmediate = selectedOption === "Overdenture" && dentureType === "Immediate";
      const isFullDentureImmediate = selectedOption === "Full Denture" && dentureType === "Immediate";

      if (isOverdentureImmediate) {
        // Overdenture + Immediate Denture flow mapping:
        // Step 2 (Services) → stepper id: 1 (Item)
        // Step 3 (DentureTypeSelection) → stepper id: 2 (Type)
        // Step 4 (OverdentureScanSelection) → stepper id: 3 (Scan/Impression)
        const overdentureImmediateStepMap: { [key: number]: number } = {
          2: 1, // Item
          3: 2, // Type
          4: 3, // Scan/Impression
        };
        return overdentureImmediateStepMap[currentStep] || 1;
      }

      if (isFullDentureImmediate) {
        // Full Denture + Immediate flow mapping:
        // Step 2 (Services) → stepper id: 1 (Item)
        // Step 3 (DentureTypeSelection) → stepper id: 2 (Type)
        // Step 4 (ExistingDentureCheck) → skip (not in stepper)
        // Step 5 (ImplantSupportedCheck) → skip (not in stepper)
        // Step 6 (DentureArchSelection) → stepper id: 3 (Arch)
        // Steps 7-13 COMMENTED OUT: Denture Type, Smile Style, Festooning, Settings, Functional Preferences, Design Preview
        // Step 14 (OptionalPhotos) → stepper id: 4 (Photos)
        // Step 15 (DentureReviewSummary) → stepper id: 5 (Review)
        const fullDentureImmediateStepMap: { [key: number]: number } = {
          2: 1, // Item
          3: 2, // Type
          6: 3, // Arch
          // Steps 7-13 commented out (Denture Type, Smile Style, Festooning, Settings, Functional Preferences, Design Preview)
          14: 4, // Photos
          15: 5, // Review
        };
        return fullDentureImmediateStepMap[currentStep] || 1;
      }

      if (selectedOption === "Partial Denture") {
        // Partial Denture flow mapping:
        // Step 2 (Services) → stepper id: 1 (Item)
        // Step 3 (PartialDentureMaterialSelection) → stepper id: 2 (Material)
        // Step 4 (PartialDentureShadeSelection) → stepper id: 3 (Shade) - COMMENTED OUT
        // Step 4 (PartialDentureReplacementCheck) → stepper id: 3 (Replacement) - moved up
        // Photos step is commented out - flow ends at step 4
        const partialStepMap: { [key: number]: number } = {
          2: 1, // Item
          3: 2, // Material
          // 4: 3, // Shade - commented out
          4: 3, // Replacement (moved from step 5)
          14: 4, // Photos
          15: 5, // Review
        };
        return partialStepMap[currentStep] || 1;
      }

      const isOverdentureReline = selectedOption === "Overdenture" && dentureType === "Reline";
      const supportType = watch("overdentureSupportType");
      const isOverdentureRelineImplant = isOverdentureReline && supportType === "Implant-supported";

      if (isOverdentureRelineImplant) {
        // Overdenture + Reline + Implant-supported flow mapping:
        // Step 2 (Services) → stepper id: 1 (Item)
        // Step 3 (DentureTypeSelection) → stepper id: 2 (Type)
        // Step 4 (OverdentureRelineImplantCheck) → stepper id: 3 (Reline Check)
        // Step 5 (OverdentureSupportTypeSelection) → stepper id: 4 (Support Type)
        // Step 6 (OverdentureImplantLocationSelection) → stepper id: 5 (Implant Locations)
        // Step 7 (OverdentureImplantDetails) → stepper id: 6 (Implant Details)
        // Step 8 (OverdentureRelineArchSelection) → stepper id: 7 (Arch Selection) - needs to be added to stepper
        const overdentureRelineImplantStepMap: { [key: number]: number } = {
          2: 1, // Item
          3: 2, // Type
          4: 3, // Reline Check
          5: 4, // Support Type
          6: 5, // Implant Locations
          7: 6, // Implant Details
          8: 7, // Arch Selection
        };
        return overdentureRelineImplantStepMap[currentStep] || 1;
      }

      if (isOverdentureReline) {
        // Overdenture + Reline (Tooth-supported) flow mapping:
        // Step 2 (Services) → stepper id: 1 (Item)
        // Step 3 (DentureTypeSelection) → stepper id: 2 (Type)
        // Step 4 (OverdentureRelineImplantCheck) → stepper id: 3 (Reline Check)
        // Step 5 (OverdentureSupportTypeSelection) → stepper id: 4 (Support Type)
        // Step 6 (OverdentureRelineArchSelection) → stepper id: 5 (Arch Selection) - needs to be added to stepper
        const overdentureRelineStepMap: { [key: number]: number } = {
          2: 1, // Item
          3: 2, // Type
          4: 3, // Reline Check
          5: 4, // Support Type
          6: 5, // Arch Selection
        };
        return overdentureRelineStepMap[currentStep] || 1;
      }
      // Full Denture/Overdenture flow mapping:
      // dentureType is already declared above, reuse it
      if (dentureType === "Conventional" || !dentureType) {
        // For Full Denture/Overdenture Conventional flow:
        // Step 2 (Services) → stepper id: 1 (Item)
        // Step 3 (DentureTypeSelection) → stepper id: 2 (Type)
        // Step 4 (ExistingDentureCheck) → skip (not in stepper)
        // Step 5 (ImplantSupportedCheck) → skip (not in stepper)
        // Step 6 (DentureArchSelection) → stepper id: 3 (Arch)
        // Steps 7-13 COMMENTED OUT: Denture Type, Smile Style, Festooning, Settings, Functional Preferences, Design Preview
        // Step 14 (OptionalPhotos) → stepper id: 4 (Photos)
        // Step 15 (DentureReviewSummary) → stepper id: 5 (Review)
        const conventionalStepMap: { [key: number]: number } = {
          2: 1, // Item
          3: 2, // Type
          6: 3, // Arch
          // Steps 7-13 commented out (Denture Type, Smile Style, Festooning, Settings, Functional Preferences, Design Preview)
          14: 4, // Photos
          15: 5, // Review
        };
        return conventionalStepMap[currentStep] || 1;
      }
      // For other denture types (Reline), use normal flow:
      // Stepper only shows: Item (1), Type (2), Arch (3), Photos (4), Review (5)
      // Intermediate workflow steps 7-12 map to Arch (3) in stepper since they're not shown as separate stepper items
      const stepMap: { [key: number]: number } = {
        2: 1, // Item
        3: 2, // Type
        6: 3, // Arch
        7: 3,  // DentureKindSelection — keep Arch active
        8: 3,  // DentureSmileStyleSelection — keep Arch active
        9: 3,  // DentureFestooningSelection — keep Arch active
        10: 3, // DentureSettingsSelection — keep Arch active
        11: 3, // DentureOtherDetailsSelection — keep Arch active
        12: 3, // (step 12 sub-step) — keep Arch active
        // Step 13 skipped (Design Preview commented out)
        14: 4, // Photos
        15: 5, // Review
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
                dentureType={watch("digitalType")?.[0]}
                overdentureSupportType={watch("overdentureSupportType")}
              />
            </div>
          )}

          <div className="flex-1">{renderStep()}</div>
        </div>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrevious={handleBack}
          onNext={handleNext}
          isSubmitting={createCase.isPending}
        />
      </form>

      {/* Switch to Overdenture Confirmation Modal */}
      <SwitchToOverdentureModal
        isOpen={showSwitchToOverdentureModal}
        onConfirm={() => {
          // When confirmed, update the form to reflect overdenture selection
          // and proceed to support type selection
          setShowSwitchToOverdentureModal(false);
          // The flow will continue to step 5 (OverdentureSupportTypeSelection)
          // We can trigger next step or update form state as needed
          setCurrentStep(5);
        }}
        onCancel={() => setShowSwitchToOverdentureModal(false)}
      />

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

      {/* Overdenture Reline Added Modal */}
      {showOverdentureRelineAddedModal && selectedOption === "Overdenture" && (
        <OverdentureRelineAddedModal
          isOpen={showOverdentureRelineAddedModal}
          patientName={watch("patientName") || "Training"}
          onStartScanning={() => {
            setShowOverdentureRelineAddedModal(false);
            // Reset form and navigate to cases list after scanning
            setAttachments([]);
            reset(CASE_FORM_DEFAULT_VALUES);
            setSelectedOption(null);
            setCurrentStep(1);
            navigate("/cases");
          }}
          onAddAnotherItem={() => {
            setShowOverdentureRelineAddedModal(false);
            // Reset form and go back to item selection
            reset(CASE_FORM_DEFAULT_VALUES);
            setSelectedOption(null);
            setCurrentStep(2);
          }}
          onEdit={() => {
            setShowOverdentureRelineAddedModal(false);
            // Go back to the last step to allow editing
            const dentureType = watch("digitalType")?.[0];
            const supportType = watch("overdentureSupportType");
            if (dentureType === "Reline") {
              if (supportType === "Implant-supported") {
                setCurrentStep(8); // Go back to arch selection step
              } else {
                setCurrentStep(6); // Go back to arch selection step
              }
            }
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
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 bg-white flex flex-col items-center transition-colors ${dragOver ? "border-[#0B75C9] bg-[#f0f8ff]" : "border-[#d6dde6]"
              }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload photos & files
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here or click to browse. You can select multiple files.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Supported: Images (JPG, PNG, GIF), PDF, STL, 7-Zip
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
                accept=".jpg,.jpeg,.png,.gif,.pdf,.stl,.7z,.zip,image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>
            {uploadError && (
              <p className="text-sm text-red-600 mt-4">{uploadError}</p>
            )}
            {!uploadError && uploading && (
              <p className="text-sm text-gray-600 mt-4">Uploading...</p>
            )}
            <p className="text-xs text-gray-500 mt-4">Maximum Size: 500 MB per file</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cases;
