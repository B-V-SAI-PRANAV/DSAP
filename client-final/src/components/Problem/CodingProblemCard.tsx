import React from 'react';
import { Problem } from '../../types';

interface CodingProblemCardProps {
  problem: Problem;
  onSolve?: (problemId: string) => void;
  showDescription?: boolean;
  compact?: boolean;
}

const CodingProblemCard: React.FC<CodingProblemCardProps> = ({
  problem,
  onSolve,
  showDescription = true,
  compact = false
}) => {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'leetcode':
        return '🔴';
      case 'hackerrank':
        return '🟢';
      case 'codeforces':
        return '🔵';
      case 'geeksforgeeks':
        return '🟡';
      default:
        return '📝';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'leetcode':
        return 'LeetCode';
      case 'hackerrank':
        return 'HackerRank';
      case 'codeforces':
        return 'Codeforces';
      case 'geeksforgeeks':
        return 'GeeksforGeeks';
      default:
        return 'External';
    }
  };

  const externalLinks = [
    { platform: 'leetcode', link: problem.leetcodeLink, id: problem.leetcodeId },
    { platform: 'hackerrank', link: problem.hackerrankLink },
    { platform: 'codeforces', link: problem.codeforcesLink },
    { platform: 'geeksforgeeks', link: problem.geeksforgeeksLink }
  ].filter(link => link.link);

  const handleExternalLink = (link: string, platform: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleSolve = () => {
    // Open the first available external link
    const links = [problem.leetcodeLink, problem.hackerrankLink, problem.codeforcesLink, problem.geeksforgeeksLink].filter(Boolean);
    if (links.length > 0) {
      window.open(links[0]!, '_blank', 'noopener,noreferrer');
    } else {
      alert('No external link available for this problem.');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 ${
      compact ? 'p-4' : 'p-6'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold text-gray-900 ${compact ? 'text-lg' : 'text-xl'} mb-1`}>
            {problem.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) : 'Easy'}
            </span>
            {problem.premium && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Premium
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {showDescription && problem.description && (
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {problem.description}
          </p>
        </div>
      )}

      {/* Problem Metadata */}
      {(problem.timeComplexity || problem.spaceComplexity || problem.tags) && (
        <div className="mb-4 space-y-2">
          {(problem.timeComplexity || problem.spaceComplexity) && (
            <div className="flex gap-4 text-xs text-gray-500">
              {problem.timeComplexity && (
                <span>Time: {problem.timeComplexity}</span>
              )}
              {problem.spaceComplexity && (
                <span>Space: {problem.spaceComplexity}</span>
              )}
            </div>
          )}
          {problem.tags && problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {problem.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {problem.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">
                  +{problem.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* External Links */}
      {externalLinks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Solve on:</h4>
          <div className="flex flex-wrap gap-2">
            {externalLinks.map(({ platform, link, id }) => (
              <button
                key={platform}
                onClick={() => handleExternalLink(link!, platform)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md border border-gray-200 transition-colors duration-200"
                title={`Solve on ${getPlatformName(platform)}`}
              >
                <span>{getPlatformIcon(platform)}</span>
                <span>{getPlatformName(platform)}</span>
                {id && <span className="text-xs text-gray-500">#{id}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onSolve && (
          <button
            onClick={handleSolve}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Solve Problem
          </button>
        )}
        {problem.starterCode && (
          <button
            onClick={() => {/* TODO: Open code editor */}}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 font-medium rounded-md border border-blue-200 transition-colors duration-200"
          >
            View Code
          </button>
        )}
      </div>
    </div>
  );
};

export default CodingProblemCard; 