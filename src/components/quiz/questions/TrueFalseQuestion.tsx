import React from 'react';
import { QuizQuestion } from '../../../types/quiz';
import { useTranslation } from '../../../hooks/useTranslation';

interface TrueFalseQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  isSubmitted = false,
  showCorrectAnswer = false,
  isDisabled = false,
}) => {
  const { getLocalizedContent } = useTranslation();

  const handleOptionSelect = (value: 'true' | 'false') => {
    if (isDisabled) return;
    onAnswerChange(value);
  };

  const getOptionStatus = (value: 'true' | 'false') => {
    const isSelected = answer === value;
    const isCorrect = question.correct_answer === value;
    
    if (!isSubmitted) {
      return isSelected ? 'selected' : 'default';
    }
    
    if (showCorrectAnswer) {
      if (isCorrect) return 'correct';
      if (isSelected && !isCorrect) return 'incorrect';
    }
    
    return isSelected ? 'selected' : 'default';
  };

  const getOptionClasses = (status: string) => {
    const baseClasses = 'flex-1 p-4 text-center border-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium';
    
    switch (status) {
      case 'selected':
        return `${baseClasses} border-blue-500 bg-blue-50 text-blue-900`;
      case 'correct':
        return `${baseClasses} border-green-500 bg-green-50 text-green-900`;
      case 'incorrect':
        return `${baseClasses} border-red-500 bg-red-50 text-red-900`;
      default:
        return `${baseClasses} border-gray-300 bg-white text-gray-900 hover:border-gray-400`;
    }
  };

  return (
    <div className="true-false-question">
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {getLocalizedContent(question.question)}
        </h3>
      </div>

      {/* True/False Options */}
      <div className="flex gap-4">
        {/* True Option */}
        <button
          type="button"
          onClick={() => handleOptionSelect('true')}
          disabled={isDisabled}
          className={getOptionClasses(getOptionStatus('true'))}
        >
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-lg">True</span>
          </div>
          
          {/* Status Icon */}
          {isSubmitted && showCorrectAnswer && getOptionStatus('true') === 'correct' && (
            <div className="mt-2">
              <svg className="w-5 h-5 mx-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {isSubmitted && showCorrectAnswer && getOptionStatus('true') === 'incorrect' && (
            <div className="mt-2">
              <svg className="w-5 h-5 mx-auto text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>

        {/* False Option */}
        <button
          type="button"
          onClick={() => handleOptionSelect('false')}
          disabled={isDisabled}
          className={getOptionClasses(getOptionStatus('false'))}
        >
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-lg">False</span>
          </div>
          
          {/* Status Icon */}
          {isSubmitted && showCorrectAnswer && getOptionStatus('false') === 'correct' && (
            <div className="mt-2">
              <svg className="w-5 h-5 mx-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {isSubmitted && showCorrectAnswer && getOptionStatus('false') === 'incorrect' && (
            <div className="mt-2">
              <svg className="w-5 h-5 mx-auto text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Answer Feedback */}
      {isSubmitted && (
        <div className="mt-4">
          {answer === question.correct_answer ? (
            <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Correct!</span>
            </div>
          ) : (
            <div className="flex items-center text-red-700 bg-red-50 p-3 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                Incorrect. {showCorrectAnswer && `The correct answer is ${question.correct_answer === 'true' ? 'True' : 'False'}.`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};