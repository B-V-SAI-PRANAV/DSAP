import React, { useState } from 'react';
import { Modal } from '@mui/material';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizModalProps {
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ questions, onComplete, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      const percentage = (score / questions.length) * 100;
      setShowResult(true);
      onComplete(percentage, percentage >= 70);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      className="flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        {!showResult ? (
          <>
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <h2 className="text-xl font-bold mb-2">{currentQuestion.question}</h2>
            </div>
            
            <div className="space-y-2 mb-6">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className={`px-4 py-2 rounded ${
                  selectedAnswer ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
            <p className="text-lg mb-4">
              You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </p>
            <p className="mb-6">
              {score >= questions.length * 0.7 ? (
                <span className="text-green-600 font-medium">Congratulations! You passed!</span>
              ) : (
                <span className="text-red-600 font-medium">Please review the material and try again.</span>
              )}
            </p>
            <button
              onClick={() => onClose()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuizModal;
