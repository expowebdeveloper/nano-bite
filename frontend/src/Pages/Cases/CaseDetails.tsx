import { Link, useParams } from "react-router-dom";
import useCases from "../../hooks/useCases";
import useUploads from "../../hooks/useUploads";
import {  useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../../components/common/Buttons/Button";
import Modal from "../../components/common/Modal/Modal";
import { confirmationMessage } from "../../components/common/ToastMessage";
import { useSelector } from "react-redux";
import { ChangeEvent } from "react";
import { CaseAttachment } from "../../interfaces/types";


const CaseDetails = () => {
    const { user } = useSelector((state: any) => state.user);

  const { caseId } = useParams();
      const {
  caseDetailsQuery,
  updateCaseStatus,
  designerAttachmentsQuery,
  uploadDesignerAttachments,
} = useCases();

const {
  uploadFile,
  uploading,
  getDownloadUrl,
} = useUploads();
const { data: designerAttachmentsData } =
  designerAttachmentsQuery(caseId);

  const { data, isLoading, error } = caseDetailsQuery(caseId);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [attachments, setAttachments] = useState<CaseAttachment[]>([]);

  
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
  console.log("c>>>>>>>>>>>>>>>>>>>>>>>>alled")
  if (!record?.caseId) return;

  const nextStatus = getNextStatus(record.status);
  if (!nextStatus) return;

  updateCaseStatus.mutate({
    caseId: record.caseId,
    status: nextStatus,
  });
};



  const record = data;

  const hasValue = (value: any) => {
    if (Array.isArray(value)) return value.length > 0;
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  };

  const formatValue = (value: any) => {
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
      { label: "Bruxism", value: record.bruxism },
    ]);

    addSection("Esthetics & Notes", [
      { label: "Smile Style", value: record.smileStyle },
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
      "Partial Denture",
      [
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
      return "Design Complete?";
    case "QC":
      return "Assign To QC";
      
   
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
          
                            {user?.role === "Designer" &&   (record?.status === "Assigned" ||
   record?.status === "In Design" ||
   record?.status === "QC") && <button className="px-10 py-3 top-[94px] left-[1681px] rounded-md text-white bg-[#2B89D2] opacity-100"
                            onClick={handleUpdateStatus}
                            >
  {getStatusButtonText(record?.status)}
</button>}

              
       
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
              ) : (
                <p className="text-sm text-gray-600">No attachments</p>
              )}
              <p className="text-xs text-gray-500">
                STL preview: browsers need a 3D viewer (e.g., three.js + STLLoader). For now, download the STL and open in your preferred viewer.
              </p>
            </div>
         {(record.status === "In Design"||record.status === "QC" )&& <button
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
              Supported: Images (JPG, PNG, GIF), PDF, STL
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
        </div>
      )}
    </div>
  );
};

export default CaseDetails;

