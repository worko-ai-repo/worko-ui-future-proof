import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CorporateServiceObj from "@Components/Dashboard/Agency/Pages/Services/Corporate.service";
import { SecureStorageKeyEnum } from "@Enums/SecureStorage.enum";
import secureStorage from "@Utils/SecureStorage.utils";
// import { STATUS_COLORS } from "@Components/Shared/FindJobByDropdown";
import { useAppContext } from "@Context/App.context";

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "bg-green-500",
  CLOSED: "bg-red-500",
  DRAFT: "bg-gray-400",
  ARCHIVED: "bg-yellow-500",
};

export type DropDownSelectedJobData = {
  id: string;
  jobTitle: string;
  status: string;
  jobDescription: string;
  jobDetails:any;
};

type JobListDropdownProps = {
  onSelect: (job: DropDownSelectedJobData) => void;
  placeholder?: string;
  dashboard?: "CORPORATE" | "ADMIN";
};

const fetchJobs = async (
  search: string,
  userEmail?: any
): Promise<DropDownSelectedJobData[]> => {
  const userCognitoDetails = secureStorage.getItem<any>(SecureStorageKeyEnum.COGNITOUSERDETAILS);

  const payload = {
    pageSize: 200,
    sortOrder: "desc",
    agencyRegisteredEmail: userEmail,
    status: "ACTIVE",
    searchText: search.trim(),
    includeJobDetails:true,
  };

  const response:any = await CorporateServiceObj.fetchAgencyJobs(payload);
  return response?.data || [];
};

const JobListDropdown: React.FC<JobListDropdownProps> = ({
  onSelect,
  placeholder = "Search jobs...",
}) => {
  const [searchText, setSearchText] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userDetails } = useAppContext();
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobsPopup", searchText, userDetails?.email],
    queryFn: () => fetchJobs(searchText, userDetails?.email),
    enabled: !!userDetails?.email,
    staleTime: 5 * 60 * 1000,
  });
  // useEffect(()=>{
  //   console.log(userDetails)
  //   console.log(jobs)
  // },[jobs])
  const handleSelectJob = (job: DropDownSelectedJobData) => {
    setSearchText(job.jobTitle);
    setDropdownVisible(false);
    onSelect(job);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Choose Job description from dropdown
      </label>
      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setDropdownVisible(true);
          }}
          onFocus={() => setDropdownVisible(true)}
          className="w-full p-2 pr-10 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ChevronDown
          className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
          size={18}
        />
        {dropdownVisible && (
          <div className="no-scrl no-scrl-web cursor-pointer absolute mt-1 w-full z-10 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded shadow">
            {isLoading && <div className="p-3 text-sm text-gray-500 text-center">Loading...</div>}

            {!isLoading && (!jobs || jobs.length === 0) && (
              <div className="p-3 text-sm text-gray-500 text-center">
                {searchText ? `No jobs found for "${searchText}"` : "No jobs available"}
              </div>
            )}

            {!isLoading && Array.isArray(jobs) && jobs.length > 0 && (
              <>
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJob(job.jobDetails)}
                    className="p-2 px-3 hover:bg-blue-50 border-b-2 rounded-md cursor-pointer capitalize">
                    <div className="text-sm font-medium text-left">{job.jobDetails.jobTitle}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          STATUS_COLORS[job.status] || "bg-gray-300"
                        }`}
                      />
                      <span>{job.status.toLowerCase()}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default JobListDropdown;
