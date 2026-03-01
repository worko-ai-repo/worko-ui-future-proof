import React, { useEffect, useRef, useState } from "react";

type DropDownOption = {
  label: string;
  onClick: () => void;
};

export type DatabaseDropdownProps = {
  options: DropDownOption[];
  disabled?: boolean;
  selectTitle?: string;
  tooltipMessage?: string;
};

const DatabaseDropdown: React.FC<DatabaseDropdownProps> = ({
  options,
  disabled = false,
  selectTitle = "Select",
  tooltipMessage = "Perform bulk actions on selected rows.",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

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
      className={`relative min-w-[7rem]  ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      data-tooltip-id="dropdown-tooltip"
      data-tooltip-content={tooltipMessage}
    >
      {/* Trigger Button */}
      <div
        onClick={toggleDropdown}
        className={`flex justify-center text-left  min-w-[7rem] h-10 bg-white px-2 py-2 items-center font-semibold  transition-all ${
          isOpen ? "rounded-b-none rounded-2xl text-blue-600" : "rounded-2xl"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <span>{selectedLabel || selectTitle}</span>
        <span className="ml-1">▾</span>
      </div>

      {/* Dropdown Panel */}
      {isOpen && !disabled && (
        <div className="absolute min-w-[7rem]  bg-white rounded-2xl rounded-t-none  shadow-lg z-50">
          <div className="flex flex-col  gap-1">
            {options.map((option, index) => {
              const isSelected = option.label === selectedLabel;
              return (
                <button
                  key={option.label + index}
                  onClick={() => {
                    option.onClick();
                    setSelectedLabel(option.label);
                    setIsOpen(false);
                  }}
                  className={`text-left  border-b px-4 py-1  text-sm font-medium transition ${
                    isSelected
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseDropdown;
