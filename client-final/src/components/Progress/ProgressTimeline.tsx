// FileName: MultipleFiles/ProgressTimeline.tsx
import React from 'react';

interface ProgressTimelineProps {
  progress: Array<{ date: string; status: string }>;
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ progress }) => {
  return (
    <div className="space-y-4">
      {progress.map((entry, index) => (
        <div key={index} className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
            {index + 1}
          </div>
          <div className="ml-4">
            <p className="font-semibold">{entry.date}</p>
            <p className="text-gray-600">{entry.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressTimeline;
