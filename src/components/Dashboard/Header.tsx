import { logo_text } from '@Assets';
import { useDashboardContext } from '@Context/Dashboard.context';
import { Bell, Menu } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export type SignupMode = "EMP" | "CAND";
interface ToggleOptionsDto {
  label: string;
  value: SignupMode;
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}


const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { breadcrumb,dashboardType } = useDashboardContext();

  const getDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  };

const getInitialFrame = () => {
  const path = window.location.pathname;
  if (path.includes('/employee')) return "EMP";
  if (path.includes('/candidate')) return "CAND";
  return "CAND";  
};
;

  const [activeFrame, setActiveFrame] = useState<SignupMode>(getInitialFrame());
  const options: ToggleOptionsDto[] = [
  { label: "Candidate", value: "CAND" },
  { label: "Employee", value: "EMP" },
];

  return (
    <header className="px-4 w-full sm:px-8 py-4 relative">
     
      <div className="absolute bottom-0 left-0 w-full border-b border-gray-200" />
      
      <div className="flex flex-col sm:flex-row flex-wrap w-full items-center z-10 gap-4 sm:gap-0">
        <div className="w-full sm:w-1/3 flex justify-between sm:justify-start">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-grow">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <img src={logo_text} onClick={()=>window.location.href = "/agency/agJobs"} className="cursor-pointer w-20 h-auto sm:w-20 sm:h-auto flex-shrink-0" alt="Logo" />
              
              <div className="flex items-center gap-3 sm:hidden">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1 focus:outline-none"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-6 h-6 text-gray-800" />
                </button>
                <button 
                  className="bg-white p-2 shadow-md rounded-lg focus:outline-none"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>

            <div className="hidden sm:block">{breadcrumb}</div>
            
            {breadcrumb && <div className="sm:hidden">{breadcrumb}</div>}
            <span className="text-blue-600 text-left font-semibold sm:hidden text-sm">
              {getDate()}
            </span>
          </div>
        </div>
        <div className="w-full sm:w-1/3 flex justify-center">
          <div className="w-full sm:w-auto">
            {/* {dashboardType === "CANDIDATE" || dashboardType === "EMPLOYEE"
            ? <CustomButtonWithButton options={options} activeFrame={activeFrame}
              setActiveFrame={(mode: SignupMode) => setActiveFrame(mode)}
            /> 
            : null} */}
          </div>
        </div>
        <div className="w-full sm:w-1/3 flex justify-end">
          <div className="hidden sm:flex items-center gap-4 text-blue-600">
            <span className="whitespace-nowrap text-sm font-semibold">
              {getDate()}
            </span>
            <button 
              className="bg-white p-2 shadow-md rounded-lg focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;