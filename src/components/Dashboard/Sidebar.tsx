import React, { useEffect, useState } from "react";
import { XMarkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { User } from "@Assets";
import { CorporateUserDetail, useAppContext } from "@Context/App.context";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, User2 } from "lucide-react";

import navigationItems from "./navigation";
import SidebarItem from "./SidebarItem";
import { DashboardType, NavItem, TabId } from "src/types/sidebar";
import { useDashboardContext } from "@Context/Dashboard.context";
import secureStorage from "@Utils/SecureStorage.utils";
import { SecureStorageKeyEnum } from "@Enums/SecureStorage.enum";
import { LogOut } from "lucide-react";
import CognitoServiceObj from "@Utils/Cognito.utils";
import { NormalizedUser } from "@Utils/NormalizeUser";
import { UserRole } from "@Interfaces/RoleBasedAccessControl";
import { RBAC } from "@Utils/RoleBaseAccessControll.utils";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (open: boolean) => void;
}

/**
 * Sidebar Component
 *
 * A responsive sidebar navigation component that supports:
 * - Collapsible/expandable states
 * - Mobile responsive behavior
 * - User profile display with avatar
 * - Dynamic navigation based on dashboard type
 * - Context-aware navigation filtering
 */

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed,
}) => {
  // Extract user context and dashboard context
  const navigate = useNavigate();
  const location = useLocation();
  const [imgError, setImgError] = useState(false);
  const { activeTab, setActiveTab, dashboardType } = useDashboardContext();
  const {
    userDetails,
    setUpdateCheck,
  }: { userDetails: NormalizedUser | null; setUpdateCheck: any } = useAppContext();

  // Local state to manage finalized user details
  const [userName, setUserName] = React.useState("");
  const [finalUserDetails, setFinalUserDetails] = React.useState<NormalizedUser | null>(
    userDetails
  );

  /**
   * Effect to handle user details updates
   * - Updates local state when userDetails changes
   * - Triggers update check when userDetails is null/undefined
   */
  useEffect(() => {
    if (userDetails) {
      setFinalUserDetails(userDetails);
    } else {
      // Trigger parent component to refresh user data
      setUpdateCheck((prev: any) => !prev);
    }
  }, [userDetails, setUpdateCheck]);

  /**
   * Filter navigation items based on current dashboard type
   * Only shows items that are either global or match current dashboard type
   */
  
    const normalizedDashboardType = "AGENCY"; 
    const navItems = navigationItems.filter((item) => {
    // keep items that are global (no dashboardTypes) OR explicitly include AGENCY
    if (!item.dashboardTypes || item.dashboardTypes.length === 0) return true;
    return item.dashboardTypes.map(dt => String(dt).toUpperCase()).includes(normalizedDashboardType);
    });

  /**
   * Check AdminAccess
   *
   * if Nav Item contain switch-dashboard then check if RBAC.can("play-admin") is true then show the item otherwise filter it out
   */

  /**
   * Handle navigation to different dashboard sections
   * @param dashboardType - The type of dashboard to navigate to
   * @param tabId - The specific tab/section within the dashboard
   */
  const onNavigate = (dashboardType: DashboardType, tabId: TabId) => {
    const path = `/${dashboardType.toLowerCase()}/${tabId}`;
    navigate(path);
  };

  /**
   * Handle tab click events
   * - Updates active tab state
   * - Navigates to selected tab
   * - Closes sidebar on mobile after navigation
   */
  const handleTabClick = (NavItem: NavItem) => {
    if (NavItem.id === "switch-dashboard") {
      //Check the current page from the URL

      const currentPath = location.pathname;
      //If the current path is admin, switch to corporate dashboard
      if (currentPath.includes("admin")) {
        onNavigate("CANDIDATE", "jobs");
        return;
      } else if (currentPath.includes("candidate") || currentPath.includes("employee")) {
        //If the current path is corporate, switch to admin dashboard
        onNavigate("ADMIN", "ajobs");
        return;
      }
    } else {
      // console.log("Navigating to tab:", NavItem.label);
      setActiveTab(NavItem.label);
      onNavigate(dashboardType, NavItem.id);
      setSidebarOpen(false); // Close sidebar on mobile after navigation
    }
  };


  /**
   * Effect to set appropriate user name based on user type
   * - Corporate users: firstName + lastName
   * - Other users: name field
   */
  useEffect(() => {
    const fullNameStr = finalUserDetails?.fullName;
    const fullName = fullNameStr ? fullNameStr.split(" ") : [];
    setUserName(fullName.length > 0 ? fullName[0] : "User");
  }, [finalUserDetails]);

  const finalLogoUrl = `${import.meta.env.APP_PROXY_AGENCY_BASE}/images/${
    finalUserDetails?.profileImageAwsS3SignedUrl
  }`;

  /**
   * Avatar component - reusable user profile image/icon
   */
  const Avatar =
    finalLogoUrl && !imgError ? (
      <img
        data-tooltip-id="my-tooltip"
        data-tooltip-content={userName}
        src={finalUserDetails?.profileImageAwsS3SignedUrl}
        alt={userName}
        loading="lazy"
        className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 object-cover border"
        onError={() => setImgError(true)} // This only affects the current component
      />
    ) : (
      <User2 className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border" />
    );

  return (
    <aside
      className={`bg-[#316bff] text-white  h-screen  z-40 transition-all duration-300 ease-in-out p-4 rounded-r-3xl
                ${collapsed ? "w-[72px]" : "w-[212px]"}
                md:relative md:block
                max-md:fixed max-md:left-0 max-md:top-0 max-md:w-[320px] 
                ${sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}`}>
      <div className="h-full   flex flex-col justify-between  ">
        <div className="flex  justify-between items-center mb-6 ">
          {!collapsed ? (
            <div className="flex  items-center  w-full">
              <div className="flex items-center gap-2 w-full overflow-hidden">
                {Avatar}
                <span className="text-sm font-bold capitalize truncate w-full text-start">
                  {userName}
                </span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="hidden sm:flex focus:outline-none"
                aria-label="Collapse sidebar">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="block sm:hidden focus:outline-none"
                aria-label="Close sidebar">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="w-full h-10 flex justify-center ">{Avatar}</div>
          )}
        </div>
        <div className=" h-full min-w-10 flex flex-col justify-start items-start overflow-scroll no-scrl-web">
           {/* Expand Button */}
           {collapsed && (
            <div className="my-4 mx-auto border p-0.5 rounded-lg flex justify-center">
              <button
                onClick={() => setCollapsed(false)}
                className="text-white focus:outline-none"
                aria-label="Expand sidebar">
                <ChevronLeftIcon className="w-5 h-5 rotate-180" />
              </button>
            </div>
          )}
          <nav className="space-y-2  w-full overflow-scroll no-scrl-web">
            {navItems.map((item) => (
              <SidebarItem
              key={item.id}
              item={item}
              isActive={item.label === activeTab}
              activeTab={activeTab}
              collapsed={collapsed}
              onClick={handleTabClick}
              expandable={item.expandable}
              child={item.child}
            />
            ))}
          </nav>
         
        </div>
        {/* Logout Buttons */}

        <div className="border-t  border-white/20 pt-4 hover:text-red-600">
          <button
            onClick={() => {
              CognitoServiceObj.handleSignOut();
              secureStorage.clear();
              setUpdateCheck((prev: boolean) => !prev);
              // navigate("/auth/login");
              window.location.href = "/auth/agency/login";
            }}
            className="hover:text-red-500 text-[13px] text-white flex items-center justify-between focus:outline-none w-full text-left hover:bg-white/10 p-1 rounded"
            aria-label="Logout">
            {!collapsed && <p>Logout</p>}
            <LogOut className="cursor-pointer self-center text-[13px]" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
