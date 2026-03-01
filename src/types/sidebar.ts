import { ComponentType, SVGProps } from "react";

export type DashboardType = 'CORPORATE' | 'EMPLOYEE' | 'CANDIDATE' | 'ADMIN' | 'AGENCY';

export type TabId =
//Candidate Dashboard Tabs
| 'switch-dashboard'
| 'profile'
| 'jobs'
| 'referral'
| 'guidance'
| 'refer-and-earn'
| 'subscription'
| 'support'
//Employee Dashboard Tabs
| 'switch-dashboard'
| 'profile'
| 'referral'
| 'guidance'
| 'refer-and-earn'
| 'support'
// Corporate Dashboard Tabs
| 'home'
| 'invites'
| 'cApplicants'
| 'Aapplicants'
| 'interviews'
| 'hire'
| 'bulk-cv-check'
| 'referrals'
| 'invoice-&-payment'
// Admin Dashboard Tabs
| 'ajobs'
| 'aApplicants'
| 'aAllApplicants'
| 'aEmployee'
| 'aCandidate'
| 'aReferrals'
| 'aAgency/allCandidates'
| 'aAgency/agencyList'
| 'aDatabase'
| 'aSearchDB'
| 'aGuidance'
| 'aBulkCVCheck'
| 'aInvites'
| 'aPayments'
| 'aCompanies'
| 'Refer-n-Earn'
| 'aPackages'
// Agency dashboard tabs
| 'agInvites'
| 'agJobs'
| 'agApplicants'
| 'agBulkCVCheck'
| 'agCredits';
export interface NavItem {
    id: TabId;
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>> | React.ReactNode; //<i class="fa-solid fa-left-right"></i>
    dashboardTypes?: DashboardType[];
    expandable?: boolean;
    child?: { 
        id: TabId;
        label: string; 
        icon?: ComponentType<SVGProps<SVGSVGElement>> | React.ReactNode;
        dashboardTypes?: DashboardType[];
        expandable?: boolean;
    }[];
}

export interface UserDetails {
    name?: string;
    avatar?: string;
}