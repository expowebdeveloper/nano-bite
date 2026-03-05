import { Edit, EyeIcon, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useCases from "../../hooks/useCases";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination/Pagination";
import { ITEMS_PER_PAGE } from "../../Constants/Constants";

const RecentCasesTable = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const { page, onPageChange } = usePagination();
  const { casesListQuery } = useCases({ page, limit: ITEMS_PER_PAGE });
  const listResult = casesListQuery.data;
  const cases = listResult?.data ?? [];
  const total = listResult?.total ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Recent Cases</h2>
        {user?.role === "Dentist" && (
          <button
            className="bg-[#2B89D2] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={() => navigate("/cases/create")}
          >
            + New Cases
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-t-[15px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2B89D2] text-white">
              <tr className="h-[53px]">
                <th className="px-6 py-4 text-left text-sm font-semibold">Case ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Last Updated</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {casesListQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : cases?.length > 0 ? (
                cases.map((item?:any) => (
                  <tr key={item.caseId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.caseId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.patientName || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/cases/${item.caseId}`}
                          className="text-sm text-[#0B75C9] hover:underline"
                        >
                          <EyeIcon />
                        </Link>
                        <button className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No cases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 px-4 pb-4">
        <Pagination
          onPageChange={onPageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalData={total}
          currentPage={page}
        />
      </div>
    </div>
  );
};

export default RecentCasesTable;
