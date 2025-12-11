import { useEffect, useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import TableWrapper from "../../components/common/Table/TableWrapper";
import Pagination from "../../components/common/Pagination/Pagination";
import ActionButton from "../../components/common/Buttons/ActionButton";
import usePagination from "../../hooks/usePagination";
import { ITEMS_PER_PAGE } from "../../Constants/Constants";
import useQC from "../../hooks/useQc";
import Modal from "../../components/common/Modal/Modal";
import AddQC, { type AddQCFormValues } from "./AddQC";

type QcUser = {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  isActive?: boolean;
};

const TABLE_HEADER = [
  "First name",
  "Last name",
  "Email",
  "Phone no.",
  "Status",
  "Action",
];

const QualityControl = () => {
  const [search, setSearch] = useState("");
  const { page, onPageChange, setPage } = usePagination();
  const [showAddModal, setShowAddModal] = useState(false);
  const [qcUsers, setQcUsers] = useState<QcUser[]>([]);
  const [editUser, setEditUser] = useState<QcUser | null>(null);

  const { qcList, qcLoading, qcError, addQc, deleteQc, updateQc } = useQC();

  useEffect(() => {
    if (qcList?.data) {
      setQcUsers(qcList.data);
    } else if (Array.isArray(qcList)) {
      setQcUsers(qcList);
    }
  }, [qcList]);

  useEffect(() => {
    if (addQc.isSuccess) {
      setShowAddModal(false);
    }
  }, [addQc.isSuccess]);



  const filteredUsers = useMemo(() => {
    if (!search.trim()) return qcUsers;
    return qcUsers.filter((user) => {
      const haystack = `${user.first_name || ""} ${user.last_name || ""} ${user.email || ""}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [search, qcUsers]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  const totalData = filteredUsers.length;

  const handleAddSubmit = (values: AddQCFormValues) => {
    console.log(values);
    if (editUser?.id) {
      updateQc.mutate(
        { id: editUser.id, payload: values },
        {
          onSuccess: () => {
            setShowAddModal(false);
            setEditUser(null);
            setPage(1);
            setSearch("");
          },
        }
      );
    } else {
      addQc.mutate(values, {
        onSuccess: () => {
          setShowAddModal(false);
          setPage(1);
          setSearch("");
        },
      });
    }
  };

  const handleDelete = (id?: string | number) => {
    if (!id) return;
    deleteQc.mutate(id);
  };

  const handleEdit = (user: QcUser) => {
    setEditUser(user);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">QC Users</h1>
      <div className="bg-white rounded-3xl shadow-md border border-[#eaf4fb] p-6">
      
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
        
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name"
                className="h-10 w-64 rounded-lg border border-[#d9e8f5] bg-white pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0b75c9]/30"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0b75c9] px-4 py-2 text-white text-sm font-semibold shadow-sm hover:bg-[#0a69b5] transition-colors"
            >
              <Plus size={16} />
              Add QC
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <TableWrapper tableHeader={TABLE_HEADER}>
            {qcLoading ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={TABLE_HEADER.length}>
                  Loading QC users...
                </td>
              </tr>
            ) : qcError ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-red-500" colSpan={TABLE_HEADER.length}>
                  Failed to load QC users.
                </td>
              </tr>
            ) : paginatedUsers.length ? (
              paginatedUsers.map((user, index) => {
                const isStriped = index % 2 === 0;
                const firstName = user.first_name || "-";
                const lastName = user.last_name || "-";
                const email = user.email || "-";
                const phone = user.phone_number || "-";
                const active = user.isActive ?? false;
                return (
                  <tr
                    key={`${user.id ?? `${firstName}-${lastName}-${index}`}`}
                    className={`${isStriped ? "bg-[#F6FDFF]" : "bg-[#fafafa]"} hover:bg-[#eef7ff] transition-colors`}
                  >
                    <td className="px-4 py-3 text-[15px] text-gray-800">{firstName}</td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">{lastName}</td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">{email}</td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">{phone}</td>
                    <td className="px-4 py-3">
                      <div className={`h-6 w-11 rounded-full flex items-center px-1 transition ${active ? "bg-[#1a9bf2]" : "bg-gray-300"}`}>
                        <div
                          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${active ? "translate-x-5" : ""}`}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ActionButton
                          icon={<Edit size={16} />}
                          btnText="Edit"
                          btnClick={() => handleEdit(user)}
                          customClass="p-2 rounded-lg text-[#7c3aed] hover:bg-[#ebddff] transition-colors"
                        />
                        <ActionButton
                          icon={<Trash2 size={16} />}
                          btnText="Delete"
                          btnClick={() => handleDelete(user.id)}
                          customClass={`p-2 rounded-lg text-[#dc2626] hover:bg-[#ffdcdc] transition-colors ${!user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={TABLE_HEADER.length}>
                  No QC users found.
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
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditUser(null);
        }}
        title={editUser ? "Edit QC" : "Add QC"}
        loading={addQc.isPending || updateQc.isPending}
      >
        <AddQC
          handleSubmit={handleAddSubmit}
          loading={addQc.isPending || updateQc.isPending}
          onCancel={() => {
            setShowAddModal(false);
            setEditUser(null);
          }}
          initialValues={
            editUser
              ? {
                  first_name: editUser.first_name || "",
                  last_name: editUser.last_name || "",
                  email: editUser.email || "",
                  phone_number: editUser.phone_number || "",
                  isActive: editUser.isActive ?? true,
                }
              : undefined
          }
          mode={editUser ? "edit" : "add"}
        />
      </Modal>
      </div>
    );
  };
  
  export default QualityControl;