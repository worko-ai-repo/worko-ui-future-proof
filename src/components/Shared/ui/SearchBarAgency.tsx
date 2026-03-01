import { Search, X } from "lucide-react";
import React, { useCallback, useRef } from "react";

interface SearchBarAgencyProps {
  searchBarText: string | null;
  setSearchBarText: React.Dispatch<React.SetStateAction<string | null>>;
  handleClick: (value?: string | null) => void;
}

const SearchBarAgency: React.FC<SearchBarAgencyProps> = ({ searchBarText, setSearchBarText, handleClick }) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const onClear = useCallback(() => {
    setSearchBarText(null);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    handleClick(null); // Trigger default API
  }, [setSearchBarText, handleClick]);

  return (
    <div className="flex flex-row w-full sm:flex-1 bg-white shadow-md rounded-xl overflow-hidden">
      <div className="relative flex flex-1">
        {/* <i className=" fa-solid fa-magnifying-glass absolute z-10 top-4 left-3 text-gray-300" /> */}
        <input
          type="text"
          ref={searchInputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleClick();
            }
          }}
          placeholder="Search candidates"
          value={searchBarText ?? ""}
          onChange={(e) => setSearchBarText(e.target.value)}
          className="px-3 py-3 relative w-full outline-none bg-[#FAFAFA] text-xs focus:outline-none focus:ring-neutral-50"
        />
        {searchBarText && (
          <button onClick={onClear} className="scale-50 active:scale-[45%] absolute right-[5%] h-full w-fit rounded-full">
            <X className="p-1 text-white bg-blue-600 rounded-full w-full h-full relative" />
          </button>
        )}
      </div>
      <button onClick={() => handleClick()} className="relative bg-blue-500 text-white p-1 m-2 rounded-lg">
        <Search className="h-5 w-auto"/>
      </button>
    </div>
  );
};

export default SearchBarAgency;
