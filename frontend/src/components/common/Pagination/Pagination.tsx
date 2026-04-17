import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  onPageChange: (selectedItem: { selected: number }) => void;
  onItemsPerPageChange?: (limit: number) => void;
  totalData: number;
  itemsPerPage: number;
  currentPage: number;
}

const Pagination = ({
  onPageChange,
  onItemsPerPageChange,
  totalData,
  itemsPerPage,
  currentPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalData / itemsPerPage);
  const shouldShowPagination = totalData > itemsPerPage;
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
          className="rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2B89D2]/30"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span>items per page</span>
      </div>

      {shouldShowPagination && (
        <ReactPaginate
          previousLabel={<ChevronLeft size={18} />}
          nextLabel={<ChevronRight size={18} />}
          pageCount={totalPages}
          onPageChange={onPageChange}
          containerClassName="flex gap-2 justify-end items-center flex-wrap pagination_custom"
          previousLinkClassName="border border-gray-300 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors min-w-[2.25rem] text-center"
          nextLinkClassName="border border-gray-300 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors min-w-[2.25rem] text-center"
          pageLinkClassName="border border-gray-300 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors min-w-[2.25rem] inline-block text-center"
          activeLinkClassName="!bg-[#2B89D2] !text-white !border-[#2B89D2] font-medium"
          disabledClassName="opacity-50 pointer-events-none"
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
};

export default Pagination;
