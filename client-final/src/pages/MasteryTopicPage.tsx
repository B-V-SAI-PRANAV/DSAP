import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProblemList from '../components/Problem/ProblemList';
import ResourceCard from '../components/Resource/ResourceCard';
import { getMasteryTopicDetails, getTopicProblemProgress, getResourceCompletionStatus, updateUserProgress } from '../services/api';
import { MasteryTopicDetail } from '../types';
import ProgressBar from '../components/Navigation/ProgressBar';

const MasteryTopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<MasteryTopicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'problems' | 'cheatsheets'>('problems');
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [completedResources, setCompletedResources] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Helper to get the real topic ID (strip 'mastery_' prefix if present)
  const getRealTopicId = (id: string | undefined) => id ? id.replace(/^mastery_/, '') : '';

  // Helper to fetch completions for the current topic
  const fetchCompletions = useCallback(async (topicObj: MasteryTopicDetail | null) => {
    const realTopicId = getRealTopicId(topicId);
    if (realTopicId && topicObj) {
      // Problems
      try {
        const progress = await getTopicProblemProgress(realTopicId);
        setCompletedProblems(progress.completedProblems);
      } catch {}
      // Resources
      if (topicObj.cheatSheets) {
        try {
          const results = await Promise.all(topicObj.cheatSheets.map(r => getResourceCompletionStatus(r.id)));
          setCompletedResources(results.filter(r => r.isCompleted).map(r => r.resourceId));
        } catch {}
      }
      // Quiz (if available)
      if (topicObj.lastQuizScore !== undefined) {
        setQuizScore(topicObj.lastQuizScore);
      }
    }
  }, [topicId]);

  // Function to handle progress updates
  const handleProgressUpdate = useCallback(async () => {
    const realTopicId = getRealTopicId(topicId);
    if (realTopicId) {
      // Always re-fetch the latest topic details
      let newTopic: MasteryTopicDetail | null = null;
      try {
        newTopic = await getMasteryTopicDetails(topicId!);
        setTopic(newTopic);
      } catch {}
      await fetchCompletions(newTopic);

      // --- NEW LOGIC: Update topic progress if all problems/resources are completed ---
      if (newTopic) {
        const totalProblems = newTopic.essentialProblems?.length || 0;
        const totalResources = newTopic.cheatSheets?.length || 0;
        const allProblemsDone = totalProblems > 0 && completedProblems.length === totalProblems;
        const allResourcesDone = totalResources === 0 || completedResources.length === totalResources;
        if (allProblemsDone && allResourcesDone) {
          await updateUserProgress({ topicId: realTopicId, status: 'completed', lastAccessed: new Date().toISOString() } as any);
        } 
        // Always mark as in_progress if any progress is made (even if not all done)
        else if (completedProblems.length > 0 || completedResources.length > 0) {
          await updateUserProgress({ topicId: realTopicId, status: 'in_progress', lastAccessed: new Date().toISOString() } as any);
        }
      }
      // --- END NEW LOGIC ---
    }
  }, [topicId, fetchCompletions, completedProblems.length, completedResources.length]);

  const calculateCombinedProgress = () => {
    if (!topic) return 0;
    const totalProblems = topic.essentialProblems?.length || 0;
    const totalResources = topic.cheatSheets?.length || 0;
    let quizPart = 0, problemPart = 0, resourcePart = 0;
    let weights = [0, 0, 0];
    if (quizScore !== null) {
      quizPart = quizScore / 100;
      weights[0] = 1;
    }
    if (totalProblems > 0) {
      problemPart = completedProblems.length / totalProblems;
      weights[1] = 1;
    }
    if (totalResources > 0) {
      resourcePart = completedResources.length / totalResources;
      weights[2] = 1;
    }
    const totalWeight = weights[0] + weights[1] + weights[2];
    if (totalWeight === 0) return 0;
    const progress = (quizPart * (weights[0] ? 0.33 : 0) + problemPart * (weights[1] ? 0.33 : 0) + resourcePart * (weights[2] ? 0.34 : 0)) / (totalWeight === 3 ? 1 : totalWeight / 3);
    return Math.min(100, Math.round(progress * 100));
  };

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        if (topicId) {
          const data: MasteryTopicDetail = await getMasteryTopicDetails(topicId);
          setTopic(data);
        } else {
          setError('Topic ID is missing.');
        }
      } catch (err) {
        setError('Failed to fetch mastery topic details. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicDetails();
  }, [topicId]);

  useEffect(() => {
    if (topicId && topic) {
      fetchCompletions(topic);
    }
    const handler = () => handleProgressUpdate();
    window.addEventListener('user-progress-updated', handler);
    return () => window.removeEventListener('user-progress-updated', handler);
  }, [topicId, topic, fetchCompletions, handleProgressUpdate]);

  if (isLoading) return <div className="text-center py-8">Loading mastery topic...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!topic) return <div className="text-center py-8 text-gray-500">Mastery topic not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{topic.name}</h1>
        <p className="text-gray-700">{topic.quickSummary}</p>
        <div className="mt-4">
          <ProgressBar progress={calculateCombinedProgress()} showPercentage={true} />
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'problems'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('problems')}
        >
          Essential Problems
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'cheatsheets'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('cheatsheets')}
        >
          Cheat Sheets
        </button>
      </div>

      {activeTab === 'problems' && (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Track Your Progress</h3>
            <p className="text-blue-700 text-sm">
              Check off problems as you complete them. Your progress will be saved automatically.
            </p>
            <div className="mt-2 text-blue-900 text-sm font-medium">
              {completedProblems.length} of {topic.essentialProblems?.length || 0} problems completed
            </div>
          </div>
          <ProblemList
            problems={topic.essentialProblems || []}
            showDifficulty={true}
            showPremiumStatus={true}
            showCheckboxes={true}
            topicId={getRealTopicId(topicId)}
            onProgressUpdate={handleProgressUpdate}
            onSelect={(problemId) => {
              const problem = (topic.essentialProblems || []).find(p => p.id === problemId);
              const url = problem?.leetcodeLink || problem?.hackerrankLink || problem?.codeforcesLink || problem?.geeksforgeeksLink;
              if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
              } else {
                alert('No external link available for this problem.');
              }
            }}
          />
        </div>
      )}

      {activeTab === 'cheatsheets' && (
        <div>
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Cheat Sheet Progress</h3>
            <div className="mt-2 text-green-900 text-sm font-medium">
              {completedResources.length} of {topic.cheatSheets?.length || 0} cheat sheets completed
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topic.cheatSheets.length === 0 ? (
              <p className="text-gray-500">No cheat sheets available for this topic.</p>
            ) : (
              topic.cheatSheets.map(cheatSheet => (
                <ResourceCard
                  key={cheatSheet.id}
                  id={cheatSheet.id}
                  title={cheatSheet.title}
                  type="cheatsheet"
                  url={cheatSheet.url}
                  description={cheatSheet.description || 'Quick reference guide.'}
                  onProgressUpdate={handleProgressUpdate}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MasteryTopicPage;
