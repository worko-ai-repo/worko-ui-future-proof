import { useEffect, useMemo, useState } from "react";
import { Eye, FileText, ArrowLeft } from "lucide-react";
// import { DynamicTable, Column } from "../DynamicTable";
import ProgressCircle from "@Components/Shared/ui/CircularBarAgency";

import { useAppContext } from "@Context/App.context";

import { useCursorPagination } from "@Hooks/usePaginatedQuery.hook";
import SkeletonLoader from "../SkeletonLoader";
import { CursorPaginationAdminBulkScreenedJobsParams } from "@Interfaces/AdminServices.dto";
import { ResumeScreeningRecordDto } from "@Interfaces/CorporateServices.dto";
import CorporateServiceObj from "@Components/Dashboard/Agency/Pages/Services/Corporate.service";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SecureStorageKeyEnum } from "@Enums/SecureStorage.enum";
import secureStorage from "@Utils/SecureStorage.utils";
import { RBAC } from "@Utils/RoleBaseAccessControll.utils";
import { useSortableData } from "@Hooks/useSortTableData.hook";
import Modal from "../Modal";
import jobApplicationServiceObj from "@Utils/ApplicationPage.utils";
import ScorePointsModal, { ScorePointsModalProps } from "../ui/DetailedAnalysis";
import NoDataPresent from "../NoDataPresent";
import CVPreviewRaw from "../CvPreviewRaw";
import { toast } from "react-toastify";
import httpServiceObj from "@Services/ApiHandler.service";
import { getToastOptions } from "@Utils/Toast.utils";
import CreatedByDisplay from "../Postjob/CreatedByDisplay";
import { DynamicTableTwo, Column } from "../DynamicTableTwo";
import { NewDynamicTable } from "../NewDynamicTable";




interface ApplicantScreeningRecord extends ResumeScreeningRecordDto {
  id: string;
  name: string;
  company: string;
  designation: string;
  yoe: number;
  location: string;
  matchingScore: number;
  status: string;
  rejectedDate: string | null;
  viewedDate: string | null;
}

export default function ApplicantScreeningTable() {
  const nav = useNavigate();
  const location = useLocation();
  const { userDetails } = useAppContext();

  //{ state: { jobTitle: row?.jobTitle } } get this and set the job title
  const locationState = (location.state as { jobTitle?: string; returnUrl?: string } | null) ?? {};
  const queryJobTitle = new URLSearchParams(location.search).get("jobTitle") ?? "";
  const jobTitle = locationState.jobTitle ?? queryJobTitle ?? "";
  const returnUrl = locationState.returnUrl;
  const fallbackReturnUrl = `${"/agency/agBulkCVCheck" }?tab=screening-list`;

  const [FeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [scorePointsModal, setScorePointsModal] = useState<ScorePointsModalProps>();
  const [isViewCVModalOpen, setIsViewCVModalOpen] = useState(false);
  const [pdfViewDetails, setPdfViewDetails] = useState<string>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [pdfViewUserDetails, setPdfViewUserDetails] = useState<{
    name: string;
    YOE?: number;
    companyName?: string;
  }>({ name: "" });
  const [pageSize, setPageSize] = useState<number>(10);
  const { id } = useParams<{ id: string }>();
  const baseUrl = import.meta.env.APP_PROXY_AGENCY_BASE
  if (!id) {
    nav("/404");
  }
  const companyId = RBAC.can("play_admin")
    ? import.meta.env.APP_WORKO_COMP_ID
    : userDetails?.id;
  const fallbackKeys = {};
  const params: Omit<CursorPaginationAdminBulkScreenedJobsParams, "lastKey"> = {
    pageSize: pageSize,
    // sortOrder: "descending",
    // companyId: companyId,
    agencyBulkJdId: id as string,
  };

  const {
    data,
    isLoading: queryIsJobsLoading,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    refetch,
    reset,
  } = useCursorPagination<ResumeScreeningRecordDto, CursorPaginationAdminBulkScreenedJobsParams>({
    queryKey: ["ApplicantScreeningBulkQuery", !!companyId, params],
    queryFn: CorporateServiceObj.getBulkScreeningResumes,
    baseParams: params,
    enabled: !!companyId,
  });

  //  Replace useEffect with useMemo to avoid infinite re-renders
  const applicantsData = useMemo((): ApplicantScreeningRecord[] => {
    if (data && Array.isArray(data)) {
      return data
        .filter((item) => !!item.cvExtractedParsed)
        .map((item) => ({
          ...item,
          id: item.id,
          name: item.cvExtractedParsed!.candidateName,
          company: item.cvExtractedParsed!.candidateCurrentCompany,
          designation: item.cvExtractedParsed!.candidateCurrentDesignation,
          yoe: Number(item.cvExtractedParsed!.candidateExperience),
          location: item.cvExtractedParsed!.candidateLocation,
          matchingScore: item.matchingScore,
          status: item.processingStatus,
          rejectedDate: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : null,
          viewedDate: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : null,
        }));
    }
    return [];
  }, [data]);
  const { sortedData, onSortChange } = useSortableData(applicantsData, fallbackKeys,    {
    tableId:"screening-list-view",
    defaultSort:null,
    persistInLocalStorage:false,
    persistInUrl:true
  });

  // Keep the reset useEffect as it's safe
  useEffect(() => {
    reset();
  }, [pageSize, reset]); // Add reset to dependencies

  const toggleSelectAll = () => {
    if (selectedRows.length === applicantsData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(applicantsData.map((row) => row?.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleCVUrlGenerator = async (agencyBulkJdId: string, id: string, fileName: string) => {
  if (!fileName && !id) {
    toast.error("Document file not found", getToastOptions({}));
    return;
  }
  try {
    const payload = {
      agencyBulkJdId,
      bulkCvsAwsS3FileName:fileName
    };
    const { response, error } = await httpServiceObj.post<any>(`${baseUrl}/file/gsu2v/AGENCY_BULK_CVS`, payload, true, {}, true);
    if (!response || error) {
      throw new Error("Failed to get pre-signed URL for document");
    }
    return response.objectUrl;
  } catch (error) {
    console.error("Error viewing document:", error);
    toast.error("Failed to view document", getToastOptions({}));
  }
};

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const columns: Column<(typeof applicantsData)[0]>[] = [
    {
      key: "name",
      label: "Applicants name",
      sortable: true,
      contentWidth:"max-w-none",
      render: (row: (typeof applicantsData)[0]) => (
        <div className="flex w-full  mx-auto justify-center   items-center gap-3">
          <div className="w-10 h-10 mx-auto bg-gray-200  rounded-lg flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {row?.name
          .split(" ")
          .map((n: string) => n[0])
          .slice(0, 3) // limit to max 3 initials
          .join("")}
            </span>
          </div>
          <span 
          data-tooltip-id="my-tooltip"
          data-tooltip-content={row?.name}
          className="font-semibold text-gray-800  flex-1 text-left truncate">{row?.name}</span>
        </div>
      ),
    },
    {
      key: "company",
      label: "Company",
      sortable:true,
      render: (row: (typeof applicantsData)[0]) => (
        <span
        data-tooltip-id="my-tooltip"
        data-tooltip-content={row?.company}
        className="text-gray-700">{row?.company}</span>
      ),
    },
    {
      key: "designation",
      label: "Designation",
      sortable:true,
      render: (row: (typeof applicantsData)[0]) => (
        <span
        data-tooltip-id="my-tooltip"
        data-tooltip-content={row?.designation}
        className="text-gray-700">{row?.designation}</span>
      ),
    },
    {
      key: "yoe",
      label: "YOE",
      sortable:true,
      render: (row: (typeof applicantsData)[0]) => (
        <span className="font-semibold text-gray-800">{row?.yoe}</span>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable:true,
      render: (row: (typeof applicantsData)[0]) => (
        <span title={row?.location} className="text-gray-700">{row?.location}</span>
      ),
    },
    {
      key: "matchingScore",
      label: "Matching Score",
      sortable: true,
      render: (row: (typeof applicantsData)[0]) => (
        <div className="flex justify-center">
          <ProgressCircle
            onClick={() => {
              setFeedbackModalOpen(true);
              const application = jobApplicationServiceObj.getScoreDetails(row as any);
              if (application === null) return;
              setScorePointsModal({
                title: application.type === "SCORE" ? "Matching Score Details" : "Rejected Reason",
                data: application.feedback, // Assuming matchingScore is an object with details
                matchingScore: row?.matchingScore ?? 0,
                candidateName: row?.name,
                details: true,
                showCloseButton: true,
                onClose: () => setFeedbackModalOpen(false),
              });
              // console.log("Matching Score Details:", scorePointsModal);
            }}
            value={row?.matchingScore}
          />
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: (typeof applicantsData)[0]) => (
        <div className="flex mx-auto w-auto justify-center gap-2">
          <button
            onClick={async () => {
              const url = await handleCVUrlGenerator(
                row?.agencyBulkJdId,
                row?.companyId,
                row?.cloudFileName
              );
              setPdfViewDetails(url);
              setPdfViewUserDetails({
                name: row.name,
                YOE: row.yoe,
                companyName: row.company,
              });
              setIsViewCVModalOpen(true);
            }}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="View CV"
            className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <FileText className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      ),
    },
  ];

  const renderExpandedDetails = (row: (typeof applicantsData)[0]) => (
    <div className="flex justify-between items-center py-2">
      <div className="text-xs text-gray-600">
        <strong>Status:</strong>
        <span
          className={`ml-2 px-3 py-1 rounded-full text-[0.625rem] font-medium ${
            row?.status === "accepted"
              ? "bg-green-100 text-green-800"
              : row?.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
          {row?.status.charAt(0).toUpperCase() + row?.status.slice(1)}
        </span>
      </div>

      <div className="flex gap-4 text-xs text-gray-600">
        {row?.rejectedDate && (
          <div>
            <span className="font-medium">Rejected on:</span>
            <span className="ml-2">{row?.rejectedDate}</span>
          </div>
        )}
        {row?.viewedDate && (
          <div>
            <span className="font-medium">Viewed on:</span>
            <span className="ml-2">{row?.viewedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
  if (queryIsJobsLoading) {
    return (
      <div className="max-h-screen bg-gray-50 min-w-[60vw] ">
        <SkeletonLoader
          showButtons={true}
          buttonCount={1}
          showTableHeader={true}
          showTableRows={true}
          tableColumns={5}
          rowCount={5}
        />
      </div>
    );
  }
  return (
    <div className="max-h-screen  ">
      {/* Header Section */}
      <div className="my-6">
        <div className="flex  flex-wrap items-center gap-4 mb-6">
          <button
            onClick={() => {
              nav(returnUrl || fallbackReturnUrl);
            }}
            className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex flex-wrap gap-4">
            {/* Job Profile Card */}
            <div className="bg-white max-w-[200px] rounded-xl shadow-sm p-4 w-80">
              <div className="text-center h-full flex flex-col justify-between items-center ">
                <div className="text-sm text-gray-500 mb-1">Job profile</div>
                <div
                  className="text-xs font-bold text-blue-600 capitalize line-clamp-1 cursor-pointer"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content={jobTitle}>
                  {jobTitle ?? "-----"}
                </div>
              </div>
            </div>

            {/* Screened Card */}
            <div className="bg-white max-w-[200px] rounded-xl shadow-sm p-4 w-40">
              <div className="text-center h-full flex flex-col justify-between items-center  ">
                <div className="text-sm text-gray-500 mb-1">Screened</div>
                <div className="text-2xl font-bold text-blue-500">{applicantsData.length}</div>
              </div>
            </div>

            {/* Screening Done By Card */}
            <div className="bg-white max-w-[200px] rounded-xl shadow-sm p-4 ">
              <div className="text-center h-full flex flex-col justify-between items-center ">
                <div className="text-sm text-gray-500 mb-1">Screening done by</div>
                <div className="text-xs font-semibold text-gray-800 capitalize">
                  <CreatedByDisplay row={data?.[0]} mode="created" />
                </div>
              </div>
            </div>

            {/* Screening Time Card */}
            <div className="bg-white max-w-[200px] rounded-xl shadow-sm p-4 w-72">
              <div className="text-center h-full flex flex-col justify-between items-center ">
                <div className="text-sm text-gray-500 mb-1">Screening time</div>
                <div className="text-xs font-semibold text-gray-800">
                  {new Date(data?.[0]?.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <NewDynamicTable
        columns={columns}
        renderExpandedDetails={renderExpandedDetails}
        toggleExpand={toggleExpand}
        expandedRows={expandedRows}
        toggleRow={toggleRow}
        rows={sortedData}
        selectedRows={selectedRows}
        enableSelect={false}
        onSortChange={onSortChange}
        allSelected={selectedRows.length === applicantsData.length}
        pageSize={pageSize}
        setPageSize={setPageSize}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPreviousPage}
        handleNextPage={goToNextPage}
        handlePreviousPage={goToPreviousPage}
        enableExpand={true}
      />
      <Modal
        isOpen={FeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        className="h-full">
        {scorePointsModal && <ScorePointsModal {...scorePointsModal} />}
      </Modal>
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
              setPdfViewUserDetails({name:""})
            }}
            candidateFullDetails={pdfViewUserDetails}
            showDownload={true} 
          />
        )}
      </Modal>
    </div>
  );
}
