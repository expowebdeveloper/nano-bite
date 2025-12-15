import ReactPaginate from "react-paginate";

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
          previousLabel={"<"}
          nextLabel={">"}
          pageCount={totalPages}
          onPageChange={onPageChange}
          containerClassName={"flex gap-2 justify-end pagination_custom"}
          previousLinkClassName={"border px-2 bg-[#F5F5F5] rounded-md py-1"}
          nextLinkClassName={"border px-2 bg-[#F5F5F5] rounded-md py-1"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"active"}
          pageClassName={"border px-2 bg-[#F5F5F5] rounded-md"}
          forcePage={currentPage - 1}
        />
      )}
    </>
  );
};

export default Pagination;
