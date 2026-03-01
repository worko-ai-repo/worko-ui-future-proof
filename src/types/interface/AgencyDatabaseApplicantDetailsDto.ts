export interface AgencyDatabaseApplicantDetailsDto {
  pk: string;
  sk: string;
  id:string;
  referredBy: string;
  refereeType: string;
  date: string;
  profileName: string;
  candidateName: string;
  currentCompany: string;
  currentDesignation: string;
  currentCTC: string;
  expectedCTC: string;
  noticePeriod: string;
  locationComfortableWith: string;
  remark: string;
  cv: string;
  coreSkills:string;
  YOE:string;
  source:string;
  about:string;
  CTC:string;
  ECTC:string;
  cvLink:string;
  candidateEmail:string;
  contactNumber:string;
  appliedCompany:string;
  addedBy:string;
  addedFor:string;
  coolingPeriod:string;
  lastActive:string;
  jobProfile: string;
  agencyName: string;
  dateSubmitted: string;
  applicantName: string;
  emailId: string;
  totalYOE: number;
  relevantYOE: number;
  readyToRelocate: boolean;
  comments: string;
  score: number;
  currentStatus: string;
  location:string;
  contactName:string;
  dateActivated:string;
  assignedJobs:number;
  totalCandidateSubmitted:number;
  totalCandidateRejected:number;
  totalCandidateHired:number;
  GSTIN:string;
  contractLink:string;
  companyName:string;
  achievements?:string;
  locationComfortable:string;
  inviteStatus:string;
  contractCopyAwsS3FileName:string;
  name:string;
}
//   "data": [
//       {
//          invitedByCorporateUserId: string;
//          updatedByCorporateUserId?: string;
//          companyId: string;
//          name: string;
//          inviteStatus: string;
//          email: string;
//          phoneNumberDetails: object;
//          GSTIN?: string;
//          contractCopyAwsS3FileName: string;
//          contractCopyUserFileName: string;
//          createdAt: string;
//          updatedAt: string;
//       }
//   ],
//   "pagination": {
//     "count": 1,
//     "pageSize": 25,
//     "sortOrder": "descending"
//   }
// }

export interface AgencyListDetailsDto {
  GSTIN: string;
  companyId:String;
  contractCopyAwsS3FileName:string;
  contractCopyUserFileName:string;
  createdAt:string;
  email:string;
  id: string;
  inviteStatus: string;
  invitedByCorporateUserId:string;
  name:string;
  phoneNumberDetails:{
    countryCode: number;
    number: number;
  }
  updatedAt:string;
  PK: string;
  SK: string;
  
  //fake data
  pk: string;
  sk: string;
  referredBy: string;
  refereeType: string;
  date: string;
  profileName: string;
  candidateName: string;
  currentCompany: string;
  currentDesignation: string;
  currentCTC: string;
  expectedCTC: string;
  noticePeriod: string;
  locationComfortableWith: string;
  remark: string;
  cv: string;
  coreSkills:string;
  YOE:string;
  source:string;
  about:string;
  CTC:string;
  ECTC:string;
  cvLink:string;
  candidateEmail:string;
  contactNumber:string;
  appliedCompany:string;
  addedBy:string;
  addedFor:string;
  coolingPeriod:string;
  lastActive:string;
  jobProfile: string;
  agencyName: string;
  dateSubmitted: string;
  applicantName: string;
  emailId: string;
  totalYOE: number;
  relevantYOE: number;
  readyToRelocate: boolean;
  comments: string;
  score: number;
  currentStatus: string;
  location:string;
  contactName:string;
  dateActivated:string;
  assignedJobs:number;
  totalCandidateSubmitted:number;
  totalCandidateRejected:number;
  totalCandidateHired:number;
  contractLink:string;
  companyName:string;
  achievements?:string;
  isPaused:boolean;
  isDelete:boolean;
}