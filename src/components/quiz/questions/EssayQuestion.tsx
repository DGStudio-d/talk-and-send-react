import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../../types/quiz';
import { useTranslation } from '../../../hooks/useTranslation';

interface EssayQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

export const EssayQuestion: React.FC<EssayQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  isSubmitted = false,
  showCorrectAnswer = false,
  isDisabled = false,
}) => {
  const { getLocalizedContent } = useTranslation();
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Initialize text from answer
  useEffect(() => {
    const initialText = Array.isArray(answer) ? answer[0] || '' : answer || '';
    setText(initialText);
    updateCounts(initialText);
  }, [answer]);

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  };

  const handleTextChange = (value: string) => {
    if (isDisabled) return;
    
    setText(value);
    updateCounts(value);
    onAnswerChange(value);
  };

  const getTextAreaClasses = () => {
    const baseClasses = 'w-full p-4 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
    
    if (isSubmitted) {
      return `${baseClasses} border-blue-300 bg-blue-50`;
    }
    
    return `${baseClasses} border-gray-300 focus:border-blue-500`;
  };

  // Suggested word count ranges based on question complexity
  const getSuggestedWordCount = () => {
    const questionLength = getLocalizedContent(question.question).length;
    if (questionLength < 100) return { min: 50, max: 150 };
    if (questionLength < 200) return { min: 100, max: 300 };
    return { min: 200, max: 500 };
  };

  const suggestedRange = getSuggestedWordCount();

  return (
    <div className="essay-question">
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {getLocalizedContent(question.question)}
        </h3>
      </div>

      {/* Writing Guidelines */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Writing Guidelines:</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Write a clear and well-structured response</li>
          <li>• Support your points with examples or evidence</li>
          <li>• Suggested length: {suggestedRange.min}-{suggestedRange.max} words</li>
          <li>• Check your grammar and spelling before submitting</li>
        </ul>
      </div>

      {/* Text Area */}
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          disabled={isDisabled}
          className={getTextAreaClasses()}
          rows={12}
          placeholder="Write your answer here..."
        />
      </div>

      {/* Word and Character Count */}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <div className="flex space-x-4">
          <span className={wordCount < suggestedRange.min ? 'text-orange-600' : wordCount > suggestedRange.max ? 'text-red-600' : 'text-green-600'}>
            Words: {wordCount}
          </span>
          <span>Characters: {charCount}</span>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500">
            Suggested: {suggestedRange.min}-{suggestedRange.max} words
          </div>
          {wordCount < suggestedRange.min && (
            <div className="text-xs text-orange-600">
              Consider adding more detail
            </div>
          )}
          {wordCount > suggestedRange.max && (
            <div className="text-xs text-red-600">
              Consider being more concise
            </div>
          )}
        </div>
      </div>

      {/* Writing Tips */}
      {!isSubmitted && text.length < 50 && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-2">Writing Tips:</h5>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Start with a clear introduction</li>
            <li>• Organize your thoughts into paragraphs</li>
            <li>• Use specific examples to support your points</li>
            <li>• End with a strong conclusion</li>
          </ul>
        </div>
      )}

      {/* Submission Status */}
      {isSubmitted && (
        <div className="mt-4">
          <div className="flex items-center text-blue-700 bg-blue-50 p-3 rounded-lg">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="font-medium">Answer submitted successfully!</span>
              <div className="text-sm mt-1">
                Your essay ({wordCount} words) has been recorded and will be reviewed.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Answer (if provided and showing correct answers) */}
      {isSubmitted && showCorrectAnswer && question.correct_answer && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Sample Answer:</h4>
          <div className="text-green-800 text-sm leading-relaxed whitespace-pre-wrap">
            {Array.isArray(question.correct_answer) 
              ? question.correct_answer[0] 
              : question.correct_answer}
          </div>
        </div>
      )}

      {/* Auto-save indicator */}
      {!isSubmitted && text.length > 0 && (
        <div className="flex items-center justify-end text-xs text-gray-500 mt-2">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Answer saved automatically
        </div>
      )}
    </div>
  );
};