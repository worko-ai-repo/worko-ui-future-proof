import React from 'react';

type SelectOption<T = any> = {
    label: string;
    value: T;
  };

type SelectInputProps<T = any> = {
    label: string;
    name: string;
    error?: string;
    options: SelectOption<T>[];
    placeholder?: string;
    required?: boolean;
  } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
    onChange?: (value: T | null) => void;
  };
  
  const SimpleSelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
    ({ label, name, error, options, placeholder, required, ...rest }, ref) => {
      return (
        <div className="space-y-1">
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            id={name}
            name={name}
            ref={ref}
            className={`w-full rounded-xl p-3 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              error ? 'border border-red-500 focus:ring-red-500' : ''
            }`}
            {...rest}
          >
            <option value="">
              {placeholder || `Select ${label.toLowerCase()}`}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      );
    }
  );
export default SimpleSelectInput;
  