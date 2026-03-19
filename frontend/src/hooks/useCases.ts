import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { confirmationMessage } from "../components/common/ToastMessage";
import { useShowErrorMessage } from "../components/common/ShowErrorMessage";
import type { CaseRecord } from "../interfaces/types";
import { useSelector } from "react-redux";

export type CasesListParams = {
  page?: number;
  limit?: number;
  search?: string;
  calendarYear?: number;
  calendarMonth?: number;
};

export type CalendarCase = {
  caseId: string;
  dueDate: string;
  patientName: string;
  status: string;
  caseType?: string;
};

const useCases = (params?: CasesListParams) => {
  const { request } = useAuth();
  const showErrorMessage = useShowErrorMessage();
  const queryClient = useQueryClient();
  const { user } = useSelector((state: any) => state.user);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = params?.search ?? "";
  const calendarYear = params?.calendarYear;
  const calendarMonth = params?.calendarMonth;

  /*
  const LOCAL_STORAGE_KEY = "nano-bite-cases";

  const getLocalCases = (): CaseRecord[] => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const saveLocalCase = (newCase: any) => {
    const cases = getLocalCases();
    // Generate a mock ID and timestamps if not present
    const caseWithId = {
      ...newCase,
      id: newCase.id || Math.random().toString(36).substr(2, 9),
      caseId: newCase.caseId || `CASE-${Date.now().toString().slice(-6)}`,
      status: "Submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Mock due date 7 days from now
      createdBy: user,
    };
    cases.unshift(caseWithId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cases));
    return caseWithId;
  };
  */

  const createCase = useMutation({
    mutationFn: async (
      payload: Partial<CaseRecord> & { attachments?: CaseRecord["attachments"] }
    ) => {
      // Mocking API call latency
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // return saveLocalCase(payload);
      const response = await request.post("/cases/", payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: (_data, variables) => {
      // Don't show toast for Partial Denture - modal will be shown instead
      if (variables.caseType !== "Partial Denture") {
        confirmationMessage("Case submitted successfully", "success");
      }
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
    queryKey: ["cases", page, limit, search],
    queryFn: async () => {
      let url = "/cases";
      if (user?.role === "ADMIN") {
        url = "/cases/admin/all";
      } else if (user?.role === "QC") {
        url = "/cases/qc";
      } else if (user?.role === "Designer") {
        url = "/cases/designer";
      }
      const response = await request.get(url, {
        params: { page, limit, ...(search ? { search } : {}) },
      });
      const data = response.data?.data ?? [];
      const total = response.data?.total ?? data.length;
      return {
        data,
        total,
        submittedCount: response.data?.submittedCount,
        inDesignCount: response.data?.inDesignCount,
        completedCount: response.data?.completedCount,
      };
    },
    refetchOnWindowFocus: false,
  });

  const calendarCasesQuery = useQuery({
    queryKey: ["cases", "calendar", calendarYear, calendarMonth],
    queryFn: async (): Promise<CalendarCase[]> => {
      const y = calendarYear ?? new Date().getFullYear();
      const m = calendarMonth ?? new Date().getMonth() + 1;
      const response = await request.get("/cases/calendar", { params: { year: y, month: m } });
      return response.data?.data ?? [];
    },
    enabled: typeof calendarYear === "number" && typeof calendarMonth === "number",
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
      qcComment,
    }: {
      caseId: string;
      status: string;
      qcComment?: string;
    }) => {
      const response = await request.patch(`/cases/${caseId}/status`, {
        status,
        qcComment,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      confirmationMessage("Case status updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      if (variables.caseId) {
        queryClient.invalidateQueries({ queryKey: ["cases", variables.caseId] });
        queryClient.invalidateQueries({
          queryKey: ["cases", variables.caseId, "designer-attachments"],
        });
      }
    },
    onError: (error: any) => {
      showErrorMessage(
        error?.response?.data?.message || "Failed to update case status"
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
      const response = await request.post("/cases/designer-attachments", {
        caseId,
        designerId: user.id,
        attachments,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      confirmationMessage("Files saved successfully", "success");
      queryClient.invalidateQueries({
        queryKey: ["cases", variables.caseId, "designer-attachments"],
      });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (error: any) => {
      showErrorMessage(error?.response?.data?.message || "Upload failed");
    },
  });

  const markCasePaid = useMutation({
    mutationFn: async (caseId: string) => {
      const response = await request.patch(`/cases/${caseId}/payment`);
      return response.data;
    },
    onSuccess: (_data, caseId) => {
      confirmationMessage("Payment recorded. You can now download the files.", "success");
      queryClient.invalidateQueries({ queryKey: ["cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (error: any) => {
      showErrorMessage(
        error?.response?.data?.message || "Failed to update payment status"
      );
    },
  });

  return {
    createCase,
    casesListQuery,
    calendarCasesQuery,
    caseDetailsQuery,
    updateCaseStatus,
    designerAttachmentsQuery,
    uploadDesignerAttachments,
    markCasePaid,
  };
};

export default useCases;
