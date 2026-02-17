import { useRef, ChangeEvent, useState } from "react";
import Button from "../../../../../components/common/Buttons/Button";
import useUploads from "../../../../../hooks/useUploads";
import { confirmationMessage } from "../../../../../components/common/ToastMessage";
import { CaseAttachment } from "../../../../../interfaces/types";

interface AddingImplantRestorationProps {
    setAttachments?: React.Dispatch<React.SetStateAction<CaseAttachment[]>>;
    attachments?: CaseAttachment[];
}

export default function AddingImplantRestoration({
    setAttachments: parentSetAttachments,
    attachments: parentAttachments,
}: AddingImplantRestorationProps = {}) {
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
        <div className="w-full max-w-xl rounded-xl bg-white space-y-6">

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
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

            {/* List of uploaded files */}
            {attachments.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Uploaded Files</h4>
                    <ul className="space-y-2">
                        {attachments.map((file, idx) => (
                            <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
