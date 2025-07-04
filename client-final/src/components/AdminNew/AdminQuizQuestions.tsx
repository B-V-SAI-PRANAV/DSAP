import React, { useEffect, useState } from 'react';
import { getAllQuizQuestions, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion } from '../../services/adminApi';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: string;
  category: string;
  topicId?: string;
  subtopicId?: string;
  tags?: string[];
}

const AdminQuizQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Medium',
    category: 'Arrays',
    topicId: '',
    subtopicId: '',
    tags: ''
  });

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllQuizQuestions();
      // Handle different response structures
      const questionsArray = Array.isArray(data) ? data : (data.questions || data.data || []);
      setQuestions(questionsArray);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quiz questions');
      setQuestions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      if (editingQuestion) {
        await updateQuizQuestion(editingQuestion.id, submitData);
      } else {
        await createQuizQuestion(submitData);
      }
      setShowModal(false);
      setEditingQuestion(null);
      resetForm();
      fetchQuestions();
    } catch (err: any) {
      setError(err.message || 'Failed to save quiz question');
    }
  };

  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      difficulty: question.difficulty,
      category: question.category,
      topicId: question.topicId || '',
      subtopicId: question.subtopicId || '',
      tags: question.tags ? question.tags.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz question? This action cannot be undone.')) {
      try {
        await deleteQuizQuestion(questionId);
        fetchQuestions();
      } catch (err: any) {
        setError(err.message || 'Failed to delete quiz question');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'Medium',
      category: 'Arrays',
      topicId: '',
      subtopicId: '',
      tags: ''
    });
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    resetForm();
    setShowModal(true);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quiz Questions</h2>
        <div className="space-x-2">
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-gray-600 text-white rounded-md font-semibold shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Add Question
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">Loading quiz questions...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Answer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(questions || []).map(question => (
              <tr key={question.id}>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {question.question}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.difficulty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.options[question.correctAnswer]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(question)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
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
              {editingQuestion ? 'Edit Quiz Question' : 'Add New Quiz Question'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Options *</label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData({...formData, correctAnswer: index})}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Explanation</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Explain why this is the correct answer..."
                />
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
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter tags separated by commas (e.g., arrays, sorting, two-pointers)"
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
                  {editingQuestion ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizQuestions; 