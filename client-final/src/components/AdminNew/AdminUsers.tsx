import React, { useEffect, useState } from 'react';
import { getUsersList, createUser, updateUser, deleteUser } from '../../services/adminApi';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
  lastActive?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    active: true
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsersList();
      // Handle different response structures
      let usersArray: any[] = [];
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data && data.users) {
        usersArray = data.users;
      } else if (data && data.data) {
        usersArray = data.data;
      }
      setUsers(usersArray);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setShowModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't show password in edit mode
      role: user.role,
      active: user.active
    });
    setShowModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err: any) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      active: true
    });
  };

  const openAddModal = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <div className="space-x-2">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-gray-600 text-white rounded-md font-semibold shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">Loading users...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(users || []).map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required={!editingUser}
                    minLength={6}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Active</label>
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
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 