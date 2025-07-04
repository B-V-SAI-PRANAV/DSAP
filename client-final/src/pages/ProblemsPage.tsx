import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import { getTopicProblems, updateProblemCompletion } from '../services/api';
import { Problem } from '../types';

const ProblemsPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (topicId) {
          const data = await getTopicProblems(topicId);
          setProblems(data);
          if (data.length > 0) {
            setCode(data[0].starterCode || '');
          }
        } else {
          setError('Topic ID is missing.');
        }
      } catch (err) {
        setError('Failed to fetch problems. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [topicId]);

  const handleRunCode = async () => {
    const currentProblem = problems[currentProblemIndex];
    if (!currentProblem || !currentProblem.testCases || currentProblem.testCases.length === 0) {
      setOutput('No test cases available for this problem.');
      return;
    }

    if (code.includes(currentProblem.testCases[0].output)) {
      setOutput('All test cases passed! ✅ Problem completed!');
      
      // Mark problem as completed
      if (!completedProblems.includes(currentProblem.id)) {
        try {
          await updateProblemCompletion(currentProblem.id, true);
          setCompletedProblems(prev => [...prev, currentProblem.id]);
        } catch (error) {
          console.error('Failed to mark problem as completed:', error);
        }
      }
    } else {
      setOutput('Some test cases failed. Try again!');
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setCode(problems[currentProblemIndex + 1].starterCode || '');
      setOutput('');
    } else {
      navigate('/completion', {
        state: {
          topicId: topicId,
          topicName: problems[0]?.title || 'Unknown Topic',
          score: problems.length,
          totalProblems: problems.length,
        },
      });
    }
  };

  const handleSubmitSolution = () => {
    const currentProblem = problems[currentProblemIndex];
    navigate(`/submit/${currentProblem.id}`, {
      state: { starterCode: code },
    });
  };

  if (isLoading) return <div className="text-center py-8">Loading problems...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (problems.length === 0) return <div className="text-center py-8 text-gray-500">No problems found for this topic.</div>;

  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <div className="mb-4">
          {/* Progress indicator */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress: {completedProblems.length}/{problems.length} completed</span>
              <span>{Math.round((completedProblems.length / problems.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedProblems.length / problems.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            Problem {currentProblemIndex + 1} of {problems.length}
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                currentProblem.difficulty === 'easy'
                  ? 'bg-green-100 text-green-800'
                  : currentProblem.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {currentProblem.difficulty}
            </span>
            {completedProblems.includes(currentProblem.id) && (
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                ✅ Completed
              </span>
            )}
          </h2>
          <h1 className="text-xl font-semibold mb-4">{currentProblem.title}</h1>
          <div className="prose">
            {currentProblem.description.split('\n').map((para, i) => (
              <p key={i} className="mb-3">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="md:w-1/2">
        <CodeEditor
          value={code}
          onChange={setCode}
          language="javascript"
          height="400px"
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleRunCode}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Run Code
          </button>
          <button
            onClick={handleNextProblem}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {currentProblemIndex < problems.length - 1 ? 'Next Problem' : 'Finish Topic'}
          </button>
          <button
            onClick={handleSubmitSolution}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Solution
          </button>
        </div>

        {output && (
          <div className="mt-4 p-4 bg-gray-800 text-white rounded">
            <h3 className="font-bold mb-2">Output:</h3>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;
