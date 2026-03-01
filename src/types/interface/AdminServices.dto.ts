import {
  JobApplicationStatusType,
  JobStatusType,
  ReferAndEarnJobApplicationStatusType,
  ReferAndEarnStatusType,
  ReferralStatusType,
  UserGuidanceRequestStatusType,
  UserGuidanceRequestType,
} from "../JobsAndApplication.type";
import { StatusTracker } from "./JobTypes";
import { ApplicantDetails, CompanyDetails } from "./CorporateDashboard.dto";
import {
  ReferAndEarnJobApplicationStatusEnum,
  ReferAndEarnStatusEnum,
} from "@Enums/JobAndApplication.enum";
import { CompanyDto } from "./JobsAndCompany.dto";

/**
 * APIResponseDto
 *
 * @description - This interface defines the structure of a generic API response for paginated data.
 */
export interface ApiResponseDto<T> {
  data: T[];
  pagination: {
    count: number;
    pageSize: number;
  };
}

/**
 * CursorPaginationJobDataParams
 *
 * @description - This interface defines the parameters for cursor-based pagination of job data in corporate services.
 */
export interface CursorPaginationAdminJobDataParams {
  pageSize: number;
  sortOrder: "asc" | "desc";
  dashboard: string;
  status: JobStatusType;
  searchText?: string;
  includeCompanyDetails: boolean;
  lastKey?: string | undefined;
}

/**
 * CursorPaginationApplicationDataAdminParams
 */

export interface CursorPaginationApplicationDataAdminParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  status?: JobApplicationStatusType;
  searchText?: string;
  jobId?: string | undefined;
  userType?: string;
  lastKey?: string | undefined;
}

/**
 * CursorPaginationEmployeeDataAdminParams
 */
export interface CursorPaginationUsersDataAdminParams {
  pageSize: number;
  userType: "CAND" | "EMP";
  sortOrder: "ascending" | "descending";
  searchText?: string;
  lastKey?: string | undefined;
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
}

/**
 * CursorPaginationReferAndEarnAdminParams
 */
export interface CursorPaginationReferAndEarnAdminParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  searchText?: string;
  lastKey?: string | undefined;
}

/**
 * CursorPaginationReferralsDataAdminParams
 *
 * @description - Parameters for paginating referral data in admin services.
 */
export interface CursorPaginationReferralsDataAdminParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  searchText?: string;
  companyId?: string;
  lastKey?: string | undefined;
  status?: ReferralStatusType;
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
}

/**
 * CursorPaginationGuidanceDataAdminParams
 *
 * @description - Parameters for paginating guidance data in admin services.
 */
export interface CursorPaginationGuidanceDataAdminParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  actionByUserType: string;
  searchText?: string;
  lastKey?: string | undefined;
}

/**
 * CursorPagiantionCompanyDataAdminParams
 *
 * @description - Parameters for paginating company data in admin services.
 */
export interface CursorPaginationCompanyDataAdminParams {
  pageSize: number;
  sortOrder: "ascending" | "descending";
  searchText?: string;
  lastKey?: string | undefined;
  industryType?: string;
}
/**
 * AdminBulkJobApplicationUpdateItem
 */
export interface AdminBulkJobApplicationUpdateItem {
  id: string;
  emailId: string;
  jobApplicationId: string;
  status: JobApplicationStatusType;
  oldStatus: JobApplicationStatusType;
  userType: string;
  applicantName: string;
  oldStatusTracker: StatusTracker[]; //@TODO:Makesure its not changed for admin service
  applicantUserId: string;
}

/**
 * GuidanceRequest
 *
 * @description - Data Transfer Object representing a guidance request made by a candidate.
 */
export interface GuidanceRequestDto {
  jobUrl: string;
  guidanceRequestDeadline: string; // ISO date string
  companyName: string;
  status: UserGuidanceRequestStatusType;
  createdAt: string;
  guidanceRequestDescription: string;
  mentorAssignedRemarks: string;

  //----- Candidate details -----
  userDetails: ApplicantDetails;

  // --- Status & Tracking ---
  statusTracker: GuidanceStatusTracker[];
  GSI1PK: string;
  GSI1SK: string;
  PK: string;
  SK: string;
  id: string;

  // --- User tracking ---
  createdByUserId: string;
  updatedByUserId: string;
  updatedAt: string;

  // --- Mentor details ---
  mentorDetails: MentorDetails;

  // --- Meeting details ---
  scheduleMeetingDetails?: ScheduleMeetingDetails;
  rescheduleMeetingDetails?: RescheduleMeetingDetails[];

  // --- Payment details ---
  paymentRequestDetails?: PaymentRequestDetails;
  paymentConfirmationPendingDetails?: PaymentConfirmationPendingDetails;
  paymentConfirmationDoneDetails?: PaymentConfirmationDoneDetails;

  // --- Request type ---
  guidanceRequestType: UserGuidanceRequestType;
}

export interface GuidanceStatusTracker {
  actionByUserId: string;
  newStatus: string;
  oldStatus?: string;
  actionDate: string;
  actionByUserType: string;
}

export interface MentorDetails {
  name: string;
  userId: string;
  userEmail: string;
}

export interface ScheduleMeetingDetails {
  date: string; // ISO date string
  duration: string;
  time: string;
  meetingLink?: string;
}

export interface RescheduleMeetingDetails {
  date: string; // ISO date string
  time: string;
  actionByUserId: string;
  actionByUserType: string;
  actionDate: string;
}

export interface PaymentRequestDetails {
  totalAmount: number;
  guidanceFee: number;
  platformFee: number;
  currency: string;
  linkForPayment: string;
  actionByUserId: string;
  actionByUserType: string;
  actionDate: string;
}

export interface PaymentConfirmationPendingDetails {
  actionByUserId: string;
  actionByUserType: string;
  actionDate: string;
}

export interface PaymentConfirmationDoneDetails {
  actionByUserId: string;
  actionByUserType: string;
  actionDate: string;
  uniqueTransactionReference: string; // this is your UTR number
}

// post company request type
export interface CreateCompanyRequestDto {
  name: string;
  industry: string;
  linkedIn: string;
  carrierPage: string;
  aboutCompany: string;
  logoUrl: string;
  logo: string;
  teamSize: number;
  website: string;
  isCompanyRequestPageFlag?: boolean;
}

// Refer-n-Earn DTO aligned with schema
export interface ReferAndEarnDto {
  /**
   * ids & keys
   */
  id: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  PK: string;
  SK: string;

  /**
   * metadata
   */
  createdByUserId: string;
  updatedByUserId?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  /**
   * details
   */
  referrerDetails: {
    id: string;
    name: string;
    email: string;
    phoneCountryCode: number;
    phoneNumber: number;
  };

  recipientDetails: {
    id?: string;
    name: string;
    email: string;
    phoneCountryCode: number;
    phoneNumber: number;
  };

  companyDetails: {
    id: string;
    name: string;
  };

  jobDetails: {
    id: string;
    title: string;
    url: string;
  };

  /**
   * status & tracking
   */
  status: ReferAndEarnStatusType; // ReferAndEarnStatusEnum
  statusTracker: {
    oldStatus?: string;
    newStatus: string;
    actionDate: string; // ISO date string
    actionByUserId?: string;
    description?: string;
  }[];

  jobApplicationStatus: ReferAndEarnJobApplicationStatusType; // ReferAndEarnJobApplicationStatusEnum
  userJobApplicationId?: string;
  jobAppliedDate?: string; // ISO date string

  /**
   * payment details
   */
  commissionAmount: number;
  referredDate: string; // ISO date string

  referrerBankDetails?: {
    accountHolderName: string;
    accountNumber: number;
    branchName: string;
    ifscCode: string;
  };

  paymentDoneDetails?: {
    userId: string;
    userType: string;
    actionDate: string; // ISO date string
    amountPaid: number;
    uniqueTransactionReference: string;
  };
}

/**
 * ReferAndEarnUpdateApiDto
 */
export interface ReferAndEarnUpdateApiDto {
  status?: ReferAndEarnStatusType;
  withDrawalRequestRejectedReason?: string;
  jobApplicationStatus?: ReferAndEarnJobApplicationStatusType;
  paymentDoneDetails?: ReferAndEarnPaymentDoneDetailsDto;
  referrerBankDetails?: ReferAndEarnReferrerBankDetails;
  commissionAmount?: number;
}

/**
 * ReferAndEarnPaymentDoneDetailsType
 *
 * @reference `paymentDoneDetails` attribute of `ReferAndEarn.model.ts`
 */
export interface ReferAndEarnPaymentDoneDetailsDto {
  userId: string;
  userType: "ADMIN";
  actionDate: string;
  amountPaid: number;
  uniqueTransactionReference: string;
}

/**
 * ReferAndEarnReferrerBankDetails
 *
 * @reference `referrerBankDetails` attribute of `ReferAndEarn.model.ts`
 */
export interface ReferAndEarnReferrerBankDetails {
  accountHolderName: string;
  accountNumber: number;
  ifscCode: string;
  branchName: string;
}

/**
 * CursorPaginationAdminBulkScreenedJobsParams
 *
 * @description - This interface defines the parameters for cursor-based pagination of bulk screened jobs in corporate services.
 */
export interface CursorPaginationAdminBulkScreenedJobsParams {
  searchText?: string;
  lastKey?: string | undefined;
  pageSize: number;
  // sortOrder: string;
  companyId?: string;
  corporateBulkJdId?: string;
  agencyBulkJdId?:string;
  corporateRecruiterUserId?: string;
}

/**
 * CorporateUserPageAdminDataDto
 *
 * @description - Data Transfer Object representing a corporate user in the admin dashboard.
 */
export interface CorporateUserPageAdminDataDto {
  inviteId: string;
  companyId: string;
  lastName: string;
  createdAt: string; // ISO date
  isDeleted: boolean;
  email: string;
  firstName: string;
  GSI1PK: string;
  cognitoUserId: string;
  updatedAt: string; // ISO date
  SK: string;
  corporateUserType: "corporate-admin" | "corporate-recruiter"; // extend if more types exist
  id: string;
  PK: string;
  GSI1SK: string;
  companyDetails: CompanyDetails;
}

export interface CorporateUserPageRecDataDto {
  GSI1PK: string;
  GSI1SK: string;
  PK: string;
  companyId: string;
  corporateUserType: "corporate-admin" | "corporate-user" | string;
  createdAt: string; // ISO date string
  createdByUserId: string;
  email: string;
  expiresAt: string; // ISO date string
  firstName: string;
  id: string;
  inviteStatus: "PENDING" | "ACCEPTED" | "REJECTED" | string;
  isDeleted: boolean;
  lastName: string;
  phoneNumberDetails?: {
    countryCode: number;
    phoneNumber: number;
  };
  updatedAt: string; // ISO date string
  SK: string;
  corporateUserDetails?: CorporateUserDetails; // only present when inviteStatus = "ACCEPTED"
  companyDetails?: CompanyDto; // only present when includeCompanyDetails = true in params
}

interface CorporateUserDetails {
  inviteId: string;
  companyId: string;
  lastName: string;
  createdAt: string; // ISO date string
  isDeleted: boolean;
  email: string;
  firstName: string;
  GSI1PK: string;
  cognitoUserId: string;
  updatedAt: string; // ISO date string
  SK: string;
  corporateUserType: "corporate-admin" | "corporate-user" | string;
  id: string;
  PK: string;
  GSI1SK: string;
}
