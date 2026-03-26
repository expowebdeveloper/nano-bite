import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { DollarSign, FileText, AlertCircle } from "lucide-react";
import { useAdminPayments } from "../../hooks/usePayment";
import useCases from "../../hooks/useCases";
import { calculateDenturePrice, formValuesToPricingInput } from "../../utils/denturePricing";
import { useMemo } from "react";
import Pagination from "../../components/common/Pagination/Pagination";
import usePagination from "../../hooks/usePagination";
import { ITEMS_PER_PAGE } from "../../Constants/Constants";

const Payments = () => {
  const { user } = useSelector((state: any) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const { page, onPageChange } = usePagination();
  const { transactionsQuery, balanceQuery } = useAdminPayments(page, ITEMS_PER_PAGE);

  const balance = balanceQuery.data;
  const { data: txData, isLoading: txLoading, isError: txError } = transactionsQuery;
  const transactions = txData?.data ?? [];
  const totalTransactions = txData?.total ?? 0;

  const isDentist = user?.role === "Dentist";
  const { casesListQuery } = useCases({ page: 1, limit: 1000 });

  const amountDue = useMemo(() => {
    if (!casesListQuery.data?.data) return 0;

    let total = 0;
    casesListQuery.data.data.forEach((record: any) => {
      // Amount is due if the case is unpaid and ready/completed.
      if (!record.isPaid && (record.status === "Ready" || record.status === "Completed") && (record.caseType === "Digital Complete Denture" || record.caseType === "Partial Denture")) {
        const selectedOption =
          record.caseType === "Partial Denture"
            ? "Partial Denture"
            : (Array.isArray(record.overdentureImplantLocations)
              ? record.overdentureImplantLocations.length > 0
              : !!record.overdentureImplantLocations) ? "Overdenture" : "Full Denture";

        const input = formValuesToPricingInput(
          {
            dueDate: record.dueDate,
            dentureArch: record.dentureArch,
            hasExistingDenture: record.hasExistingDenture,
            overdentureRelineArch: record.overdentureRelineArch,
            overdentureImplantLocations: record.overdentureImplantLocations,
            partialType: record.partialType,
            partialMaterial: record.partialMaterial,
            dentureBiteAdjustment: record.dentureBiteAdjustment,
            dentureMidlineCorrection: record.dentureMidlineCorrection,
            dentureWantsDesignPreview: record.dentureWantsDesignPreview,
            dentureDesignPreviewAddOns: record.dentureDesignPreviewAddOns,
            dentureOtherDetails: record.dentureOtherDetails,
          },
          selectedOption
        );
        const pricing = calculateDenturePrice(input);
        total += pricing.total;
      }
    });
    return total;
  }, [casesListQuery.data]);

  if (!isAdmin && !isDentist) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Paid card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-[#0B75C9]" />
              <h2 className="text-lg font-semibold text-gray-900">Total Paid</h2>
            </div>
            {balanceQuery.isLoading && (
              <p className="text-sm text-gray-500">Loading balance...</p>
            )}
            {balanceQuery.isError && (
              <p className="text-sm text-red-600">Failed to load balance.</p>
            )}
            {balance && !balanceQuery.isLoading && (
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${balance.totalAmount}
                </span>
                <span className="text-sm text-gray-500">
                  {balance.transactionCount} transaction{balance.transactionCount !== 1 ? "s" : ""} total
                </span>
              </div>
            )}
          </div>

          {/* Amount Due card */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Total Amount Due</h2>
            </div>
            {casesListQuery.isLoading ? (
              <p className="text-sm text-gray-500">Loading amount due...</p>
            ) : casesListQuery.isError ? (
              <p className="text-sm text-red-600">Failed to load amount due.</p>
            ) : (
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900 flex items-center">
                  ${amountDue.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  from unpaid Ready/Completed cases
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#0B75C9]" />
            <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
          </div>
          {txLoading && (
            <p className="text-sm text-gray-500 py-4">Loading transactions...</p>
          )}
          {txError && (
            <p className="text-sm text-red-600 py-4">Failed to load transactions.</p>
          )}
          {!txLoading && !txError && transactions.length === 0 && (
            <p className="text-sm text-gray-500 py-4">No transactions yet.</p>
          )}
          {!txLoading && !txError && transactions.length > 0 && (
            <>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="min-w-[600px] w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Case ID</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Patient</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Invoice</th>
                      <th className="text-right py-3 font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 text-gray-700">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleString(undefined, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                            : "—"}
                        </td>
                        <td className="py-3 text-gray-700 font-mono">{tx.caseId}</td>
                        <td className="py-3 text-gray-700">
                          {tx.caseRecord?.patientName ?? "—"}
                        </td>
                        <td className="py-3 text-gray-700">
                          {tx.caseRecord?.caseType ?? "—"}
                        </td>
                        <td className="py-3 text-gray-700">
                          {tx.invoiceUrl ? (
                            <a
                              href={tx.invoiceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0B75C9] hover:underline font-medium"
                            >
                              View Invoice
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 text-right font-medium text-gray-900">
                          ${((tx.amountInCents || 0) / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalTransactions > ITEMS_PER_PAGE && (
                <div className="mt-4">
                  <Pagination
                    totalData={totalTransactions}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={page}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
