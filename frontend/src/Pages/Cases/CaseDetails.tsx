import { Link, useParams, useSearchParams } from "react-router-dom";
import useCases from "../../hooks/useCases";
import useUploads from "../../hooks/useUploads";
import { usePayment } from "../../hooks/usePayment";
import { useMemo, useRef, useState, useEffect } from "react";
import { ArrowLeft, Download, Lock } from "lucide-react";
import Button from "../../components/common/Buttons/Button";
import Modal from "../../components/common/Modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import { confirmationMessage } from "../../components/common/ToastMessage";
import { useSelector } from "react-redux";
import { ChangeEvent } from "react";
import { StlViewer } from "../../components/common/StlViewer/StlViewer";
import type { CaseAttachment, CaseRecord } from "../../interfaces/types";
import { calculateDenturePrice, formValuesToPricingInput } from "../../utils/denturePricing";


const CaseDetails = () => {
  const { user } = useSelector((state: any) => state.user);

  const { caseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success" && caseId) {
      confirmationMessage("Payment successful. You can now download the files.", "success");
      queryClient.invalidateQueries({ queryKey: ["cases", caseId] });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, caseId, queryClient, setSearchParams]);
  const {
    caseDetailsQuery,
    updateCaseStatus,
    designerAttachmentsQuery,
    uploadDesignerAttachments,
  } = useCases();

  const { uploadFile, uploading, getDownloadUrl } = useUploads();
  const { createCheckoutSession } = usePayment();
  const { data: designerAttachmentsData } =
    designerAttachmentsQuery(caseId);

  const { data, isLoading, error } = caseDetailsQuery(caseId);
  const record = data as CaseRecord | undefined;

  // Stripe amount must match the same pricing logic shown to the lab owner.
  // Without this, the UI estimate can be $160 but Stripe charges $100 (hardcoded).
  const denturePricingForPayment = useMemo(() => {
    if (!record) return null;
    if (record.caseType !== "Digital Complete Denture" && record.caseType !== "Partial Denture") {
      return null;
    }

    const selectedOption =
      record.caseType === "Partial Denture"
        ? "Partial Denture"
        : (Array.isArray(record.overdentureImplantLocations)
          ? record.overdentureImplantLocations.length > 0
          : !!record.overdentureImplantLocations) ? "Overdenture" : "Full Denture";

    const input = formValuesToPricingInput(
      {
        dueDate: record.dueDate,
        dentureArch: record.dentureArch,
        hasExistingDenture: record.hasExistingDenture,
        overdentureRelineArch: record.overdentureRelineArch,
        overdentureImplantLocations: record.overdentureImplantLocations,
        partialType: record.partialType,
        partialMaterial: record.partialMaterial,
        dentureBiteAdjustment: record.dentureBiteAdjustment,
        dentureMidlineCorrection: record.dentureMidlineCorrection,
        dentureWantsDesignPreview: record.dentureWantsDesignPreview,
        dentureDesignPreviewAddOns: record.dentureDesignPreviewAddOns,
        dentureOtherDetails: record.dentureOtherDetails,
      },
      selectedOption
    );

    const pricing = calculateDenturePrice(input);
    const totalCents = Math.round(pricing.total * 100);
    return {
      pricing,
      totalCents,
    };
  }, [record]);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<CaseAttachment[]>([]);
  const [qcComment, setQcComment] = useState("");
  const [stlUrls, setStlUrls] = useState<Record<string, string>>({});

  const allAttachments = [
    ...(record?.attachments || []),
    ...(designerAttachmentsData?.designersAttachments || []),
    ...attachments,
  ];

  useEffect(() => {
    const stlFiles = allAttachments.filter(
      (f) => f.type === "stl" && f.key && !stlUrls[f.key]
    );
    if (stlFiles.length === 0) return;

    let cancelled = false;
    const resolve = async () => {
      for (const file of stlFiles) {
        if (cancelled) break;
        try {
          // Always use presigned URL for STL so private S3 buckets work (direct file.url would 403)
          const url = await getDownloadUrl(file.key);
          if (!cancelled) {
            setStlUrls((prev) => ({ ...prev, [file.key]: url }));
          }
        } catch {
          // skip files that fail to resolve
        }
      }
    };
    resolve();
    return () => { cancelled = true; };
  }, [record?.attachments, designerAttachmentsData?.designersAttachments, attachments]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];



    if (!file) return;

    setUploadError(null);

    try {
      const uploaded = await uploadFile(file);
      const base =
        attachments.length > 0
          ? attachments
          : designerAttachmentsData?.designersAttachments || [];
      const nextAttachments = [...base, uploaded];

      if (caseId) {
        await uploadDesignerAttachments.mutateAsync({
          caseId,
          attachments: nextAttachments,
        });
      }

      setAttachments(nextAttachments);
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

  const getNextStatus = (currentStatus?: string) => {
    switch (currentStatus) {
      case "Assigned":
        return "In Design";
      case "In Design":
        return "QC";
      case "QC":
        return "Ready";
      // case "In Design":
      // return "Assigned";
      default:
        return null;
    }
  };

  const handleUpdateStatus = () => {
    if (!record?.caseId) return;

    const nextStatus = getNextStatus(record.status);
    if (!nextStatus) return;

    updateCaseStatus.mutate({
      caseId: record.caseId,
      status: nextStatus,
    });
  };

  const handleQcDecision = async (decision: "approve" | "reject") => {
    if (!record?.caseId) return;
    const targetStatus = decision === "approve" ? "Ready" : "In Design";
    try {
      await updateCaseStatus.mutateAsync({
        caseId: record.caseId,
        status: targetStatus,
        qcComment: qcComment.trim(),
      });
      setQcComment("");
    } catch {
      // errors handled in mutation
    }
  };



  const hasValue = (value: any) => {
    if (typeof value === "boolean") return true;
    if (Array.isArray(value)) return value.length > 0;
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  };

  const formatValue = (value: any) => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
    if (value === null || value === undefined || value === "") return "—";
    return value;
  };

  const sections = useMemo(() => {
    if (!record) return [];
    const ct = record.caseType;
    const results: { title: string; fields: { label: string; value: any }[] }[] = [];

    const addSection = (
      title: string,
      fields: { label: string; value: any }[],
      allowedTypes?: string[]
    ) => {
      if (allowedTypes && ct && !allowedTypes.includes(ct)) return;
      const filtered = fields.filter((f) => hasValue(f.value));
      if (!filtered.length) return;
      results.push({ title, fields: filtered });
    };

    addSection("Case", [
      { label: "Case ID", value: record.caseId },
      { label: "Status", value: record.status },
      { label: "Type", value: record.caseType },
      { label: "Due Date", value: record.dueDate },
      {
        label: "Created",
        value: record.createdAt ? new Date(record.createdAt).toLocaleString() : "—",
      },
      { label: "Doctor Signature", value: record.doctorSignature },
      { label: "Date", value: record.date },
    ]);

    addSection("Patient", [
      { label: "Name", value: record.patientName },
      { label: "Age", value: record.age },
      { label: "Sex", value: record.sex },
    ]);

    addSection("Esthetics & Notes", [
      { label: "Midline", value: record.midline },
      { label: "Esthetic Notes", value: record.estheticNotes },
      { label: "Additional Notes", value: record.additionalNotes },
    ]);

    addSection("Photos & Scans", [
      { label: "Photos", value: record.photos },
      { label: "Scans", value: record.scans },
    ]);

    addSection(
      "Single Crown / Onlay / Veneer",
      [
        { label: "Tooth Type", value: record.toothType },
        { label: "Final Shade", value: record.finalShade },
        { label: "Stump Shade", value: record.stumpShade },
        { label: "Restoration Types", value: record.restorationTypes },
        { label: "Material Options", value: record.materialOptions },
        { label: "Restoration Prep", value: record.restorationPrep },
        { label: "Contacts", value: record.contacts },
        { label: "Occlusion", value: record.occlusion },
        { label: "Required Scans", value: record.requiredScans },
        { label: "Noted", value: record.noted },
      ],
      ["Single Crown / Onlay / Veneer"]
    );

    addSection(
      "Short-span Bridge",
      [
        { label: "Abutments Left", value: record.abutmentsLeft },
        { label: "Abutments Right", value: record.abutmentsRight },
        { label: "Pontic Design", value: record.ponticDesign },
        { label: "Pontic Contacts", value: record.ponticContacts },
        { label: "Pontic Teeth", value: record.ponticTeeth },
        { label: "Bridge Material", value: record.bridgeMaterial },
        { label: "Bridge Required Scans", value: record.bridgeRequiredScans },
      ],
      ["Short-span Bridge"]
    );

    addSection(
      "Implant Crown / Bridge",
      [
        { label: "Brand", value: record.implantBrand },
        { label: "Platform", value: record.implantPlatform },
        { label: "Connection", value: record.implantConnection },
        { label: "Tooth", value: record.implantTooth },
        { label: "Restoration", value: record.implantRestoration },
        { label: "Emergence", value: record.implantEmergence },
        { label: "Required Scans", value: record.implantRequiredScans },
        { label: "Abutment", value: record.implantAbutment },
        { label: "Occlusion", value: record.implantOcclusion },
        { label: "Allowed", value: record.implantAllowed },
      ],
      ["Implant Crown / Implant Bridge"]
    );

    addSection(
      "Full Arch Implant Fixed",
      [
        { label: "Design", value: record.fullArchDesign },
        { label: "Framework", value: record.fullArchFramework },
        { label: "VDO", value: record.fullArchVdo },
        { label: "Occlusion", value: record.fullArchOcc },
        { label: "Tooth Size", value: record.fullArchToothSize },
        { label: "Gingiva", value: record.fullArchGingiva },
        { label: "Midline", value: record.fullArchMidline },
        { label: "Required Scans (Top)", value: record.fullArchRequiredScansTop },
        { label: "Required Scans", value: record.fullArchRequiredScans },
      ],
      ["Full Arch Implant Fixed"]
    );

    addSection(
      "Digital Complete Denture",
      [
        { label: "Type", value: record.digitalType },
        { label: "Arch", value: record.digitalArch },
        { label: "VDO", value: record.digitalVdo },
        { label: "Tooth Setup", value: record.digitalToothSetup },
        { label: "Shade", value: record.digitalShade },
        { label: "Base", value: record.digitalBase },
        { label: "Copy", value: record.digitalCopy },
        { label: "Required Scans", value: record.digitalRequiredScans },
        { label: "New Record", value: record.digitalNewRecord },
        { label: "Changes", value: record.digitalChanges },
      ],
      ["Digital Complete Denture"]
    );

    addSection(
      "Denture (Full / Conventional)",
      [
        { label: "Arch", value: record.dentureArch },
        { label: "Base Shade", value: record.dentureBaseShade },
        { label: "Tissue Shade", value: record.dentureTissueShade },
        { label: "Denture Kind", value: record.dentureKind },
        { label: "Smile Style", value: record.dentureSmileStyle },
        { label: "Festooning Level", value: record.dentureFestooningLevel },
        { label: "Add-ons", value: record.dentureAddOns },
        { label: "Bite Adjustment", value: record.dentureBiteAdjustment },
        { label: "Midline Correction", value: record.dentureMidlineCorrection },
        { label: "Other Details", value: record.dentureOtherDetails },
        { label: "Review Options", value: record.dentureReviewOptions },
        { label: "Design Preview Add-ons", value: record.dentureDesignPreviewAddOns },
        { label: "Rx Instructions", value: record.dentureRxInstructions },
        { label: "Has Existing Denture", value: record.hasExistingDenture },
        { label: "Exact Copy", value: record.isExactCopy },
        { label: "Implant Supported", value: record.isImplantSupported },
        { label: "Wants Add-ons", value: record.dentureWantsAddOns },
        { label: "Has Diastema", value: record.dentureHasDiastema },
        { label: "Diastema Handling", value: record.dentureDiastemaHandling },
        { label: "Wants Design Preview", value: record.dentureWantsDesignPreview },
      ],
      ["Digital Complete Denture"]
    );

    addSection(
      "Overdenture",
      [
        { label: "Scan Method", value: record.overdentureScanMethod },
        { label: "Support Type", value: record.overdentureSupportType },
        { label: "Implant Locations", value: Array.isArray(record.overdentureImplantLocations) ? record.overdentureImplantLocations.join(", ") : record.overdentureImplantLocations },
        { label: "Implant Manufacturer", value: record.overdentureImplantManufacturer },
        { label: "Implant System", value: record.overdentureImplantSystem },
        { label: "Platform Size", value: record.overdentureImplantPlatformSize },
        { label: "Cuff Height", value: record.overdentureImplantCuffHeight },
        { label: "Use Same Implant System", value: record.overdentureUseSameImplantSystem },
        { label: "Reline Arch", value: record.overdentureRelineArch },
      ],
      ["Digital Complete Denture"]
    );

    addSection(
      "Partial Denture",
      [
        { label: "Replacement", value: record.partialIsReplacement },
        { label: "Material", value: record.partialMaterial },
        { label: "Base Shade", value: record.partialBaseShade },
        { label: "Tissue Shade", value: record.partialTissueShade },
        { label: "Type", value: record.partialType },
        { label: "Framework", value: record.partialFramework },
        { label: "Major Connector", value: record.partialMajorConnector },
        { label: "Rests", value: record.partialRests },
        { label: "Shade", value: record.partialShade },
        { label: "Clasps", value: record.partialClasps },
        { label: "Base Areas", value: record.partialBaseAreas },
        { label: "Aesthetics", value: record.partialAesthetics },
        { label: "Required Scans", value: record.partialRequiredScans },
      ],
      ["Partial Denture"]
    );

    return results;
  }, [record, hasValue]);

  const handleDownload = async (key?: string) => {
    if (!key) return;
    try {
      setDownloadingKey(key);
      const url = await getDownloadUrl(key);
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingKey(null);
    }
  };

  const getStatusButtonText = (status?: string) => {
    switch (status) {
      case "Assigned":
        return "Start In Design";
      case "In Design":
        return "Send to QC";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <Link
            to="/dashboard"
            className="text-sm text-[#0B75C9] bg-blue-100 rounded-full p-3"
          >
            <ArrowLeft className="w-5 h-5 text-[#2B89D2]" />

          </Link>


          <div>

            <h1 className="text-2xl font-bold text-gray-900">Case Details</h1>
            <p className="text-sm text-gray-600">Case ID: {caseId}</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-6">
          <span className="px-3 py-1 rounded-full bg-[#e8f4ff] text-[#0B75C9] font-semibold">
            {record?.status}
          </span>

          {user?.role === "Designer" && (record?.status === "Assigned" || record?.status === "In Design") && (
            <button
              className="px-10 py-3 top-[94px] left-[1681px] rounded-md text-white bg-[#2B89D2] opacity-100"
              onClick={handleUpdateStatus}
            >
              {getStatusButtonText(record?.status)}
            </button>
          )}
          {user?.role === "Designer" && record?.status === "QC" && (
            <span className="text-sm text-gray-600">Pending QC review</span>
          )}



        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        {isLoading && <p className="text-sm text-gray-600">Loading case...</p>}
        {error && (
          <p className="text-sm text-red-600">
            Unable to load case. Please try again.
          </p>
        )}
        {!isLoading && record && (
          <>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">

              <span>Type: {record.caseType || "—"}</span>
              <span>Due: {record.dueDate || "—"}</span>
              {record.createdBy?.fullName && (
                <span>Dentist: {record.createdBy.fullName}</span>
              )}
              <span>Created: {record.createdAt ? new Date(record.createdAt).toLocaleString() : "—"}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <div className="space-y-1">
                    {section.fields.map((field) => (
                      <p key={field.label} className="text-sm text-gray-700">
                        <span className="font-semibold">{field.label}:</span> {formatValue(field.value)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
              {record.attachments && record.attachments.length > 0 ? (
                <>
                  <ul className="space-y-3">
                    {record.attachments.map((file) => (
                      <li
                        key={file.key}
                        className="flex items-center justify-between text-sm text-gray-800"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="inline-flex items-center rounded-full bg-[#e8f4ff] px-2 py-1 text-[11px] font-semibold uppercase text-[#0B75C9]">
                            {file.type}
                          </span>
                          <span className="truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                          <button
                            onClick={() => handleDownload(file.key)}
                            className="text-[#0B75C9] hover:underline disabled:opacity-60"
                            disabled={downloadingKey === file.key}
                          >
                            {downloadingKey === file.key ? "Preparing..." : "View / Download"}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Inline STL 3D Previews */}
                  {record.attachments
                    .filter((file) => file.type === "stl" && stlUrls[file.key])
                    .map((file) => (
                      <div key={`stl-preview-${file.key}`} className="mt-4">
                        <StlViewer url={stlUrls[file.key]} fileName={file.name} />
                      </div>
                    ))}
                </>
              ) : (
                <p className="text-sm text-gray-600">No attachments</p>
              )}
            </div>

            {(user.role === "Dentist" || user.role === "ADMIN") &&
              record.isPaid &&
              record.payments?.[0]?.invoiceUrl && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Invoice</h3>
                  <a
                    href={record.payments[0]!.invoiceUrl as string}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#0B75C9] hover:underline font-medium"
                  >
                    View invoice PDF
                  </a>
                </div>
              )}

            {/* Delivered files (QC-approved): Dentist can preview always; download only after payment */}
            {user.role === "Dentist" && (record.status === "Ready" || record.status === "Completed") && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Delivered files (QC-approved)</h3>
                <p className="text-sm text-gray-600">
                  Files are previewed below. Download is available after payment.
                </p>
                {!record.isPaid && (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        createCheckoutSession.mutate({
                          caseId: record.caseId,
                          amountInCents: denturePricingForPayment?.totalCents ?? 10000,
                          successUrl: `${window.location.origin}/cases/${record.caseId}?payment=success`,
                          cancelUrl: `${window.location.origin}/cases/${record.caseId}?payment=cancelled`,
                        })
                      }
                      disabled={createCheckoutSession.isPending}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2B89D2] text-white hover:bg-[#2369a8] disabled:opacity-60 text-sm font-medium"
                    >
                      <Lock size={16} />
                      {createCheckoutSession.isPending
                        ? "Redirecting to payment..."
                        : `Pay now ($${((denturePricingForPayment?.totalCents ?? 10000) / 100).toFixed(2)})`}
                    </button>
                  </div>
                )}
                {(designerAttachmentsData?.designersAttachments?.length ?? 0) > 0 ? (
                  <>
                    <ul className="space-y-3">
                      {(designerAttachmentsData?.designersAttachments ?? []).map((file: CaseAttachment) => (
                        <li
                          key={file.key}
                          className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-800 border border-gray-100 rounded-xl p-3 bg-gray-50/50"
                        >
                          <div className="flex items-center gap-2 truncate min-w-0">
                            <span className="inline-flex rounded-full bg-[#e8f4ff] px-2 py-1 text-[11px] font-semibold uppercase text-[#0B75C9] shrink-0">
                              {file.type}
                            </span>
                            <span className="truncate">{file.name}</span>
                            <span className="text-gray-500 shrink-0">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {record.isPaid ? (
                              <button
                                type="button"
                                onClick={() => handleDownload(file.key)}
                                disabled={downloadingKey === file.key}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B89D2] text-white hover:bg-[#2369a8] disabled:opacity-60 text-sm font-medium"
                              >
                                <Download size={14} />
                                {downloadingKey === file.key ? "Preparing..." : "Download"}
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 text-sm">
                                <Lock size={14} />
                                Pay to download
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {(designerAttachmentsData?.designersAttachments ?? []).filter(
                      (f: CaseAttachment) => f.type === "stl" && stlUrls[f.key]
                    ).length > 0 && (
                        <div className="space-y-2 mt-4">
                          <h4 className="text-sm font-semibold text-gray-700">3D preview</h4>
                          {(designerAttachmentsData?.designersAttachments ?? [])
                            .filter((file: CaseAttachment) => file.type === "stl" && stlUrls[file.key])
                            .map((file: CaseAttachment) => (
                              <div key={`delivered-stl-${file.key}`} className="mt-2">
                                <StlViewer url={stlUrls[file.key]} fileName={file.name} />
                              </div>
                            ))}
                        </div>
                      )}
                  </>
                ) : (
                  <p className="text-sm text-gray-600">No delivered files yet.</p>
                )}
              </div>
            )}

            {record.qcComment && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">QC Comment</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {record.qcComment}
                </p>
              </div>
            )}
            {user.role === "QC" && record.status !== "Ready" && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  QC Review
                </h3>
                <textarea
                  value={qcComment}
                  onChange={(e) => setQcComment(e.target.value)}
                  placeholder="Add review comment (required for reject, optional for approve)"
                  className="w-full min-h-[120px] rounded-xl border border-[#d6dde6] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B75C9]/40"
                />
                <div className="flex gap-3">
                  <button
                    className="px-6 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
                    onClick={() => handleQcDecision("approve")}
                    disabled={updateCaseStatus.isPending}
                  >
                    {updateCaseStatus.isPending ? "Saving..." : "Approve"}
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg bg-red-600 text-white disabled:opacity-60"
                    onClick={() => handleQcDecision("reject")}
                    disabled={updateCaseStatus.isPending || qcComment.trim().length === 0}
                  >
                    {updateCaseStatus.isPending ? "Saving..." : "Reject"}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Reject moves status back to "In Design". Approve moves status to "Ready".
                </p>
              </div>
            )}
            {user.role === "Dentist" && record.status === "Ready" && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Finalize Case
                </h3>
                <p className="text-sm text-gray-700">
                  Confirm you have received the final files to mark this case complete.
                </p>
                <button
                  className="px-6 py-2 rounded-lg bg-[#0B75C9] text-white disabled:opacity-60"
                  onClick={() =>
                    updateCaseStatus.mutate({
                      caseId: record.caseId,
                      status: "Completed",
                    })
                  }
                  disabled={updateCaseStatus.isPending}
                >
                  {updateCaseStatus.isPending ? "Saving..." : "Mark as Completed"}
                </button>
              </div>
            )}
            {(record.status === "In Design" || record.status === "QC") && <button
              className="px-14 py-3 rounded-md border border-[#2B89D2] 
        text-[#2B89D2] bg-transparent opacity-100
        hover:bg-[#2B89D2] hover:text-white transition"
              onClick={() => setShowUploadModal(true)}
            >
              Upload File
            </button>}
          </>
        )}
      </div>
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
              Supported: Images (JPG, PNG, GIF), PDF, STL, 7-Zip
            </p>
            <p className="text-sm text-gray-700 font-semibold mb-4">
              We will request a signed URL and upload directly to S3.
            </p>
            <div className="flex justify-center">
              <Button
                btnType="button"
                btnText={
                  uploading || uploadDesignerAttachments.isPending
                    ? "Uploading..."
                    : "Browse Files"
                }
                customClass="!py-3 !px-6 rounded-lg bg-transparent text-[#0B75C9] border border-[#0B75C9] hover:bg-[#0B75C9] hover:text-white disabled:opacity-60"
                backGround={false}
                border={false}
                btnClick={() => {
                  if (!uploading && !uploadDesignerAttachments.isPending) {
                    fileInputRef.current?.click();
                  }
                }}
                disable={uploading || uploadDesignerAttachments.isPending}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.stl,.7z,.zip"
                onChange={handleFileChange}
              />
            </div>
            {uploadError && (
              <p className="text-sm text-red-600 mt-4">{uploadError}</p>
            )}
            {!uploadError && uploading && (
              <p className="text-sm text-gray-600 mt-4">Uploading...</p>
            )}
            <p className="text-xs text-gray-500 mt-4">Maximum Size: 500 MB</p>
          </div>
        </div>
      </Modal>
      {/* {filesToShow && */}
      {user.role === "Designer" && attachments.length > 0 && (
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

          {/* Inline STL 3D Previews for designer uploads */}
          {attachments
            .filter((item) => item.type === "stl" && stlUrls[item.key])
            .map((item) => (
              <div key={`stl-designer-${item.key}`} className="mt-4">
                <StlViewer url={stlUrls[item.key]} fileName={item.name} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CaseDetails;

