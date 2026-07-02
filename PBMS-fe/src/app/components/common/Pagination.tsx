interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, totalRecords, onPageChange }: PaginationProps) {
  const btn = "px-3 h-7 border border-gray-300 text-xs rounded hover:bg-gray-50 text-gray-600 cursor-pointer";
  const activebtn = "px-3 h-7 border border-blue-600 bg-blue-600 text-white text-xs rounded cursor-pointer";
  return (
    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
      <span className="text-xs text-gray-500">
        {totalRecords !== undefined ? `Tổng: ${totalRecords} bản ghi` : ""}
      </span>
      <div className="flex items-center gap-1">
        <button className={btn} onClick={() => onPageChange(1)}>First</button>
        <button className={btn} onClick={() => onPageChange(Math.max(1, currentPage - 1))}>Previous</button>
        <button className={activebtn}>{currentPage}</button>
        <button className={btn} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>Next</button>
        <button className={btn} onClick={() => onPageChange(totalPages)}>Last</button>
      </div>
    </div>
  );
}
