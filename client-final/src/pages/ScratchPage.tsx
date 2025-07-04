import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PathCard from '../components/Cards/PathCard';
import { getFullLearningPath } from '../services/api';
import { PathItem } from '../types';

const ScratchPage: React.FC = () => {
  const [path, setPath] = useState<PathItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFullPath = async () => {
      try {
        const data = await getFullLearningPath();
        setPath(
          data.map((item: any, index: number) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            status: index === 0 ? 'available' : 'locked',
          }))
        );
      } catch (err) {
        setError('Failed to fetch complete learning path. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullPath();
  }, []);

  const handleItemClick = (itemId: string, itemType: 'topic' | 'subtopic') => {
    navigate(`/topic/${itemId}`);
  };

  if (isLoading) return <div className="text-center py-8">Loading complete learning path...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (path.length === 0) return <div className="text-center py-8 text-gray-500">No learning path available.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Start from Scratch</h1>
      <p className="mb-8 text-gray-600">
        Begin your DSA journey with our comprehensive learning path covering all fundamental concepts.
      </p>

      <div className="space-y-4">
        {path.map((item, index) => (
          <PathCard
            key={item.id}
            title={`${index + 1}. ${item.name}`}
            description={item.description}
            status={item.status}
            type={item.type}
            onClick={() => item.status === 'available' && handleItemClick(item.id, item.type)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScratchPage;
