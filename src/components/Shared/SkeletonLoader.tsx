import React from "react";

interface SkeletonLoaderProps {
    showHeaderCards?: boolean;
    showSearchBar?: boolean;
    showButtons?: boolean;
    buttonCount?: number;
    showTabs?: boolean;
    showTableHeader?: boolean;
    showTableRows?: boolean;
    tableColumns?: number;
    rowCount?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    showHeaderCards,
    showSearchBar,
    showButtons,
    buttonCount,
    showTabs,
    showTableHeader,
    showTableRows,
    tableColumns,
    rowCount,
}) => {
    return (
        <div className="animate-pulse p-4 space-y-6">
            {/* Header Cards */}
            {showHeaderCards && (
                <div className="grid grid-cols-5 gap-4">
                    {Array(5).fill(0).map((_, idx) => (
                        <div key={idx} className="h-20 rounded-lg bg-gray-200"></div>
                    ))}
                </div>
            )}

            {/* Search Bar and/or Buttons */}
            {(showSearchBar || (showButtons && buttonCount)) && (
                <div className="flex justify-between items-center gap-4">
                    {/* Left Side */}
                    {showSearchBar ? (
                        <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
                    ) : (
                        <div></div> // keeps right side pushed right even if no search
                    )}

                    {/* Right Side Buttons */}
                    {showButtons && buttonCount && (
                        <div className="flex gap-4">
                            {Array(buttonCount).fill(0).map((_, i) => (
                                <div key={i} className="h-10 w-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tabs */}
            {showTabs && (
                <div className="flex justify-center gap-6 border-b pb-2">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-6 w-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            )}

            {/* Table Header */}
            {showTableHeader && tableColumns && (
                <div className={`grid grid-cols-${tableColumns} gap-4 p-2 bg-gray-100 rounded-md`}>
                    {Array(tableColumns).fill(0).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
                    ))}
                </div>
            )}

            {/* Table Rows */}
            {showTableRows && tableColumns && rowCount && (
                Array(rowCount).fill(0).map((_, rowIdx) => (
                    <div
                        key={rowIdx}
                        className={`grid grid-cols-${tableColumns} gap-4 py-3 border-b items-center`}
                    >
                        {Array(tableColumns).fill(0).map((_, colIdx) => (
                            <div key={colIdx} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default SkeletonLoader;
