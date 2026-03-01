import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useSortableData } from "@Hooks/useSortTableData.hook";
// import secureStorage from "@Utils/SecureStorage.utils";
// import { SecureStorageKeyEnum } from "@Enums/SecureStorage.enum";
import { useAppContext } from "@Context/App.context";
// import { NormalizedUser } from "@Utils/NormalizeUser";
// import jobApplicationServiceObj from "@Utils/ApplicationPage.utils";
// import CreatedByDisplay from "@Components/Shared/PostJob/CreatedByDisplay";
// import { Edit, View } from "@AssetsFolder/assets";
import { AgencyInvitesListDetailsDto } from "@Interfaces/AgencyDashboardList.dto";
import { DynamicTableTwo } from "@Components/Shared/DynamicTableTwo";
import { toast } from "react-toastify";
import { getToastOptions } from "@Utils/Toast.utils";
import httpServiceObj from "@Services/ApiHandler.service";
import { JobApplicationStatusType } from "src/types/JobsAndApplication.type";
import { newDisplayStatus, statusColors } from "../Applicants/ApplicantsListTable";
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


export default function InvitesListTable(props: any) {
  const {
    ListSelection,
    data,
    handleUpdate,
    userType,
    localUpdate,
    removeAgencyLocally,
    pagination,
    currentPage,
    onPageChange,
    onPageSizeChange,
    jobsList,
  } = props as any;

  // State required for table interactions
  const [dropdownVisibleRows, setDropdownVisibleRows] = useState<string[]>([]);
  const [selectedStatusDropdown, setSelectedStatusDropdown] = useState<string>("");
  const [scorePointsModal, setScorePointsModal] = useState<any>();
  const [pdfViewDetailsID, setPdfViewDetailsID] = useState<string | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState({ isOpen: false, applicant: {} as any, action: "EDIT" as "EDIT" | "VIEW" });
  const [editProfileView,setEditProfileView] = useState<boolean>(false)
  const [editProfileData,setEditProfileData] = useState<any>()
  const [feedbackModalOpen,setFeedbackModalOpen] = useState<boolean>(false)
  const [isAssignJobModelOpen,setIsAssignJobModelOpen] = useState<boolean>(false);
  const [isRemoveJobModelOpen,setIsRemoveJobModelOpen] = useState<boolean>(false);
  const [isEditAgencyModelOpen,setIsEditAgencyModelOpen] = useState<boolean>(false);
  const [isPauseAgencyModelOpen,setIsPauseAgencyModelOpen] = useState<boolean>(false);
  const [isDeleteAgencyModelOpen,setIsDeleteAgencyModelOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);

  // App context
  const { userDetails } = useAppContext();
  
  // Sorting hook (keeps same fallback keys as before)
  const keyFallbacks = {
    companyName: ["companyName"],
    senderName: ["inviterName"],
    date: ["createdAt"],
  };
  // const { sortedData, onSortChange } = useSortableData(data as any, keyFallbacks);
      const { sortedData, onSortChange } = useSortableData<AgencyInvitesListDetailsDto>(data, keyFallbacks, {
      tableId: `agency`,
      persistInUrl: true,
      persistInLocalStorage: false,
      defaultSort: null,
      });

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
  
  const acceptAndReject = async (row:AgencyInvitesListDetailsDto,acceptOrReject:string) =>{
    const payload = {
      agencyInviteId: row?.id,
      inviteStatus: acceptOrReject.trim(),
    }
    try {
      const {response, error} = await httpServiceObj.patch(`/agency-invite/agency-action`,payload,true,{},false,"BASE")
      let msg = acceptOrReject == "ACCEPTED" 
      ? "Invite accept failed please try again" 
      : "Invite reject failed please try again"

      if(error){
        toast.error(msg,getToastOptions({}))
        return
      }
      localUpdate(row.id,{inviteStatus:acceptOrReject})
      if(acceptOrReject == "ACCEPTED"){
        toast.success("Invite Accepted",getToastOptions({}))
      }else{
        toast.success("Invite Rejected",getToastOptions({}))
      }
    } catch (error) {
      console.log(error)
    }
  }
  // Column definitions (kept same as previous "All" view)
  const columns = [
    {
        key: "companyName",
        label: "Company name",
        sortable: true,
        render: (row: AgencyInvitesListDetailsDto) => row?.companyName ?? "NA"
        // (
        //     <div className='flex justify-center m-auto w-[150px] text-center'>
        //         <span 
        //         title={row?.companyName}
        //         className="truncate block w-full">{row?.companyName ?? "NA"}</span>
        //     </div>
        // ),
    },
    {
        key: "senderName",
        label: "Sender name(HR)",
        sortable: true,
        render: (row: AgencyInvitesListDetailsDto) => row?.inviterName ?? "NA"
        // (
        //     <div className='flex justify-center m-auto w-[150px] text-center'>
        //         <span title={row?.inviterName}
        //         className="truncate block w-full">{row?.inviterName ?? "NA"}</span>
        //     </div>
        // ),
    },
    {
        key: "date",
        label: "Date",
        sortable: true,
        render: (row: AgencyInvitesListDetailsDto) => row?.createdAt
                  ? new Date(row.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "NA"
                  // (
            // <div className='flex justify-center m-auto w-[150px]'>
            //   <span>
            //     {row?.createdAt
            //       ? new Date(row.createdAt).toLocaleDateString("en-GB", {
            //           day: "2-digit",
            //           month: "2-digit",
            //           year: "numeric",
            //         })
            //       : "NA"}
            //   </span>
            // </div>
        // ),
    },
    {
        key: "action",
        label: "Action / Current status",
        sortable: false,
        contentWidth: `max-w-none`,
        render: (row: AgencyInvitesListDetailsDto) => {
        const colorClass = statusColors[row.inviteStatus as JobApplicationStatusType] ?? "bg-gray-100 text-gray-500";
        return (
            <div className='flex justify-center m-auto gap-1'>
              {row.inviteStatus === "AWAITING" ? (
                <>
                  <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={row.inviteStatus as JobApplicationStatusType}
                    data-tooltip-place="top"
                    className="border rounded-lg p-2 bg-green-600 text-white"
                    onClick={() => {
                      acceptAndReject(row,"ACCEPTED")
                      setEditProfileData(row);
                    }}
                  >
                    <Check className="w-3 h-3 shrink-0 rounded-sm" />
                  </button>

                  <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={row.inviteStatus as JobApplicationStatusType}
                    data-tooltip-place="top"
                    className="border rounded-lg p-2 bg-red-600 text-white"
                    onClick={() => {
                      acceptAndReject(row,"REJECTED")
                      setEditProfileData(row);
                    }}
                  >
                    <X className="w-3 h-3 shrink-0" />
                  </button>
                </>
              ):
              <span 
                data-tooltip-id="my-tooltip"
                data-tooltip-content={row.inviteStatus as JobApplicationStatusType}
                data-tooltip-place="top"
                className={`px-3 py-1 h-fit rounded-full text-[0.625rem] font-medium overflow-visible  capitalize ${colorClass}`}>
                {newDisplayStatus[row.inviteStatus as JobApplicationStatusType]}</span>
              }
            </div>
        )}
    },
];

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
        onSortChange={onSortChange}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        handlePreviousPage={() => onPageChange(currentPage - 1)}
        handleNextPage={() => onPageChange(currentPage + 1)}
        hasPrevPage={currentPage > 1}
        hasNextPage={!!pagination?.lastKey}
        />
    </>
  );
}
