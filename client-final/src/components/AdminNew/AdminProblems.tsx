import React, { useEffect, useState } from 'react';
import { getAllProblems, createProblem, updateProblem, deleteProblem } from '../../services/adminApi';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  leetcodeId?: number;
  leetcodeLink?: string;
  solution?: string;
  testCases?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  topicId?: string;
  subtopicId?: string;
}

const AdminProblems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    category: 'Arrays',
    leetcodeId: 0,
    leetcodeLink: '',
    solution: '',
    testCases: '',
    timeComplexity: '',
    spaceComplexity: '',
    topicId: '',
    subtopicId: ''
  });

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching problems...');
      const data = await getAllProblems();
      console.log('Problems response:', data);
      
      // Handle different response structures
      const problemsArray = Array.isArray(data) ? data : (data.problems || data.data || []);
      console.log('Processed problems array:', problemsArray);
      
      if (!Array.isArray(problemsArray)) {
        console.error('Problems is not an array:', problemsArray);
        setError('Invalid response format from server');
        setProblems([]);
        return;
      }
      
      setProblems(problemsArray);
      console.log(`Loaded ${problemsArray.length} problems`);
    } catch (err: any) {
      console.error('Error fetching problems:', err);
      setError(err.message || 'Failed to fetch problems');
      setProblems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProblem) {
        await updateProblem(editingProblem.id, formData);
      } else {
        await createProblem(formData);
      }
      setShowModal(false);
      setEditingProblem(null);
      resetForm();
      fetchProblems();
    } catch (err: any) {
      setError(err.message || 'Failed to save problem');
    }
  };

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      leetcodeId: problem.leetcodeId || 0,
      leetcodeLink: problem.leetcodeLink || '',
      solution: problem.solution || '',
      testCases: problem.testCases || '',
      timeComplexity: problem.timeComplexity || '',
      spaceComplexity: problem.spaceComplexity || '',
      topicId: problem.topicId || '',
      subtopicId: problem.subtopicId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (problemId: string) => {
    if (window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      try {
        await deleteProblem(problemId);
        fetchProblems();
      } catch (err: any) {
        setError(err.message || 'Failed to delete problem');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'Medium',
      category: 'Arrays',
      leetcodeId: 0,
      leetcodeLink: '',
      solution: '',
      testCases: '',
      timeComplexity: '',
      spaceComplexity: '',
      topicId: '',
      subtopicId: ''
    });
  };

  const openAddModal = () => {
    setEditingProblem(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Problems</h2>
        <div className="space-x-2">
          <button
            onClick={fetchProblems}
            className="px-4 py-2 bg-gray-600 text-white rounded-md font-semibold shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Add Problem
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">Loading problems...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LeetCode ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(problems || []).map(problem => (
              <tr key={problem.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{problem.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.difficulty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.leetcodeId ?? '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(problem)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(problem.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingProblem ? 'Edit Problem' : 'Add New Problem'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Linked Lists">Linked Lists</option>
                    <option value="Stacks">Stacks</option>
                    <option value="Queues">Queues</option>
                    <option value="Trees">Trees</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Greedy">Greedy</option>
                    <option value="Backtracking">Backtracking</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LeetCode ID</label>
                  <input
                    type="number"
                    value={formData.leetcodeId}
                    onChange={(e) => setFormData({...formData, leetcodeId: parseInt(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LeetCode Link</label>
                <input
                  type="url"
                  value={formData.leetcodeLink}
                  onChange={(e) => setFormData({...formData, leetcodeLink: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Time Complexity</label>
                  <input
                    type="text"
                    value={formData.timeComplexity}
                    onChange={(e) => setFormData({...formData, timeComplexity: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., O(n)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Space Complexity</label>
                  <input
                    type="text"
                    value={formData.spaceComplexity}
                    onChange={(e) => setFormData({...formData, spaceComplexity: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., O(1)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Topic ID</label>
                  <input
                    type="text"
                    value={formData.topicId}
                    onChange={(e) => setFormData({...formData, topicId: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subtopic ID</label>
                  <input
                    type="text"
                    value={formData.subtopicId}
                    onChange={(e) => setFormData({...formData, subtopicId: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Solution</label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({...formData, solution: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={6}
                  placeholder="Enter the solution code or explanation..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Test Cases</label>
                <textarea
                  value={formData.testCases}
                  onChange={(e) => setFormData({...formData, testCases: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                  placeholder="Enter test cases..."
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingProblem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProblems; 