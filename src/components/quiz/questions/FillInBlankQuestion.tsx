import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../../types/quiz';
import { useTranslation } from '../../../hooks/useTranslation';

interface FillInBlankQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

export const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  isSubmitted = false,
  showCorrectAnswer = false,
  isDisabled = false,
}) => {
  const { getLocalizedContent } = useTranslation();
  const [blanks, setBlanks] = useState<string[]>([]);

  // Parse question text to find blanks (marked with _____ or [blank])
  const parseQuestionText = (text: string) => {
    const blankPattern = /(_____|\[blank\]|\{\})/g;
    const parts = text.split(blankPattern);
    const blankCount = (text.match(blankPattern) || []).length;
    
    return { parts, blankCount };
  };

  const questionText = getLocalizedContent(question.question);
  const { parts, blankCount } = parseQuestionText(questionText);

  // Initialize blanks array
  useEffect(() => {
    if (Array.isArray(answer)) {
      setBlanks(answer.slice(0, blankCount));
    } else if (answer) {
      // Single answer - put it in the first blank
      setBlanks([answer, ...Array(Math.max(0, blankCount - 1)).fill('')]);
    } else {
      setBlanks(Array(blankCount).fill(''));
    }
  }, [answer, blankCount]);

  const handleBlankChange = (index: number, value: string) => {
    if (isDisabled) return;
    
    const newBlanks = [...blanks];
    newBlanks[index] = value;
    setBlanks(newBlanks);
    
    // If only one blank, send as string, otherwise as array
    if (blankCount === 1) {
      onAnswerChange(newBlanks[0] || '');
    } else {
      onAnswerChange(newBlanks);
    }
  };

  const getCorrectAnswers = (): string[] => {
    if (Array.isArray(question.correct_answer)) {
      return question.correct_answer;
    }
    return [question.correct_answer as string];
  };

  const isBlankCorrect = (index: number): boolean => {
    const correctAnswers = getCorrectAnswers();
    const userAnswer = blanks[index]?.toLowerCase().trim() || '';
    const correctAnswer = correctAnswers[index]?.toLowerCase().trim() || '';
    
    return userAnswer === correctAnswer;
  };

  const getBlankStatus = (index: number) => {
    if (!isSubmitted) return 'default';
    if (showCorrectAnswer) {
      return isBlankCorrect(index) ? 'correct' : 'incorrect';
    }
    return 'submitted';
  };

  const getBlankClasses = (status: string) => {
    const baseClasses = 'inline-block min-w-[120px] px-3 py-2 border-b-2 bg-transparent text-center font-medium focus:outline-none transition-colors';
    
    switch (status) {
      case 'correct':
        return `${baseClasses} border-green-500 text-green-700 bg-green-50`;
      case 'incorrect':
        return `${baseClasses} border-red-500 text-red-700 bg-red-50`;
      case 'submitted':
        return `${baseClasses} border-blue-500 text-blue-700`;
      default:
        return `${baseClasses} border-gray-400 text-gray-900 focus:border-blue-500`;
    }
  };

  if (blankCount === 0) {
    return (
      <div className="fill-in-blank-question">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
            {questionText}
          </h3>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            No blanks found in this question. Please add blanks using _____ or [blank] markers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fill-in-blank-question">
      {/* Question Text with Blanks */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          <span className="inline-flex flex-wrap items-baseline gap-1">
            {parts.map((part, index) => {
              const isBlank = part === '_____' || part === '[blank]' || part === '{}';
              
              if (isBlank) {
                const blankIndex = Math.floor(index / 2); // Every other part is a blank
                const status = getBlankStatus(blankIndex);
                
                return (
                  <input
                    key={index}
                    type="text"
                    value={blanks[blankIndex] || ''}
                    onChange={(e) => handleBlankChange(blankIndex, e.target.value)}
                    disabled={isDisabled}
                    className={getBlankClasses(status)}
                    placeholder="___"
                    autoComplete="off"
                  />
                );
              }
              
              return <span key={index}>{part}</span>;
            })}
          </span>
        </h3>
      </div>

      {/* Separate Input Fields (Alternative Layout) */}
      {blankCount > 1 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Fill in the blanks:</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: blankCount }, (_, index) => {
              const status = getBlankStatus(index);
              
              return (
                <div key={index} className="flex items-center">
                  <label className="text-sm font-medium text-gray-600 mr-3 min-w-[60px]">
                    Blank {index + 1}:
                  </label>
                  <input
                    type="text"
                    value={blanks[index] || ''}
                    onChange={(e) => handleBlankChange(index, e.target.value)}
                    disabled={isDisabled}
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      status === 'correct' 
                        ? 'border-green-500 bg-green-50' 
                        : status === 'incorrect'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder={`Answer for blank ${index + 1}`}
                    autoComplete="off"
                  />
                  
                  {/* Status Icon */}
                  {isSubmitted && showCorrectAnswer && (
                    <div className="ml-2">
                      {status === 'correct' ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Answer Feedback */}
      {isSubmitted && (
        <div className="mt-4">
          {blanks.every((_, index) => isBlankCorrect(index)) ? (
            <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">All blanks correct!</span>
            </div>
          ) : (
            <div className="text-red-700 bg-red-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Some answers are incorrect.</span>
              </div>
              
              {showCorrectAnswer && (
                <div className="text-sm">
                  <p className="font-medium mb-1">Correct answers:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {getCorrectAnswers().map((correctAnswer, index) => (
                      <li key={index}>
                        Blank {index + 1}: <span className="font-medium">{correctAnswer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};