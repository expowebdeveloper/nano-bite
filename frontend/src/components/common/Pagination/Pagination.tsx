import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  onPageChange: (selectedItem: { selected: number }) => void;
  totalData: number;
  itemsPerPage: number;
  currentPage: number;
}

const Pagination = ({
  onPageChange,
  totalData,
  itemsPerPage,
  currentPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalData / itemsPerPage);
  const shouldShowPagination = totalData > itemsPerPage;
  return (
    <>
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
    </>
  );
};

export default Pagination;
