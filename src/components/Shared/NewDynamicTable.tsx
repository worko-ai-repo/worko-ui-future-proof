import React, { SetStateAction } from "react";
import { ChevronDownIcon, ChevronUpIcon, ChevronLeft, ChevronRight } from "lucide-react";
import CustomDropdown from "@Components/Shared/DropDown/CustomDropDown";
import { CommonPaginationPageSizeOptions } from "../../types/common.constants";
import { sortOrder } from "@AssetsFolder/assets";

export interface Column<T> {
  key: (keyof T & string) | string;
  label: string;
  sortable?: boolean;
  contentWidth?: string;
  render?: (row: T) => React.ReactNode;
}

interface SplitColumns<T> {
  visibleColumns: Column<T>[];
  expandedColumns: Column<T>[];
}

// 🆕 NEW: Interface for extra expanded nodes
interface ExpandedNode {
  content: React.ReactNode;
  colSpan?: number; // Optional, defaults to 1
  className?: string;
}

interface DynamicTableAgencyProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  selectedRows?: string[];
  expandedRows?: string[];
  toggleSelectAll?: () => void;
  toggleRow?: (id: string) => void;
  toggleExpand?: (id: string) => void;
  allSelected?: boolean;
  renderExpandedDetails?: (row: T) => React.ReactNode;
  enableSelect?: boolean;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
  onSortChange?: (columnKey: string) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  hideChevronForRejected?: boolean;
  mainColumns?: string[];
  expandedColumns?: string[];
  // NEW: Function to render extra nodes for each row
  renderExpandedNodes?: (row: T) => ExpandedNode[];
  // NEW: Function to check if a row is expandable
  isRowExpandable?: (row: T) => boolean;
  enableExpand?: boolean;
}

export function NewDynamicTable<T extends { id: string }>({
  columns,
  rows,
  selectedRows = [],
  expandedRows = [],
  toggleSelectAll,
  toggleRow,
  toggleExpand,
  allSelected = false,
  renderExpandedDetails,
  enableSelect = true,
  pageSize = 10,
  setPageSize,
  hasPrevPage = false,
  hasNextPage = false,
  handlePreviousPage,
  handleNextPage,
  onSortChange,
  emptyStateMessage = "No data available",
  emptyStateSubMessage = "There are no items to display at the moment.",
  hideChevronForRejected = false,
  mainColumns = [],
  expandedColumns = [],
  renderExpandedNodes, // 🆕 NEW
  isRowExpandable, // 🆕 NEW
  enableExpand = false,
}: DynamicTableAgencyProps<T>) {
  const totalCols = columns.length + (enableSelect ? 1 : 1);

  function getNestedValue(obj: any, path: string): any {
    return path
      .replace(/\$/g, "_")
      .split("_")
      .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }

  const getCellValue = (row: T, col: Column<T>): React.ReactNode => {
    const value = getNestedValue(row, col.key);
    return col.render
      ? col.render(row)
      : typeof value === "string" || typeof value === "number" || typeof value === "boolean"
      ? value.toString()
      : "-";
  };

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-lg p-2 md:p-4 overflow-x-auto w-full">
        <table className="min-w-full table-auto">
          <thead className="bg-[#EFFFFF] text-[#94A3B8]">
            <tr>
              {enableSelect && (
                <th className="p-3 text-center rounded-l-xl">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-xs whitespace-nowrap text-center font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={totalCols} className="h-2" />
            </tr>
          </tbody>
        </table>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyStateMessage}</h3>
          <p className="text-xs text-gray-500">{emptyStateSubMessage}</p>
        </div>
      </div>
    );
  }

  const areAllExpanded = rows.length > 0 && expandedRows.length === rows.length;

  // Calculate expandable rows count
  const expandableRowsCount = isRowExpandable 
    ? rows.filter((row) => isRowExpandable(row)).length
    : rows.length;
  
  // Check if all expandable rows are expanded
  const areAllExpandableRowsExpanded = expandableRowsCount > 0 && expandedRows.length === expandableRowsCount;

  const { visibleColumns, extraExpandedColumns } = React.useMemo(() => {
    if (areAllExpanded && (mainColumns.length || expandedColumns.length)) {
      return {
        visibleColumns: columns.filter((col) => mainColumns.includes(col.key)),
        extraExpandedColumns: columns.filter((col) => expandedColumns.includes(col.key)),
      };
    }
    return { visibleColumns: columns, extraExpandedColumns: [] };
  }, [columns, mainColumns, expandedColumns, areAllExpanded]);

  const showExpand = enableExpand && renderExpandedDetails && toggleExpand;
  const showSelect = enableSelect;

  return (
    <div className="bg-white overflow-x-auto flex flex-col justify-between rounded-lg p-2 md:p-2 max-w-[94vw] h-[calc(100vh-80px)] max-h-[calc(100vh-80px)]">
      <div className="overflow-x-auto overflow-y-scroll pb-4 rounded-md h-full max-h-[calc(100vh-80px)]">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-50 text-slate-700 sticky top-0 z-30 shadow-sm  border-blue-200">
            <tr>
              {(showSelect || showExpand) && (
                <th className="p-1 text-center rounded-l-xl sticky left-0 z-30 bg-blue-50">
                  <div className="flex items-center justify-center gap-1">
                    {showExpand && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!toggleExpand) return;
                          if (areAllExpandableRowsExpanded) {
                            // Collapse all
                            expandedRows.forEach((id) => toggleExpand(id));
                          } else {
                            // Expand all expandable rows
                            rows.forEach((r) => {
                              if (!expandedRows.includes(r.id) && (!isRowExpandable || isRowExpandable(r))) {
                                toggleExpand(r.id);
                              }
                            });
                          }
                        }}
                        className="w-5 h-5 flex items-center justify-center cursor-pointer text-blue-600 border border-gray-300 rounded-full"
                        aria-label={
                          areAllExpandableRowsExpanded
                            ? "Collapse all"
                            : "Expand all"
                        }>
                        {areAllExpandableRowsExpanded ? (
                          <ChevronUpIcon />
                        ) : (
                          <ChevronDownIcon />
                        )}
                      </button>
                    )}
                    {showSelect && (
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                        aria-label="Select all rows"
                      />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.map((col, index) => {
                const isFirstVisibleColumn = index === 0;
                return (
                  <th
                    key={col.key}
                    className={`w-32 px-1 py-3 text-xs whitespace-nowrap text-center font-medium ${
                      isFirstVisibleColumn ? `sticky ${ showSelect && showExpand ? "left-12" : showSelect || showExpand ? "left-6" : "left-0"} z-30 bg-blue-50`: "" }`}>
                    <span className="flex items-center justify-center gap-0 text-center">
                      {col.label}
                      {col.sortable && onSortChange && (
                        <span className="cursor-pointer text-center h-auto w-8">
                          <img
                            src={sortOrder}
                            onClick={(e) => {
                              onSortChange(col.key);
                              e.currentTarget.style.transform =
                                e.currentTarget.style.transform === "rotate(180deg)"
                                  ? "rotate(0deg)"
                                  : "rotate(180deg)";
                            }}
                            className="inline transition-transform duration-300 text-center"
                            alt="sortOrder"
                          />
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={totalCols} className="h-2" />
            </tr>
            {rows.map((row, rowIndex) => {
              const isSelected = selectedRows.includes(row.id);
              const isExpanded = expandedRows.includes(row.id);
              const baseBg = isSelected ? "bg-[#F5F7F7]" : "bg-[#F5F7F7]";

              // Get expanded nodes for this row
              const expandedNodes = renderExpandedNodes ? renderExpandedNodes(row) : [];
              const totalExpandedNodesCols = expandedNodes.reduce(
                (sum, node) => sum + (node.colSpan || 1),
                0
              );
              const mainContentCols = totalCols - totalExpandedNodesCols;

              return (
                <React.Fragment key={row.id}>
                  {rowIndex > 0 && (
                    <tr>
                      <td colSpan={totalCols} className="h-2" />
                    </tr>
                  )}

                  <tr className="h-[56px] bg-[#F5F7F7]">
                    {(showSelect || showExpand) && (
                      <td
                        className={`p-1 w-12  text-center ${isExpanded ? "" : "border-b"}  sticky left-0 z-20 ${
                          baseBg || ""
                        } rounded-tl-xl
                          ${
                            isSelected
                              ? "before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500 border-b-gray-200"
                              : ""
                          }
                        `}>
                        <div className="flex items-center justify-center gap-1">
                        {showExpand &&
                          (!hideChevronForRejected || (row as any).currentStatus !== "REJECTED") && (
                            <button
                              type="button"
                              onClick={() => toggleExpand?.(row.id)}
                              className="w-5 h-5 flex items-center justify-center cursor-pointer text-blue-600 border-2 border-gray-300 rounded-full"
                              aria-label={expandedRows.includes(row.id) ? "Collapse" : "Expand"}>
                              {expandedRows.includes(row.id) ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )}
                            </button>
                          )}
                          {showSelect && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRow?.(row.id)}
                              className="w-4 h-4"
                              aria-label="Select row"
                            />
                          )}
                        </div>
                      </td>
                    )}

                    {visibleColumns.map((col, index) => {
                      const isFirstVisibleColumn =  index === 0;
                      return (
                        <td
                          key={col.key}
                          className={`w-min max-w-[150px] w-32 px-4 ${isExpanded ? "" : "border-b"}  py-0 text-xs whitespace-nowrap ${
                            col.key !== "email" && col.key !== "candidateEmail" ? "capitalize" : ""
                          } ${baseBg}
                          ${col.contentWidth || ""}
                          ${index === columns.length - 1 ? "rounded-tr-xl" : ""}
                          ${isFirstVisibleColumn? `sticky ${showSelect && showExpand? "left-12": showSelect || showExpand? "left-6": "left-0"} z-20`: ""}
                          ${isSelected && isFirstVisibleColumn ? "border-l-4 border-blue-500" : ""
                          }`}>
                          <div
                            className="truncate cursor-pointer h-full w-full p-0" 
                            onDoubleClick={(e) =>
                              navigator.clipboard.writeText(getCellValue(row, col) as string)
                            }
                            {...(typeof getCellValue(row, col) === "string"
                              ? {
                                  "data-tooltip-id": "my-tooltip",
                                  "data-tooltip-content": getCellValue(row, col) as string,
                                }
                              : {})}>
                            {getCellValue(row, col)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {renderExpandedDetails?.(row) && !isExpanded && (
                    <tr className="relative h-0">
                      <td colSpan={totalCols} className="p-0 border-t-0">
                        <div
                          onClick={() => toggleExpand?.(row.id)}
                          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-blue-600 border rounded-full bg-white shadow-md cursor-pointer opacity-0 pointer-events-none">
                          <ChevronDownIcon />
                        </div>
                      </td>
                    </tr>
                  )}

                  {renderExpandedDetails && isExpanded && (
                    <>
                      <tr >
                        {/* 🆕 Main content area - dynamically calculated colspan */}
                        <td
                          colSpan={mainContentCols}
                          className="relative bg-white p-0 text-xs h-6 border-r  border-b border-l   text-gray-600">
                          <div className="px-4 py-2 h-full">
                            {extraExpandedColumns.length > 0 && (
                              <div className="grid grid-cols-7 gap-2  mb-4 w-full" >
                                {extraExpandedColumns.map((col) => (
                                  <div
                                    key={col.key}
                                    className="flex flex-col items-start justify-start gap-2 text-start">
                                    <span className="font-medium text-blue-400 text-nowrap text-start">
                                      {col.label}
                                    </span>
                                    <span className="!text-start !text-gray-900">
                                      {getCellValue(row, col)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {renderExpandedDetails(row)}
                          </div>
                          <div
                            onClick={() => toggleExpand?.(row.id)}
                            className="absolute left-1/2 -translate-x-1/2 translate-y-1/2 bottom-0 z-10 w-8 h-8 text-blue-600 flex items-center justify-center bg-white border shadow-md rounded-full cursor-pointer opacity-0 pointer-events-none">
                            <ChevronUpIcon />
                          </div>
                        </td>

                        {/* 🆕 Dynamic expanded nodes */}
                        {expandedNodes.map((node, nodeIndex) => (
                          <td
                            key={nodeIndex}
                            colSpan={node.colSpan || 1}
                            className={`relative  border border-t-0 border-l-0  bg-white p-0 text-xs text-gray-600 ${
                              node.className || ""
                            }`}>
                            <div className="px-1 h-full">{node.content}</div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td colSpan={totalCols} className="h-4" />
                      </tr>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="h-12 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center z-50">
          <label htmlFor="pageSize" className="text-xs text-gray-600">
            Show rows:
          </label>
          <div className="p-2">
            <CustomDropdown
              options={CommonPaginationPageSizeOptions}
              value={pageSize}
              placeholder="Show rows"
              onChange={(val) => {
                setPageSize(val);
              }}
            />
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPrevPage}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                !hasPrevPage
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }`}>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                !hasNextPage
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }`}>
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
