import React, { useEffect, useState } from 'react';
import { getAllTopics, createTopic, updateTopic, deleteTopic } from '../../services/adminApi';

interface Topic {
  id: string;
  name: string;
  description: string;
  difficultyScore?: number;
  isCore?: boolean;
  estimatedTimeMins?: number;
  priority?: number;
}

const AdminTopics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficultyScore: 0.5,
    isCore: true,
    estimatedTimeMins: 120,
    priority: 1
  });

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTopics();
      // Handle different response structures
      const topicsArray = Array.isArray(data) ? data : (data.topics || data.data || []);
      setTopics(topicsArray);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch topics');
      setTopics([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await updateTopic(editingTopic.id, formData);
      } else {
        await createTopic(formData);
      }
      setShowModal(false);
      setEditingTopic(null);
      resetForm();
      fetchTopics();
    } catch (err: any) {
      setError(err.message || 'Failed to save topic');
    }
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      difficultyScore: topic.difficultyScore || 0.5,
      isCore: topic.isCore !== false,
      estimatedTimeMins: topic.estimatedTimeMins || 120,
      priority: topic.priority || 1
    });
    setShowModal(true);
  };

  const handleDelete = async (topicId: string) => {
    if (window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
      try {
        await deleteTopic(topicId);
        fetchTopics();
      } catch (err: any) {
        setError(err.message || 'Failed to delete topic');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      difficultyScore: 0.5,
      isCore: true,
      estimatedTimeMins: 120,
      priority: 1
    });
  };

  const openAddModal = () => {
    setEditingTopic(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Topics</h2>
        <div className="space-x-2">
          <button
            onClick={fetchTopics}
            className="px-4 py-2 bg-gray-600 text-white rounded-md font-semibold shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Add Topic
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">Loading topics...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Core</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (mins)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(topics || []).map(topic => (
              <tr key={topic.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{topic.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.difficultyScore ?? '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.isCore ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.estimatedTimeMins ?? '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.priority ?? '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(topic)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(topic.id)}
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
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingTopic ? 'Edit Topic' : 'Add New Topic'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty Score</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.difficultyScore}
                    onChange={(e) => setFormData({...formData, difficultyScore: parseFloat(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Time (mins)</label>
                  <input
                    type="number"
                    value={formData.estimatedTimeMins}
                    onChange={(e) => setFormData({...formData, estimatedTimeMins: parseInt(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isCore}
                    onChange={(e) => setFormData({...formData, isCore: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Core Topic</label>
                </div>
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
                  {editingTopic ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTopics; 