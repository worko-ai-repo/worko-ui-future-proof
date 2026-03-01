import { ReferralStatusEnum, UserGuidanceRequestTypeEnum } from "@Enums/JobAndApplication.enum";
import {
  ReferAndEarnFullStatusType,
  ReferAndEarnJobApplicationStatusType,
  ReferAndEarnStatusType,
  ReferralStatusType,
  UserGuidanceRequestStatusType,
} from "./JobsAndApplication.type";
import { TimelineStep } from "@Components/Shared/Timeline";

/**
 * CommonPaginationPageSizeOptions
 *
 * @description Defines the available options for pagination page sizes.
 */
export const CommonPaginationPageSizeOptions = [
  { label: "10 items", value: 10 },
  { label: "25 items", value: 25 },
  { label: "50 items", value: 50 },
  { label: "100 items", value: 100 },
  { label: "150 items", value: 150 },
  { label: "200 items", value: 200 },
];
export type CommonPaginationPageSizeOptionsType = 10 | 25 | 50 | 100 | 150 | 200;
/**
 * STATUS_LABELS
 *
 * @description Maps each referral status enum to its corresponding human-readable label.
 */
export const STATUS_LABELS: Record<ReferralStatusEnum, string> = {
  [ReferralStatusEnum.AWAITING]: "Requested",
  [ReferralStatusEnum.ACCEPTED]: "Accepted",
  [ReferralStatusEnum.DONE]: "Done",
  [ReferralStatusEnum.REJECTED]: "Rejected",
  [ReferralStatusEnum.WITHDRAWN]: "Withdrawn",
  [ReferralStatusEnum.CANCELLED]: "Cancelled",
};

/**
 * STATUS_TYPE_MAP
 *
 * @description Maps each referral status to a timeline step type
 * (success, error, or warning) for UI representation.
 */
export const STATUS_TYPE_MAP: Partial<Record<ReferralStatusType, TimelineStep["status"]>> = {
  [ReferralStatusEnum.AWAITING]: "success",
  [ReferralStatusEnum.ACCEPTED]: "success",
  [ReferralStatusEnum.DONE]: "success",
  [ReferralStatusEnum.REJECTED]: "error",
  [ReferralStatusEnum.WITHDRAWN]: "warning",
  [ReferralStatusEnum.CANCELLED]: "warning",
};

/**
 * REFERRAL_STATUS_COLORS
 *
 * @description Provides background and text color classes for each referral status.
 */
export const REFERRAL_STATUS_COLORS: Record<ReferralStatusType, string> = {
  DONE: "bg-[#A0CEFF] text-[#316BFF]", // Blue and dark blue text
  ACCEPTED: "bg-[#A0FFA5] text-[#00B542]", // Green and dark green text
  AWAITING: "bg-[#FFF3A0] text-[#FFB800]", // Yellow and dark yellow text
  REJECTED: "bg-[#FFA0A0] text-[#FF3B3B]", // Red and dark red text
  WITHDRAWN: "bg-[#FFD1A0] text-[#FF6F00]", // Orange and dark orange text
  CANCELLED: "bg-[#E0E0E0] text-[#6B6B6B]", // Grey and dark grey text
};

/**
 * REFERRAL_STATUS_LABELS
 *
 * @description Maps each referral status type to its simplified label for display.
 */
export const REFERRAL_STATUS_LABELS: Record<ReferralStatusType, string> = {
  DONE: "Referred",
  ACCEPTED: "Accepted",
  AWAITING: "Awaiting",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  CANCELLED: "Cancelled",
};

/**
 * GUIDANCE_STATUS_COLORS
 *
 * @description - Provides background and text color classes for each guidance request status.
 */
export const GUIDANCE_STATUS_COLORS: Record<UserGuidanceRequestStatusType, string> = {
  PENDING: "bg-[#FFF3A0] text-[#FFB800]", // Yellow and dark yellow text
  MENTOR_ASSIGNED: "bg-[#A0CEFF] text-[#316BFF]", // Blue and dark blue text
  PAYMENT_CONFIRMATION_PENDING: "bg-[#FFD1A0] text-[#FF6F00]", // Orange and dark orange text
  PAYMENT_CONFIRMATION_DONE: "bg-[#A0FFA5] text-[#00B542]", // Green and dark green text
  MEETING_CONFIRMED: "bg-[#A0FFA5] text-[#00B542]", // Green and dark green text
  MEETING_RESCHEDULE_REQUESTED_BY_CANDIDATE: "bg-[#FFA0A0] text-[#FF3B3B]", // Red and dark red text
  MEETING_RESCHEDULE_REQUESTED_BY_MENTOR: "bg-[#FFA0A0] text-[#FF3B3B]", // Red and dark red text
  MEETING_RESCHEDULE_CONFIRMED: "bg-[#A0FFA5] text-[#00B542]", // Green and dark green text
  REJECTED: "bg-[#FFA0A0] text-[#FF3B3B]", // Red and dark red text
  CANCELLED: "bg-[#E0E0E0] text-[#6B6B6B]", // Grey and dark grey text
  PROJECT_COMPLETED: "bg-[#D1FFD1] text-[#008000]", // Light green and dark green text
};

/**
 * GUIDANCE_STATUS_LABELS
 *
 * @description - Maps each guidance request status type to its simplified label for display.
 */
export const GUIDANCE_STATUS_LABELS: Record<UserGuidanceRequestStatusType, string> = {
  PENDING: "Pending",
  MENTOR_ASSIGNED: "Mentor Assigned",
  PAYMENT_CONFIRMATION_PENDING: "Payment Pending",
  PAYMENT_CONFIRMATION_DONE: "Payment Done",
  MEETING_CONFIRMED: "Meeting Confirmed",
  MEETING_RESCHEDULE_REQUESTED_BY_CANDIDATE: "Reschedule Requested by Candidate",
  MEETING_RESCHEDULE_REQUESTED_BY_MENTOR: "Reschedule Requested by Mentor",
  MEETING_RESCHEDULE_CONFIRMED: "Reschedule Confirmed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  PROJECT_COMPLETED: "Project Completed",
};

/**
 * GUIDANCE_REQUEST_TYPE_LABELS
 *
 * @description - Maps each guidance request type to its human-readable label.
 */
export const GUIDANCE_REQUEST_TYPE_LABELS: Record<UserGuidanceRequestTypeEnum, string> = {
  INTERVIEW_HAND_HOLDING: "Interview Hand Holding",
  MOCK_INTERVIEW_PREPARATION: "Mock Interview Preparation",
  HELP_WITH_ASSIGNMENT: "Help with Assignment",
  CAREER_GUIDANCE: "Career Guidance",
  RESUME_REVIEW: "Resume Review",
  OTHER: "Other",
};

/**
 * CompanyIndustryOptions
 */
export const industryTypeOptions: Array<{ name: string; value: string }> = [
  { name: "Accounting / Auditing", value: "Accounting / Auditing" },
  { name: "Advertising & Marketing", value: "Advertising & Marketing" },
  { name: "Agriculture / Forestry / Fishing", value: "Agriculture / Forestry / Fishing" },
  { name: "Analytics / KPO / Research", value: "Analytics / KPO / Research" },
  { name: "Animation & VFX", value: "Animation & VFX" },
  { name: "Architecture / Interior Design", value: "Architecture / Interior Design" },
  { name: "Auto Components", value: "Auto Components" },
  { name: "Aviation", value: "Aviation" },
  { name: "Automobile", value: "Automobile" },
  { name: "Banking", value: "Banking" },
  { name: "Beauty & Personal Care", value: "Beauty & Personal Care" },
  { name: "Beverage", value: "Beverage" },
  { name: "Biotechnology", value: "Biotechnology" },
  { name: "BPO / Call Centre", value: "BPO / Call Centre" },
  { name: "Building Material", value: "Building Material" },
  { name: "Chemicals", value: "Chemicals" },
  { name: "Clinical Research / Contract Research", value: "Clinical Research / Contract Research" },
  { name: "Consumer Electronics & Appliances", value: "Consumer Electronics & Appliances" },
  { name: "Content Development / Language", value: "Content Development / Language " },
  { name: "Courier / Logistics", value: "Courier / Logistics" },
  { name: "Defence & Aerospace", value: "Defence & Aerospace" },
  { name: "Design", value: "Design" },
  { name: "E-commerce", value: "E-commerce" },
  { name: "E-Learning / EdTech", value: "e-Learning / EdTech" },
  { name: "Education / Training", value: "Education / Training" },
  { name: "Electrical Equipment", value: "Electrical Equipment" },
  {
    name: "Electronic Components / Semiconductors",
    value: "Electronic Components / Semiconductors",
  },
  { name: "Electronics Manufacturing", value: "Electronics Manufacturing" },
  { name: "Emerging Technologies", value: "Emerging Technologies" },
  { name: "Engineering & Construction", value: "Engineering & Construction" },
  { name: "Events / Live Entertainment", value: "Events / Live Entertainment" },
  { name: "D2C", value: "D2C" },
  { name: "Facility Management Services", value: "Facility Management Services" },
  {
    name: "Fertilizers / Pesticides / Agro chemicals",
    value: "Fertilizers / Pesticides / Agro chemicals",
  },
  { name: "Film / Music / Entertainment", value: "Film / Music / Entertainment" },
  { name: "Financial Services", value: "Financial Services" },
  { name: "FinTech / Payments", value: "FinTech / Payments" },
  { name: "Fitness & Wellness", value: "Fitness & Wellness" },
  { name: "FMCG", value: "FMCG" },
  { name: "Food Processing", value: "Food Processing" },
  { name: "Furniture & Furnishing", value: "Furniture & Furnishing" },
  { name: "Gaming", value: "Gaming" },
  { name: "Gems & Jewellery", value: "Gems & Jewellery" },
  { name: "Hardware & Networking", value: "Hardware & Networking" },
  { name: "Hospitality", value: "Hospitality" },
  { name: "Hotels & Restaurants", value: "Hotels & Restaurants" },
  { name: "Import & Export", value: "Import & Export" },
  { name: "Industrial Automation", value: "Industrial Automation" },
  { name: "Industrial Equipment / Machinery", value: "Industrial Equipment / Machinery" },
  { name: "Insurance", value: "Insurance" },
  { name: "Internet", value: "Internet" },
  {
    name: "Investment Banking / Venture Capital / Private Equity",
    value: "Investment Banking / Venture Capital / Private Equity",
  },
  { name: "Manufacturing", value: "Manufacturing" },
  { name: "Iron & Steel", value: "Iron & Steel" },
  { name: "IT Services & Consulting", value: "IT Services & Consulting" },
  { name: "Law Enforcement / Security Services", value: "Law Enforcement / Security Services" },
  { name: "Leather", value: "Leather" },
  { name: "Legal", value: "Legal" },
  { name: "Management Consulting", value: "Management Consulting" },
  { name: "Manufacturing", value: "Manufacturing" },
  { name: "Medical Devices & Equipment", value: "Medical Devices & Equipment" },
  { name: "Medical Services / Hospital", value: "Medical Services / Hospital" },
  { name: "Metals & Mining", value: "Metals & Mining" },
  { name: "Miscellaneous", value: "Miscellaneous" },
  { name: "NBFC", value: "NBFC" },
  {
    name: "NGO / Social Services / Industry Associations",
    value: "NGO / Social Services / Industry Associations",
  },
  { name: "Oil & Gas", value: "Oil & Gas" },
  { name: "Packaging & Containers", value: "Packaging & Containers" },
  { name: "Petrochemical / Plastics / Rubber", value: "Petrochemical / Plastics / Rubber" },
  { name: "Pharmaceutical & Life Sciences", value: "Pharmaceutical & Life Sciences" },
  { name: "Ports & Shipping", value: "Ports & Shipping" },
  { name: "Power", value: "Power" },
  {
    name: "Professional Services / Project Management",
    value: "Professional Services / Project Management",
  },
  { name: "Printing & Publishing", value: "Printing & Publishing" },
  { name: "Pulp & Paper", value: "Pulp & Paper" },
  { name: "Railways", value: "Railways" },
  { name: "Real Estate", value: "Real Estate" },
  { name: "Recruitment / Staffing", value: "Recruitment / Staffing" },
  { name: "Retail", value: "Retail" },
  { name: "SAAS", value: "SAAS" },
  { name: "Software Product", value: "Software Product" },
  { name: "Sports / Leisure & Recreation", value: "Sports / Leisure & Recreation" },
  { name: "Stock Broking", value: "Stock broking" },
  { name: "Telecom / ISP", value: "Telecom / ISP" },
  { name: "Textile & Apparel ", value: "Textile & Apparel" },
  { name: "Travel & Tourism", value: "Travel & Tourism" },
  { name: "Taxi / Mobility", value: "Taxi / Mobility" },
  { name: "TV / Radio", value: "TV / Radio" },
  { name: "Transport / Logistics", value: "Transport / Logistics" },
  { name: "Warehousing", value: "Warehousing" },
  { name: "Water Treatment / Waste Management", value: "Water Treatment / Waste Management" },
];

/**
 * ReferAndEarnStatusOptionsLabel
 */
export const ReferAndEarnStatusOptionsLabel: Record<
  ReferAndEarnStatusType,
  { label: string; style: string }
> = {
  NOT_ACHIEVED_YET: { label: "Not Achieved Yet", style: "bg-[#E0E0E0] text-[#6B6B6B]" }, // Grey and dark grey text
  ACHIEVED: { label: "Achieved", style: "bg-[#A0FFA5] text-[#00B542]" }, // Green and dark green text
  WITHDRAWAL_REQUESTED: { label: "Withdrawal Requested", style: "bg-[#FFF3A0] text-[#FFB800]" }, // Yellow and dark yellow text
  WITHDRAWAL_ACCEPTED: { label: "Withdrawal Accepted", style: "bg-[#A0CEFF] text-[#316BFF]" }, // Blue and dark blue text
  WITHDRAWAL_REJECTED: { label: "Withdrawal Rejected", style: "bg-[#FFA0A0] text-[#FF3B3B]" }, // Red and dark red text
  PAYMENT_COMPLETED: { label: "Payment Completed", style: "bg-[#D1FFD1] text-[#008000]" }, // Light green and dark green text
};

/**
 * ReferAndEarnJobStatusOptionsArray
 *
 * @description - Array of job application status options for refer and earn feature
 */
export const ReferAndEarnJobStatusOptionsArray: Record<
  ReferAndEarnJobApplicationStatusType,
  { label: string; style: string }
> = {
  PENDING: { label: "Pending", style: "bg-[#FFF3A0] text-[#FFB800]" },
  REJECTED: { label: "Rejected", style: "bg-[#FFA0A0] text-[#FF3B3B]" },
  APPLIED: { label: "Applied", style: "bg-[#A0CEFF] text-[#316BFF]" },
  PROCESSING_INTERVIEW: { label: "Interviewing", style: "bg-[#A0FFA5] text-[#00B542]" },
  HIRED: { label: "Hired", style: "bg-[#A0FFA5] text-[#00B542]" },
  JOINED: { label: "Joined", style: " bg-[#A0FFA5] text-[#00B542]" },
};
