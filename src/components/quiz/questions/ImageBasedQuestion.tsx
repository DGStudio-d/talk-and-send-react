import React, { useState } from 'react';
import { QuizQuestion } from '../../../types/quiz';
import { useTranslation } from '../../../hooks/useTranslation';

interface ImageBasedQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

export const ImageBasedQuestion: React.FC<ImageBasedQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  isSubmitted = false,
  showCorrectAnswer = false,
  isDisabled = false,
}) => {
  const { getLocalizedContent } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

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

  if (!question.media_url) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">No image provided for this question.</p>
      </div>
    );
  }

  if (!question.options || question.options.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">No options available for this image-based question.</p>
      </div>
    );
  }

  return (
    <div className="image-based-question">
      {/* Image Display */}
      <div className="mb-6">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="flex items-center justify-center h-64 bg-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading image...</span>
            </div>
          )}
          
          {imageError && (
            <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-600">Failed to load image</p>
                <button
                  onClick={() => {
                    setImageError(false);
                    setImageLoaded(false);
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
          
          <img
            src={question.media_url}
            alt="Question image"
            className={`w-full h-auto max-h-96 object-contain cursor-pointer transition-opacity ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            onClick={() => setIsImageExpanded(true)}
          />
          
          {imageLoaded && (
            <button
              onClick={() => setIsImageExpanded(true)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              title="Expand image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>
          )}
        </div>
        
        {imageLoaded && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Click image to expand
          </p>
        )}
      </div>

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
                Incorrect. {showCorrectAnswer && `The correct answer is ${String.fromCharCode(65 + parseInt(question.correct_answer as string))}.`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Image Expansion Modal */}
      {isImageExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-full max-h-full">
            <img
              src={question.media_url}
              alt="Expanded question image"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};