
import React, { useState } from 'react';
import type { QuizQuestion } from '../types';
import { Icon } from './Icon';

interface QuizViewProps {
  questions: QuizQuestion[] | null;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No quiz available. Generate one from your document!</p>
      </div>
    );
  }

  const handleAnswerSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };
  
  const handleRetake = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const score = Object.keys(selectedAnswers).reduce((acc, indexStr) => {
    const index = parseInt(indexStr, 10);
    if (selectedAnswers[index] === questions[index].correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  if (isSubmitted) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Results</h2>
        <p className="text-lg font-medium text-slate-600 mb-6">
          You scored <span className="text-blue-600 font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>!
        </p>
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-3">{index + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((option) => {
                  const isCorrect = option === q.correctAnswer;
                  const isSelected = selectedAnswers[index] === option;
                  const isIncorrectSelection = isSelected && !isCorrect;

                  let optionClass = 'flex items-center space-x-3 p-3 rounded-md transition-all text-sm ';
                  if (isCorrect) {
                    optionClass += 'bg-green-100 text-green-800 font-semibold';
                  } else if (isIncorrectSelection) {
                    optionClass += 'bg-red-100 text-red-800';
                  } else {
                    optionClass += 'bg-slate-100 text-slate-700';
                  }

                  return (
                    <div key={option} className={optionClass}>
                      {isCorrect && <Icon name="check" className="w-5 h-5 text-green-600" />}
                      {isIncorrectSelection && <Icon name="x" className="w-5 h-5 text-red-600" />}
                      {!isCorrect && !isIncorrectSelection && <div className="w-5 h-5"></div>}
                      <span>{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={handleRetake} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Quiz Time!</h2>
      <div className="mb-4 text-sm text-slate-500">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-lg font-semibold text-slate-800 mb-5">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all text-slate-700 ${
                selectedAnswers[currentQuestionIndex] === option
                  ? 'bg-blue-100 border-blue-500 font-semibold'
                  : 'bg-white border-slate-200 hover:border-blue-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button onClick={handleSubmit} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
