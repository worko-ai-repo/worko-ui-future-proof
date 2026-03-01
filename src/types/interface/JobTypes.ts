// src/components/Jobs/JobTypes.ts
export interface JobTypes {
  statusTracker: StatusTracker[];
  rejectionFeedbackBySystem: string;
  companyId: string;
  companyName: string;
  createdAt: string;
  jobId: string;
  id: string;
  title: string;
  jobTitle: string;
  company: string;
  applyDate: string;
  matchingScore: number;
  status: JobStatus;
  scoreDetails: string;
  action: string | null;
  applicationSteps?: ApplicationStep[];
  jobType: string;
  requestedDocumentDetails?: RequestedDocumentDetail[];
  followUpRequest?: {
    actionDate: string;
  }[];
}

export interface RequestedDocumentDetail {
  actionDate: string;
  documentStatus: string;
  requestedDocumentNames: string[];
  userId: string;
  userType: string;
}


export interface StatusTracker {
  userType: string;
  oldStatus: string;
  newStatus: string;
  actionDate: string;
  userId: string;
}

export type JobStatus = 
  | 'UNDER_EVALUATION'
  | 'PROCESSING_INTERVIEW'
  | 'INTERVIEW_DONE'
  | 'DOCUMENT_REQUESTED'
  | 'DOCUMENT_SUBMITTED'
  | 'OFFER_LETTER'
  | 'REVISED_LETTER'
  | 'REJECTED'
  | 'HIRED'
  | 'JOINED'
  | 'APPLIED'
  | 'CV_DOWNLOADED'
  | 'OFFER_ACCEPTED'
  | 'OFFER_ISSUE_RAISED';

export type JobAction = 
  | 'HIRED'
  | 'JOINED'
  | 'SUBMIT_DOCUMENT'
  | 'CHECK_ACCEPT'
  | 'VIEW_FEEDBACK';

export interface ApplicationStep {
  step: string;
  date: string;
  completed: boolean;
}

export interface PaginationInfo {
  count: number;
  pageSize: number;
  sortOrder: string;
  timesQueried: number;
  queriedCount: number;
  lastKey: string;
}

export interface JobApiResponse {
  data: JobTypes[];
  pagination: PaginationInfo;
  totalJobs?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface JobFilters {
  searchText?: string;
  companyId?: string;
  sortOrder?: 'ascending' | 'descending';
  userType?: string;
}