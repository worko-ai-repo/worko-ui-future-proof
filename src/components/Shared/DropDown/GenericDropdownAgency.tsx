import { ChevronDown } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

export type DropDownOption<T = any> = {
  label: string;
  onClick?: () => void;       
  value?: string | number;
  data?: T;
};

export type GenericDropdownAgencyProps<T = any> = {
  options: DropDownOption<T>[];
  onSelect?: (option: DropDownOption<T>) => void;
  disabled?: boolean;
  selectTitle?: string;
  tooltipMessage?: string;
  isJobsLoading?: boolean;
  editable?:boolean;
};

const GenericDropdownAgency: React.FC<GenericDropdownAgencyProps> = ({
  options,
  onSelect,
  disabled = false,
  selectTitle = "Select",
  tooltipMessage = "Perform bulk actions on selected rows.",
  isJobsLoading,
  editable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setQuery("");
      return next;
    });
  };

  // if dont want to clear the filter then use below toogledropdown else use above toogledropdown
  // const toggleDropdown = () => {
  //   if (!disabled) setIsOpen((prev) => !prev);
  // };

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full sm:w-auto min-w-56 max-w-full ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      data-tooltip-id="dropdown-tooltip"
      data-tooltip-content={tooltipMessage}
    >
      {/* Trigger Button */}
      <div
        onClick={toggleDropdown}
        className={`shadow-md flex items-center w-full h-9 bg-white px-2 pr-8 transition-all 
          ${isOpen ? "rounded-b-none rounded-lg text-blue-600" : "rounded-lg"}
          ${disabled ? "cursor-not-allowed" : ""}`}
      >
          {editable ? (
            <input
            type="text"
            value={query}
            placeholder={selectTitle}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!disabled) setIsOpen(true);
            }}
            onFocus={() => { if (!disabled) setIsOpen(true); }}
            disabled={disabled}
            className="font-thin text-xs truncate w-full bg-transparent focus:outline-none focus:ring-0 focus:border-transparent focus-visible:outline-none focus-visible:ring-0"
          />
          ):(
            <span className="font-thin text-gray-500 text-xs truncate">{selectedLabel || selectTitle}</span>
          )}
        
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-gray-700 bg-blue-600 rounded text-white p-1"
        >
          <ChevronDown className="h-4 w-auto" />
        </button>
      </div>

      {/* Dropdown Panel */}
      {isOpen && !disabled && (
        <div className="absolute left-0 top-full w-full min-w-56 max-w-full sm:max-w-none bg-white rounded-2xl rounded-t-none shadow-lg z-50 overflow-auto max-h-60">
          <div className="flex flex-col gap-1">
            {isJobsLoading && (
                <button
                  className={`text-left border-b px-4 py-2 text-xs font-medium whitespace-normal break-words transition`}
                >
                  Loading jobs...
                </button>
              )}
            {filteredOptions.map((option, index) => {
              const isSelected = option.label === selectedLabel;
              return (
                <button
                  key={option.label + index}
                  onClick={() => {
                    option.onClick?.();
                    onSelect?.(option);
                    setSelectedLabel(option.label);
                    setQuery(option.label);
                    setIsOpen(false);
                  }}
                  className={`text-left border-b px-4 py-2 text-xs font-medium whitespace-normal break-words transition
                    ${isSelected ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`}
                >
                  {option.label}
                </button>
              );
            })}
            {filteredOptions.length === 0 && !isJobsLoading &&(
              <button
                className={`text-left border-b px-4 py-2 text-xs font-medium whitespace-normal break-words transition`}
              >
                No Company found
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericDropdownAgency;
