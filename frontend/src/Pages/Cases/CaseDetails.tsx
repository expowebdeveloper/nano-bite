import { Link, useParams } from "react-router-dom";
import useCases from "../../hooks/useCases";
import useUploads from "../../hooks/useUploads";
import { useMemo, useState } from "react";

const CaseDetails = () => {
  const { caseId } = useParams();
  const { caseDetailsQuery } = useCases();
  const { data, isLoading, error } = caseDetailsQuery(caseId);
  const { getDownloadUrl } = useUploads();
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Details</h1>
          <p className="text-sm text-gray-600">Case ID: {caseId}</p>
        </div>
        <Link
          to="/dashboard"
          className="text-sm text-[#0B75C9] hover:underline"
        >
          Back to dashboard
        </Link>
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
              <span className="px-3 py-1 rounded-full bg-[#e8f4ff] text-[#0B75C9] font-semibold">
                {record.status || "Submitted"}
              </span>
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
          </>
        )}
      </div>
    </div>
  );
};

export default CaseDetails;

