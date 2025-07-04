import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../types';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number, passed: boolean) => void;
  threshold: number;
  title?: string;
  showProgress?: boolean;
  allowRetry?: boolean;
}

function calculateScore(
  questions: QuizQuestion[],
  selectedAnswers: Record<number, string>,
  threshold: number,
  onComplete: (score: number, totalQuestions: number, passed: boolean) => void,
  setScore: (score: number) => void
) {
  let correctAnswers = 0;
  questions.forEach((question: QuizQuestion, index: number) => {
    if (selectedAnswers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });
  const finalScore = (correctAnswers / questions.length) * 100;
  setScore(finalScore);
  const passed = finalScore >= threshold;
  onComplete(finalScore, questions.length, passed);
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  onComplete,
  threshold,
  title = 'Topic Quiz',
  showProgress = true,
  allowRetry = true
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  useEffect(() => {
    if (isRetrying) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsCompleted(false);
      setScore(0);
      setShowResults(false);
      setIsRetrying(false);
    }
  }, [isRetrying]);

  useEffect(() => {
    if (isCompleted) {
      calculateScore(questions, selectedAnswers, threshold, onComplete, setScore);
      setShowResults(true);
    }
  }, [isCompleted, questions, selectedAnswers, threshold, onComplete]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
  };

  const getQuestionStatus = (index: number) => {
    if (selectedAnswers[index]) {
      return selectedAnswers[index] === questions[index].correctAnswer ? 'correct' : 'incorrect';
    }
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'incorrect':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return '✅';
      case 'incorrect':
        return '❌';
      default:
        return '⭕';
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Quiz Available</h2>
        <p className="text-gray-600 mb-4">There are no quiz questions available for this topic yet. Please check back later or try another topic.</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Back to Topic
        </button>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= threshold;
    const correctAnswers = Math.round((score / 100) * totalQuestions);

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title} - Results</h2>
          
          {/* Score Display */}
          <div className="mb-8">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${
              passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.round(score)}%
                </div>
                <div className="text-sm text-gray-600">
                  {correctAnswers}/{totalQuestions}
                </div>
              </div>
            </div>
          </div>

          {/* Result Message */}
          <div className={`text-xl font-semibold mb-4 ${
            passed ? 'text-green-600' : 'text-red-600'
          }`}>
            {passed ? '🎉 Congratulations! You passed the quiz!' : '😔 You need to score higher to pass.'}
          </div>

          <div className="text-gray-600 mb-8">
            <p>Threshold: {threshold}% | Your Score: {Math.round(score)}%</p>
            <p className="mt-2">
              {passed 
                ? 'You can now proceed to the next topic or continue with coding problems.'
                : 'Please review the topic and try again to meet the required threshold.'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!passed && allowRetry && (
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Retry Quiz
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Back to Topic
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const status = getQuestionStatus(index);
              const isSelected = selectedAnswers[index];
              const isCorrect = isSelected === question.correctAnswer;

              return (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getStatusIcon(status)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">
                        Question {index + 1}: {question.question}
                      </h4>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded ${
                              option === question.correctAnswer
                                ? 'bg-green-200 text-green-800'
                                : option === isSelected && !isCorrect
                                ? 'bg-red-200 text-red-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {option}
                            {option === question.correctAnswer && ' ✅'}
                            {option === isSelected && !isCorrect && ' ❌'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">
          Answer all questions to proceed. You need to score at least {threshold}% to pass.
        </p>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {answeredQuestions}/{totalQuestions} questions answered</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {questions.map((_, index) => {
          const status = getQuestionStatus(index);
          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                index === currentQuestionIndex
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : getStatusColor(status)
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Current Question */}
      <div className="mb-8">
        <div className="mb-4">
          <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswers[currentQuestionIndex] === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
        >
          Previous
        </button>
        
        <div className="flex gap-4">
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answeredQuestions < totalQuestions}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent; 