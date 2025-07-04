// FileName: MultipleFiles/SubtopicCard.tsx
import React, { useEffect, useState } from 'react';
import { Subtopic, Resource } from '../../types';
import { getSubtopicCompletionStatus, updateSubtopicCompletion } from '../../services/api';

interface SubtopicCardProps {
  subtopic: Subtopic;
  resources?: Resource[];
  onProgressUpdate?: () => void;
}

const SubtopicCard: React.FC<SubtopicCardProps> = ({ subtopic, resources = [], onProgressUpdate }) => {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getSubtopicCompletionStatus(subtopic.id);
        setCompleted(res.isCompleted);
      } catch (e) {
        setCompleted(false);
      }
    };
    fetchStatus();
  }, [subtopic.id]);

  const handleCheckbox = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      await updateSubtopicCompletion(subtopic.id, e.target.checked);
      setCompleted(e.target.checked);
      if (onProgressUpdate) onProgressUpdate();
    } finally {
      setLoading(false);
    }
  };

  const statusClasses = {
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800'
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-4">
      <input type="checkbox" checked={completed} onChange={handleCheckbox} disabled={loading} className="w-4 h-4" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{subtopic.name}</h3>
          {subtopic.status && (
            <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[subtopic.status]}`}>
              {subtopic.status.replace('-', ' ')}
            </span>
          )}
        </div>
        {subtopic.description && (
          <p className="text-sm text-gray-600 mt-1">
            {subtopic.description}
          </p>
        )}
        <div className="flex mt-3 space-x-4 text-sm text-gray-500">
          {subtopic.resourcesCount !== undefined && (
            <span>{subtopic.resourcesCount} resources</span>
          )}
          {subtopic.problemsCount !== undefined && (
            <span>{subtopic.problemsCount} problems</span>
          )}
        </div>
        {/* Resource links */}
        {resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {resources.map(res => {
              // Only handle known types for color/icon
              const type = res.type as 'video' | 'pdf' | 'cheatsheet';
              let borderClass = '';
              let icon = '';
              if (type === 'video') { borderClass = 'border-red-500 text-red-600'; icon = '🎬 '; }
              else if (type === 'pdf') { borderClass = 'border-blue-500 text-blue-600'; icon = '📄 '; }
              else if (type === 'cheatsheet') { borderClass = 'border-green-500 text-green-600'; icon = '📝 '; }
              return (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${borderClass}`}
                >
                  {icon}{res.title}
                </a>
              );
            })}
          </div>
        )}
        {/* Prerequisites */}
        {subtopic.prerequisites && subtopic.prerequisites.length > 0 && (
          <div className="mt-2 text-xs text-purple-700">
            Prerequisites: {subtopic.prerequisites.map((prereq, idx) => typeof prereq === 'string' ? prereq : prereq.name || prereq.id).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtopicCard;
