import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { confirmationMessage } from "../components/common/ToastMessage";
import { useShowErrorMessage } from "../components/common/ShowErrorMessage";
import type { CaseRecord } from "../interfaces/types";
import { useSelector } from "react-redux";

const useCases = () => {
  const { request } = useAuth();
  const showErrorMessage = useShowErrorMessage();
  const queryClient = useQueryClient();
  const { user } = useSelector((state: any) => state.user);

  const createCase = useMutation({
    mutationFn: async (
      payload: Partial<CaseRecord> & { attachments?: CaseRecord["attachments"] }
    ) => {
      const response = await request.post("/cases/", payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      confirmationMessage("Case submitted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (error: any) => {
      showErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to submit case"
      );
    },
  });

  const casesListQuery = useQuery({
    queryKey: ["cases"],
    queryFn: async (): Promise<CaseRecord[]> => {
      console.log("User Role:", user?.role);

      // const isPrivilegedUser = ["ADMIN", "QC"].includes(user?.role);

      // const response = isPrivilegedUser
      //   ? await request.get("/cases/admin/all")
      //   : await request.get("/cases/");


      let url = "/cases"; // default (Dentist)

    if (["ADMIN", "QC"].includes(user?.role)) {
      url = "/cases/admin/all";
    } else if (user?.role === "Designer") {
      url = "/cases/designer";
    }
    const response = await request.get(url);

      return response.data?.data ?? [];
    },
    refetchOnWindowFocus: false,
  });

  const caseDetailsQuery = (caseId?: string) =>
    useQuery({
      enabled: !!caseId,
      queryKey: ["cases", caseId],
      queryFn: async (): Promise<CaseRecord> => {
        const response = await request.get(`/cases/${caseId}`);
        return response.data?.data;
      },
      refetchOnWindowFocus: false,
    });


    const updateCaseStatus = useMutation({
  mutationFn: async ({
    caseId,
    status,
  }: {
    caseId: string;
    status: string;
  }) => {
    const response = await request.patch(
      `/cases/${caseId}/status`,
      { status }
    );
    return response.data;
  },
  onSuccess: () => {
    confirmationMessage("Case status updated successfully", "success");
    queryClient.invalidateQueries({ queryKey: ["cases"] });
  },
  onError: (error: any) => {
    showErrorMessage(
      error?.response?.data?.message ||
        "Failed to update case status"
    );
  },
});

  const designerAttachmentsQuery = (caseId?: string) =>
    useQuery({
      enabled: !!caseId,
      queryKey: ["cases", caseId, "designer-attachments"],
      queryFn: async () => {
        const response = await request.get(
          `/cases/${caseId}/designer-attachments`
        );
        return response.data?.data;
      },
      refetchOnWindowFocus: false,
    });

const uploadDesignerAttachments = useMutation({
  mutationFn: async ({
    caseId,
    attachments,
  }: {
    caseId: string;
    attachments: any[];
  }) => {
    const response = await request.post(
      "/cases/designer-attachments",
      {
        caseId,
        designerId: user.id,
        attachments,
      }
    );
    return response.data;
  },
  onSuccess: () => {
    confirmationMessage("Files saved successfully", "success");
    queryClient.invalidateQueries({
      queryKey: ["cases", caseId, "designer-attachments"],
    });
  },
  onError: (error: any) => {
    showErrorMessage(
      error?.response?.data?.message || "Upload failed"
    );
  },
});

  return {
    createCase,
    casesListQuery,
    caseDetailsQuery,
    updateCaseStatus,designerAttachmentsQuery,uploadDesignerAttachments
  };
};

export default useCases;
