import React, { useState } from "react";
import { Eye, Pencil, User } from "lucide-react";
import { useSortableData } from "@Hooks/useSortTableData.hook";
import secureStorage from "@Utils/SecureStorage.utils";
import { SecureStorageKeyEnum } from "@Enums/SecureStorage.enum";
import { useAppContext } from "@Context/App.context";
import { NormalizedUser } from "@Utils/NormalizeUser";
import { Edit, View } from "@AssetsFolder/assets";
import { JobApplicationStatusType } from "../../../../../types/JobsAndApplication.type";
import { DynamicTableTwo } from "@Components/Shared/DynamicTableTwo";
import { AgencyApplicantsListDetailsDto } from "@Interfaces/AgencyDashboardList.dto";
import httpServiceObj from "@Services/ApiHandler.service";
import NoDataPresent from "@Components/Shared/NoDataPresent";
import CVPreviewRaw from "@Components/Shared/CvPreviewRaw";
import Modal from "@Components/Shared/Modal";
import { NewDynamicTable } from "@Components/Shared/NewDynamicTable";
import ViewFullDetail from "@Components/Shared/ViewFullDetail";

export const statusColors: Record<JobApplicationStatusType, string> = {
  APPLIED: "bg-[#D6F4FF] text-[#00ADC0]",
  ACCEPTED: "bg-[#00ADC0] text-[#D6F4FF]",
  REJECTED: "bg-[#FFD0D0] text-[#D40000]",
  UNDER_EVALUATION: "bg-[#EFEFEF] text-[#616161]",
  PROCESSING_INTERVIEW: "bg-green-100 text-green-500",
  HIRED: "bg-[#4CBC9A38] text-[#00BF29]",
  CV_DOWNLOADED: "bg-[#00ADC0] text-[#D6F4FF]",
  INTERVIEW_DONE: "bg-[#E3F7F7] text-[#008B8B]",
  ALL: "bg-[#E6E4FF] text-[#5C55D4]",
  ON_HOLD: "bg-[#FFF3CD] text-[#856404]",
  JOINED: "bg-[#D1E7DD] text-[#0F5132]",
  DOCUMENT_REQUESTED: "bg-[#D6F4FF] text-[#00ADC0]",
  DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED: "bg-[#D6F4FF] text-[#00ADC0] has-notification",
  DOCUMENT_REVISION_REQUEST_SUBMITTED: "bg-[#D6F4FF] text-[#00ADC0] has-notification",
  DOCUMENT_REVISION_REQUESTED: "bg-[#D6F4FF] text-[#00ADC0] has-notification",
  DOCUMENT_SUBMITTED: "bg-[#D6F4FF] text-[#00ADC0] has-notification",
  DOCUMENT_VERIFIED: "bg-[#D6F4FF] text-[#00ADC0]",
  OFFER_SENT: "bg-[#D6F4FF] text-[#00ADC0]",
  HIRING_IN_PROCESS: "bg-[#D6F4FF] text-[#00ADC0]",
  DOCUMENT_ADDITIONAL_REQUESTED: "bg-[#D6F4FF] text-[#00ADC0]",
  OFFER_ISSUE_RAISED: "bg-[#FFD700] text-[#856404]",
  REVISED_OFFER_SENT: "bg-[#D6F4FF] text-[#00ADC0]",
  REVISED_LETTER: "bg-[#D6F4FF] text-[#00ADC0]",
  OFFER_ACCEPTED: "bg-[#D1E7DD] text-[#0F5132]",
  AWAITING: "bg-[#D6F4FF] text-[#00ADC0]",
};

export const newDisplayStatus: Record<JobApplicationStatusType, string> = {
  ALL: "All",
  APPLIED: "Applied/Pending",
  ACCEPTED: "Accepted",
  CV_DOWNLOADED: "CV Downloaded",
  UNDER_EVALUATION: "Evaluation Pending",
  PROCESSING_INTERVIEW: "Interviewing",
  INTERVIEW_DONE: "Interview Done",
  HIRING_IN_PROCESS: "Hiring in Process",
  DOCUMENT_REQUESTED: "Document Requested",
  DOCUMENT_ADDITIONAL_REQUESTED: "Additional Document Requested",
  DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED: "Document Requested",
  DOCUMENT_REVISION_REQUESTED: "Document Requested",
  DOCUMENT_REVISION_REQUEST_SUBMITTED: "Document Requested",
  DOCUMENT_SUBMITTED: "Document Submitted",
  DOCUMENT_VERIFIED: "Document Verified",
  HIRED: "Hired",
  OFFER_SENT: "Offer Sent",
  JOINED: "Joined",
  ON_HOLD: "On Hold",
  REJECTED: "Rejected",
  OFFER_ISSUE_RAISED: "Offer Issue Raised",
  REVISED_OFFER_SENT: "Revised Offer Sent",
  REVISED_LETTER: "Revised Letter Sent",
  OFFER_ACCEPTED: "Offer Accepted",
  AWAITING: "Awaiting",
};

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


export default function ApplicantsListTable(props: any) {
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
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [dropdownVisibleRows, setDropdownVisibleRows] = useState<string[]>([]);
  const [selectedStatusDropdown, setSelectedStatusDropdown] = useState<string>("");
  const [scorePointsModal, setScorePointsModal] = useState<any>();
  const [pdfViewDetailsID, setPdfViewDetailsID] = useState<string | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState({ isOpen: false, applicant: {} as any, action: "EDIT" as "EDIT" | "VIEW" });
  const [editProfileView,setEditProfileView] = useState<boolean>(false);
  const [editProfileData,setEditProfileData] = useState<AgencyApplicantsListDetailsDto | undefined>();
  const [feedbackModalOpen,setFeedbackModalOpen] = useState<boolean>(false);
  const [pdfViewDetails, setPdfViewDetails] = useState<string>();
  // App context
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);
  const { userDetails } = useAppContext() as { userDetails: NormalizedUser };
  const [isViewCVModalOpen,setIsViewCVModalOpen] = useState<boolean>(false);
  const [viewViewDetailsModal, setViewViewDetailsModal] = useState<boolean>(false);
  const [fullDetails, setFullDetails] = useState<string>("");
  const [pdfViewUserDetails, setPdfViewUserDetails] = useState<{
    name: string;
    YOE?: number;
    companyName?: string;
  }>({ name: "" });
  // Sorting hook (keeps same fallback keys as before)
    const keyFallbacks = {
        companyName: ["jobDetails.companyName"],
        jobProfile: ["jobDetails.jobTitle"],
        dateSubmitted: ["candidateParsedCvDetails.updatedAt"],
        applicantName: ["candidateParsedCvDetails.name"],
        email: ["candidateParsedCvDetails.email"],
        contactNumber: ["candidateParsedCvDetails.phoneNumberDetails.number"],
        currentCompany: ["candidateParsedCvDetails.currentCompany"],
        currentDesignation: ["candidateParsedCvDetails.currentDesignation"],
        totalYOE: ["candidateParsedCvDetails.totalYOE"],
        relevantYOE: ["candidateParsedCvDetails.relevantYOE"],
        currentCTC: ["candidateParsedCvDetails.currentCTC"],
        expectedCTC: ["candidateParsedCvDetails.expectedCTC"],
        noticePeriod: ["candidateParsedCvDetails.noticePeriod"],
        location: ["candidateParsedCvDetails.location"],
        readyToRelocate: ["candidateParsedCvDetails.readyToRelocate"],
        anyComment: ["agencyComments"],
        status: ["jobApplicationStatus"]
    };

//   const { sortedData, onSortChange } = useSortableData(data as any, keyFallbacks);

    const { sortedData, onSortChange } = useSortableData<AgencyApplicantsListDetailsDto>(data, keyFallbacks, {
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

  // Column definitions (kept same as previous "All" view)
  const columns = [
      {
          key: "companyName",
          label: "Company name",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => row?.jobDetails?.companyName ?? "NA"
          // (
          //     <div className='flex justify-center m-auto w-[150px]'>
          //         <span 
          //         title={row?.jobDetails?.companyName}
          //         className="truncate block w-full">{row?.jobDetails?.companyName ?? "NA"}</span>
          //     </div>
          // ),
      },
      {
          key: "jobProfile",
          label: "Job Profile",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => row?.jobDetails?.jobTitle ?? "NA"
          // (
          //     <div className="flex justify-center m-auto w-[150px] text-center">
          //         <a
          //             href={row?.jobDetails?.jobUrl}
          //             target="_blank"
          //             rel="noopener noreferrer"
          //             className="truncate block w-full"
          //             data-tooltip-id="my-tooltip"
          //             data-tooltip-content={row?.jobDetails?.jobTitle}
          //             data-tooltip-place="top"
          //         >
          //             {row?.jobDetails?.jobTitle ?? "NA"}
          //         </a>
          //     </div>
          // ),
      },
      {
          key: "dateSubmitted",
          label: "Date Submitted",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => row?.candidateParsedCvDetails?.updatedAt
                ? new Date(row?.candidateParsedCvDetails?.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "NA"
        // (
        //   <div className='flex justify-center m-auto w-[150px]'>
        //       {row?.candidateParsedCvDetails?.updatedAt
        //         ? new Date(row?.candidateParsedCvDetails?.updatedAt).toLocaleDateString("en-GB", {
        //             day: "2-digit",
        //             month: "2-digit",
        //             year: "numeric",
        //           })
        //         : "NA"}
        //   </div>
        // ),
      },
      {
          key: "applicantName",
          label: "Applicant Name",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => row?.candidateParsedCvDetails?.name ?? "NA"
          // (
          //     <div className='flex justify-center m-auto w-[150px]'>
          //     <span 
          //         title={row?.candidateParsedCvDetails?.name}
          //         className="truncate block w-full">{row?.candidateParsedCvDetails?.name ?? "NA"}</span>
          //     </div>
          // ),
      },
      {
          key: "email",
          label: "Email ID",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => row?.candidateParsedCvDetails?.email ?? "NA"
          // (
          //     <div className='flex justify-center m-auto w-[150px] text-center'>
          //         <span 
          //         title={row?.candidateParsedCvDetails?.email}
          //         className="truncate block w-full">{row?.candidateParsedCvDetails?.email ?? "NA"}</span>
          //     </div>
          // ),
      },
      {
          key: "contactNumber",
          label: "Contact number",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => `+${row?.candidateParsedCvDetails?.phoneNumberDetails?.countryCode} ${row?.candidateParsedCvDetails?.phoneNumberDetails?.number ?? "NA"}`
          // (
          // <div className='flex justify-center m-auto w-[150px]'>
          //   {row?.candidateParsedCvDetails?.phoneNumberDetails?.countryCode && row?.candidateParsedCvDetails?.phoneNumberDetails?.number
          //   ? <span>+{row?.candidateParsedCvDetails?.phoneNumberDetails?.countryCode} {row?.candidateParsedCvDetails?.phoneNumberDetails?.number}</span>
          //   : <span>{"NA"}</span>}     
          // </div>
          // ),
      },
      {
          key: "currentCompany",
          label: "Current Compnay",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => row?.candidateParsedCvDetails?.currentCompany ?? "NA"
          // (
          //     <div className='flex justify-center m-auto w-[150px]'>
          //         <span 
          //         title={row?.candidateParsedCvDetails?.currentCompany}
          //         className="truncate block w-full">{row?.candidateParsedCvDetails?.currentCompany ?? "NA"}</span>
          //     </div>
          // ),
      },
      {
          key: "currentDesignation",
          label: "Current designation",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => row?.candidateParsedCvDetails?.currentDesignation ?? "NA"
          // (
          //     <div className='flex justify-center m-auto w-[150px]'>
          //         <span 
          //         title={row?.candidateParsedCvDetails?.currentDesignation}
          //         className="truncate block w-full">{row?.candidateParsedCvDetails?.currentDesignation ?? "NA"}</span>
          //     </div>
          // ),
      },
      {
          key: "totalYOE",
          label: "Total YOE",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => (
              <div className='flex justify-center m-auto'>
                  <span>{row?.candidateParsedCvDetails?.totalYOE ?? "NA"}</span>
              </div>
          ),
      },
      {
          key: "relevantYOE",
          label: "Relevant YOE",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => (
              <div className='flex justify-center m-auto'>
                  <span>{row?.candidateParsedCvDetails?.relevantYOE ?? "NA"}</span>
              </div>
          ),
      },
      {
          key: "currentCTC",
          label: "CTC",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => (
              <div className='flex justify-center m-auto'>
                  <span>{row?.candidateParsedCvDetails?.currentCTC ?? "NA"}</span>
              </div>
          ),
      },
      {
          key: "expectedCTC",
          label: "ECTC",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => (
              <div className='flex justify-center m-auto'>
                  <span>{row?.candidateParsedCvDetails?.expectedCTC ?? "NA"}</span>
              </div>
          ),
      },
      {
          key: "noticePeriod",
          label: "Notice Period",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => (
              <div className='flex justify-center m-auto'>
                  <span>{row?.candidateParsedCvDetails?.noticePeriod ?? "NA"}</span>
              </div>
          ),
      },
      {
          key: "location",
          label: "Location",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => row?.candidateParsedCvDetails?.location ?? "NA"
          // (
          //       <div className='flex justify-center m-auto w-[150px]'>
          //         <span 
          //         title={row?.candidateParsedCvDetails?.location}
          //         className="truncate block w-full">{row?.candidateParsedCvDetails?.location ?? "NA"}</span>
          //     </div>
          // ),
      },
      {
          key: "readyToRelocate",
          label: "Ready to relocate",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => (
          <div className='flex justify-center m-auto'>
              <span>{row?.candidateParsedCvDetails?.readyToRelocate === true
                  ? "Yes"
                  : row?.candidateParsedCvDetails?.readyToRelocate === false
                  ? "No"
                  : "NA"}
              </span>
          </div>
          ),
      },
      {
          key: "anyComment",
          label: "Any comment",
          sortable: true,
          render: (row: AgencyApplicantsListDetailsDto) => 
          (
            <div className='flex justify-center items-center m-auto'>
                <span 
                title={row?.agencyComments}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={"Click to view full details"}
                onClick={() => {
                  setViewViewDetailsModal(true);
                  setFullDetails(row?.agencyComments || "N/A");
                }}
                className="truncate block w-full">{row?.agencyComments ?? "NA"}</span>
            </div>
          ),
      },
      {
          key: "viewCV",
          label: "CV",
          sortable: false,
          render: (row: AgencyApplicantsListDetailsDto) => (
          <div className='flex justify-center m-auto'>
              <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="View CV"
              data-tooltip-place="top"
              className="flex flex-row justify-center items-center"
              onClick={()=>{
              viewCV(row)
              setEditProfileData(row)
              }}>
              <img src={View} alt="View" className="w-8 h-8 btn-sky shrink-0 "/>
              </button>
          </div>
          )
      },
      {
          key: "status",
          label: "Current status",
          sortable: true,
          contentWidth: `max-w-none`,
          render: (row: AgencyApplicantsListDetailsDto) => {
              // <div className='flex justify-center m-auto w-[150px]'>
              //     <span>{row?.currentStatus ?? "NA"}</span>
              // </div>
              const colorClass =
                  statusColors[row?.jobApplicationStatus as JobApplicationStatusType] ?? "bg-gray-100 text-gray-500";
      
              return (
                  <div className="flex justify-center  mx-auto p-2 w-fit relative">
                  <span
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={row?.jobApplicationStatus as JobApplicationStatusType}
                    data-tooltip-place="top"
                    className={`px-3 py-1 h-fit rounded-full text-[0.625rem] font-medium overflow-visible  capitalize ${colorClass}`}>
                    {newDisplayStatus[row?.jobApplicationStatus as JobApplicationStatusType]}
                  </span>
                  </div>
              );
          },
      },
  ];

  // Toggle row expansion
  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

    const viewCV = async (row:AgencyApplicantsListDetailsDto) =>{
        const payload = {
            companyId: row?.companyId,
            jobId:row?.jobId,
            agencyUserId: row?.agencyUserId,
            candidateCvAwsS3FileName: row?.candidateParsedCvDetails?.cvAwsS3FileName,
        }
        try {
        const {response} = await httpServiceObj.post<any>(`/file/gsu2v/AGENCY_SUBMIT_USER_CV`,payload,true,{},false,"BASE")
        setPdfViewDetails(response.objectUrl)
        setPdfViewUserDetails({
          name: row.candidateParsedCvDetails.name,
          YOE: row.candidateParsedCvDetails?.totalYOE,
          companyName: row.candidateParsedCvDetails?.currentCompany,
        });
        setIsViewCVModalOpen(true)
        } catch (error) {
        console.log(error)
        }
    }

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
        enableSelect={false}
        onSortChange={onSortChange}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        handlePreviousPage={() => onPageChange(currentPage - 1)}
        handleNextPage={() => onPageChange(currentPage + 1)}
        hasPrevPage={currentPage > 1}
        hasNextPage={!!pagination?.lastKey}
        />
        <Modal
          isOpen={isViewCVModalOpen}
          onClose={() => {
            setIsViewCVModalOpen(false);
          }}
          className="w-[90vw] sm:max-w-4xl h-full">
          {!pdfViewDetails ? (
            <NoDataPresent />
          ) : (
            <CVPreviewRaw 
            pdfUrl={pdfViewDetails} 
            onClose={() => {
              setIsViewCVModalOpen(false)
              setEditProfileData(undefined)
              setPdfViewUserDetails({name:""})
            }} 
            candidateFullDetails={pdfViewUserDetails}
            showDownload={true}/>
          )}
        </Modal>
        <ViewFullDetail
          onClose={() => {
            setViewViewDetailsModal(false);
            setFullDetails("");
          }}
          isOpen={viewViewDetailsModal}
          fullDetails={fullDetails}
          displayText={"Comments"}
        />
    </>
  );
}
