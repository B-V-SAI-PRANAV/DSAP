import React, { useEffect, useState } from 'react';
import { getAllResources, createResource, updateResource, deleteResource } from '../../services/adminApi';

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  description?: string;
  qualityScore?: number;
  topicId?: string;
  subtopicId?: string;
  duration?: number;
  difficulty?: string;
  leetcodeId?: number;
  leetcodeLink?: string;
}

const AdminResources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Article',
    url: '',
    description: '',
    qualityScore: 8.0,
    topicId: '',
    subtopicId: '',
    duration: 0,
    difficulty: 'Medium',
    leetcodeId: 0,
    leetcodeLink: ''
  });

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResources();
      // Handle different response structures
      const resourcesArray = Array.isArray(data) ? data : (data.resources || data.data || []);
      setResources(resourcesArray);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch resources');
      setResources([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await updateResource(editingResource.id, formData);
      } else {
        await createResource(formData);
      }
      setShowModal(false);
      setEditingResource(null);
      resetForm();
      fetchResources();
    } catch (err: any) {
      setError(err.message || 'Failed to save resource');
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      type: resource.type,
      url: resource.url,
      description: resource.description || '',
      qualityScore: resource.qualityScore || 8.0,
      topicId: resource.topicId || '',
      subtopicId: resource.subtopicId || '',
      duration: resource.duration || 0,
      difficulty: resource.difficulty || 'Medium',
      leetcodeId: resource.leetcodeId || 0,
      leetcodeLink: resource.leetcodeLink || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        await deleteResource(resourceId);
        fetchResources();
      } catch (err: any) {
        setError(err.message || 'Failed to delete resource');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Article',
      url: '',
      description: '',
      qualityScore: 8.0,
      topicId: '',
      subtopicId: '',
      duration: 0,
      difficulty: 'Medium',
      leetcodeId: 0,
      leetcodeLink: ''
    });
  };

  const openAddModal = () => {
    setEditingResource(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Resources</h2>
        <div className="space-x-2">
          <button
            onClick={fetchResources}
            className="px-4 py-2 bg-gray-600 text-white rounded-md font-semibold shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Add Resource
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">Loading resources...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(resources || []).map(resource => (
              <tr key={resource.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{resource.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">Link</a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.qualityScore ?? '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.difficulty ?? '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(resource)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
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
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
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
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Problem">Problem</option>
                    <option value="Quiz">Quiz</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quality Score</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.qualityScore}
                    onChange={(e) => setFormData({...formData, qualityScore: parseFloat(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">LeetCode ID</label>
                  <input
                    type="number"
                    value={formData.leetcodeId}
                    onChange={(e) => setFormData({...formData, leetcodeId: parseInt(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
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
                  {editingResource ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResources; 