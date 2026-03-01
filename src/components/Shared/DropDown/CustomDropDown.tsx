import { ChevronUp } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

/**
 * CustomDropdown Component
 *
 * A stylized dropdown component using Tailwind CSS.
 *
 * @component
 * @param {Object} props - Props for the component
 * @param {string[]} props.options - List of dropdown options
 * @param {string} props.value - Currently selected value
 * @param {string} props.placeholder - Placeholder to show when no value is selected
 * @param {(value: string) => void} props.onChange - Callback when a value is selected
 * @returns {JSX.Element}
 */

export interface DropdownOption {
    label: string;
    value: string | number;
  }
  
  export interface CustomDropdownProps {
    options: DropdownOption[];
    value: string | number;
    placeholder?: string;
    onChange: (value: any) => void;
  }

const CustomDropdown = ({ options = [], value, placeholder = 'Select...', onChange }:CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find label of selected value
  const selectedLabel = options.find((opt:DropdownOption) => opt.value === value)?.label;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-4 px-4 py-2 w-fit rounded-xl border border-slate-200 cursor-pointer select-none"
      >
        <span className="text-sm text-slate-400 font-medium">
          {selectedLabel || placeholder}
        </span>
        <div className="w-4 h-4 relative">
         <ChevronUp className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={16} color="#64748b" />
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50  bottom-12 mb-2 w-full bg-white shadow-lg rounded-xl border border-slate-200">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 z-[999999] cursor-pointer text-sm font-medium ${
                opt.value === value
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
