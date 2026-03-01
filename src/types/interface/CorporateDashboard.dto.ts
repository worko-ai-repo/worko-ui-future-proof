import {
  JobApplicationStatusType,
  JobStatusType,
  JobTypeofEmploymentType,
  ReferralStatusType,
} from "../JobsAndApplication.type";
import { UserRole } from "./RoleBasedAccessControl";

export interface JobApiResponse {
  data: JobData[];
  pagination: {
    lastKey?: string;
    sortOrder?: string;
    timesQueried?: number;
    queriedCount?: number;
    count: number;
    pageSize: number;
  };
}
export interface ApiResponseDto<T> {
  data: T[];
  pagination: {
    count: number;
    pageSize: number;
  };
}
export interface CountCompanyJob {
  GSI1PK: string;
  GSI1SK: string;
  PK: string;
  SK: string;
  companyId: string;
  jobId: string;
  entityType: "JOB_APPLICATION";
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  allJobApplicationCounts: {
    hired: number;
    total: number;
    processingInterview: number;
    applied: number;
  };
}

export interface JobData {
  status: string; //@TODO: Change to JobStatusType
  companyId: string;
  coreSkills: string[];
  department: string;
  experienceRange: {
    min: number;
    max: number;
  };
  countCompanyJob?: CountCompanyJob;
  jobTitle: string;
  htmlJobDescription: string;
  location: {
    city: string[];
    fullLocation: string[];
    state: string[];
    country: string[];
  };
  miscellaneousSkills: string[];
  numOfOpenings: number;
  noticePeriod: number;
  otherRequirements: string;
  salaryRange: {
    min: number;
    max: number;
  };
  softSkills: string[];
  technicalSkills: string[];
  typeofEmployment: string;
  workMode: string;
  jobDescription: string;
  createdByUserId: string;
  createdByCorporateUserId: string;
  companyName: string;
  companyUrl: string;
  companyLogoUrl: string;
  detailedSoftDeleteReason?: string;
  shortSoftDeleteReason?: string;
  id: string;
  jobUrl: string;
  sourcedFrom: string;
  createdAt: string;
  updatedAt: string;
  updatedByCorporateUserId?: string;
  updatedByUserId?: string;
  isDeleted: boolean;
  companyDetails: CompanyDetails;
}

export interface CompanyDetails {
  website: string;
  linkedIn: string;
  industry: string;
  logoUrl: string;
  createdAt: string;
  isDeleted: boolean;
  GSI1SK: string;
  logo: string;
  carrierPage: string;
  name: string;
  isVerified: boolean;
  teamSize: number;
  GSI1PK: string;
  updatedAt: string;
  aboutCompany: string;
  SK: string;
  PK: string;
  id: string;
}

export interface CorporateInviteResponse {
  data: CorporateInvite[];
  pagination: {
    count: number;
    pageSize: number;
    lastKey: string;
    sortOrder: string;
    timesQueried: number;
    queriedCount: number;
  };
}

export interface CorporateInvite {
  companyId: string;
  lastName: string;
  createdAt: string;
  isDeleted: boolean;
  email: string;
  GSI1SK: string;
  firstName: string;
  GSI1PK: string;
  createdByUserId: string;
  expiresAt: string;
  updatedAt: string;
  SK: string;
  corporateUserType: string;
  inviteStatus: string;
  id: string;
  PK: string;
  companyDetails: CompanyDetails;
}

export interface JobDetails {
  id?: string;
  jobTitle?: string;
  company?: string;
  offerings?: string;
  gradeLevel?: string;
  department?: string;
  workMode?: "WFO" | "WFH" | "HYBRID";
  location?: {
    city: string[];
    fullLocation: string[];
  };
  experienceRange?: {
    min?: number;
    max?: number;
  };
  salaryRange?: {
    min?: number;
    max?: number;
  };
  creatorName?: string;
  coreSkills?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  goodSkills?: string[];
  otherRequirements?: string;
  typeofEmployment: JobTypeofEmploymentType;
  status: JobStatusType;
  noticePeriod: number;
  displaySalaryRange: boolean;
  miscellaneousSkills?: any;
  jobDescription: string;
  htmlJobDescription: string;
  fixedComponent?: number;
  variableComponent?: number;
  companyDetails: CompanyDetails;
}

export interface CandidateExperience {
  companyName: string;    // e.g. "Worko.ai"
  designation: string;    // e.g. "Founder"
  department: string;     // e.g. "Entrepreneurship"
  startDate: string;      // ISO date, e.g. "2023-07-01"
  endDate: string;        // ISO date, e.g. "2024-06-01"
  YOE: number;            // Years of experience, e.g. 1
}

export interface JobApplicationDetailsDto {
  id: string;
  companyId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  updatedByUserId?: string;
  updatedByCorporateUserId?: string;
  jobCreatedByCorporateUserId?: string;
  jobCreatedByUserId?: string;
  offerLetterDetails?: Array<{
    userType: string;
    userId: string;
    actionDate: string;
    remarks: string;
    cloudFileName: string;
  }>;
  action:string;
  offerLetterIssueRaisedDetails: Array<{
    userId: string;
    userType: string;
    actionDate: string;
    cloudFileName: string;
    remarks: string;
  }>;
  jobPortal: string;
  jobUrl: string;
  status: JobApplicationStatusType;
  rejectionAwsScheduleId?: string;
  rejectedByUserId: {
    actionDate: string;
    reason: string;
    userType: UserRole;
    userComment: string;
    userId: string;
  };
  rejectionFeedbackBySystem?: string;
  rejectionFeedbackBySystemForApplicant?:string;
  jdMatchErrorCode?: number;
  jdMatchErrorDesc?: string;
  scoreDetails?: string;
  matchingScore?: number;
  scoreFetchedDate?: string;
  createdAt: string;
  updatedAt: string;
  displayToCorporate: boolean;
  hiredFromOtherPortal?: {
    portal: string;
    date: string;
  };
  statusTracker: StatusTracker[];
  applicantDetails: ApplicantDetails;
  isEvaluatorResponded?: boolean;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  PK: string;
  SK: string;
  // @_CL - Document management properties
  requestedDocumentDetails?: Array<{
    requestedDocumentNames: string[];
    documentStatus: JobApplicationDocumentStatusType;
    userType: string;
    userId: string;
    actionDate: string;
  }>;
  responseDocumentDetails?: Array<{
    documentMapping: Array<{
      documentName: string;
      cloudFileName: string;
    }>;
    documentStatus: JobApplicationDocumentStatusType;
    userType: string;
    userId: string;
    actionDate: string;
  }>;
  documentCurrentStatusMap?: Record<string, JobApplicationDocumentStatusType>;
  documentCurrentMapping?: Record<string, string>;
  followUpRequest?: Array<{
    actionDate: string;
  }>;
}

export type JobApplicationDocumentStatusType =
  | "DOCUMENT_REVISION_REQUEST_SUBMITTED"
  | "DOCUMENT_ADDITIONAL_REQUESTED"
  | "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED"
  | "DOCUMENT_SUBMITTED"
  | "DOCUMENT_REVISION_REQUESTED"
  | "DOCUMENT_REQUESTED";
export interface StatusTracker {
  userType: "ADMIN" | "CAND" | string;
  newStatus: JobApplicationStatusType;
  oldStatus: JobApplicationStatusType;
  actionDate: string; // ISO string
  userId: string;
}

export interface ApplicantDetails {
  id: string;
  userId: string;
  name: string;
  email: string;
  emailList: {
    primary: string;
  };
  multipleCandidateExperience: CandidateExperience[];
  profileImage: string;
  profileImageAwsS3SignedUrl: string;
  cvAwsS3SignedUrl: string;
  companyName?: string;
  CV: string;
  country: string;
  number: string;
  location: string;
  YOE: number;
  CTC: number;
  ECTC: number;
  noticePeriod: number;
  acceptedTermsAndConditions: boolean;
  isSubscribed: boolean;
  isEmailVerified: boolean;
  isNumberVerified: boolean;
  isWhatsappNotificationEnabled: boolean;
  isCandidateFresher: boolean;
  isCurrentCompEmailVerified?: boolean;
  lastAccessedDash: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
  coverLetter: string;
  referralCount: number;
  userType: string[];
  cvExtract: string;
  cvExtractDate: string;
  cvExtractParsedDate: string;
  GSI1PK: string;
  GSI1SK: string;
  SK: string;
  companyEmailId?: string;
  cvExtractParsed: CVExtractParsed;
  personalDetails: UsersPersonalDetails;
  candidateExperience: {
    companyName: string;
    department: string;
    designation: string;
  };
}

interface UsersPersonalDetails {
  name: string;
  phone: string;
  email: string;
}
export interface CVExtractParsed {
  personalDetails: UsersPersonalDetails;
  roleAndResponsibilities: RoleAndResponsibility[];
  industryExperience: IndustryExperience[];
  education: Education[];
  professionalExperience: ProfessionalExperience[];
}

export interface RoleAndResponsibility {
  role: string;
  responsibilities: string[];
  achievements: string[];
  teamLeadership: string[];
}

export interface IndustryExperience {
  industryType: string;
  industryDomain: string;
  details: string[];
}

export interface Education {
  degree: string;
  institution: string;
  certifications: string[];
  year: string;
}

export interface ProfessionalExperience {
  workExperience: string[];
  company: string;
  period: string;
  role: string;
}

/**
 * ReferralDetailsDto
 *
 * @description - Data Transfer Object representing the details of a referral made by an employee.
 */
export interface ReferralDetailsDto {
  jobUrl: string;
  companyId: string;
  status: ReferralStatusType;
  jobId?: string;
  createdAt: string; // ISO date string
  updatedAt: string;
  emailFeedback?: string;
  scoreDetails?: {
    heading: string;
    detail: string;
  }[];
  matchingScore: number;
  userDetails:any;
  jobPortal: string;
  jdExtracted?: string;
  userSubscriptionId: string;
  scoreFetchedDate?: string;
  jdMatchErrorDesc?: string;
  jdMatchErrorCode?: number;
  rejectionFeedbackBySystem?: {
    heading: string;
    detail: string;
  }[];
  id: string;
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
}
