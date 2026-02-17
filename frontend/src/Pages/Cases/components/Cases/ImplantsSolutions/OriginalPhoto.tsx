import { useRef, ChangeEvent, useState, useEffect } from "react";
import Button from "../../../../../components/common/Buttons/Button";
import useUploads from "../../../../../hooks/useUploads";
import { confirmationMessage } from "../../../../../components/common/ToastMessage";
import { CaseAttachment } from "../../../../../interfaces/types";
import { CommanHeading } from "../../../CommanHeading";

// Helper to determine if a file is an image
const isImage = (file: CaseAttachment) => {
  return file.mime.startsWith("image/") || file.type === "photo";
};

type UploadedPhotoCardProps = {
  file: CaseAttachment;
  onRemove?: () => void;
};

function UploadedPhotoCard({ file }: UploadedPhotoCardProps) {
  const { getDownloadUrl } = useUploads();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUrl = async () => {
      if (isImage(file)) {
        try {
          const url = await getDownloadUrl(file.key);
          if (mounted) setImageUrl(url);
        } catch (err) {
          console.error("Failed to load image url", err);
        }
      }
      if (mounted) setLoading(false);
    };

    fetchUrl();

    return () => {
      mounted = false;
    };
  }, [file.key, getDownloadUrl, file]);

  if (!isImage(file)) {
    return (
      <div className="aspect-[6/7] w-full rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
          <span className="text-blue-600 font-bold text-xs uppercase">{file.type?.substring(0, 3) || 'FIL'}</span>
        </div>
        <p className="text-xs text-gray-700 truncate w-full text-center">{file.name}</p>
      </div>
    );
  }

  return (
    <div
      className="
        aspect-[6/7]
        w-full
        rounded-xl
        border
        border-gray-200
        bg-white
        overflow-hidden
        relative
      "
    >
      {loading ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <span className="text-gray-400 text-xs">Loading...</span>
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={file.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <span className="text-red-400 text-xs">Failed to load</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs truncate">
        {file.name}
      </div>
    </div>
  );
}

interface OptionalPhotosProps {
  setAttachments?: React.Dispatch<React.SetStateAction<CaseAttachment[]>>;
  attachments?: CaseAttachment[];
}

export default function OptionalPhotos({
  setAttachments: parentSetAttachments,
  attachments: parentAttachments,
}: OptionalPhotosProps = {}) {
  const { uploadFile, uploading } = useUploads();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localAttachments, setLocalAttachments] = useState<CaseAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const attachments = parentAttachments || localAttachments;
  const setAttachments = parentSetAttachments || setLocalAttachments;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    try {
      const uploaded = await uploadFile(file);
      setAttachments((prev) => [...prev, uploaded]);
      confirmationMessage("File uploaded successfully", "success");
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

  return (
    <div className="space-y-4">
      {/* Heading */}

      <CommanHeading
        caseName="Adding an Implant Restoration"
        titleName="Optional Photos"
      />

      {/* Cards */}
      {attachments.length > 0 ? (
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
        >
          {attachments.map((file, idx) => (
            <UploadedPhotoCard key={file.key || idx} file={file} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No photos uploaded yet.</p>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Images
        </h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Upload any relevant images for the implant restoration.
        </p>

        <Button
          btnType="button"
          btnText={uploading ? "Uploading..." : "Browse Files"}
          customClass="!py-3 !px-6 rounded-lg bg-white text-[#0B75C9] border border-[#0B75C9] hover:bg-blue-50 font-medium"
          backGround={false}
          border={false}
          btnClick={() => fileInputRef.current?.click()}
          disable={uploading}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {uploadError && (
          <p className="text-sm text-red-600 mt-4">{uploadError}</p>
        )}
      </div>
    </div>
  );
}
