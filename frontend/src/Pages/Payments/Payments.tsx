import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { DollarSign, FileText } from "lucide-react";
import { useAdminPayments } from "../../hooks/usePayment";
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

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

        {/* Balance card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-[#0B75C9]" />
            <h2 className="text-lg font-semibold text-gray-900">Balance</h2>
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
