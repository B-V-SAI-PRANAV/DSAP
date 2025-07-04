import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLearningPath, getAdaptiveLearningPath, getTopicProblemProgress, getResourceCompletionStatus, getTopicDetails } from '../services/api';

import ProgressBar from '../components/Navigation/ProgressBar';
import { LearningPathNode } from '../types';

const LearningPathPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [path, setPath] = useState<LearningPathNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [topicProgresses, setTopicProgresses] = useState<{ [topicId: string]: number }>({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const topics = queryParams.get('topics')?.split(',') || [];

    const fetchPath = async () => {
      setIsLoading(true);
      try {
        // Always try to get adaptive learning path first (which includes user progress)
        let data: LearningPathNode[];
        try {
          data = await getAdaptiveLearningPath(topics);
        } catch (adaptiveError) {
          // Fallback to regular learning path
          data = await getLearningPath(topics);
        }
        
        setPath(data);
        const completedCount = data.filter(item => item.status === 'completed').length;
        const newOverallProgress = data.length > 0
          ? (completedCount / data.length) * 100
          : 0;
        setOverallProgress(newOverallProgress);
      } catch (err: any) {
        console.error('Detailed error:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        setError(`Failed to generate learning path: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPath();
  }, [location.search, refreshKey]);

  useEffect(() => {
    const fetchAllTopicProgresses = async () => {
      if (!path || path.length === 0) return;
      const progresses: { [topicId: string]: number } = {};
      for (const item of path) {
        if (item.type === 'topic') {
          try {
            const topicDetails = await getTopicDetails(item.id);
            const totalProblems = topicDetails.questions?.length || 0;
            const totalResources = topicDetails.resources?.length || 0;
            let quizPart = 0, problemPart = 0, resourcePart = 0;
            let weights = [0, 0, 0];
            if (topicDetails.topic.lastQuizScore !== undefined) {
              quizPart = topicDetails.topic.lastQuizScore / 100;
              weights[0] = 1;
            }
            if (totalProblems > 0) {
              const progress = await getTopicProblemProgress(item.id);
              problemPart = progress.completedProblems.length / totalProblems;
              weights[1] = 1;
            }
            if (totalResources > 0) {
              const results = await Promise.all((topicDetails.resources || []).map(r => getResourceCompletionStatus(r.id)));
              resourcePart = results.filter(r => r.isCompleted).length / totalResources;
              weights[2] = 1;
            }
            const totalWeight = weights[0] + weights[1] + weights[2];
            let progress = 0;
            if (totalWeight > 0) {
              progress = (quizPart * (weights[0] ? 0.33 : 0) + problemPart * (weights[1] ? 0.33 : 0) + resourcePart * (weights[2] ? 0.34 : 0)) / (totalWeight === 3 ? 1 : totalWeight / 3);
            }
            progresses[item.id] = Math.min(100, Math.round(progress * 100));
          } catch {}
        }
      }
      setTopicProgresses(progresses);
    };
    fetchAllTopicProgresses();
    const handler = () => fetchAllTopicProgresses();
    window.addEventListener('user-progress-updated', handler);
    return () => window.removeEventListener('user-progress-updated', handler);
  }, [path]);

  const refreshPath = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleItemClick = (item: LearningPathNode) => {
    if (item.status === 'locked') return;
    navigate(`/topic/${item.id}`);
  };

  if (isLoading) {
    return <div className="text-center py-8">Generating your personalized learning path...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (path.length === 0) {
    return <div className="text-center py-8 text-gray-500">No learning path generated. Please select topics.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Learning Path</h1>
        <button
          onClick={refreshPath}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Progress'}
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Overall Progress</h2>
        <ProgressBar progress={overallProgress} showPercentage={true} />
      </div>

      <div className="space-y-4">
        {path.map(item => (
          <div key={item.id} className="border rounded p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleItemClick(item)}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-sm text-gray-600">Type: {item.type}</div>
                {item.difficultyScore !== undefined && (
                  <div className="text-xs text-gray-500">Difficulty: {item.difficultyScore}</div>
                )}
                {item.estimatedTimeMins !== undefined && (
                  <div className="text-xs text-gray-500">Est. Time: {item.estimatedTimeMins} mins</div>
                )}
                {item.prerequisites && item.prerequisites.length > 0 && (
                  <div className="text-xs text-gray-500">Prerequisites: {item.prerequisites.join(', ')}</div>
                )}
                {item.nextTopics && item.nextTopics.length > 0 && (
                  <div className="text-xs text-gray-500">Next: {item.nextTopics.join(', ')}</div>
                )}
                {item.type === 'topic' && (
                  <div className="mt-2">
                    <ProgressBar progress={topicProgresses[item.id] || 0} showPercentage={true} />
                  </div>
                )}
              </div>
              <div className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'completed' ? 'bg-green-200 text-green-800' : item.status === 'locked' ? 'bg-gray-200 text-gray-600' : 'bg-blue-200 text-blue-800'}`}>{item.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathPage;
