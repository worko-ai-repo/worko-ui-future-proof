export interface AgencyInvitesListDetailsDto {
  GSTIN: string;
  companyId: string;
  contractCopyUserFileName: string;
  createdAt: string;
  email: string; 
  id: string;
  inviteStatus: string;
  invitedByCorporateUserId: string;
  name: string;
  phoneNumberDetails: {
    number: number; 
    countryCode: number;
  }
  updatedAt: string;
  updatedByAgencyUserId: string;
  inviterName:string;
  companyName:string;
}

// export interface AgencyJobsList {
//   id: string;
//   pk: string;
//   sk: string;
//   companyName:string;
//   profile:string;
//   YOEStart: number;
//   YOEEnd: number;
//   salaryStart: number;
//   salaryEnd: number;
//   location:string;
//   noticePeriod: number;
//   dateAssigned: string,
//   candidatesUploaded: number;
//   candidatesRejected: number;
//   candidatesInProcess: number;
// }

export interface AgencyJobsList {
  agencyRegisteredEmail: string;
  assignedByCorporateUserId: string;
  companyId: string;
  createdAt: string;
  id: string;
  jobId: string;
  status: string; 
  updatedAt: string; 
  jobDetails:JobDetails;
  //fake data
  totalCandidatesUploaded:number;
  candidatesRejected:number;
  candidatesInProcess:number;
  agencyUserInviteId:string;
  agencyComments:string;
}

// export interface JobDetails {
//   id: string;
//   jobId?: string;
//   companyId: string;
//   companyName: string;
//   companyLogoUrl: string;
//   companyUrl?: string;
//   coreSkills: string[];
//   technicalSkills: string[];
//   softSkills: string[];
//   miscellaneousSkills: string[];
//   createdAt: string; 
//   updatedAt?: string; 
//   createdByCorporateUserId?: string;
//   department?: string;
//   displaySalaryRange?: boolean;
//   experienceRange?: ExperienceRange;
//   flexibleNotice?: boolean;
//   htmlJobDescription?: string;  
//   jobDescription?: string;
//   jobTitle?: string;
//   jobUrl?: string;
//   location?: LocationInfo;
//   noticePeriod?: number;
//   numOfOpenings?: number;
//   otherRequirements?: string;
//   salaryRange?: SalaryRange;
//   sourcedFrom?: string;         
//   status?: string;              
//   typeofEmployment?: string;   
//   workMode?: string;            
//   isDeleted?: boolean;
// }

export interface ExperienceRange {
  min: number;
  max: number;
}

export interface SalaryRange {
  min: number;
  max: number;
  fixedComponentPercentage?: number;  
  variableComponentPercentage?: number;
}

export interface LocationInfo {
  city: string[];
  fullLocation: string[];
  state: string[];
  country: string[];
}

export interface AgencyApplicantsListDetailsDto {
  agencyComments: string;
  agencyJobAssignedByCorporateUserId: string;
  agencyJobAssignmentId: string;
  agencyName: string;
  agencyRegisteredEmail: string;
  agencyUserId: string;
  agencyUserInviteId: string;
  candidateEmail:  string;
  candidateParsedCvDetails: CandidateParsedCvDetails;
  candidateParsedCvId: string;
  companyId: string;
  createdAt: string;
  id: string;
  jobDetails: JobDetails;
  jobId: string;
  updatedAt: string;
  jobApplicationStatus:string;
}

export interface JobDetails {
  companyId: string;
  companyLogoUrl: string;
  companyName: string;
  companyUrl: string;
  coreSkills: string[];
  createdAt: string;
  createdByCorporateUserId: string;
  department: string;
  displaySalaryRange: boolean;
  experienceRange: {
    min: number;
    max: number;
  };
  flexibleNotice: boolean;
  htmlJobDescription: string;
  id: string;
  isDeleted: boolean;
  jobDescription: string;
  jobTitle: string;
  jobUrl: string;
  location: {
    city: string[];
    fullLocation: string[];
    state: string[];
    country: string[];
  };
  miscellaneousSkills: string[];
  noticePeriod: number;
  numOfOpenings: number;
  otherRequirements: string;
  salaryRange: {
    min: number;
    max: number;
    fixedComponentPercentage: number;
    variableComponentPercentage: number;
  };
  softSkills: string[];
  sourcedFrom: string;
  status: string;
  technicalSkills: string[];
  typeofEmployment: string;
  updatedAt: string;
  workMode: string;
  userPreferredDepartments: any;
  userPreferredIndustries: any;
  userPreferredLocations: any;
  userPreferredRoles: any;
}

export interface CandidateParsedCvDetails {
  agencyUserSubmissionId: string;
  createdAt: string;
  currentCTC: number;
  currentCompany: string;
  currentDesignation: string;
  cvAwsS3FileName: string;
  email: string;
  expectedCTC: number;
  id: string;
  isNoticePeriodNegotiable: boolean;
  location: string;
  name: string;
  noticePeriod: number;
  phoneNumberDetails: {
    number: number;
    countryCode: number;
  };
  countryCode: number;
  number: number;
  readyToRelocate: boolean;
  relevantYOE: number;
  totalYOE: number;
  updatedAt: string;
}