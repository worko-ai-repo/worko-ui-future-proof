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
    <div className="flex flex-col items-center justify-center w-[50px]">
      <CircularProgressbar
        value={safeValue}
        strokeWidth={12}
        text={value !== undefined ? `${safeValue}%` : 'N/A'}
        styles={buildStyles({
          textColor: color,
          pathColor: color,
            textSize: '24px',
            strokeLinecap: 'butt',
            
          })}
          />
      <button
        onClick={onClick}
        className="text-[10px] text-center text-gray-500 mt-2"
      >
        View details
      </button>
    </div>
  );
};

export default ProgressCircle;
