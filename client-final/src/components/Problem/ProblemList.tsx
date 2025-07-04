// FileName: MultipleFiles/ProblemList.tsx
import React, { useState, useEffect } from 'react';
import { Problem } from '../../types'; // Import Problem from consolidated types
import { getProblemCompletionStatus, updateProblemCompletion, notifyUserProgressUpdated } from '../../services/api';

interface ProblemListProps {
  problems: Problem[];
  onSelect?: (problemId: string) => void; // Made optional as it's not always used
  showDifficulty?: boolean; // Added prop
  showPremiumStatus?: boolean; // Added prop
  showCheckboxes?: boolean; // New prop for showing checkboxes
  topicId?: string; // Optional topic ID for progress tracking
  onProgressUpdate?: () => void; // Callback for when progress is updated
}

const ProblemList: React.FC<ProblemListProps> = ({ 
  problems, 
  onSelect, 
  showDifficulty, 
  showPremiumStatus,
  showCheckboxes = false,
  topicId,
  onProgressUpdate
}) => {
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (showCheckboxes) {
      // Load completion status for all problems
      const loadCompletionStatus = async () => {
        const statusMap: Record<string, boolean> = {};
        for (const problem of problems) {
          try {
            const status = await getProblemCompletionStatus(problem.id);
            statusMap[problem.id] = status.isCompleted;
          } catch (error) {
            console.error(`Failed to load completion status for problem ${problem.id}:`, error);
            statusMap[problem.id] = false;
          }
        }
        setCompletionStatus(statusMap);
      };
      loadCompletionStatus();
    }
  }, [problems, showCheckboxes]);

  const handleCheckboxChange = async (problemId: string, isCompleted: boolean) => {
    setLoadingStates(prev => ({ ...prev, [problemId]: true }));
    
    try {
      await updateProblemCompletion(problemId, isCompleted);
      setCompletionStatus(prev => ({ ...prev, [problemId]: isCompleted }));
      // Trigger progress update callback
      if (onProgressUpdate) {
        onProgressUpdate();
      }
      notifyUserProgressUpdated();
    } catch (error) {
      console.error(`Failed to update completion status for problem ${problemId}:`, error);
      // Revert the checkbox state on error
      setCompletionStatus(prev => ({ ...prev, [problemId]: !isCompleted }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [problemId]: false }));
    }
  };

  const handleProblemClick = (problemId: string) => {
    if (onSelect) {
      onSelect(problemId);
    }
  };

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <div
          key={problem.id}
          className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
          onClick={(e) => {
            // Prevent card click if the checkbox was clicked
            if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
            handleProblemClick(problem.id);
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{problem.title}</h3>
              <p className="text-gray-600">{problem.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                {showDifficulty && (
                  <span className={`text-sm font-medium ${
                    problem.difficulty === 'easy' ? 'text-green-600' : 
                    problem.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                )}
                {showPremiumStatus && problem.premium && (
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
                {problem.leetcodeId && (
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    LeetCode #{problem.leetcodeId}
                  </span>
                )}
              </div>
            </div>
            
            {showCheckboxes && (
              <div className="ml-4 flex items-center">
                <input
                  type="checkbox"
                  checked={completionStatus[problem.id] || false}
                  onChange={(e) => handleCheckboxChange(problem.id, e.target.checked)}
                  disabled={loadingStates[problem.id]}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  onClick={e => e.stopPropagation()} // Prevent card click when clicking checkbox
                />
                {loadingStates[problem.id] && (
                  <div className="ml-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemList;
