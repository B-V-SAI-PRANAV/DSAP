import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicDetails, updateQuizPerformance, getTopicProblemProgress, getResourceCompletionStatus, notifyUserProgressUpdated, updateUserProgress } from '../services/api';
import { TopicDetailsResponse } from '../types';
import ConceptCard from '../components/Topics/ConceptCard';
import ResourceCard from '../components/Resource/ResourceCard';
import CodingProblemList from '../components/Problem/CodingProblemList';
import QuizComponent from '../components/Quiz/QuizComponent';
import ProgressBar from '../components/Navigation/ProgressBar';
import NextTopicButton from '../components/Topics/NextTopicButton';

type TabType = 'overview' | 'concepts' | 'resources' | 'problems' | 'quiz';

const TopicDetailPage: React.FC = () => {
  const { id: topicId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topicData, setTopicData] = useState<TopicDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [completedResources, setCompletedResources] = useState<string[]>([]);

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        if (topicId) {
          const data = await getTopicDetails(topicId);
          setTopicData(data);
        } else {
          setError('Topic ID is missing.');
        }
      } catch (err) {
        setError('Failed to fetch topic details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicDetails();
  }, [topicId]);

  // Fetch completions on load
  useEffect(() => {
    const fetchCompletions = async () => {
      if (topicId && topicData) {
        // Problems
        try {
          const progress = await getTopicProblemProgress(topicId);
          setCompletedProblems(progress.completedProblems);
        } catch {}
        // Resources
        try {
          const results = await Promise.all((topicData.resources || []).map(r => getResourceCompletionStatus(r.id)));
          setCompletedResources(results.filter(r => r.isCompleted).map(r => r.resourceId));
        } catch {}
      }
    };
    fetchCompletions();
    const handler = () => fetchCompletions();
    window.addEventListener('user-progress-updated', handler);
    return () => window.removeEventListener('user-progress-updated', handler);
  }, [topicId, topicData]);

  const handleQuizComplete = async (score: number, totalQuestions: number, passed: boolean) => {
    setQuizScore(score);
    setQuizCompleted(true);
    setShowQuiz(false);
    
    if (topicId) {
      try {
        // Update quiz performance in backend
        const result = await updateQuizPerformance(topicId, score, topicData?.topic?.quizThreshold || 70);
        
        // Show adaptive learning message if topic is weak
        if (result.isWeakTopic) {
          // You could show a toast notification here
        }

        // Notify user progress updated
        notifyUserProgressUpdated();
      } catch (error) {
        console.error('Failed to update quiz performance:', error);
      }
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  // Handler for when a problem is completed
  const handleProblemProgressUpdate = async () => {
    if (topicId) {
      const progress = await getTopicProblemProgress(topicId);
      setCompletedProblems(progress.completedProblems);
      if (progress.completedProblems.length > 0) {
        await updateUserProgress({ topicId, status: 'in_progress', lastAccessed: new Date().toISOString() } as any);
        notifyUserProgressUpdated();
      }
    }
  };

  // Handler for when a resource is completed
  const handleResourceProgressUpdate = async () => {
    if (topicData?.resources) {
      const results = await Promise.all(
        topicData.resources.map(r => getResourceCompletionStatus(r.id))
      );
      setCompletedResources(
        results.filter(r => r.isCompleted).map(r => r.resourceId)
      );
      if (results.some(r => r.isCompleted)) {
        await updateUserProgress({ topicId, status: 'in_progress', lastAccessed: new Date().toISOString() } as any);
        notifyUserProgressUpdated();
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrerequisitesText = () => {
    if (!topicData?.prerequisites || topicData.prerequisites.length === 0) {
      return 'None';
    }
    return topicData.prerequisites.map(topic => topic.name).join(', ');
  };

  const getNextTopicsText = () => {
    if (!topicData?.nextTopics || topicData.nextTopics.length === 0) {
      return 'None';
    }
    return topicData.nextTopics.map(topic => topic.name).join(', ');
  };

  const calculateTopicProgress = () => {
    if (!topicId || !topicData) return 0;
    const totalProblems = topicData.questions?.length || 0;
    const totalResources = topicData.resources?.length || 0;
    let quizPart = 0, problemPart = 0, resourcePart = 0;
    let weights = [0, 0, 0];
    // Quiz
    if (quizCompleted && quizScore !== null) {
      quizPart = quizScore / 100;
      weights[0] = 1;
    } else if (topicData.topic?.lastQuizScore !== undefined) {
      quizPart = topicData.topic.lastQuizScore / 100;
      weights[0] = 1;
    }
    // Problems
    if (totalProblems > 0) {
      problemPart = completedProblems.length / totalProblems;
      weights[1] = 1;
    }
    // Resources
    if (totalResources > 0) {
      resourcePart = completedResources.length / totalResources;
      weights[2] = 1;
    }
    const totalWeight = weights[0] + weights[1] + weights[2];
    if (totalWeight === 0) return 0;
    // Proportional weights: quiz 33%, problems 33%, resources 34%
    const progress = (quizPart * (weights[0] ? 0.33 : 0) + problemPart * (weights[1] ? 0.33 : 0) + resourcePart * (weights[2] ? 0.34 : 0)) / (totalWeight === 3 ? 1 : totalWeight / 3);
    return Math.min(100, Math.round(progress * 100));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading topic details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Topic</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/topics')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Topic Not Found</h2>
          <p className="text-gray-600 mb-4">The requested topic could not be found.</p>
          <button
            onClick={() => navigate('/topics')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const { topic, subtopics, resources, questions, quizTemplate } = topicData;

  // Check if topic is completed (quiz passed and problems solved)
  const isTopicCompleted = quizCompleted && quizScore !== null && quizScore >= (topic.quizThreshold || 70);

  // Show quiz if it's active
  if (showQuiz && quizTemplate?.questions && quizTemplate.questions.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <QuizComponent
          questions={quizTemplate.questions}
          onComplete={handleQuizComplete}
          threshold={topic.quizThreshold || 70}
          title={`${topic.name} Quiz`}
          allowRetry={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{topic.name}</h1>
              <p className="text-gray-600 mt-1">{topic.description}</p>
            </div>
            <div className="flex items-center gap-4">
              {topic.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty}
                </span>
              )}
              {quizCompleted && quizScore !== null && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quizScore >= (topic.quizThreshold || 70) 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Quiz: {Math.round(quizScore)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar progress={calculateTopicProgress()} />

      {/* Next Topic Button - Show when topic is completed */}
      {isTopicCompleted && topicId && (
        <div className="container mx-auto px-4 py-4">
          <NextTopicButton topicId={topicId} isCompleted={isTopicCompleted} />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📋' },
              { id: 'concepts', name: 'Concepts', icon: '💡' },
              { id: 'resources', name: 'Resources', icon: '📚' },
              { id: 'problems', name: 'Problems', icon: '💻' },
              { id: 'quiz', name: 'Quiz', icon: '🧠' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">About This Topic</h2>
                <p className="text-gray-700 leading-relaxed">
                  {topic.description || 'This topic covers fundamental concepts and techniques that are essential for understanding data structures and algorithms.'}
                </p>
              </div>

              {/* Subtopics */}
              {subtopics && subtopics.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Subtopics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subtopics.map((subtopic) => (
                      <div key={subtopic.id} className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">{subtopic.name}</h3>
                        {subtopic.description && (
                          <p className="text-sm text-gray-600">{subtopic.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          {subtopic.resourcesCount && (
                            <span>📚 {subtopic.resourcesCount} resources</span>
                          )}
                          {subtopic.problemsCount && (
                            <span>💻 {subtopic.problemsCount} problems</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('problems')}
                    className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="text-2xl mb-2">💻</div>
                    <h3 className="font-medium text-gray-900">Practice Problems</h3>
                    <p className="text-sm text-gray-600">Solve coding problems on various platforms</p>
                  </button>
                  {quizTemplate?.questions && quizTemplate.questions.length > 0 && (
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left"
                    >
                      <div className="text-2xl mb-2">🧠</div>
                      <h3 className="font-medium text-gray-900">Go to Quiz</h3>
                      <p className="text-sm text-gray-600">Test your knowledge with {quizTemplate.questions.length} questions</p>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prerequisites */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Prerequisites</h3>
                <p className="text-gray-600">{getPrerequisitesText()}</p>
              </div>

              {/* Next Topics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Next Topics</h3>
                <p className="text-gray-600">{getNextTopicsText()}</p>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Topic Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtopics:</span>
                    <span className="font-medium">{subtopics?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resources:</span>
                    <span className="font-medium">{resources?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Problems:</span>
                    <span className="font-medium">{questions?.length || 0}</span>
                  </div>
                  {quizTemplate?.questions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quiz Questions:</span>
                      <span className="font-medium">{quizTemplate.questions.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'concepts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subtopics?.map((subtopic) => (
                <ConceptCard
                  key={subtopic.id}
                  concept={{
                    id: subtopic.id,
                    name: subtopic.name,
                    description: subtopic.description || '',
                    resources: subtopic.resources?.map(r => ({
                      title: r.title,
                      url: r.url,
                      type: r.type === 'book' || r.type === 'document' ? 'article' : r.type
                    })).filter(r => r.type === 'video' || r.type === 'article' || r.type === 'cheatsheet') || []
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources?.map((resource) => (
                <ResourceCard 
                  key={resource.id} 
                  id={resource.id}
                  title={resource.title}
                  type={resource.type}
                  url={resource.url}
                  description={resource.description}
                  duration={resource.duration}
                  meta={resource.meta}
                  subtopicId={resource.subtopicId}
                  onProgressUpdate={handleResourceProgressUpdate}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="py-6">
            <CodingProblemList
              problems={questions || []}
              topicId={topicId}
              showFilters={true}
              title="Coding Problems"
              emptyMessage="No problems found for this topic."
              onProgressUpdate={handleProblemProgressUpdate}
            />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{topic.name} Quiz</h2>
              {/* Quiz Stats */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                  {quizTemplate?.questions?.length || 0} Questions
                </div>
                <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                  Passing Score: {topic.quizThreshold || 70}%
                </div>
                {quizCompleted && quizScore !== null && (
                  <div className={`px-4 py-2 rounded-lg text-sm font-medium ${quizScore >= (topic.quizThreshold || 70) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Last Attempt: {Math.round(quizScore)}% ({quizScore >= (topic.quizThreshold || 70) ? 'Passed' : 'Failed'})
                  </div>
                )}
              </div>
              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Answer all questions to the best of your ability.</li>
                  <li>You need at least {topic.quizThreshold || 70}% to pass.</li>
                  <li>You can retake the quiz as many times as you like.</li>
                </ul>
              </div>
              {/* Preview Questions Toggle */}
              {quizTemplate?.questions && quizTemplate.questions.length > 0 && (
                <PreviewQuestions questions={quizTemplate.questions} />
              )}
              {/* Quiz Start/Retake Logic */}
              {quizCompleted ? (
                <div className="text-center mt-6">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-8 mb-4 ${
                    quizScore! >= (topic.quizThreshold || 70) 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      quizScore! >= (topic.quizThreshold || 70) ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.round(quizScore!)}%
                    </div>
                  </div>
                  <p className={`text-lg font-semibold mb-4 ${
                    quizScore! >= (topic.quizThreshold || 70) ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {quizScore! >= (topic.quizThreshold || 70) 
                      ? '🎉 Quiz completed successfully!' 
                      : '😔 Quiz score below threshold'
                    }
                  </p>
                  <button
                    onClick={handleStartQuiz}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Retake Quiz
                  </button>
                </div>
              ) : quizTemplate?.questions ? (
                <div className="text-center mt-6">
                  <div className="text-6xl mb-4">🧠</div>
                  <h3 className="text-xl font-semibold mb-2">Ready to test your knowledge?</h3>
                  <p className="text-gray-600 mb-6">
                    This quiz contains {quizTemplate.questions.length} questions. 
                    You need to score at least {topic.quizThreshold || 70}% to pass.
                  </p>
                  <button
                    onClick={handleStartQuiz}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-lg transition-colors duration-200"
                  >
                    Start Quiz
                  </button>
                </div>
              ) : (
                <div className="text-center mt-6">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">No Quiz Available</h3>
                  <p className="text-gray-600">
                    Quiz questions are not available for this topic yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PreviewQuestions: React.FC<{ questions: any[] }> = ({ questions }) => {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div className="mb-4">
      <button
        onClick={() => setShowPreview((prev) => !prev)}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium mb-2"
      >
        {showPreview ? 'Hide Preview' : 'Preview Questions'}
      </button>
      {showPreview && (
        <ul className="list-decimal list-inside bg-gray-50 rounded-lg p-4 mt-2 text-left text-sm text-gray-700 max-h-48 overflow-y-auto">
          {questions.map((q, idx) => (
            <li key={q.id || idx} className="mb-1">
              {q.question.split(' ').slice(0, 10).join(' ')}{q.question.split(' ').length > 10 ? '...' : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopicDetailPage;
