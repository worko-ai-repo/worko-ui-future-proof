import { Star } from "lucide-react";
import React, { createContext, ReactNode, useState, useContext, useEffect, useMemo } from "react";
import profileService, {
  CognitoUserDetails,
} from "@Components/Dashboard/Candidate/Service/ProfileService";
import { useLocation } from "react-router-dom";
import { TabId } from "src/types/sidebar";
import navigationItems from "@Components/Dashboard/navigation";
// import { set } from "lodash";
import { getToastOptions } from "@Utils/Toast.utils";
import { toast } from "react-toastify";

// Define dashboard types
export type DashboardType = "CORPORATE" | "EMPLOYEE" | "CANDIDATE" | "ADMIN" | "AGENCY";

interface DashboardContextType {
  // Core dashboard properties
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dashboardType: DashboardType;
  breadcrumb: ReactNode;
  user: CognitoUserDetails | null;
  isLoadingUser: boolean;
  refreshUser: () => void;
  isBulkScreenDone: boolean;
  setBulkScreenDone: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({
  children,
}: {
  children: ReactNode;
  initialDashboardType?: DashboardType;
}) => {
  const location = useLocation();
  let urlSplittedPath = location.pathname.split("/");
  // Dashboard type and active tab state
  const [dashboardType, setDashboardType] = useState<DashboardType>(
    getDashboardTypeFromUrl().Dashboard
  );
  const [activeTab, setActiveTab] = useState<string>(getDashboardTypeFromUrl().ActiveTab);
  const [isBulkScreenDone, setBulkScreenDone] = useState<boolean>(false);
  // User state with loading indicator
  const [user, setUser] = useState<CognitoUserDetails | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // Parse dashboard type from URL
  function getDashboardTypeFromUrl(): {
    Dashboard: DashboardType;
    ActiveTab: string;
  } {
    const urlType = urlSplittedPath[1].toUpperCase() as DashboardType;
    const activeTab = urlSplittedPath[2]?.toUpperCase() as TabId;
    const navItems = navigationItems.filter(
      (item) => !item.dashboardTypes || item.dashboardTypes.includes(urlType)
    );
    let finalActiveTab;
    if (activeTab) {
      const matchedItem = navItems.find(
        (item) => item.id.toLowerCase() === activeTab.toLowerCase()
      );
      if (matchedItem && matchedItem.label !== activeTab) {
        finalActiveTab = matchedItem.label;
      }
    }
    return {
      Dashboard: urlType,
      ActiveTab: finalActiveTab!,
    };
  }

  useEffect(() => {
    if (isBulkScreenDone === true)
      toast.success("Your bulk CV screening is complete!", getToastOptions());
  }, [isBulkScreenDone]);

  // Function to refresh user data
  const refreshUser = () => {
    setIsLoadingUser(true);
    const userDetails = profileService.getCurrentUser();
    setUser(userDetails);
    setIsLoadingUser(false);
  };

  useEffect(() => {}, [activeTab]);
  // Load user from secure storage on initial mount
  useEffect(() => {
    refreshUser();
  }, []);

  // Update dashboard type and tab when URL changes
  useEffect(() => {
    const { Dashboard, ActiveTab } = getDashboardTypeFromUrl();
    setDashboardType(Dashboard);
    setActiveTab(ActiveTab);
  }, [location.pathname]);

  // Dynamic breadcrumb based on active tab
  const breadcrumb = useMemo(
    () => (
      <div className="flex items-center text-sm text-gray-500 space-x-2 truncate">
        {/* <Star className="text-[#316bff] w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> */}
        <span>Dashboards</span>
        <span>/</span>
        <span className="capitalize">{dashboardType.toLowerCase()}</span>
        <span>/</span>
        <span className="font-medium text-black capitalize">{activeTab}</span>
      </div>
    ),
    [activeTab, dashboardType]
  );

  const contextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      dashboardType,
      breadcrumb,
      user,
      isLoadingUser,
      refreshUser,
      isBulkScreenDone,
      setBulkScreenDone,
    }),
    [activeTab, dashboardType, breadcrumb, user, isLoadingUser, isBulkScreenDone, setBulkScreenDone]
  );

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};
