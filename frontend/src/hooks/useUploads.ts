import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { useShowErrorMessage } from "../components/common/ShowErrorMessage";
import type { CaseAttachment, CaseAttachmentType } from "../interfaces/types";

const inferCategory = (file: File): CaseAttachmentType | null => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (file.type.startsWith("image/")) return "photo";
  if (file.type === "application/pdf" || extension === "pdf") return "pdf";
  if (extension === "stl") return "stl";

  return null;
};

const toPublicUrl = (bucket: string, key: string) =>
  `https://${bucket}.s3.amazonaws.com/${key}`;

const useUploads = () => {
  const { request } = useAuth();
  const showErrorMessage = useShowErrorMessage();

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<CaseAttachment> => {
      const category = inferCategory(file);
      if (!category) {
        throw new Error("Unsupported file type. Use images, PDF, or STL.");
      }

      const presignResponse = await request.post("/uploads/presign", {
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileCategory: category,
        contentLength: file.size,
      });

      const presignData = presignResponse.data?.data;

      if (!presignData?.url || !presignData?.key || !presignData?.bucket) {
        throw new Error("Invalid presign response from server.");
      }

      await axios.put(presignData.url, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      return {
        type: category,
        name: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
        key: presignData.key,
        url: toPublicUrl(presignData.bucket, presignData.key),
      };
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Upload failed. Please try again.";
      showErrorMessage(message);
    },
  });

  return {
    uploadFile: uploadMutation.mutateAsync,
    uploading: uploadMutation.isPending,
    getDownloadUrl: async (key: string) => {
      try {
        const response = await request.post("/uploads/presign/get", { key });
        const url = response.data?.data?.url;
        if (!url) {
          throw new Error("Download URL not available.");
        }
        return url as string;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Unable to generate download link.";
        showErrorMessage(message);
        throw error;
      }
    },
  };
};

export default useUploads;

