import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { confirmationMessage } from "../components/common/ToastMessage";
import { useShowErrorMessage } from "../components/common/ShowErrorMessage";
import type { CaseRecord } from "../interfaces/types";

const useCases = () => {
  const { request } = useAuth();
  const showErrorMessage = useShowErrorMessage();
  const queryClient = useQueryClient();

  const createCase = useMutation({
    mutationFn: async (payload: Partial<CaseRecord> & { attachments?: CaseRecord["attachments"] }) => {
      const response = await request.post("/cases/", payload);
      return response.data?.data ?? response.data;
    },
    onSuccess: () => {
      confirmationMessage("Case submitted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (error: any) => {
      showErrorMessage(
        error?.response?.data?.message || error?.response?.data?.error || "Unable to submit case"
      );
    },
  });

  const casesListQuery = useQuery({
    queryKey: ["cases"],
    queryFn: async (): Promise<CaseRecord[]> => {
      const response = await request.get("/cases/");
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

  return {
    createCase,
    casesListQuery,
    caseDetailsQuery,
  };
};

export default useCases;

