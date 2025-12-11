import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import type { QC } from "../interfaces/interfaces";
import { confirmationMessage } from "../components/common/ToastMessage";
import { useShowErrorMessage } from "../components/common/ShowErrorMessage";


const useQC = () => {
    const { request } = useAuth();
    const showErrorMessage = useShowErrorMessage();
    const queryClient =  useQueryClient();
  
    const qcListQuery = useQuery({
      queryKey: ["qc-list"],
      queryFn: async () => request.get("/qc/list").then((res) => res.data),
      refetchOnWindowFocus: false,
    });
  
    const addQc = useMutation({
      mutationFn: async (payload: QC) => request.post("/qc/add", payload).then((res) => res.data),
      onSuccess: () => {
        confirmationMessage("QC account created successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["qc-list"] });

    },
      onError: (error: any) =>
        showErrorMessage(
          error?.response?.data?.message || error?.response?.data?.error || "Unable to create QC account"
        ),
    });
  
    const updateQc = useMutation({
      mutationFn: async ({ id, payload }: { id: string | number; payload: QC }) =>
        request.put(`/qc/update/${id}`, payload).then((res) => res.data),
      onSuccess: () => {
        confirmationMessage("QC updated successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["qc-list"] });

    },
      onError: (error: any) =>
        showErrorMessage(
          error?.response?.data?.message || error?.response?.data?.error || "Unable to update QC info"
        ),
    });
  
    const deleteQc = useMutation({
      mutationFn: async (id: string | number) => request.delete(`/qc/delete/${id}`).then((res) => res.data),
      onSuccess: () => {
        confirmationMessage("QC deleted successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["qc-list"] });

    },
      onError: (error: any) =>
        showErrorMessage(
          error?.response?.data?.message || error?.response?.data?.error || "Unable to delete QC"
        ),
    });
  
    return {
      addQc,
      updateQc,
      deleteQc,
      qcList: qcListQuery.data,
      qcLoading: qcListQuery.isLoading,
      qcError: qcListQuery.error,
      qcRefetch: qcListQuery.refetch,
    };
  };

  export default useQC;
