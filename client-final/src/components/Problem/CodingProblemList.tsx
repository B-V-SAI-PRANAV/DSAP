import React, { useState, useMemo, useEffect } from 'react';
import { Problem } from '../../types';
import CodingProblemCard from './CodingProblemCard';
import { getTopicProblemProgress, updateProblemCompletion } from '../../services/api';

interface CodingProblemListProps {
  problems: Problem[];
  onProblemSelect?: (problem: Problem) => void;
  showFilters?: boolean;
  title?: string;
  emptyMessage?: string;
  topicId?: string;
  onProgressUpdate?: () => void;
}

const CodingProblemList: React.FC<CodingProblemListProps> = ({
  problems,
  onProblemSelect,
  showFilters = true,
  title = 'Coding Problems',
  emptyMessage = 'No problems found for this topic.',
  topicId,
  onProgressUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'platform'>('title');
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load completed problems on component mount
  useEffect(() => {
    if (topicId) {
      const loadProgress = async () => {
        try {
          const progress = await getTopicProblemProgress(topicId);
          setCompletedProblems(progress.completedProblems);
        } catch (error) {
          console.error('Failed to load problem progress:', error);
        }
      };
      loadProgress();
    }
  }, [topicId]);

  const handleProblemToggle = async (problemId: string) => {
    if (!topicId) return;
    
    setIsLoading(true);
    try {
      const isCompleted = completedProblems.includes(problemId);
      const newCompletedProblems = isCompleted
        ? completedProblems.filter(id => id !== problemId)
        : [...completedProblems, problemId];
      
      setCompletedProblems(newCompletedProblems);
      
      await updateProblemCompletion(problemId, !isCompleted);
      if (onProgressUpdate) onProgressUpdate();
    } catch (error) {
      console.error('Failed to update problem completion:', error);
      // Revert the state change on error
      setCompletedProblems(completedProblems);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProblems = useMemo(() => {
    let filtered = problems.filter(problem => {
      // Search filter
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (problem.tags && problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      // Difficulty filter
      const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;

      // Platform filter
      const matchesPlatform = platformFilter === 'all' || 
        (platformFilter === 'leetcode' && problem.leetcodeLink) ||
        (platformFilter === 'hackerrank' && problem.hackerrankLink) ||
        (platformFilter === 'codeforces' && problem.codeforcesLink) ||
        (platformFilter === 'geeksforgeeks' && problem.geeksforgeeksLink);

      return matchesSearch && matchesDifficulty && matchesPlatform;
    });

    // Sort problems
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        case 'platform':
          const aHasPlatform = a.leetcodeLink || a.hackerrankLink || a.codeforcesLink || a.geeksforgeeksLink;
          const bHasPlatform = b.leetcodeLink || b.hackerrankLink || b.codeforcesLink || b.geeksforgeeksLink;
          return bHasPlatform ? 1 : aHasPlatform ? -1 : 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [problems, searchTerm, difficultyFilter, platformFilter, sortBy]);

  const getPlatformStats = () => {
    const stats = {
      leetcode: 0,
      hackerrank: 0,
      codeforces: 0,
      geeksforgeeks: 0,
      total: problems.length
    };

    problems.forEach(problem => {
      if (problem.leetcodeLink) stats.leetcode++;
      if (problem.hackerrankLink) stats.hackerrank++;
      if (problem.codeforcesLink) stats.codeforces++;
      if (problem.geeksforgeeksLink) stats.geeksforgeeks++;
    });

    return stats;
  };

  const platformStats = getPlatformStats();

  const handleProblemSelect = (problem: Problem) => {
    if (onProblemSelect) {
      onProblemSelect(problem);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            {filteredProblems.length} of {problems.length} problems
          </p>
        </div>
        
        {/* Platform Stats */}
        <div className="flex gap-2 text-sm">
          {platformStats.leetcode > 0 && (
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full">
              🔴 {platformStats.leetcode}
            </span>
          )}
          {platformStats.hackerrank > 0 && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full">
              🟢 {platformStats.hackerrank}
            </span>
          )}
          {platformStats.codeforces > 0 && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
              🔵 {platformStats.codeforces}
            </span>
          )}
          {platformStats.geeksforgeeks > 0 && (
            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">
              🟡 {platformStats.geeksforgeeks}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Problems
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or tags..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                id="platform"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Platforms</option>
                <option value="leetcode">LeetCode</option>
                <option value="hackerrank">HackerRank</option>
                <option value="codeforces">Codeforces</option>
                <option value="geeksforgeeks">GeeksforGeeks</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'title' | 'difficulty' | 'platform')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
                <option value="platform">Platform</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Problem List */}
      {filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProblems.map((problem) => (
            <div key={problem.id} className="relative">
              {/* Checkbox for completion tracking */}
              {topicId && (
                <div className="absolute top-4 right-4 z-10">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={completedProblems.includes(problem.id)}
                      onChange={() => handleProblemToggle(problem.id)}
                      disabled={isLoading}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {completedProblems.includes(problem.id) ? 'Completed' : 'Mark Complete'}
                    </span>
                  </label>
                </div>
              )}
              <CodingProblemCard
                problem={problem}
                onSolve={() => handleProblemSelect(problem)}
                showDescription={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
          <p className="text-gray-600">{emptyMessage}</p>
          {(searchTerm || difficultyFilter !== 'all' || platformFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDifficultyFilter('all');
                setPlatformFilter('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CodingProblemList; 