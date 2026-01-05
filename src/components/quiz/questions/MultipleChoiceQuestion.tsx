import React from 'react';
import { QuizQuestion } from '../../../types/quiz';
import { useTranslation } from '../../../hooks/useTranslation';

interface MultipleChoiceQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  isSubmitted = false,
  showCorrectAnswer = false,
  isDisabled = false,
}) => {
  const { getLocalizedContent } = useTranslation();

  const handleOptionSelect = (optionIndex: number) => {
    if (isDisabled) return;
    
    const optionValue = optionIndex.toString();
    onAnswerChange(optionValue);
  };

  const getOptionStatus = (optionIndex: number) => {
    const optionValue = optionIndex.toString();
    const isSelected = answer === optionValue;
    const isCorrect = question.correct_answer === optionValue;
    
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
    const baseClasses = 'w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md';
    
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

  if (!question.options || question.options.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">No options available for this question.</p>
      </div>
    );
  }

  return (
    <div className="multiple-choice-question">
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {getLocalizedContent(question.question)}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const status = getOptionStatus(index);
          const optionClasses = getOptionClasses(status);
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleOptionSelect(index)}
              disabled={isDisabled}
              className={optionClasses}
            >
              <div className="flex items-center">
                {/* Option Letter */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 font-medium">
                  {String.fromCharCode(65 + index)}
                </div>
                
                {/* Option Text */}
                <div className="flex-1 text-left">
                  {getLocalizedContent(option)}
                </div>
                
                {/* Status Icons */}
                {isSubmitted && showCorrectAnswer && (
                  <div className="flex-shrink-0 ml-3">
                    {status === 'correct' && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {status === 'incorrect' && (
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback */}
      {isSubmitted && (
        <div className="mt-4 p-3 rounded-lg">
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
                Incorrect. {showCorrectAnswer && `The correct answer is ${String.fromCharCode(65 + parseInt(question.correct_answer as string))}.`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};