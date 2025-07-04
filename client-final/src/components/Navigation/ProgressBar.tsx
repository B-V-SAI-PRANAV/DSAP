import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  bgColor?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  color = 'bg-blue-600',
  bgColor = 'bg-gray-200',
  showPercentage = true,
}) => {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div className={`flex items-center ${showPercentage ? 'gap-2' : ''}`}>
        <div className={`flex-grow ${bgColor} rounded-full`} style={{ height: `${height}px` }}>
          <div 
            className={`h-full ${color} rounded-full transition-all duration-300`} 
            style={{ width: `${safeProgress}%` }}
          ></div>
        </div>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700 min-w-[40px]">
            {Math.round(safeProgress)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
