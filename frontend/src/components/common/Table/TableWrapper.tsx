import { ReactNode } from "react";

type TableWrapperProps = {
  children: ReactNode;
  tableHeader: string[];
};

function TableWrapper({ children, tableHeader }: TableWrapperProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 bg-white text-sm">
        <thead className="bg-[#027bc9] text-white">
          <tr>
            {tableHeader?.map((item, index) => (
              <th
                className="px-4 py-3 text-left font-semibold text-white first:rounded-tl-xl last:rounded-tr-xl"
                key={index}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="whitespace-nowrap divide-y divide-[#e8f3fb]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export default TableWrapper;
