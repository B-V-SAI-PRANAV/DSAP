// FileName: MultipleFiles/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { updateUserSettings, getUserSettings } from '../services/api'; // Ensure these functions exist in api.ts
import { UserSettings } from '../types'; // Import UserSettings from consolidated types

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    preferredLanguage: 'javascript',
    difficultyLevel: 'intermediate',
    darkMode: false,
    weeklyGoal: 10
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getUserSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings', error);
        setError('Failed to load settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? Number(value)
        : value
    }));
    setIsSaved(false);
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (settings.weeklyGoal < 1 || settings.weeklyGoal > 50) {
      setError('Weekly goal must be between 1 and 50.');
      return;
    }

    try {
      await updateUserSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings', error);
      setError('Failed to save settings. Please try again.');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading settings...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700">
            Preferred Programming Language
          </label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            value={settings.preferredLanguage}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Difficulty Level
          </label>
          <div className="space-y-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <div key={level} className="flex items-center">
                <input
                  id={`difficulty-${level}`}
                  name="difficultyLevel"
                  type="radio"
                  checked={settings.difficultyLevel === level}
                  onChange={handleChange}
                  value={level}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor={`difficulty-${level}`} className="ml-2 capitalize text-gray-700">
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="darkMode"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
              Dark Mode
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="weeklyGoal" className="block text-sm font-medium text-gray-700">
            Weekly Goal (problems)
          </label>
          <input
            type="number"
            id="weeklyGoal"
            name="weeklyGoal"
            min="1"
            max="50"
            value={settings.weeklyGoal}
            onChange={handleChange}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
          {isSaved && (
            <span className="ml-3 flex items-center text-green-600">
              Settings saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
