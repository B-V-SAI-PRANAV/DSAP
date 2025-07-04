// FileName: MultipleFiles/TopicCard.tsx
import React from 'react';
import { Topic, Resource } from '../../types'; // Import Topic and Resource from consolidated types

interface TopicCardProps {
  topic: Topic;
  resources?: Resource[];
  onSelect: (topicId: string, isChecked: boolean) => void;
  isSelected: boolean;
  onCardClick?: () => void;
  progress?: number;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, resources = [], onSelect, isSelected, onCardClick, progress = 0 }) => {
  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow${onCardClick ? ' cursor-pointer' : ''}`}
      onClick={onCardClick}
    >
      <div className="flex items-start">
        <input
          type="checkbox"
          id={`topic-${topic.id}`}
          checked={isSelected}
          onChange={(e) => onSelect(topic.id, e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 rounded"
          onClick={e => e.stopPropagation()}
        />
        <div className="ml-3 w-full">
          <label
            htmlFor={`topic-${topic.id}`}
            className="font-medium text-gray-900 cursor-pointer"
          >
            {topic.name}
          </label>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{progress}% completed</span>
          </div>
          {topic.description && (
            <p className="text-sm text-gray-500 mt-1">
              {topic.description}
            </p>
          )}
          {resources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {resources.map(res => {
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
                    onClick={e => e.stopPropagation()}
                  >
                    {icon}{res.title}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
