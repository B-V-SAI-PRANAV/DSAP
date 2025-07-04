// FileName: MultipleFiles/ResourceCard.tsx
import React, { useEffect, useState } from 'react';
import { Resource } from '../../types'; // Import Resource from consolidated types
import { getResourceCompletionStatus, updateResourceCompletion, notifyUserProgressUpdated } from '../../services/api';

// Re-using the Resource interface from types/index.ts
interface ResourceCardProps extends Resource {
  onProgressUpdate?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ id, title, type, url, description, meta, onProgressUpdate }) => {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getResourceCompletionStatus(id);
        setCompleted(res.isCompleted);
      } catch (e) {
        setCompleted(false);
      }
    };
    fetchStatus();
  }, [id]);

  const handleCheckbox = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      await updateResourceCompletion(id, e.target.checked);
      // Re-fetch status to ensure UI matches backend
      const res = await getResourceCompletionStatus(id);
      setCompleted(res.isCompleted);
      notifyUserProgressUpdated();
      if (onProgressUpdate) onProgressUpdate();
    } finally {
      setLoading(false);
    }
  };

  // Optional: Add an icon based on type
  const typeIcon = {
    video: '▶️',
    article: '📄',
    cheatsheet: '📝',
    book: '📚',
    document: '📁',
  }[type];

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-4">
      <input type="checkbox" key={id + '-' + completed} checked={completed} onChange={handleCheckbox} disabled={loading} className="w-4 h-4" />
      {loading && <span className="ml-2 animate-spin">⏳</span>}
      <div className="flex-1">
        <div className="flex items-center mb-2">
          {typeIcon && <span className="mr-2 text-xl">{typeIcon}</span>}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
        {meta && <p className="text-sm text-gray-500 mt-1">{meta}</p>}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 block text-sm">
          View Resource
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;
