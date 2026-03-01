import { DatabaseStatusEnum, JobApplicationStatusEnum, JobStatusTypeEnum, ReferAndEarnJobApplicationStatusEnum, ReferAndEarnStatusEnum, ReferralStatusEnum, UserGuidanceRequestStatusEnum, UserGuidanceRequestTypeEnum } from "@Enums/JobAndApplication.enum";

/**
 * JobStatus
 * 
 * @description -  Represent the type of status a job can have
 */
export type JobStatusType = `${JobStatusTypeEnum}`;

/**
 * JobApplicationStatusType
 * 
 * @description: Type representing the possible values of JobApplicationStatusEnum.
 */
export type JobApplicationStatusType = `${JobApplicationStatusEnum}`;

/**
 * JobTypeofEmploymentType
 * 
 * @description: Type representing the possible values of job typeof employment.
 */
export type JobTypeofEmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

/**
 * ReferralStatusType
 * 
 * @description - Represents the type of status a referral can have
 */
export type ReferralStatusType = `${ReferralStatusEnum}`;

/**
 * UserGuidanceRequestType
 * 
 * @description - Represents the type of user guidance request
 */
export type UserGuidanceRequestType = `${UserGuidanceRequestTypeEnum}`;

/**
 * UserGuidanceRequestStatusType
 * 
 * @description - Represents the type of status a user guidance request can have
 */
export type UserGuidanceRequestStatusType = `${UserGuidanceRequestStatusEnum}`; 
  

/**
 * ReferAndEarnStatusType
 * 
 * @description - Represents the type of status a refer and earn can have
 */
export type ReferAndEarnStatusType = `${ReferAndEarnStatusEnum}`;

/**
 * ReferAndEarnJobApplicationStatusType
 * 
 * @description - Represents the type of status a refer and earn job application can have
 */
export type ReferAndEarnJobApplicationStatusType = `${ReferAndEarnJobApplicationStatusEnum}`;

/**
 * ReferAndEarnFullStatusType
 * 
 * @description - Represents the type of status a refer and earn or its job application can have
 */
export type ReferAndEarnFullStatusType = ReferAndEarnStatusType | ReferAndEarnJobApplicationStatusType;

export type DatabaseStatusType = `${DatabaseStatusEnum}`;