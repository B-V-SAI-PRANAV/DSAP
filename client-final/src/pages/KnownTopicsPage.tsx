import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/Topics/TopicCard';
import { getAllTopics, getTopicResources, getUserDetailedProgress, markInitialSetupComplete, getKnownTopics, setKnownTopics } from '../services/api';
import { Topic, TopicProgress } from '../types';

const KnownTopicsPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [topicResources, setTopicResources] = useState<Record<string, any[]>>({});
  const [progressMap, setProgressMap] = useState<Record<string, TopicProgress>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkKnownTopics = async () => {
      try {
        const known = await getKnownTopics();
        if (known && known.length > 0) {
          // Redirect to learning path with known topics
          navigate(`/learning-path?topics=${known.join(',')}`);
          return;
        }
      } catch (e) {
        // Ignore error, proceed to selection
      }
    };
    checkKnownTopics();
  }, [navigate]);

  useEffect(() => {
    const fetchTopicsAndResources = async () => {
      try {
        const data = await getAllTopics();
        setTopics(data);
        // Fetch resources for each topic in parallel
        const resourcesMap: Record<string, any[]> = {};
        await Promise.all(
          data.map(async (topic: Topic) => {
            try {
              const resources = await getTopicResources(topic.id, 'pdf');
              resourcesMap[topic.id] = resources;
            } catch {
              resourcesMap[topic.id] = [];
            }
          })
        );
        setTopicResources(resourcesMap);
        // Fetch user progress for topics
        const progressArr: TopicProgress[] = await getUserDetailedProgress();
        const progressObj: Record<string, TopicProgress> = {};
        progressArr.forEach((p) => { progressObj[p.topicId] = p; });
        setProgressMap(progressObj);
      } catch (err) {
        setError('Failed to fetch topics. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopicsAndResources();
  }, []);

  const handleTopicSelect = (topicId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTopics([...selectedTopics, topicId]);
    } else {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    }
    setError('');
  };

  const handleProceed = async () => {
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic.');
      return;
    }
    try {
      // Save known topics
      await setKnownTopics(selectedTopics);
      // Mark initial setup as complete
      await markInitialSetupComplete();
      // Navigate to the learning path page with selected topics as query param
      navigate(`/learning-path?topics=${selectedTopics.join(',')}`);
    } catch (error) {
      console.error('Failed to save known topics or mark initial setup complete:', error);
      // Still navigate even if marking complete fails
      navigate(`/learning-path?topics=${selectedTopics.join(',')}`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading topics...</div>;
  }

  if (error && topics.length === 0) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Select Your Known Topics</h1>
      <p className="mb-8 text-gray-600">
        We'll suggest a personalized learning path based on your current knowledge. Select all the topics you're comfortable with.
      </p>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            resources={topicResources[topic.id] || []}
            onSelect={handleTopicSelect}
            isSelected={selectedTopics.includes(topic.id)}
            onCardClick={() => navigate(`/topic/${topic.id}`)}
            progress={progressMap[topic.id]?.progress || 0}
          />
        ))}
      </div>

      <button
        onClick={handleProceed}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedTopics.length === 0}
      >
        Generate Learning Path
      </button>
    </div>
  );
};

export default KnownTopicsPage;
