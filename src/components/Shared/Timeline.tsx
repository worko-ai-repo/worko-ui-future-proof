import React from "react";

export type TimelineStep = {
  label: string;
  date: string;
  status: "success" | "warning" | "error" | "pending";
};

import { Check, AlertTriangle, X } from "lucide-react";

const getStepStyle = (status: TimelineStep["status"]) => {
  switch (status) {
    case "success":
      return { bg: "bg-emerald-500", icon: <Check size={12} /> };
    case "warning":
      return { bg: "bg-yellow-500", icon: <AlertTriangle size={12} /> };
    case "error":
      return { bg: "bg-red-500", icon: <X size={12} /> };
    default:
      return { bg: "bg-gray-300", icon: null }; // pending
  }
};

const Timeline: React.FC<{ steps: TimelineStep[] }> = ({ steps }) => {
  return (
    <div className="w-full px-6 py-4">
      <div className="flex justify-start flex-wrap gap-y-6">
        {steps.map((step, index) => {
          const { bg, icon } = getStepStyle(step.status);

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col  items-start ">
                <div className="flex items-center gap-2">
                  <div
                    className={`${bg} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`}>
                    {icon ? icon : index + 1}
                  </div>
                  <span className="text-xs  relative text-left">
                    {step.label}
                    <div className="absolute top-4 text-[8px] text-gray-500">{new Date(step.date).toLocaleDateString()}</div>
                  </span>
                </div>
              </div>

              {/* Line connector */}
              {index < steps.length - 1 && (
                <div className="flex items-center">
                  <div className="h-0.5 bg-emerald-400 rounded-full" style={{ width: "80px" }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;