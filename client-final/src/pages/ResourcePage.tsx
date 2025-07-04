// FileName: MultipleFiles/ResourcePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTopicResources } from '../services/api';
import ResourceCard from '../components/Resource/ResourceCard';
import { Resource } from '../types';

const ResourcePage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | Resource['type']>('all');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        if (topicId) {
          const data = await getTopicResources(topicId);
          setResources(data);
        } else {
          setError('Topic ID is missing.');
        }
      } catch (error) {
        console.error('Failed to fetch resources', error);
        setError('Failed to load resources. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [topicId]);

  const filteredResources = selectedType === 'all'
    ? resources
    : resources.filter(res => res.type === selectedType);

  if (isLoading) return <div className="text-center py-8">Loading resources...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Resources</h1>
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by type:</label>
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="cheatsheet">Cheat Sheet</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredResources.map(resource => {
          const type = resource.type as 'video' | 'pdf' | 'cheatsheet';
          let borderClass = '';
          let icon = '';
          if (type === 'video') { borderClass = 'border-red-500 text-red-600'; icon = '🎬 '; }
          else if (type === 'pdf') { borderClass = 'border-blue-500 text-blue-600'; icon = '📄 '; }
          else if (type === 'cheatsheet') { borderClass = 'border-green-500 text-green-600'; icon = '📝 '; }
          return (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${borderClass}`}
            >
              {icon}{resource.title}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ResourcePage;
