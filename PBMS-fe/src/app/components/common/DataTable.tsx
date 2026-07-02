import React from "react";
import { cls } from "./ui";

export interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  hasCheckbox?: boolean;
  selectedRows?: Set<number>;
  onSelectRow?: (id: number) => void;
  onSelectAll?: () => void;
  allSelected?: boolean;
}

export function DataTable({ columns, data, hasCheckbox, selectedRows, onSelectRow, onSelectAll, allSelected }: DataTableProps) {
  return (
    <div className={cls.tableWrapper}>
      <table className="w-full text-sm border-collapse min-w-max">
        <thead>
          <tr className="border-y border-gray-300">
            {hasCheckbox && (
              <th className={`${cls.th} w-8 text-center`}>
                <input type="checkbox" checked={allSelected} onChange={onSelectAll} className="cursor-pointer" />
              </th>
            )}
            {columns.map(col => (
              <th key={col.key} className={cls.th} style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                selectedRows?.has(row.id) ? "bg-blue-50" : i % 2 === 1 ? "bg-gray-50" : "bg-white"
              }`}
            >
              {hasCheckbox && (
                <td className={`${cls.td} text-center`}>
                  <input
                    type="checkbox"
                    checked={selectedRows?.has(row.id) ?? false}
                    onChange={() => onSelectRow?.(row.id)}
                    className="cursor-pointer"
                  />
                </td>
              )}
              {columns.map(col => (
                <td key={col.key} className={cls.td}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (hasCheckbox ? 1 : 0)}
                className="text-center py-10 text-gray-400 text-sm"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
