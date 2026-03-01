import { JobApplicationDetailsDto, StatusTracker } from "@Interfaces/CorporateDashboard.dto";
import { parseScorePoints, ScorePoint } from "./DetailedAnalysis.utils";
import { TimelineStep } from "@Components/Shared/Timeline";
import { JobApplicationStatusEnum } from "@Enums/JobAndApplication.enum";

class JobApplicationService {
  private readonly THRESHOLD_SCORE = 40;
  private readonly UPPER_MID_SCORE = 69;
  private readonly HIGH_SCORE = 90;
  private readonly STATUS_REJECTED = "REJECTED";
  private readonly STATUS_APPLIED = "APPLIED";
  private readonly STATUS_LABELS: Record<JobApplicationStatusEnum, string> = {
    [JobApplicationStatusEnum.APPLIED]: "Applied",
    [JobApplicationStatusEnum.ACCEPTED]: "Accepted",
    [JobApplicationStatusEnum.CV_DOWNLOADED]: "CV Downloaded",
    [JobApplicationStatusEnum.UNDER_EVALUATION]: "Under Evaluation",
    [JobApplicationStatusEnum.PROCESSING_INTERVIEW]: "Processing Interview",
    [JobApplicationStatusEnum.INTERVIEW_DONE]: "Interview Completed",
    [JobApplicationStatusEnum.DOCUMENT_REQUESTED]: "Documents Requested",
    [JobApplicationStatusEnum.HIRING_IN_PROCESS]: "Hiring in Process",
    [JobApplicationStatusEnum.OFFER_SENT]: "Offer Sent",
    [JobApplicationStatusEnum.OFFER_ISSUE_RAISED]: "Offer Issue Raised",
    [JobApplicationStatusEnum.REVISED_OFFER_SENT]: "Revised Offer Sent",
    [JobApplicationStatusEnum.REVISED_LETTER]: "Revised Letter",
    [JobApplicationStatusEnum.OFFER_ACCEPTED]: "Offer Accepted",
    [JobApplicationStatusEnum.HIRED]: "Hired",
    [JobApplicationStatusEnum.JOINED]: "Joined",
    [JobApplicationStatusEnum.REJECTED]: "Rejected",
    [JobApplicationStatusEnum.AWAITING]: "Awaiting",

    // Not part of timeline → keep as empty label
    [JobApplicationStatusEnum.ON_HOLD]: "",
    [JobApplicationStatusEnum.ALL]: "",
    [JobApplicationStatusEnum.DOCUMENT_ADDITIONAL_REQUESTED]: "",
    [JobApplicationStatusEnum.DOCUMENT_SUBMITTED]: "",
    [JobApplicationStatusEnum.DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED]: "",
    [JobApplicationStatusEnum.DOCUMENT_REVISION_REQUESTED]: "",
    [JobApplicationStatusEnum.DOCUMENT_REVISION_REQUEST_SUBMITTED]: "",
    [JobApplicationStatusEnum.DOCUMENT_VERIFIED]: "",
  };
  private readonly STATUS_TYPE_MAP: Partial<
    Record<JobApplicationStatusEnum, TimelineStep["status"]>
  > = {
    [JobApplicationStatusEnum.APPLIED]: "success",
    [JobApplicationStatusEnum.ACCEPTED]: "success",
    [JobApplicationStatusEnum.CV_DOWNLOADED]: "success",
    [JobApplicationStatusEnum.UNDER_EVALUATION]: "success",
    [JobApplicationStatusEnum.PROCESSING_INTERVIEW]: "success",
    [JobApplicationStatusEnum.INTERVIEW_DONE]: "success",
    [JobApplicationStatusEnum.DOCUMENT_REQUESTED]: "success",
    [JobApplicationStatusEnum.HIRING_IN_PROCESS]: "success",
    [JobApplicationStatusEnum.OFFER_SENT]: "success",
    [JobApplicationStatusEnum.REVISED_OFFER_SENT]: "success",
    [JobApplicationStatusEnum.HIRED]: "success",
    [JobApplicationStatusEnum.JOINED]: "success",

    [JobApplicationStatusEnum.OFFER_ISSUE_RAISED]: "warning",
    [JobApplicationStatusEnum.REJECTED]: "error",
  };

  constructor() {}

  /**
   * Determines if the "Push to Recruiter" button should be shown for a job application.
   */
  public showPushToRecruiterButton(jobApplication: JobApplicationDetailsDto): boolean {
    if (!jobApplication?.statusTracker?.length || !jobApplication.matchingScore) return false;
    // Find the latest APPLIED status change
    const appliedStatus = [...jobApplication.statusTracker]
      .reverse()
      .find((entry) => entry.newStatus === this.STATUS_APPLIED);

    if (!appliedStatus?.actionDate) return false;

    // Calculate hours since APPLIED
    const hoursSinceApplied =
      (new Date().getTime() - new Date(appliedStatus.actionDate).getTime()) / (1000 * 60 * 60);

    const isWithin24Hours = hoursSinceApplied < 24;

    // Score validity: (50–70) OR (>=90), and scoreDetails must exist
    const scoreIsValid =
      ((jobApplication.matchingScore >= this.THRESHOLD_SCORE &&
        jobApplication.matchingScore <= this.UPPER_MID_SCORE) ||
        jobApplication.matchingScore >= this.HIGH_SCORE) &&
      Boolean(jobApplication.scoreDetails);
    /*     console.log(
      isWithin24Hours &&
        jobApplication?.companyId !== import.meta.env.APP_WORKO_COMP_ID &&
        jobApplication.status !== this.STATUS_REJECTED &&
        scoreIsValid &&
        jobApplication?.companyId !== import.meta.env.APP_WORKO_COMP_ID // this make sure that worko jobs don't show this button
    ); */
    const isWorkoJob =
      !jobApplication?.jobCreatedByCorporateUserId && jobApplication?.jobCreatedByUserId != null;
    return (
      isWithin24Hours &&
      !isWorkoJob &&
      // jobApplication?.companyId !== import.meta.env.APP_WORKO_COMP_ID &&
      jobApplication.status !== this.STATUS_REJECTED &&
      scoreIsValid
    );
  }

  /**
   * Returns the appropriate score details or rejection feedback for a job application.
   */
  public getScoreDetails(jobApplication: JobApplicationDetailsDto): {
    feedback: any;
    type: "REJ" | "SCORE";
  } {
    if (
      !jobApplication ||
      jobApplication.matchingScore === null ||
      jobApplication.matchingScore === undefined
    ) {
      console.error("Invalid input: job is null or undefined");
      return {
        feedback: null,
        type: "REJ",
      };
    }

    const isSentToCorporate = jobApplication.displayToCorporate ?? false;

    if (!isSentToCorporate) {
      if (
        jobApplication.matchingScore >= this.THRESHOLD_SCORE &&
        jobApplication.matchingScore <= this.UPPER_MID_SCORE
      ) {
        return this.createResponse(jobApplication.rejectionFeedbackBySystem, "REJ");
      } else if (jobApplication.matchingScore >= this.HIGH_SCORE) {
        return this.createResponse(jobApplication.scoreDetails, "SCORE");
      } else if (jobApplication.matchingScore < this.THRESHOLD_SCORE) {
        return this.createResponse(jobApplication.rejectionFeedbackBySystem, "REJ");
      }
    }
    return this.createResponse(
      jobApplication.scoreDetails || "No score details available",
      "SCORE"
    );
  }

  /**
   * Helper method to create a response object.
   */
  private createResponse(feedback: any, type: "REJ" | "SCORE") {
    return { feedback, type };
  }

  public getRejectionReason(data: JobApplicationDetailsDto | string | null): string[] {
    if (!data) return [];
  
    let feedback: string | undefined;
  
    if (typeof data === "string") {
      feedback = data;
    } else {
      feedback = data.rejectionFeedbackBySystem;
    }
  
    if (!feedback) return [];
  
    // Check if feedback is a JSON string (starts with '[' or '{')
    const trimmedFeedback = feedback.trim();
    if (!trimmedFeedback.startsWith('[') && !trimmedFeedback.startsWith('{')) {
      // It's a plain text string, return it as a single-item array
      return [feedback];
    }
  
    try {
      const parsed = JSON.parse(feedback);
      
      // Check if parsed data is an array
      if (Array.isArray(parsed)) {
        const scorePoints: ScorePoint[] = parsed;
        return scorePoints?.map((point) => point.detail || "");
      }
      
      // If it's an object, try to extract details from it
      if (typeof parsed === 'object' && parsed !== null) {
        // If it has a details property that's an array
        if (Array.isArray(parsed.details)) {
          return parsed.details.map((point: any) => point.detail || point.toString());
        }
        
        // If it's a single object with detail property
        if (parsed.detail) {
          return [parsed.detail];
        }
        
        // If it's an object with string values, return them
        const values = Object.values(parsed).filter(val => typeof val === 'string');
        if (values.length > 0) {
          return values as string[];
        }
      }
      
      // If it's a string, return it as single item array
      if (typeof parsed === 'string') {
        return [parsed];
      }
      
      console.warn("Unexpected rejection feedback format:", parsed);
      return [];
    } catch (e) {
      // If JSON parsing fails, treat as plain text
      console.warn("Feedback is not valid JSON, treating as plain text:", feedback);
      return [feedback];
    }
  }

  public getTimelineDetails(row: JobApplicationDetailsDto): TimelineStep[] {
    const seen = new Set<JobApplicationStatusEnum>();

    return row.statusTracker
      .filter(
        (s: StatusTracker) => this.STATUS_LABELS[s.newStatus as JobApplicationStatusEnum] // only major ones
      )
      .map((s: StatusTracker) => {
        const status = s.newStatus as JobApplicationStatusEnum;
        if (seen.has(status)) return null; // avoid duplicates
        seen.add(status);

        return {
          label: this.STATUS_LABELS[status],
          date: s.actionDate ? new Date(s.actionDate).toLocaleDateString() : "",
          status: this.STATUS_TYPE_MAP[status] ?? "pending",
        } as TimelineStep;
      })
      .filter(Boolean) as TimelineStep[];
  }

  public isVisibleToCorporate(row: JobApplicationDetailsDto): boolean {
   if(row?.matchingScore  && row.matchingScore >= this.UPPER_MID_SCORE) return true; // auto visible if score is 70 or above)
   else{ 
    return typeof row?.displayToCorporate === "boolean" && row.displayToCorporate === true
   }
  } 
}

const jobApplicationServiceObj = new JobApplicationService();
export default jobApplicationServiceObj;
