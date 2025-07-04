// FileName: MultipleFiles/ProgressPage.tsx
import React, { useState, useEffect } from 'react';
import ProgressTimeline from '../components/Progress/ProgressTimeline';
import TopicProgressChart from '../components/Progress/TopicProgressChart';
import { getAllTopics, getTopicProblemProgress, getTopicDetails, getResourceCompletionStatus } from '../services/api';
import { TopicProgress } from '../types'; // Import TopicProgress from consolidated types

const ProgressPage: React.FC = () => {
  const [progressData, setProgressData] = useState<TopicProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const allTopics = await getAllTopics();
        const progressData = await Promise.all(
          allTopics.map(async (topic) => {
            let progress = 0;
            let completedProblems = 0;
            let totalProblems = 0;
            let completedResources = 0;
            let totalResources = 0;
            let lastAccessed = '';
            try {
              const probProg = await getTopicProblemProgress(topic.id);
              completedProblems = probProg.completedProblems.length;
              totalProblems = probProg.totalProblems;
              progress += totalProblems > 0 ? (completedProblems / totalProblems) * 0.5 : 0;
              if (completedProblems > 0) lastAccessed = new Date().toISOString();
            } catch {}
            let resources = [];
            try {
              const topicDetails = await getTopicDetails(topic.id);
              resources = topicDetails.resources || [];
              totalResources = resources.length;
              if (totalResources > 0) {
                const results = await Promise.all(resources.map(r => getResourceCompletionStatus(r.id)));
                completedResources = results.filter(r => r.isCompleted).length;
                progress += (completedResources / totalResources) * 0.5;
                if (completedResources > 0) lastAccessed = new Date().toISOString();
              }
            } catch {}
            progress = Math.round(progress * 100);
            return {
              topicId: topic.id,
              name: topic.name,
              progress,
              lastAccessed,
              subtopics: [],
              completedProblems,
              totalProblems,
              completedResources,
              totalResources
            };
          })
        );
        // Only show topics where user has made progress
        setProgressData(progressData.filter(p => p.completedProblems > 0 || p.completedResources > 0));
      } catch (err) {
        setError('Failed to fetch progress data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgressData();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading your progress...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (progressData.length === 0) return <div className="text-center py-8 text-gray-500">No progress data available. Start learning!</div>;

  // Transform progressData for ProgressTimeline
  const timelineEntries = progressData.map(topic => ({
    date: new Date(topic.lastAccessed).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    status: `${topic.name}: ${topic.progress}% completed`
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Learning Progress</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          {timelineEntries.length > 0 ? (
            <ProgressTimeline progress={timelineEntries} />
          ) : (
            <p className="text-gray-500">No recent activity to display.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Topic Completion</h2>
          {progressData.length > 0 ? (
            <TopicProgressChart topics={progressData} />
          ) : (
            <p className="text-gray-500">No topic data to display in chart.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Topic-wise Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Topic</th>
                <th className="py-2 px-4 border-b text-left">Progress</th>
                <th className="py-2 px-4 border-b text-left">Subtopics</th>
                <th className="py-2 px-4 border-b text-left">Last Accessed</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map(topic => (
                <tr key={topic.topicId} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{topic.name}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${topic.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{topic.progress}%</span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    {topic.subtopics.length > 0 ? (
                      topic.subtopics.map((subtopic, i) => (
                        <span
                          key={i}
                          className={`inline-block px-2 py-1 mr-1 mb-1 text-xs rounded-full ${
                            subtopic.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {subtopic.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(topic.lastAccessed).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
