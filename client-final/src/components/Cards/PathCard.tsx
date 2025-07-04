import React from 'react';

interface PathCardProps {
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  type: 'topic' | 'subtopic';
  onClick: () => void;
}

const PathCard: React.FC<PathCardProps> = ({ 
  title, 
  description, 
  status,
  type,
  onClick 
}) => {
  const enableClick = status !== 'locked';
  
  const statusColors = {
    locked: 'bg-gray-100 border-gray-200',
    available: 'bg-white border-blue-300 hover:border-blue-500',
    completed: 'bg-green-50 border-green-300'
  };

  const typeIcons = {
    topic: '📚',
    subtopic: '📝'
  };

  return (
    <div
      className={`p-5 rounded-lg border-2 ${statusColors[status]} transition-colors cursor-pointer ${enableClick ? 'hover:shadow-md' : ''}`}
      onClick={enableClick ? onClick : undefined}
    >
      <div className="flex items-start mb-3">
        <span className="text-2xl mr-3">{typeIcons[type]}</span>
        <div>
          <h3 className={`font-semibold text-lg ${!enableClick ? 'text-gray-500' : ''}`}>
            {title}
          </h3>
          {status === 'completed' && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-1">
              Completed
            </span>
          )}
        </div>
      </div>
      <p className={`text-sm ${!enableClick ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
      {status === 'locked' && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center">
            Complete prerequisite topics to unlock
          </p>
        </div>
      )}
    </div>
  );
};

export default PathCard;
