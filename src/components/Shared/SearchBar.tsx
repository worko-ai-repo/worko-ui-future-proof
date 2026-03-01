import { X } from "lucide-react";
import React, { useCallback, useRef } from "react";

interface SearchBarProps {
  placeholder?:string;
  searchBarText: string | null;
  setSearchBarText: any;
  handleClick: (value?: string | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({placeholder, searchBarText, setSearchBarText, handleClick }) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const onClear = useCallback(() => {
    setSearchBarText(null);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    handleClick(null); // Trigger default API
  }, [setSearchBarText, handleClick]);

  return (
    <div className="flex flex-row w-full bg-white shadow-md rounded-[15px] overflow-hidden max-w-7xl">
      <div className="w-full relative display flex">
        <i className=" fa-solid fa-magnifying-glass absolute z-10 top-4 left-3 text-gray-300" />
        <input
          type="text"
          ref={searchInputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleClick();
            }
          }}
          placeholder={placeholder || "Search"}
          value={searchBarText ?? ""}
          onChange={(e) => setSearchBarText(e.target.value)}
          className="px-10 py-3 relative w-full outline-none bg-[#FAFAFA] text-sm"
        />
        {searchBarText && (
          <button onClick={onClear} className="scale-50 active:scale-[45%] absolute right-[5%] h-full w-fit rounded-full">
            <X className="p-1 text-white bg-blue-600 rounded-full w-full h-full relative" />
          </button>
        )}
      </div>
      <button onClick={() => handleClick()} className="relative bg-gradient-to-t from-[#316BFF] to-[#5FC9FF] text-white px-6 py-0 rounded-[15px] rounded-l-none">
        <i className="fa-solid fa-magnifying-glass sm:hidden"></i>
        <b className="max-sm:hidden">Search</b>
      </button>
    </div>
  );
};

export default SearchBar;
