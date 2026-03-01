import React, { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface ChipInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxChips?: number;
  allowDuplicates?: boolean;
}

const ChipInput: React.FC<ChipInputProps> = ({
  value = [],
  onChange,
  onBlur,
  placeholder = "Type and press Enter to add...",
  className = "",
  disabled = false,
  maxChips,
  allowDuplicates = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addChip = (chipValue: string) => {
    const trimmedValue = chipValue.trim();
    if (!trimmedValue) return;

    if (maxChips && value.length >= maxChips) return;
    
    if (!allowDuplicates && value.includes(trimmedValue)) return;

    const newValues = [...value, trimmedValue];
    onChange(newValues);
    setInputValue('');
  };

  const removeChip = (indexToRemove: number) => {
    const newValues = value.filter((_, index) => index !== indexToRemove);
    onChange(newValues);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeChip(value.length - 1);
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      addChip(inputValue);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    if (inputValue.trim()) {
      addChip(inputValue);
    }
    onBlur?.();
  };

  const handleContainerClick = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const baseClasses = `
    w-full min-h-[3rem] px-4 py-2 bg-gray-100 rounded-lg 
    border-2 border-transparent transition-all duration-200
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white
    cursor-text flex flex-wrap gap-2 items-center
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-200' : 'hover:bg-gray-50'}
    ${className}
  `;

  return (
    <div className={baseClasses} onClick={handleContainerClick}>
      {/* Render chips */}
      {value.map((chip, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium"
        >
          <span>{chip}</span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeChip(index);
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}

      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={handleInputBlur}
        placeholder={value.length === 0 ? placeholder : ""}
        disabled={disabled}
        className="flex-1 min-w-[120px] bg-transparent border-none  text-sm placeholder-gray-500"
      />
    </div>
  );
};

export default ChipInput;