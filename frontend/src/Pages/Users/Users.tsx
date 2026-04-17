import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import TableWrapper from "../../components/common/Table/TableWrapper";
import Pagination from "../../components/common/Pagination/Pagination";
import usePagination from "../../hooks/usePagination";
import { ITEMS_PER_PAGE } from "../../Constants/Constants";
import useUser from "../../hooks/useUser";

type ListUser = {
  id: string;
  email: string;
  fullName: string | null;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  phone_number?: string | null;
  accountStatus?: string | null;
};

const TABLE_HEADER = ["Full name", "Email", "Role", "Status", /*"Platform status",*/ "Created"];

const Users = () => {
  const { user } = useSelector((state: any) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const { usersListQuery } = useUser();
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const { page, onPageChange, setPage } = usePagination();

  const { data: users = [], isLoading, isError } = usersListQuery;

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users as ListUser[];
    const term = search.toLowerCase();
    return (users as ListUser[]).filter((u) => {
      const name =
        u.fullName ||
        [u.first_name, u.last_name].filter(Boolean).join(" ").trim() ||
        "";
      return (
        name.toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.role || "").toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, page, itemsPerPage]);

  const totalData = filteredUsers.length;

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Users</h1>
      <div className="bg-white rounded-3xl shadow-md border border-[#eaf4fb] p-6">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="h-10 w-64 rounded-lg border border-[#d9e8f5] bg-white pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0b75c9]/30"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <TableWrapper tableHeader={TABLE_HEADER}>
            {isLoading ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-gray-500"
                  colSpan={TABLE_HEADER.length}
                >
                  Loading users...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-red-500"
                  colSpan={TABLE_HEADER.length}
                >
                  Failed to load users.
                </td>
              </tr>
            ) : paginatedUsers.length ? (
              paginatedUsers.map((u, index) => {
                const isStriped = index % 2 === 0;
                const displayName =
                  u.fullName ||
                  [u.first_name, u.last_name].filter(Boolean).join(" ").trim() ||
                  "—";
                const created =
                  u.createdAt &&
                  new Date(u.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                return (
                  <tr
                    key={u.id}
                    className={`${isStriped ? "bg-[#F6FDFF]" : "bg-[#fafafa]"
                      } hover:bg-[#eef7ff] transition-colors`}
                  >
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {displayName}
                    </td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {u.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {u.role || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {/* <td className="px-4 py-3">
                      {u.role === "QC" && u.accountStatus ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.accountStatus === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {u.accountStatus === "Active" ? "Joined" : "Pending setup"}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td> */}
                    <td className="px-4 py-3 text-[15px] text-gray-800">
                      {created || "—"}
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
                  No users found.
                </td>
              </tr>
            )}
          </TableWrapper>
        </div>

        <div className="mt-4">
          <Pagination
            onPageChange={onPageChange}
            onItemsPerPageChange={(newLimit) => {
              setItemsPerPage(newLimit);
              setPage(1);
            }}
            itemsPerPage={itemsPerPage}
            totalData={totalData}
            currentPage={page}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
