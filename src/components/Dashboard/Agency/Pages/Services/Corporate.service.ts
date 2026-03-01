import { JobFormSchema } from "@Components/Dashboard/types";
import {
  ApiResponseDto,
  CorporateInvite,
  JobApiResponse,
  JobApplicationDetailsDto,
  ReferralDetailsDto,
} from "@Interfaces/CorporateDashboard.dto";
import { JobDto } from "@Interfaces/JobsAndCompany.dto";
import httpServiceObj from "@Services/ApiHandler.service";
import { SelectedRow } from "@Components/Dashboard/Agency/Pages/BulkCVCheck/BulkCvCheck";
import {
  CorporateBulkScreeningDto,
  FileMetadataDto,
  BulkUploadResponseDto,
  BulkScreeningListItemDto,
  ResumeScreeningRecordDto,
  JobEvaluationRequestDto,
  BulkJobApplicationUpdateItem,
  EvaluationResponseItemDto,
  BulkJobApplicationUpdatePayload,
  BulkScreeningResponse,
} from "@Interfaces/CorporateServices.dto";
import { BulkJdParsedData } from "@Components/Dashboard/Agency/Pages/BulkCVCheck/BulkCvCheck";
import { AgencyListDetailsDto } from "@Interfaces/AgencyDatabaseApplicantDetailsDto";

const workoBaseApi = import.meta.env.APP_PROXY_AGENCY_BASE
const workoJobApi = import.meta.env.APP_JOBS_API_URI
/**
 * Corporate Service File
 *
 * @description - This file contains the Api calls made on the behalf of Corporate Component
 */
class CorporateService {
  /**
   * postJobs
   *
   * @type {POST}
   *
   * @description - This api is used to post jobs based on the tab - OPEN ARCHIVED AND CLOSED.
   *
   * @param {JobFormSchema} payload for the job Api
   *
   * @return {Promise<JobDto>} -= Common job data that will be listed in the corporate dashboard.
   */
  async postJobs(payload: JobFormSchema, params: object): Promise<JobDto | []> {
    try {
      const { response } = await httpServiceObj.post<JobDto>(
        "/job",
        payload,
        true,
        params,
        false,
        "JOB"
      );

      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to update Job.", error);
      return [];
    }
  }

  /**
   * fetchJobs
   *
   * @type {GET}
   *
   * @description - This api is used to get jobs based on the tab - OPEN ARCHIVED AND CLOSED.
   *
   * @return {Promise<JobDto>} -= Common job data that will be listed in the corporate dashboard.
   */
  async fetchJobs(params: object): Promise<JobApiResponse> {
    try {
      const { response } = await httpServiceObj.get<JobApiResponse>(
        "/job",
        true,
        params,
        false,
        "JOB"
      );
      if (response) return response;
      throw new Error("Empty response");
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to fetch Jobs.", error);
      // fallback response to prevent `null`
      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: 0,
        },
      };
    }
  }

  /**
   * bulkUpdate
   *
   * @type {PATCH}
   *
   * @description - This api is used to patch jobs based on the selected tab - OPEN ARCHIVED AND CLOSED.
   *
   * @return {any} - Common job data that will be listed in the corporate dashboard.
   */
  async bulkUpdate(payload: { bulkJobUpdate: SelectedRow[] }): Promise<any> {
    try {
      const { response } = await httpServiceObj.patch<any>(
        "/job/bulk-update",
        payload,
        true,
        {},
        false,
        "JOB"
      );
      if (response) return response;
      else {
        throw new Error();
      }
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to Bulk Update.");
      return null;
    }
  }

  /**
   * updateJob
   *
   * @type {PUT}
   *
   * @description -  This api is used to update a job
   *
   * @param {JobFormSchema | any} payload for the job Api - Can be full job data or partial update
   *
   * @return {Promise<JobDto>} -= Common job data that will be listed in the corporate dashboard.
   */
  async updateJob(
    payload: JobFormSchema | any, // Accept full job data or partial updates
    params: object,
    jobId: string
  ): Promise<JobDto | null> {
    try {
      const { response } = await httpServiceObj.put<JobDto>(
        `/job/${jobId}`,
        payload,
        true,
        params,
        false,
        "JOB"
      );

      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to update Job.", error);
      return null;
    }
  }

  /**
   * fetchApplications
   *
   * @type {GET}
   *
   * @description - This api is used to get jobs based on the tab .
   *
   * @return {Promise<ApiResponseDto<JobApplicationDetailsDto>>} -= Common job data that will be listed in the corporate dashboard.
   */
  async fetchApplications(params: object): Promise<ApiResponseDto<JobApplicationDetailsDto>> {
    try {
      //path: string, data: object, authorization: boolean = true, params = {}, fullUri: boolean = false,apiType: ApiType = "BASE"
      const { response } = await httpServiceObj.get<ApiResponseDto<JobApplicationDetailsDto>>(
        "/job-application",
        true,
        params,
        false,
        "JOB"
      );
      if (response) return response;
      else {
        throw new Error();
      }
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to fetch Applications.");
      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: 0,
        },
      };
    }
  }

  /**
   * updateApplicationStatus
   *
   * @description - This api is used to update the status of a job application.
   *
   * @type {PATCH}
   * @example - {
        applicantName: "ashutosh kumar"
        emailId : "ashutosh.sharma+corp@worko.ai"
        status : "CV_DOWNLOADED"
        userId : "4HTC6XN01HE0YSRF5BFSTWTHGD" 
        userType : "corporate-admin"
         }
   * @return {Promise<JobApplicationDetailsDto>} -= Common job data that will be listed in the corporate dashboard.
   */
  async updateApplicationStatus(
    payload: any,
    jobId: string
  ): Promise<JobApplicationDetailsDto | null> {
    try {
      const { response } = await httpServiceObj.patch<JobApplicationDetailsDto>(
        `/job-application/${jobId}/corp-action`,
        payload,
        true,
        {},
        false,
        "JOB"
      );

      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to update Application Status.", error);
      return null;
    }
  }

  /**
   * parseJobDescription
   *
   * @description - This api is used to parse the job description and extract the required information.
   *
   * @type {POST}
   * @example - {
        jobDescription: "We are looking for a software engineer with experience in React and Node.js."
         }
   * @return {Promise<any>} -= Parsed job description data.
   */
  async parseJobDescription(jobDescription: string): Promise<BulkJdParsedData | null> {
    try {
      const { response } = await httpServiceObj.post<any>(
        `${workoJobApi}/job/parsejd`,
        { jobDescription },
        true,
        {},
        true,
        // "JOB"
      );

      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to parse Job Description.", error);
      return null;
    }
  }
  /**
 * bulkScreening
 * 
 * @description - This api is used to bulk screen the job applications based on the selected job.
 * @payload - {
 * 
 * companyId: string;
  jobTitle: string;
  experienceRange: { min: number; max: number };
  coreSkills: string[];
  softSkills: string[];
  mustNotHaveSkills: string[];
  mustHave: string[];
  goodToHave: string[];
  technicalSkills: string[];
  industryPreference: string;
  jobLocation: string;}'
  * @return {Promise<BulkScreeningResponse>} - Common job data that will be listed in the corporate dashboard.
 */
  async bulkScreening(payload: any): Promise<BulkScreeningResponse> {
    try {
      const { response, error } = await httpServiceObj.post<CorporateBulkScreeningDto>(
        `${workoBaseApi}/agency-bulk-jd/`,
        payload,
        true,
        {},
        true,
        // "BASE"
      );
      
      // if (!response) {
      //   throw new Error("No response received");
      // }
      return { request: response, error };
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to bulk screen Job applications.", error);
      return { request: null, error };
    }
  }

  /**
   * bulkScreeningUpload
   *
   * @description - This api is used to upload the bulk screening file metadata to the server.
   * @param  {FileMetadataDto[]}
   *
   * @returns  {BulkUploadResponseDto} -
   */
  async bulkScreeningUpload(
    payload: FileMetadataDto[],
    bulkCvId: string
  ): Promise<BulkUploadResponseDto | {}> {
    try {
      const { response } = await httpServiceObj.post<BulkUploadResponseDto>(
        `${workoBaseApi}/agency-bulk-jd/${bulkCvId}/resumes`,
        { bulkCvs: payload },
        true,
        {},
        true,
        // "BASE"
      );

      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to upload bulk screening file metadata.", error);
      return {};
    }
  }

  /**
   * fetchBulkScreenedJobs
   *
   * @description - This api is used to fetch the bulk screened jobs.
   * @param params
   * @returns {BulkScreeningListItemDto[]} - List of bulk screened jobs.
   */

  async fetchBulkScreenedJobs(params: object): Promise<ApiResponseDto<BulkScreeningListItemDto>> {
    try {
      const { response } = await httpServiceObj.get<ApiResponseDto<BulkScreeningListItemDto>>(
        `${workoBaseApi}/agency-bulk-jd/`,
        true,
        params,
        true,
        // "BASE"
      );

      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to fetch Bulk Screening List.", error);
      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: 0,
        },
      };
    }
  }

  /**
   * agency-bulk-jd-resume
   *
   * @description - This api is used to get the bulk screening resumes based on the bulkCvId.
   */
  async getBulkScreeningResumes(params: object): Promise<ApiResponseDto<ResumeScreeningRecordDto>> {
    try {
      const { response } = await httpServiceObj.get<ApiResponseDto<ResumeScreeningRecordDto>>(
        `${workoBaseApi}/agency-bulk-jd-resume/`,
        true,
        params,
        true,
        // "BASE"
      );
      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to fetch Bulk Screening Resumes.", error);
      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: 0,
        },
      };
    }
  }

  /**
   * fetchInvites
   *
   * @description - This api is used to fetch the corporate invites.
   * @param {object} params - The parameters for the API call, such as pagination and filters.
   */
  async fetchInvites(params: object): Promise<ApiResponseDto<CorporateInvite>> {
    try {
      const { response } = await httpServiceObj.get<ApiResponseDto<CorporateInvite>>(
        "/corporate-invite/",
        true,
        params,
        false,
        "BASE"
      );
      if (response) {
        return response;
      }
      throw new Error("No response received");
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to fetch invites.", error);
      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: 0,
        },
      };
    }
  }

  /**
   * postEvaluatorFeedbackRequest
   *
   * @description - This api is used to post the evaluator feedback request for a job application.
   */

  async postEvaluatorFeedbackRequest(payload: JobEvaluationRequestDto): Promise<any> {
    try {
      const { response, status } = await httpServiceObj.post<any>(
        "/request-evaluation/",
        payload,
        true,
        {},
        false,
        "JOB"
      );

      if (status === 409) {
        const error = new Error(
          `The application evaluator feedback request already exists against ${
            payload.evaluatorDetails.email || "this evaluator"
          }.`
        );
        (error as any).status = 409;
        throw error;
      }
      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error) {
      console.error("[CORPORATE SERVICE]: Failed to post Evaluator Feedback Request.", error);
      throw error; // Re-throw to let the caller handle it
    }
  }
  /**
   * postBulkEvaluatorFeedbackRequest
   *
   * @description - This API is used to send multiple evaluator feedback requests for multiple job applications at once.
   */
  async postBulkEvaluatorFeedbackRequest(payload: {
    requestEvaluations: JobEvaluationRequestDto[];
  }): Promise<any> {
    try {
      const { response, status } = await httpServiceObj.post<any>(
        "/request-evaluation/bulk",
        payload,
        true, // withAuth
        {}, // headers
        false, // noContentTypeHeader
        "JOB" // serviceIdentifier (optional)
      );

      if (status === 409) {
        const error = new Error("Some evaluator feedback requests already exist.");
        (error as any).status = 409;
        throw error;
      }

      if (!response) {
        throw new Error("No response received from bulk evaluation request.");
      }

      return response;
    } catch (error) {
      console.error("[CORPORATE SERVICE]: Failed to post Bulk Evaluator Feedback Request.", error);
      throw error;
    }
  }
  /**
   * postBulkApplicationUpdate
   *
   * @description - This API is used to send multiple applications feedback requests for multiple job applications at once.
   */
  async postBulkApplicationUpdate(payload: BulkJobApplicationUpdatePayload): Promise<any> {
    try {
      const { response, status } = await httpServiceObj.post<any>(
        "/job-application/bulk-update",
        payload,
        true, // withAuth
        {}, // headers
        false, // noContentTypeHeader
        "JOB" // serviceIdentifier (optional)
      );

      if (!response) {
        throw new Error("No response received from bulk update request.");
      }

      return response;
    } catch (error) {
      console.error("[CORPORATE SERVICE]: Failed to post Bulk Application Update Request.", error);
      throw error;
    }
  }

  async getEvaluationResponses(params: {
    jobApplicationId: string;
  }): Promise<ApiResponseDto<EvaluationResponseItemDto>> {
    try {
      const { response } = await httpServiceObj.get<ApiResponseDto<EvaluationResponseItemDto>>(
        "/response-evaluation/",
        true,
        params,
        false,
        "JOB"
      );
      if (!response) throw new Error("No response received");
      return response;
    } catch (error) {
      console.error("[CORPORATE SERVICE]: Failed to fetch evaluation responses.", error);
      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: 0,
        },
      };
    }
  }

  /**
   * ferchReferrals
   *
   * @description - This api is used to get referrals based on the tab .
   */
  async fetchReferrals(params: object): Promise<ApiResponseDto<ReferralDetailsDto>> {
    try {
      const { response } = await httpServiceObj.get<ApiResponseDto<ReferralDetailsDto>>(
        "/referral",
        true,
        params,
        false,
        "BASE"
      );
      if (response) return response;
      throw new Error("Empty response");
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to fetch Referrals.", error);
      // fallback response to prevent `null`
      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: 0,
        },
      };
    }
  }

  async agencyList(params: object): Promise<AgencyListDetailsDto | []> {
    try {
      const { response } = await httpServiceObj.get<AgencyListDetailsDto>(
        `/agency-invite`,
        true,
        params,
        false,
        "BASE"
      );

      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to get agency list", error);
      return [];
    }
  }

    async fetchAgencyJobs(params: object): Promise<JobApiResponse> {
    try {
      const { response } = await httpServiceObj.get<JobApiResponse>(
        "/agency-job-assignment/",
        true,
        params,
        false,
      );
      // console.log(response)
      if (response) return response;
      throw new Error("Empty response");
    } catch (error: any) {
      console.error("[CORPORATE SERVICE]: Failed to fetch Jobs.", error);
      // fallback response to prevent `null`
      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: 0,
        },
      };
    }
  }
}

const CorporateServiceObj = new CorporateService();
export default CorporateServiceObj;
