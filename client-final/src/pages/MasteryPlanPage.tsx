import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MasteryTopicCard from '../components/Topics/MasteryTopicCard';
import { getMasteryPath, getUserDetailedProgress } from '../services/api';
import { MasteryTopic, TopicProgress } from '../types';

const MasteryPlanPage: React.FC = () => {
  const [topics, setTopics] = useState<MasteryTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressMap, setProgressMap] = useState<Record<string, TopicProgress>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMasteryPath = async () => {
      try {
        const data = await getMasteryPath();
        setTopics(data);
        // Fetch user progress for topics
        const progressArr: TopicProgress[] = await getUserDetailedProgress();
        const progressObj: Record<string, TopicProgress> = {};
        progressArr.forEach((p) => { progressObj[p.topicId] = p; });
        setProgressMap(progressObj);
      } catch (err) {
        setError('Failed to fetch mastery plan. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasteryPath();

    // Add event listener for progress updates
    const handleProgressUpdate = () => {
      fetchMasteryPath();
    };
    window.addEventListener('user-progress-updated', handleProgressUpdate);
    return () => {
      window.removeEventListener('user-progress-updated', handleProgressUpdate);
    };
  }, []);

  const handleTopicClick = (topicId: string) => {
    navigate(`/mastery/${topicId}`);
  };

  if (isLoading) return <div className="text-center py-8">Loading mastery plan...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (topics.length === 0) return <div className="text-center py-8 text-gray-500">No mastery topics available.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mastery Plan</h1>
      <p className="mb-8 text-gray-600">
        Focus on the most essential DSA concepts with curated problems and resources for quick revision.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map(topic => (
          <MasteryTopicCard
            key={topic.id}
            topic={topic}
            onClick={() => handleTopicClick(topic.id)}
            progress={progressMap[topic.id]?.progress || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default MasteryPlanPage;
