import { useState } from "react";
import { Edit, Eye, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TableWrapper from "../../components/common/Table/TableWrapper";
import Pagination from "../../components/common/Pagination/Pagination";
import usePagination from "../../hooks/usePagination";
import { ITEMS_PER_PAGE } from "../../Constants/Constants";
import useCases from "../../hooks/useCases";
import ScreenLoader from "../../components/common/ScreenLoader/ScreenLoader";
import { useSelector } from "react-redux";
import useUser from "../../hooks/useUser";
import { useShowErrorMessage } from "../../components/common/ShowErrorMessage";
import Button from "../../components/common/Buttons/Button";
import Modal from "../../components/common/Modal/Modal";

const TABLE_HEADER = [
  "Case ID",
  "Patient Name",
  "Case Type",
  "Status",
  "Due Date",
  "Dentist",
  "Last Updated",
  "Action",
];

const CasesList = () => {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState({ open: false, caseID: "" });
  const { page, onPageChange, setPage } = usePagination();
  const navigate = useNavigate();
  const { casesListQuery } = useCases({
    page,
    limit: ITEMS_PER_PAGE,
    search: search.trim() || undefined,
  });
  const listResult = casesListQuery.data;
  const cases = listResult?.data ?? [];
  const totalData = listResult?.total ?? 0;
  const { user } = useSelector((state: any) => state.user);
  const { designersQuery } = useUser();
  const { assignCase } = useUser();
  const [selectedDesignerId, setSelectedDesignerId] = useState<string>("");
  const [selectedQcId, setSelectedQcId] = useState<string>("");
  const showErrorMessage = useShowErrorMessage();
  const designersData = (designersQuery.data as any) ?? {};
  const designers = designersData.designers ?? [];
  const qcs = designersData.qcs ?? [];

  const handleAssign = () => {
    if (!selectedDesignerId || !selectedQcId) {
      showErrorMessage("Please select both designer and QC before assigning.");
      return;
    }
    assignCase.mutate({
      caseId: showAddModal.caseID,
      designerId: selectedDesignerId,
      qcId: selectedQcId,
    });
    setShowAddModal({ open: false, caseID: "" });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower.includes("completed") || statusLower.includes("approved")) {
      return "bg-green-100 text-green-700";
    }
    if (statusLower.includes("design") || statusLower.includes("review")) {
      return "bg-blue-100 text-blue-700";
    }
    if (statusLower.includes("submitted")) {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Cases</h1>
      <div className="bg-white rounded-3xl shadow-md border border-[#eaf4fb] p-6">
        {casesListQuery.isLoading && <ScreenLoader isLoading={true} />}

        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by Case ID, Patient, Type, or Status"
                className="h-10 w-64 rounded-lg border border-[#d9e8f5] bg-white pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0b75c9]/30"
              />
            </div>
            {user.role === "Dentist" && (
              <button
                onClick={() => navigate("/cases/create")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0b75c9] px-4 py-2 text-white text-sm font-semibold shadow-sm hover:bg-[#0a69b5] transition-colors"
              >
                <Plus size={16} />
                New Case
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl overflow-x-auto">
          <TableWrapper tableHeader={TABLE_HEADER}>
            {casesListQuery.isLoading ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-gray-500"
                  colSpan={TABLE_HEADER.length}
                >
                  Loading cases...
                </td>
              </tr>
            ) : casesListQuery.isError ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-red-500"
                  colSpan={TABLE_HEADER.length}
                >
                  Failed to load cases. Please try again.
                </td>
              </tr>
            ) : cases.length ? (
              cases.map((caseItem:any, index:number) => {
                const isStriped = index % 2 === 0;
                return (
                  <tr
                    key={caseItem.caseId || caseItem.id}
                    className={`${
                      isStriped ? "bg-[#F6FDFF]" : "bg-[#fafafa]"
                    } hover:bg-[#eef7ff] transition-colors`}
                  >
                    <td className="px-4 py-3 text-[15px] text-gray-800 font-medium">
                      {caseItem.caseId || "—"}
                    </td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {caseItem.patientName || "—"}
                    </td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {caseItem.caseType || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          caseItem.status
                        )}`}
                      >
                        {caseItem.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {formatDate(caseItem.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {caseItem.createdBy?.fullName || "—"}
                    </td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {formatDate(caseItem.updatedAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3 flex-nowrap">
                        <Link
                          to={`/cases/${caseItem.caseId || caseItem.id}`}
                          className="p-2 rounded-lg text-[#0B75C9] hover:bg-[#e8f4ff] transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => navigate(`/cases/${caseItem.caseId || caseItem.id}`)}
                          className="p-2 rounded-lg text-[#7c3aed] hover:bg-[#ebddff] transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        {caseItem.status !== "Assigned" && user?.role === "ADMIN" && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowAddModal({
                                open: true,
                                caseID: caseItem.caseId || caseItem.id,
                              })
                            }
                            className="inline-flex items-center gap-2 underline rounded-lg px-2 py-2 text-sm"
                          >
                            Assign Designer & QC
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-gray-500"
                  colSpan={TABLE_HEADER.length}
                >
                  {search
                    ? "No cases found matching your search."
                    : "No cases found. Create your first case to get started."}
                </td>
              </tr>
            )}
          </TableWrapper>
        </div>
        <div className="mt-4">
          <Pagination
            onPageChange={onPageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalData={totalData}
            currentPage={page}
          />
        </div>
      </div>
      <Modal
        widthClass="max-w-3xl"
        open={showAddModal.open}
        onClose={() => {
          setShowAddModal({ open: false, caseID: "" });
          setSelectedDesignerId("");
          setSelectedQcId("");
        }}
        title="Assign Designer & QC"
      >
        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Designer <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full  rounded-md p-2"
              value={selectedDesignerId}
              onChange={(e) => setSelectedDesignerId(e.target.value)}
            >
              <option value="">Select Designer</option>
              {designers.map((designer: any) => {
                const name =
                  [designer.first_name, designer.last_name].filter(Boolean).join(" ").trim() ||
                  designer.fullName ||
                  designer.email;
                return (
                  <option key={designer.id} value={designer.id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select QC <span className="text-red-500">*</span>
            </label>

            <select
              className="w-full  rounded-md p-2"
              value={selectedQcId}
              onChange={(e) => setSelectedQcId(e.target.value)}
            >
              <option value="">Select QC </option>
              {qcs.map((qc: any) => {
                const name =
                  [qc.first_name, qc.last_name].filter(Boolean).join(" ").trim() ||
                  qc.fullName ||
                  qc.email;
                return (
                  <option key={qc.id} value={qc.id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mt-10 flex justify-center gap-3">
            <Button
              btnType="button"
              btnText="Assign"
              customClass="px-14 py-3 bg-blue-600 text-white bg-[#C9C9C9] rounded-md "
              btnClick={handleAssign}
              btnLoader={assignCase.isPending}
              disable={!selectedDesignerId || !selectedQcId || assignCase.isPending}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CasesList;
