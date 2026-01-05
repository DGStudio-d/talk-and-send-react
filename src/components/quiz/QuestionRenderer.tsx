import React from 'react';
import { QuizQuestion, QuestionType, LocalizedContent } from '../../types/quiz';
import { useTranslation } from '../../hooks/useTranslation';
import { MultipleChoiceQuestion } from './questions/MultipleChoiceQuestion';
import { TrueFalseQuestion } from './questions/TrueFalseQuestion';
import { FillInBlankQuestion } from './questions/FillInBlankQuestion';
import { EssayQuestion } from './questions/EssayQuestion';
import { ImageBasedQuestion } from './questions/ImageBasedQuestion';
import { AudioBasedQuestion } from './questions/AudioBasedQuestion';
import { VideoBasedQuestion } from './questions/VideoBasedQuestion';

interface QuestionRendererProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
  isSubmitted = false,
  showCorrectAnswer = false,
  isDisabled = false,
  className = '',
}) => {
  const { getLocalizedContent } = useTranslation();

  const commonProps = {
    question,
    questionNumber,
    totalQuestions,
    answer,
    onAnswerChange,
    isSubmitted,
    showCorrectAnswer,
    isDisabled,
  };

  const renderQuestionByType = () => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return <MultipleChoiceQuestion {...commonProps} />;
      
      case QuestionType.TRUE_FALSE:
        return <TrueFalseQuestion {...commonProps} />;
      
      case QuestionType.FILL_IN_BLANK:
        return <FillInBlankQuestion {...commonProps} />;
      
      case QuestionType.ESSAY:
        return <EssayQuestion {...commonProps} />;
      
      case QuestionType.IMAGE_BASED:
        return <ImageBasedQuestion {...commonProps} />;
      
      case QuestionType.AUDIO_BASED:
        return <AudioBasedQuestion {...commonProps} />;
      
      case QuestionType.VIDEO_BASED:
        return <VideoBasedQuestion {...commonProps} />;
      
      default:
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              Unsupported question type: {question.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`question-renderer ${className}`}>
      {/* Question Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Reading Text (if provided) */}
      {question.reading_text && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Reading Passage:</h4>
          <div className="text-blue-800 leading-relaxed">
            {getLocalizedContent(question.reading_text)}
          </div>
        </div>
      )}

      {/* Question Content */}
      <div className="question-content">
        {renderQuestionByType()}
      </div>

      {/* Explanation (shown after submission if available) */}
      {isSubmitted && question.explanation && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
          <div className="text-gray-700">
            {getLocalizedContent(question.explanation)}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;