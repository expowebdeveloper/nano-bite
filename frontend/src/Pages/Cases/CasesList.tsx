import { use, useEffect, useMemo, useState } from "react";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TableWrapper from "../../components/common/Table/TableWrapper";
import Pagination from "../../components/common/Pagination/Pagination";
import ActionButton from "../../components/common/Buttons/ActionButton";
import usePagination from "../../hooks/usePagination";
import { ITEMS_PER_PAGE } from "../../Constants/Constants";
import useCases from "../../hooks/useCases";
import type { CaseRecord } from "../../interfaces/types";
import ScreenLoader from "../../components/common/ScreenLoader/ScreenLoader";
import { useSelector } from "react-redux";
import useUser from "../../hooks/useUser";
import Button from "../../components/common/Buttons/Button";
import Modal from "../../components/common/Modal/Modal";
import { set } from "react-hook-form";

const TABLE_HEADER = [
  "Case ID",
  "Patient Name",
  "Case Type",
  "Status",
  "Due Date",
  "Last Updated",
  "Action",
];

const CasesList = () => {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState({ open: false, caseID: "" }); //
  const { page, onPageChange, setPage } = usePagination();
  const navigate = useNavigate();
  const { casesListQuery } = useCases();
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const { user } = useSelector((state: any) => state.user);
  const { designersQuery } = useUser();
  const { assignCase } = useUser();
  const [selectedDesignerId, setSelectedDesignerId] = useState<string>("");
  const [selectedQcId, setSelectedQcId] = useState<string>("");

  const handleAssign = () => {
    console.log(showAddModal.caseID, ",>>>>>>>>>>>>");
    assignCase.mutate({
      caseId: showAddModal.caseID,
      designerId: selectedDesignerId,
      qcId: selectedQcId,
    });
    setShowAddModal({ open: false, caseID: "" });
  };

  useEffect(() => {}, [casesListQuery]);

  useEffect(() => {
    if (casesListQuery.data) {
      setCases(casesListQuery.data);
    }
  }, [casesListQuery.data]);

  const filteredCases = useMemo(() => {
    if (!search.trim()) return cases;
    return cases.filter((caseItem) => {
      const haystack = `${caseItem.caseId || ""} ${
        caseItem.patientName || ""
      } ${caseItem.caseType || ""} ${caseItem.status || ""}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [search, cases]);

  const paginatedCases = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredCases.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCases, page]);

  const totalData = filteredCases.length;

  console.log(paginatedCases, "<<<<<<<<<<paginatedCases");
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

  console.log(user);
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

        <div className="overflow-hidden rounded-2xl">
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
            ) : paginatedCases.length ? (
              paginatedCases.map((caseItem, index) => {
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
                      {formatDate(caseItem.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* <Button
            btnType="button"
            btnText={'Assign'}
          customClass="!py-3 !px-8 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white border-none"
          /> */}
                        {caseItem.status !== "Assigned" &&
                          user.role === "ADMIN" && (
                            <button
                              onClick={() =>
                                setShowAddModal({
                                  open: true,
                                  caseID: caseItem.caseId || caseItem.id,
                                })
                              }
                              className="inline-flex items-center gap-2 underline rounded-lg px-2py-2 text-sm  shadow-sm "
                            >
                              Assign Designer & QC
                            </button>
                          )}
                        {caseItem.status == "Assigned" && (
                          <>
                            <Link
                              to={`/cases/${caseItem.caseId || caseItem.id}`}
                              className="p-2 rounded-lg text-[#0B75C9] hover:bg-[#e8f4ff] transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Link>
                            {user.role === "Dentist" && (
                              <ActionButton
                                icon={<Edit size={16} />}
                                btnText="Edit"
                                btnClick={() =>
                                  navigate(
                                    `/cases/${caseItem.caseId || caseItem.id}`
                                  )
                                }
                                customClass="p-2 rounded-lg text-[#7c3aed] hover:bg-[#ebddff] transition-colors"
                              />
                            )}
                            {user.role === "Dentist" && (
                              <ActionButton
                                icon={<Trash2 size={16} />}
                                btnText="Delete"
                                btnClick={() => {
                                  // TODO: Implement delete functionality
                                  console.log("Delete case:", caseItem.caseId);
                                }}
                                customClass="p-2 rounded-lg text-[#dc2626] hover:bg-[#ffdcdc] transition-colors"
                              />
                            )}
                          </>
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
              {designersQuery.data?.designers.map((designer: any) => (
                <option key={designer.id} value={designer.id}>
                  {designer.fullName}
                </option>
              ))}
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
              {designersQuery.data?.qcs.map((qc: any) => (
                <option key={qc.id} value={qc.id}>
                  {qc.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-10 flex justify-center gap-3">
            <Button
              btnType="button"
              btnText="Assign"
              customClass="px-14 py-3 bg-blue-600 text-white bg-[#C9C9C9] rounded-md "
              btnClick={handleAssign}
              hasLoading={assignCase.isLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CasesList;
