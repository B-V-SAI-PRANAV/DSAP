import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import { submitProblemSolution } from '../services/api';
import { SubmissionResult } from '../types';

interface LocationState {
  starterCode?: string;
}

const SubmissionPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState<string>((location.state as LocationState)?.starterCode || '');
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!problemId) {
      setSubmissionError('Problem ID is missing for submission.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setOutput('');

    try {
      const result: SubmissionResult = await submitProblemSolution({
        problemId,
        code,
        language,
      });
      setOutput(result.message);
      if (result.success) {
        setTimeout(() => navigate(`/problems/${problemId}`), 1500);
      } else {
        setSubmissionError('Submission failed. Please check your code.');
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setSubmissionError('Error submitting solution. Please try again later.');
      setOutput('Error: Could not connect to judge server or unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-4">Problem Submission</h1>
          <div className="mb-4 flex items-center justify-between">
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-gray-700 mr-2"
            >
              Language:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            height="400px"
          />
        </div>

        <div className="md:w-1/2">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="h-64 bg-gray-800 text-white p-4 rounded overflow-auto">
              {output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-gray-400">
                  Your test results will appear here after submission...
                </p>
              )}
            </div>

            {submissionError && (
              <div className="text-red-500 mt-4">{submissionError}</div>
            )}

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;
