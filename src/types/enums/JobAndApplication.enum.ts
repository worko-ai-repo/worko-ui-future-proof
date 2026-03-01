/**
 * JobApplicationStatusEnum
 *
 * @description: Enum representing the various statuses of a job application.
 */
export enum JobApplicationStatusEnum {
  ALL = "ALL", // used for filtering in job application list
  APPLIED = "APPLIED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  ON_HOLD = "ON_HOLD",
  CV_DOWNLOADED = "CV_DOWNLOADED",
  UNDER_EVALUATION = "UNDER_EVALUATION",

  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",
  INTERVIEW_DONE = "INTERVIEW_DONE",
  HIRING_IN_PROCESS = "HIRING_IN_PROCESS",

  DOCUMENT_REQUESTED = "DOCUMENT_REQUESTED", // send email to cand
  DOCUMENT_ADDITIONAL_REQUESTED = "DOCUMENT_ADDITIONAL_REQUESTED",
  DOCUMENT_SUBMITTED = "DOCUMENT_SUBMITTED", // send email to job poster
  DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED = "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
  DOCUMENT_REVISION_REQUESTED = "DOCUMENT_REVISION_REQUESTED", // whenever submitted document is re-requested
  DOCUMENT_REVISION_REQUEST_SUBMITTED = "DOCUMENT_REVISION_REQUEST_SUBMITTED", // when re-requested doc is submitted
  DOCUMENT_VERIFIED = "DOCUMENT_VERIFIED",

  OFFER_SENT = "OFFER_SENT", // send email to cand
  OFFER_ISSUE_RAISED = "OFFER_ISSUE_RAISED", // candidate raised issue on offer letter
  REVISED_OFFER_SENT = "REVISED_OFFER_SENT",

  HIRED = "HIRED",
  JOINED = "JOINED", // send email to both cand and job poster

  REVISED_LETTER = "REVISED_LETTER",
  OFFER_ACCEPTED = "OFFER_ACCEPTED",
  AWAITING = "AWAITING"
}

/**
 * JobStatusTypeEnum
 *
 * @description: Enum representing the various statuses a job can have.
 */

export enum JobStatusTypeEnum {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

/**
 * ReferralStatusEnum
 *
 * @description - Enum representing the various statuses of a referral.
 */
export enum ReferralStatusEnum {
  // User Referral related status
  AWAITING = "AWAITING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  WITHDRAWN = "WITHDRAWN",
  DONE = "DONE",
}

/**
 * GuidanceStatusEnum
 *
 * @description - Enum representing the various statuses of a guidance request.
 */
export enum UserGuidanceRequestTypeEnum {
  INTERVIEW_HAND_HOLDING = "INTERVIEW_HAND_HOLDING", // if this is selected the company name and jobUrl is mandatory
  MOCK_INTERVIEW_PREPARATION = "MOCK_INTERVIEW_PREPARATION",
  HELP_WITH_ASSIGNMENT = "HELP_WITH_ASSIGNMENT", // if this is selected the company name and jobUrl is mandatory
  CAREER_GUIDANCE = "CAREER_GUIDANCE",
  RESUME_REVIEW = "RESUME_REVIEW",
  OTHER = "OTHER",
}

/**
 * UserGuidanceRequestStatusEnum
 *
 * @description - Enum representing the various statuses of a user guidance request.
 */
export enum UserGuidanceRequestStatusEnum {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  MENTOR_ASSIGNED = "MENTOR_ASSIGNED",
  CANCELLED = "CANCELLED",
  PAYMENT_CONFIRMATION_PENDING = "PAYMENT_CONFIRMATION_PENDING",
  PAYMENT_CONFIRMATION_DONE = "PAYMENT_CONFIRMATION_DONE",
  MEETING_CONFIRMED = "MEETING_CONFIRMED",
  MEETING_RESCHEDULE_REQUESTED_BY_CANDIDATE = "MEETING_RESCHEDULE_REQUESTED_BY_CANDIDATE",
  MEETING_RESCHEDULE_REQUESTED_BY_MENTOR = "MEETING_RESCHEDULE_REQUESTED_BY_MENTOR",
  MEETING_RESCHEDULE_CONFIRMED = "MEETING_RESCHEDULE_CONFIRMED",
  PROJECT_COMPLETED = "PROJECT_COMPLETED",
}

/**
 * ReferAndEarnStatusEnum
 */
export enum ReferAndEarnStatusEnum {
  /**
   * NOT_ACHIEVED_YET
   *
   * Whenever the `referrer` refer his friend
   */
  NOT_ACHIEVED_YET = "NOT_ACHIEVED_YET",

  /**
   * ACHIEVED
   *
   * Whenever the `recipient` joined the company for the job which was referred by `referrer` then
   * the `referrer` is eligible for request withdrawal money
   */
  ACHIEVED = "ACHIEVED",

  /**
   * WITHDRAWAL_REQUESTED
   *
   * Whenever the Referrer requested a withdrawal money after `recipient` joined the company
   */
  WITHDRAWAL_REQUESTED = "WITHDRAWAL_REQUESTED",

  /**
   * WITHDRAWAL_ACCEPTED
   *
   * Whenever Request was accepted by worko admin
   */
  WITHDRAWAL_ACCEPTED = "WITHDRAWAL_ACCEPTED",

  /**
   * PAYMENT_COMPLETED
   *
   * Whenever Payment was completed by worko admin
   */
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",

  /**
   * WITHDRAWAL_REJECTED
   *
   * 1. Whenever the Request was rejected by worko admin
   * 2. Whenever the Job application of `recipient` was rejected
   *    1. Because of low matching score
   *    2. Because of corporate admin/recruiter rejecting
   *    3. Because of worko admin rejecting
   */
  WITHDRAWAL_REJECTED = "WITHDRAWAL_REJECTED",
}

/**
 * ReferAndEarnJobApplicationStatusEnum
 */
export enum ReferAndEarnJobApplicationStatusEnum {
  /**
   * PENDING
   *
   * Whenever the `referrer` refer his friend
   */
  PENDING = "PENDING",

  /**
   * APPLIED
   *
   * Whenever the `recipient` applied for the `companyJob` which was
   * through the job link which was send by a `referrer`
   */
  APPLIED = "APPLIED",

  /**
   * REJECTED
   *
   * Whenever the `status` attribute in the `UserJobApplication.model.ts` is `REJECTED`:
   *  1. Whenever the `worko admin` rejects the `job application`
   *  2. Whenever the `corporate admin/recruiter`  rejects the `job application`
   *  3. Whenever the `job application` rejected because of low matching score
   */
  REJECTED = "REJECTED",

  /**
   * PROCESSING_INTERVIEW
   *
   * Whenever the `status` attribute in the `UserJobApplication.model.ts` is `PROCESSING_INTERVIEW`:
   *  1. Whenever the `worko admin` update the `job application` status to `PROCESSING_INTERVIEW`
   *  2. Whenever the `corporate admin/recruiter` update the `job application` status to `PROCESSING_INTERVIEW`
   */
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",

  /**
   * HIRED
   *
   * Whenever the `status` attribute in the `UserJobApplication.model.ts` is `HIRED`:
   *  1. Whenever the `worko admin` update the `job application` status to `hired`
   *  2. Whenever the `corporate admin/recruiter` update the `job application` status to `hired`
   */
  HIRED = "HIRED",

  /**
   * JOINED
   *
   * Whenever the `recipient` got hired and joined for the `company` then
   * `worko admin` will update the Refer And Earn JobApplication Status
   * to `JOINED`.
   */
  JOINED = "JOINED",
}

export enum DatabaseStatusEnum{
  REFERRAL = "REFERRAL",
  INTERNAL = "INTERNAL",
  AGENCY = "AGENCY",
  WORKO = "WORKO",
  BLACKLISTED = "BLACKLISTED",
  UNDER_COOLING_PERIOD = "UNDER_COOLING_PERIOD",
  UNDER_PROCESSING = "UNDER_PROCESSING",
}