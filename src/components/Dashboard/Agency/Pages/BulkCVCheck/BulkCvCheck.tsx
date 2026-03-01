import JobListDropdown, {DropDownSelectedJobData,} from "@Components/Shared/DropDown/JobListDropdown";
import { useState, useEffect, Suspense } from "react";
import CorporateServiceObj from "../Services/Corporate.service";
import { useLocation, useNavigate } from "react-router-dom";
import ScreeningListView from "@Components/Shared/BulkCvPage/BulkScreeningListView";
import BulkCvForm from "@Components/Shared/BulkCvPage/BulkCvForm";
import Modal from "@Components/Shared/Modal";
import { toast } from "react-toastify";
import { getToastOptions } from "@Utils/Toast.utils";

export interface BulkJdParsedData {
  jobTitle: string;
  salaryRange: {
    min: string; // could be number if you plan to store salary as numeric
    max: string;
  };
  experienceRange: {
    min: string;
    max: string;
  };
  numberOfOpenings: string;
  workMode: string;
  location: string;
  noticePeriod: string;
  typeOfEmployment: string;
  department: string;
  coreSkills: string[];
  softSkills: string[];
  technicalSkills: string[];
  goodToHaveSkills: string[];
  mustHaveSkills: string[];
  mandatoryRequirements: string[];
  preferredRequirements: string[];
  formattedHTML: string;
}

export type SelectedRow = {
  companyId: string;
  jobId: string;
  status: "ARCHIVED" | "CLOSED" | "PUBLISHED";
};

const BulkCVCheck: React.FC = () => {
  const [isScreeningNew, setisScreeningNew] = useState(true);
  const [data, setData] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const [jobdescription, setJobDescription] = useState<string>("");
  const [dropDownData, setDropDownData] = useState<DropDownSelectedJobData | null>(null);
  const [isbulkCvFormOpen, setIsBulkCvFormOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    setisScreeningNew(tab !== "screening-list");
  }, [location.search]);

  //UseEffect to get the state from location for description and open the form directly if data is present in state and page is screening new
  useEffect(() => {
    if (location.state && isScreeningNew) {
      const stateData = location.state as { jobDesc: string };
      if (stateData.jobDesc) {
        handleParseJd(stateData.jobDesc);
        setDropDownData(null);
      }
      // Clear the state to prevent re-triggering on subsequent renders
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, isScreeningNew, navigate]);
  
  const handleTabChange = (isFormOpen: boolean) => {
    setisScreeningNew(isFormOpen);
    const tab = isFormOpen ? "new-screening" : "screening-list";
    navigate(`?tab=${tab}`);
  };

  async function handleParseJd(jobDescription: string) {
    try {
      if (!jobDescription.trim()) {
        toast.error("Please enter a valid job description.", getToastOptions());
        return;
      }
      setLoader(true);
      const response = await CorporateServiceObj.parseJobDescription(jobDescription);
      if (!response) {
        throw new Error("Failed to parse job description");
      }
      setData(response);
    } catch (error) {
      console.error("Error parsing job description:", error);
    } finally {
      setJobDescription(jobDescription);
      setLoader(false);
      setIsBulkCvFormOpen(true);
    }
  }

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap justify-center mb-4 mt-1 border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            isScreeningNew ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
          }`}
          onClick={() => handleTabChange(true)}>
          New screening
        </button>
        <button
          className={`px-4 py-2 font-medium ml-6 text-sm ${
            !isScreeningNew ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
          }`}
          onClick={() => handleTabChange(false)}>
          Screening list
        </button>
      </div>
      {/* Conditional Rendering */}
      {isScreeningNew ? (
        <div className="space-y-6 bg-white rounded-xl p-6">
          <h2 className="text-start font-semibold text-gray-800 text-sm">Bulk cv check</h2>

          <div className="px-8">
            <JobListDropdown
              onSelect={(job) => {
                setJobDescription(job.jobDescription);
                handleParseJd(job.jobDescription);
                setDropDownData(job);
              }}
            />
          </div>

          {/* OR Divider */}
          <div className="text-center text-blue-600 font-medium">Or</div>

          {/* Text Area */}
          <div className="px-8">
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-600">*</span> Paste job description
            </label>
            <div className="relative">
              <textarea
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  handleParseJd(e.target.value);
                  setDropDownData(null);
                }}
                className="w-full h-60 p-4 rounded-md bg-[#EBEFF3] text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write or paste here"
              />
            </div>
          </div>
        </div>
      ) : (
        <ScreeningListView />
      )}
      {isbulkCvFormOpen && (
        <Modal
          isOpen={isbulkCvFormOpen}
          className={"max-w-[1000px] max-sm:w-[80vw]"}
          onClose={() => setIsBulkCvFormOpen(false)}>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading form...</span>
              </div>
            }>
            <BulkCvForm
              isOpen={isbulkCvFormOpen}
              jobData={data}
              dropDownData={jobdescription}
              onClose={() => setIsBulkCvFormOpen(false)}
              selectedJob={dropDownData}
            />
          </Suspense>
        </Modal>
      )}{" "}
    </div>
  );
};

export default BulkCVCheck;
