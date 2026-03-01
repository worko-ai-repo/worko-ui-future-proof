import React, { useState } from "react";
import { ClipboardCheck, CopyCheck, Eye, Pencil, Upload, User } from "lucide-react";
import { useSortableData } from "@Hooks/useSortTableData.hook";
import secureStorage from "@Utils/SecureStorage.utils";
import { SecureStorageKeyEnum } from "@Enums/SecureStorage.enum";
import { useAppContext } from "@Context/App.context";
import { NormalizedUser } from "@Utils/NormalizeUser";
import { AgencyJobsList } from "@Interfaces/AgencyDashboardList.dto";
import UploadProfile from "./modals/UploadProfile";
import { DynamicTableTwo } from "@Components/Shared/DynamicTableTwo";
import DuplicateUploadProfileCheck from "./modals/DuplicateUploadProfileCheck";
import { duplicate_profile } from "@AssetsFolder/assets";
import { NewDynamicTable } from "@Components/Shared/NewDynamicTable";


export const getCvViewDate = (statusTracker: any[]) => {
  const cvDownloadedEntry = statusTracker?.find((entry) => entry.newStatus === "CV_DOWNLOADED");
  return cvDownloadedEntry
    ? new Date(cvDownloadedEntry.actionDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "-";
};

export const getCvDownloadedById = (row: any) => {
  const cvDownloadedEntry = row.statusTracker?.find((entry:any) => entry.newStatus === "CV_DOWNLOADED");
  const isUserIdTypeULID = cvDownloadedEntry?.userId?.length === 26 || cvDownloadedEntry?.userId?.includes("-");
  return isUserIdTypeULID ? { updatedByUserId: cvDownloadedEntry?.userId || "" } : { updatedByCorporateUserId: cvDownloadedEntry?.userId || "" };
};

export const getCurrentPositionCell = (row: any) => {
  let currentExperience = row.multipleCandidateExperience?.find((exp: any) => !exp.endDate);
  if (!currentExperience) {
    currentExperience = row.multipleCandidateExperience
      ?.filter((exp: any) => exp.endDate)
      .sort((a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())?.[0];
  }
  return currentExperience || null;
};


export default function JobsListTable(props: any) {
  const {
    ListSelection,
    data,
    handleUpdate,
    userType,
    pagination,
    currentPage,
    onPageChange,
    onPageSizeChange,
    localUpdate
  } = props as any;

  // State required for table interactions
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [dropdownVisibleRows, setDropdownVisibleRows] = useState<string[]>([]);
  const [selectedStatusDropdown, setSelectedStatusDropdown] = useState<string>("");
  const [scorePointsModal, setScorePointsModal] = useState<any>();
  const [pdfViewDetailsID, setPdfViewDetailsID] = useState<string | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState({ isOpen: false, applicant: {} as any, action: "EDIT" as "EDIT" | "VIEW" });
  const [editProfileView,setEditProfileView] = useState<boolean>(false);
  const [editProfileData,setEditProfileData] = useState<AgencyJobsList | undefined>();
  const [feedbackModalOpen,setFeedbackModalOpen] = useState<boolean>(false);
  const [isProfileUploadModalOpen,setIsProfileUploadModalOpen] = useState<boolean>(false);
  const [selectedRow,setSelectedRow] = useState<AgencyJobsList | null>(null);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);
  const [checkIsDuplicate, setCheckIsDuplicate] = useState<boolean>(false);
  // App context
  const { userDetails } = useAppContext() as { userDetails: NormalizedUser };

  // Sorting hook (keeps same fallback keys as before)
  const keyFallbacks = {
    companyName: ["jobDetails.companyName"],
    profile: ["jobDetails.jobTitle"],
    yoe: ["jobDetails.experienceRange.min", "jobDetails.experienceRange.max"],
    experience: ["jobDetails.experienceRange.max", "jobDetails.experienceRange.min"],
    salaryRange: ["jobDetails.salaryRange.min", "jobDetails.salaryRange.max"],
    location: ["jobDetails.location.fullLocation"],
    noticePeriod: ["jobDetails.noticePeriod"],
    dateAssigned: ["jobDetails.createdAt"],
    candidatesUploaded: ["totalCandidatesUploaded"],
    candidatesRejected: ["candidatesRejected", "jobDetails.candidatesRejected"],
    candidatesInProcess: ["candidatesInProcess", "jobDetails.candidatesInProcess"],
  };

//   const { sortedData, onSortChange } = useSortableData(data as any, keyFallbacks);

    const { sortedData, onSortChange } = useSortableData<AgencyJobsList>(data, keyFallbacks, {
    tableId: `agency`,
    persistInUrl: true,
    persistInLocalStorage: false,
    defaultSort: null,
    });

  // Helpers for status transitions
  const shouldShowUpdateIcon = (row: any) => {
    return row.status !== "REJECTED" && row.status !== "HIRED";
  };

  const toggleDropdown = (rowIndex: string) => {
    setDropdownVisibleRows((prev) => (prev.includes(rowIndex) ? prev.filter((id) => id !== rowIndex) : [...prev, rowIndex]));
  };

  const isDropdownVisible = (rowIndex: string) => dropdownVisibleRows.includes(rowIndex);

  const statusArray = ["APPLIED", "CV_DOWNLOADED", "UNDER_EVALUATION", "PROCESSING_INTERVIEW", "INTERVIEW_DONE", "HIRED", "REJECTED"];

  const isOptionDisabled = (option: string, currentStatus: string) => {
    const statusOrder: Record<string, number> = {
      APPLIED: 0,
      CV_DOWNLOADED: 1,
      UNDER_EVALUATION: 2,
      PROCESSING_INTERVIEW: 3,
      INTERVIEW_DONE: 4,
      HIRED: 5,
      REJECTED: 6,
    };
    return option !== "REJECTED" && statusOrder[option] <= statusOrder[currentStatus];
  };

  const transformStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      APPLIED: "Applied",
      CV_DOWNLOADED: "CV Downloaded",
      UNDER_EVALUATION: "Under Evaluation",
      PROCESSING_INTERVIEW: "Processing Interview",
      INTERVIEW_DONE: "Interview Done",
      HIRED: "Hired",
      REJECTED: "Rejected",
      ON_HOLD: "On Hold",
    };
    return statusMap[status] || status;
  };

  const handleStatusUpdate = (status: string, row: any, hasRefetch: boolean = true) => {
    const payload = {
      applicantName: row.applicantDetails?.name,
      emailId: secureStorage.getItem(SecureStorageKeyEnum.USEREMAIL) || "",
      status,
      userId: userDetails ? userDetails?.id : "",
      userType,
    };
    handleUpdate && handleUpdate(payload, row.id, hasRefetch);
  };

    const handlePageSizeChange: React.Dispatch<React.SetStateAction<number>> = (value) => {
      if (typeof value === "number") {
        setPageSize(value);
        onPageSizeChange(value);
      } else {
        setPageSize((prev:any) => {
          const newValue = value(prev);
          onPageSizeChange(newValue);
          return newValue;
        });
      }
    };

  // Column definitions (kept same as previous "All" view)
const columns = [
    {
        key: "companyName",
        label: "Company name",
        sortable: true,
        render: (row: AgencyJobsList) => row?.jobDetails?.companyName ?? "NA"
        // (
        //     <div className='flex justify-center m-auto w-[150px]'>
        //         <span 
        //         title={row?.jobDetails?.companyName}
        //         className="truncate block w-full">{row?.jobDetails?.companyName ?? "NA"}</span>
        //     </div>
        // ),
    },
    {
        key: "profile",
        label: "Profile",
        sortable: true,
        render: (row: AgencyJobsList) => row?.jobDetails?.jobTitle ?? "NA"
        // (
        //     <div className='flex justify-center m-auto w-[150px] text-center'>
        //         <span 
        //         title={row?.jobDetails?.jobTitle}
        //         className="truncate block w-full">{row?.jobDetails?.jobTitle ?? "NA"}</span>
        //     </div>
        // ),
    },
    {
        key: "yoe",
        label: "YOE range",
        sortable: true,
        render: (row: AgencyJobsList) => `${row?.jobDetails?.experienceRange?.min ?? "NA"}-${row?.jobDetails?.experienceRange?.max ?? "NA"} years`
        // (
        // <div className='flex justify-center m-auto w-[150px]'>
        //     <span>{row?.jobDetails?.experienceRange?.min ?? "NA"}-{row?.jobDetails?.experienceRange?.max ?? "NA"} years</span>
        // </div>
        // ),
    },
    {
        key: "salaryRange",
        label: "Salary range",
        sortable: true,
        render: (row: AgencyJobsList) => `${row?.jobDetails?.salaryRange?.min ?? "NA"} LPA - ${row?.jobDetails?.salaryRange?.max ?? "NA"} LPA`
        // (
        //     <div className='flex justify-center m-auto w-[150px]'>
        //        <span>{row?.jobDetails?.salaryRange?.min ?? "NA"} LPA - {row?.jobDetails?.salaryRange?.max ?? "NA"} LPA</span>
        //     </div>
        // ),
    },
    {
        key: "location",
        label: "Location",
        sortable: true,
        render: (row: AgencyJobsList) => row?.jobDetails?.location?.fullLocation[0] ?? "NA"
        // (
        //     <div className='flex justify-center m-auto w-[100px] text-center'>
        //         <span 
        //           title={row?.jobDetails?.location?.fullLocation[0]}
        //           className="truncate block w-full">
        //           {row?.jobDetails?.location?.fullLocation ?? "NA"}
        //         </span>
        //     </div>
        // ),
    },
    {
        key: "noticePeriod",
        label: "Notice Period",
        sortable: true,
        render: (row: AgencyJobsList) => row?.jobDetails?.noticePeriod ?? "NA"
        // (
        //     <div className='flex justify-center m-auto w-[150px]'>
        //         <span>{row?.jobDetails?.noticePeriod ?? "NA"}</span>
        //     </div>
        // ),
    },
    {
        key: "dateAssigned",
        label: "Date assigned",
        sortable: true,
        render: (row: AgencyJobsList) => row?.jobDetails?.createdAt
                  ? new Date(row?.jobDetails?.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "NA"
        //           (
        //     <div className='flex justify-center m-auto w-[150px]'>        
        //         <span >{row?.jobDetails?.createdAt
        //           ? new Date(row?.jobDetails?.createdAt).toLocaleDateString("en-GB", {
        //               day: "2-digit",
        //               month: "2-digit",
        //               year: "numeric",
        //             })
        //           : "NA"}</span>
        //     </div>
        // ),
    },
    {
        key: "uploadProfile",
        label: "Upload Profile",
        sortable: false,
        contentWidth: `max-w-none`,
        render: (row: AgencyJobsList) => (
            <div className='flex justify-center items-center m-auto gap-1'>
            <div>
                <button 
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Upload new profile"
                data-tooltip-place="top"
                className="btn-sky flex items-center space-x-2"
                onClick={()=>{
                  setSelectedRow(row)
                  setIsProfileUploadModalOpen(true)
                }}>
                    <Upload className="h-5 w-5"/>
                </button>
            </div>
            <div>
                <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Check duplicate profile"
                data-tooltip-place="top"
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 border border-gray-500"
                onClick={()=>{
                  setSelectedRow(row)
                  setCheckIsDuplicate(true)
                }}
                >
                  <img src={duplicate_profile} alt="" className="h-6 w-6"/>
                </button>
            </div>    
            </div>
        ),
    },
    {
        key: "candidatesUploaded",
        label: "Candidates uploaded",
        sortable: true,
        render: (row: AgencyJobsList) => (
            <div className='flex justify-center m-auto'>
                <span>{row?.totalCandidatesUploaded ?? "-"}</span>
            </div>
        ),
    },
    {
        key: "candidatesRejected",
        label: "Candidates rejected",
        sortable: true,
        render: (row: AgencyJobsList) => (
            <div className='flex justify-center m-auto'>
                <span>{row?.candidatesRejected ?? "-"}</span>
            </div>
        ),
    },
    {
        key: "candidatesInProcess",
        label: "Candidates in-process",
        sortable: true,
        render: (row: AgencyJobsList) => (
            <div className='flex justify-center m-auto'>
                <span>{row?.candidatesInProcess ?? "-"}</span>
            </div>
        ),
    },
];

  // Toggle row expansion
  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

//   const renderExpandedDetails = (row: any) => {
// return (
//     <div className="flex justify-start items-start gap-8 p-4 bg-gray-50 rounded-lg">
//       <div>
//         <span className="font-semibold text-black">Last Rejection Date</span>
//         <p>
//           {row.lastRejectionDate
//             ? new Date(row.lastRejectionDate).toLocaleDateString("en-GB", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               })
//             : "NA"}
//         </p>
//       </div>

//       <div>
//         <span className="font-semibold text-black">Rejected By</span>
//         <p>{row.rejectedBy ?? "NA"}</p>
//       </div>

//       <div>
//         <span className="font-semibold text-black">Cooling Period</span>
//         <p>{row.coolingPeriod ?? "NA"}</p>
//       </div>

//       <div className="max-w-sm">
//         <span className="font-semibold text-black">Rejection Reason</span>
//         <p className="break-words">{row.rejectedReason ?? "NA"}</p>
//       </div>
//     </div>
//   );
// };

  return (
    <>
      {/* Deselect button - only show when rows are selected */}
      <button
        className={`text-sm text-blue-600 flex items-center gap-1 mb-2 ${ListSelection?.selectedRows?.length === 0 ? "hidden" : ""}`}
        onClick={() => ListSelection.reset && ListSelection.reset()}
      >
        <span className="w-4 h-4 flex items-center justify-center bg-blue-600 rounded-full text-white text-base">&minus;</span>
        <span>deselect {ListSelection?.selectedRows?.length ?? 0} rows</span>
      </button>

        <NewDynamicTable
        columns={columns}
        rows={sortedData ?? []}
        selectedRows={ListSelection?.selectedRows?.map((row: any) => row.id) ?? []}
        enableSelect={false}
        // expandedRows={expandedRows}
        // toggleSelectAll={() =>
        //     ListSelection.toggleSelectAll && ListSelection.toggleSelectAll(data)
        // }
        // toggleRow={(id: string) => {
        //     const row = data.find((r: any) => r.id === id);
        //     ListSelection.toggleRow && row && ListSelection.toggleRow(row);
        // }}
        // toggleExpand={toggleExpand}
        // allSelected={
        //     ListSelection.getAllSelected && ListSelection.getAllSelected(sortedData)
        // }
        // renderExpandedDetails={renderExpandedDetails}
        onSortChange={onSortChange}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        handlePreviousPage={() => onPageChange(currentPage - 1)}
        handleNextPage={() => onPageChange(currentPage + 1)}
        hasPrevPage={currentPage > 1}
        hasNextPage={!!pagination?.lastKey}
        />
        <UploadProfile
        dashboardType={"AGENCY"}
        onClose= {()=>setIsProfileUploadModalOpen(false)}
        isOpen={isProfileUploadModalOpen}
        rowData={selectedRow}
        localUpdate={localUpdate}
        />
        <DuplicateUploadProfileCheck
        dashboardType={"AGENCY"}
        onClose= {()=>setCheckIsDuplicate(false)}
        isOpen={checkIsDuplicate}
        rowData={selectedRow}
        />
    </>
  );
}
