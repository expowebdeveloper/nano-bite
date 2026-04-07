import { useMutation, useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { useShowErrorMessage } from "../components/common/ShowErrorMessage";

export type CreateCheckoutSessionParams = {
  caseId: string;
  amountInCents?: number;
  successUrl?: string;
  cancelUrl?: string;
};

export type PaymentTransaction = {
  id: string;
  caseId: string;
  amountInCents: number;
  currency: string;
  stripeSessionId: string | null;
  invoiceId: string | null;
  invoiceUrl: string | null;
  paidById: string | null;
  paidBy?: {
    fullName: string | null;
  };
  createdAt: string;
  caseRecord?: {
    caseId: string;
    patientName: string | null;
    caseType: string | null;
    status: string | null;
  };
};

export type BalanceResponse = {
  success: boolean;
  totalAmountCents: number;
  totalAmount: string;
  transactionCount: number;
};

export function usePayment() {
  const { request } = useAuth();
  const showErrorMessage = useShowErrorMessage();

  const createCheckoutSession = useMutation({
    mutationFn: async (params: CreateCheckoutSessionParams) => {
      const response = await request.post("/payments/create-checkout-session", params);
      return response.data as { success: boolean; url?: string; sessionId?: string; message?: string };
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        showErrorMessage(data?.message || "No payment URL returned");
      }
    },
    onError: (error: any) => {
      showErrorMessage(
        error?.response?.data?.message || "Failed to start payment"
      );
    },
  });

  return { createCheckoutSession };
}

export function useAdminPayments(page = 1, limit = 20) {
  const { request } = useAuth();

  const transactionsQuery = useQuery({
    queryKey: ["payments", "transactions", page, limit],
    queryFn: async () => {
      const res = await request.get("/payments/transactions", {
        params: { page, limit },
      });
      return res.data as {
        success: boolean;
        data: PaymentTransaction[];
        total: number;
        page: number;
        limit: number;
      };
    },
  });

  const balanceQuery = useQuery({
    queryKey: ["payments", "balance"],
    queryFn: async () => {
      const res = await request.get("/payments/balance");
      return res.data as BalanceResponse;
    },
  });

  return {
    transactionsQuery,
    balanceQuery,
  };
}
