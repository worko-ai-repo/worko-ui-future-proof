import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type ProgressCircleProps = {
  onClick: () => void; // optional, same as () => void
  value?: number; // optional, same as number | undefined
};

const getColor = (value: number) => {
  if (value <= 20) return '#FF0000';
  if (value <= 50) return '#FFE70D';
  return '#4CBC9A';
};

const ProgressCircle: React.FC<ProgressCircleProps> = ({ 
  value,
  onClick,
 }) => {
  const safeValue = typeof value === 'number' ? value : 0;
  const color = getColor(safeValue);

  return (
    <div 
      className="flex flex-col gap-1 items-center justify-center w-[35px]"
    >
      <CircularProgressbar
        value={safeValue}
        text={value !== undefined ? `${safeValue}%` : 'N/A'}
        strokeWidth={8}
        styles={buildStyles({
          textColor: color,
          pathColor: color,
          trailColor: '#E5E7EB', // gray-200
          textSize: '24px',
          strokeLinecap: 'round',
        })}
      />
      <button
        onClick={onClick}
        className="leading-none text-[0.438rem] text-center text-gray-500"
      >
        View details
      </button>
    </div>
  );
};

export default ProgressCircle;
