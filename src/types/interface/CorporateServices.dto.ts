import { StatusTracker } from "./CorporateDashboard.dto";
import { JobApplicationStatusType, JobStatusType } from "../JobsAndApplication.type";

/**
 * Types for corporate services in the Worko UI Dashboard application.
 * These types define the structure of job-related data and DTOs used in the application.
 */
export interface ExperienceRangeDto {
  min: number;
  max: number;
}

/**
 * FileMetadataDto
 *
 * @description - This interface defines the structure of file metadata used in the corporate services.
 */

export interface FileMetadataDto {
  fileName: string;
  fileMimeType: string;
}

/**
 * CorporateBulkScreeningDto
 *
 * @description - This interface defines the structure of a corporate bulk screening data transfer object (DTO).
 */
export interface CorporateBulkScreeningDto {
  id: string;
  companyId: string;
  jobTitle: string;
  jobDescription: string;
  experienceRange: ExperienceRangeDto;
  jobLocation: string;
  mustHaveSkills: string[];
  goodToHaveSkills: string[];
  mustNotHaveSkills: string[];
  createdByCorporateUserId: string;

  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;

  createdAt: number; // timestamp (ms)
  updatedAt: number; // timestamp (ms)

  resumesCount: number;
}

export interface BulkScreeningResponse {
  request: CorporateBulkScreeningDto | null;
  error: any;
}
/**
 * CorporateBulkScreenPayload
 *
 * @description - This interface defines the structure of the payload used for bulk screening in corporate services.
 */
export interface CorporateBulkScreenPayload {
  companyId: string;
  jobTitle: string;
  experienceRange: { min: number; max: number };
  coreSkills: string[];
  softSkills: string[];
  mustNotHaveSkills: string[];
  mustHave: string[];
  goodToHave: string[];
  technicalSkills: string[];
  industryPreference: string;
  jobLocation: string;
  files: File[];
}

/**
 * CorporateBulkScreeningResponseDto
 *
 * @description - This interface defines the structure of the response DTO for corporate bulk screening.
 */

export interface FileUploadResponseMetadataDto {
  userFileName: string;
  cloudFileName: string;
  fileMimeType: string;
  fileExtension: string;
  awsS3SignedUrl: string;
  awsS3Tag: string;
}

/**
 * BulkUploadResponseDto
 *
 * @description - This interface defines the structure of the response DTO for bulk upload operations in corporate services.
 */

export interface BulkUploadResponseDto {
  corporateBulkJdId: string;
  bulkCvs: FileUploadResponseMetadataDto[];
  bulkCvsStorageFailed: any[]; // Adjust type if known, currently it's just an empty array
  agencyBulkJdId:string;
}

/**
 * BulkScreeningListItemDto
 *
 * @description - This interface defines the structure of an item in the bulk screening list.
 */
export interface BulkScreeningListItemDto {
  id: string;
  jobTitle: string;
  jobDescription: string;
  companyId: string;
  createdAt: string; // ISO date string
  updatedAt: string;
  jobLocation: string;
  createdByCorporateUserId: string;
  experienceRange: {
    min: number;
    max: number;
  };
  mustHaveSkills: string[];
  mustNotHaveSkills: string[];
  goodToHaveSkills: string[];
  resumesCount: number;
  GSI1PK: string;
  GSI1SK: string;
  SK: string;
  PK: string;
  corporateUserDetails: {
    id: string;
    inviteId: string;
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    cognitoUserId: string;
    corporateUserType: "corporate-admin" | "corporate-recruiter";
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
  };
  userDetails?: {
    id: string;
    name: string;
    email: string;
    userType: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
  };
}

/**
 * CvExtractedParsed
 *
 * @description - This interface defines the structure of parsed CV data extracted from a resume.
 */
interface CvExtractedParsed {
  candidatePhoneNumber: string;
  candidateCurrentDesignation: string;
  candidateLocation: string;
  candidateName: string;
  candidateEmail: string;
  candidateExperience: string; // Might be better as number if always numeric (e.g. 6.5)
  candidateCurrentCompany: string;
}

interface BulkScreenRejectionFeedbackDto {
  heading: string;
  detail: string;
}

interface ScoreSectionA {
  skillsFound: string[];
  skillsMissing: string[];
  pointsPerSkill: number;
  totalSkills: number;
  score: number;
}

interface ScoreSectionB {
  requirementsMet: string[];
  requirementsMissing: string[];
  allRequirementsMet: boolean;
  score: number;
}

export interface BulkScreenFeedbackDto {
  score: number;
  sectionA: ScoreSectionA;
  sectionB: ScoreSectionB;
  recommendation: string;
}

export interface ResumeScreeningRecordDto {
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  PK: string;
  SK: string;
  id: string;
  cloudFileName: string;
  userFileName: string;
  companyId: string;
  corporateBulkJdId: string;
  createdAt: string;
  updatedAt: string;
  createdByCorporateUserId: string;
  cvExtract: string;
  cvExtractedParsed: CvExtractedParsed;
  jdMatchErrorCode: number;
  jdMatchErrorDesc: string;
  matchingScore: number;
  processingStatus: "COMPLETED" | "PENDING" | "FAILED"; // Add other possible statuses if needed
  rejectionFeedbackBySystem: string; // Note: You may want to parse this into RejectionFeedbackItem[]
  scoreDetails: string; // Note: You may want to parse this into ScoreDetails
  scoreFetchedDate: string;
  agencyBulkJdId:string;
}

/**
 * JobEvaluationRequestDto
 *
 * @description - This interface defines the structure of a job evaluation request in the corporate services.
 */
export interface EvaluatorDetails {
  name: string;
  email: string;
}

export interface JobEvaluationRequestDto {
  jobApplicationId: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  applicantName: string;
  applicantUserId: string;
  applicantUserEmail: string;
  evaluatorDetails: EvaluatorDetails;
  hrName: string;
  hrCurrentCompanyName: string;
  hrDetailedFeedback: string;
  hrHtmlDetailedFeedback: string;
}

export interface BulkJobApplicationUpdateItem {
  id: string;
  emailId: string;
  jobApplicationId: string;
  status: JobApplicationStatusType;
  oldStatus: JobApplicationStatusType;
  userType: string;
  applicantName: string;
  oldStatusTracker: StatusTracker[];
  applicantUserId: string;
}
export interface BulkJobApplicationUpdatePayloadItem {
  emailId: string;
  jobApplicationId: string;
  status: JobApplicationStatusType;
  oldStatus: JobApplicationStatusType;
  userType: string;
  applicantName: string;
  oldStatusTracker: StatusTracker[];
}

export interface BulkJobApplicationUpdatePayload {
  bulkJobApplicationUpdate: BulkJobApplicationUpdatePayloadItem[];
}

interface StatusTrackerItem {
  detailedFeedback: string;
  score: number;
  htmlDetailedFeedback: string;
  newStatus: "INTERVIEW_SCHEDULED" | "ON_HOLD" | "REJECTED";
  actionDate: string;
  comment?: string;
  htmlComment?: string;
  reason?: string;
}

interface ScheduledInterviewDetailsItem {
  date: string;
  startTime: string;
  endTime: string;
  availability: number;
  actionDate: string;
  timeSlot: string;
}

export interface EvaluationResponseItemDto {
  id: string;
  evaluatorName: string;
  jobId: string;
  jobApplicationId: string;
  status: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  applicantUserId: string;
  evaluationRequesterCorporateUserId: string;
  createdByUserEmail: string;
  evaluationRequestId: string;
  statusTracker: StatusTrackerItem[];
  scheduledInterviewDetails: ScheduledInterviewDetailsItem[];
}

/**
 * CommonCursorPaginationProp
 */
export interface CommonCursorPaginationProp {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  pageSize: number;
  setPageSize: any;
}

/**
 * CursorPaginationJobDataParams
 *
 * @description - This interface defines the parameters for cursor-based pagination of job data in corporate services.
 */
export interface CursorPaginationJobDataParams {
  pageSize: number;
  sortOrder: "asc" | "desc";
  dashboard: string;
  userRole: string[] | undefined;
  status: JobStatusType;
  searchText?: string;
  companyId: string;
  corporateRecruiterUserId?: string;
  lastKey?: string | undefined;
  includeCompanyDetails: boolean;
  includeCountCompanyJobEntityJobApplication?:boolean;
}

/**
 * CursorPaginationApplicationDataParams
 */

export interface CursorPaginationApplicationDataParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  status?: JobApplicationStatusType;
  searchText?: string;
  jobId: string | undefined;
  userType?: string;
  lastKey?: string | undefined;
}

/**
 * CursorPaginationInviteDataParams
 *
 * @description - This interface defines the parameters for cursor-based pagination of invite data in corporate services.
 */
export interface CursorPaginationInviteDataParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  searchText?: string;
  companyId: string;
  userType?: string;
  lastKey?: string | undefined;
}
/**
 * CursorPaginationCorporateUserAdminDataParams
 */
export interface CursorPaginationCorporateUserAdminDataParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  searchText?: string;
  corporateUserType: "corporate-admin" | "corporate-recruiter";
  lastKey?: string | undefined;
}

/**
 * CursorPaginationCorporateUserRecDataParams
 */
export interface CursorPaginationCorporateUserRecDataParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  searchText?: string;
  companyId?: string;
  includeCompanyDetails: boolean;
  corporateUserType?: "corporate-admin" | "corporate-recruiter";
  includeRegisteredCorporateDetails: boolean;
  lastKey?: string | undefined;
}

/**
 * CursorPaginationBulkScreenedJobsParams
 *
 * @description - This interface defines the parameters for cursor-based pagination of bulk screened jobs in corporate services.
 */
export interface CursorPaginationBulkScreenedJobsParams {
  searchText?: string;
  lastKey?: string | undefined;
  pageSize: number;
  sortOrder: string;
  companyId?: string;
  corporateRecruiterUserId?: string;
}

/**
 * CursorPaginationResumeScreeningRecordsParams
 *
 * @description - This interface defines the parameters for cursor-based pagination of resume screening records in corporate services.
 * */
export interface CursorPaginationResumeScreeningRecordsParams {
  pageSize: number;
  sortOrder: string;
  companyId?: string;
  corporateRecruiterUserId?: string;
  corporateBulkJdId: string;
  lastKey?: string;
  agencyBulkJdId:string;
}
