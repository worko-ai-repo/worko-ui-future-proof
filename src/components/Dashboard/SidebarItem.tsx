import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { NavItem, TabId } from "src/types/sidebar";

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  activeTab?: string;
  collapsed: boolean;
  onClick: (NavItem: NavItem) => void;
  expandable?: boolean;
  child?: { label: string; id: TabId }[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, activeTab, collapsed, onClick,expandable=false,child }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
  onClick(item);
  // if(expandable) setOpen((v)=>!v)
  // return
  // just uncomment above and comment below if thats not the bevaiour we want and also remove handleClickArrow function
  if (expandable && !open) setOpen(true); // only open
};

const handleClickArrow = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (expandable) setOpen((v) => !v); // open and close both
};

  return (
<div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 p-2 transition-all duration-200 rounded-lg
          ${isActive ? "bg-white text-[#316bff] shadow-sm" : "hover:bg-blue-600"}
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className={`p-1 rounded-lg ${isActive ? "bg-gray-100 text-[#316bff]" : "bg-blue-600 text-white"}`}>
            <span className="w-4 h-4 flex items-center justify-center">
              {typeof item.icon === "function" ? <item.icon /> : item.icon}
            </span>
          </span>
          {!collapsed && <span className="text-[11px] font-medium whitespace-nowrap">{item.label}</span>}
        </div>
        {!collapsed && (
          <span onClick={handleClickArrow}
          className={`${isActive ? "bg-gray-100 rounded-md p-1" : ""}`}>
            <ChevronRight
              className={`w-4 h-4 transform transition-transform duration-200 ${
                open ? "rotate-90" : ""
              } ${isActive ? "text-gray-400" : "text-blue-300"}`}
            />
          </span>
        )}
      </button>

      {expandable && open && !collapsed && (
        <div className="ml-6 mt-1 space-y-1">
          {(child ?? []).map((c, i) => {
            const isChildActive = c.label === activeTab;
            return (
              <button
                key={i}
                onClick={() => onClick({ ...item, id: c.id, label: c.label })}
                className={`
                  w-full flex items-center justify-between gap-2 p-2 rounded-lg text-xs transition-all duration-200
                  ${isChildActive ? "bg-white text-[#316bff] shadow-sm" : "hover:bg-blue-600 text-gray-300 hover:text-white"}
                `}
              >
                <span>{c.label}</span>
                <ChevronRight
                  className={`w-3 h-3 ${isChildActive ? "text-gray-400" : "text-blue-300"}`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
