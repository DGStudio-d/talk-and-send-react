import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { QuizQuestion } from '../../types/models';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

interface QuizQuestionDisplayProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  onSelectOption?: (option: 'A' | 'B' | 'C' | 'D') => void;
  showCorrectAnswer?: boolean;
}

export const QuizQuestionDisplay: React.FC<QuizQuestionDisplayProps> = React.memo(({
  question,
  questionNumber,
  selectedOption,
  onSelectOption,
  showCorrectAnswer = false,
}) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();

  // Questions are in single language (quiz's target language)
  const questionText = question.question_text;
  
  const options = useMemo(() => [
    { label: 'A' as const, text: question.option_a },
    { label: 'B' as const, text: question.option_b },
    { label: 'C' as const, text: question.option_c },
    { label: 'D' as const, text: question.option_d },
  ], [question.option_a, question.option_b, question.option_c, question.option_d]);
  
  const explanation = question.explanation;

  const getOptionClassName = useCallback((optionLabel: 'A' | 'B' | 'C' | 'D') => {
  const isSelected = selectedOption === optionLabel;
  const isCorrect = question.correct_option === optionLabel;

  if (showCorrectAnswer) {
    if (isCorrect) return 'border-green-500 bg-green-50 text-green-800';
    if (isSelected && !isCorrect) return 'border-red-500 bg-red-50 text-red-800';
    return 'border-gray-200 bg-white text-gray-800';
  }

  if (isSelected) return 'border-primary bg-primary/10 text-primary-900';
  return 'border-gray-200 bg-white hover:border-primary/60';
}, [selectedOption, question.correct_option, showCorrectAnswer]);

  const getOptionIcon = useCallback((optionLabel: 'A' | 'B' | 'C' | 'D') => {
    if (!showCorrectAnswer) return null;

    const isCorrect = question.correct_option === optionLabel;
    const isSelected = selectedOption === optionLabel;

    if (isCorrect) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (isSelected && !isCorrect) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return null;
  }, [showCorrectAnswer, question.correct_option, selectedOption]);

  const getOptionAriaLabel = useCallback((optionLabel: 'A' | 'B' | 'C' | 'D', optionText: string) => {
    if (showCorrectAnswer) {
      const isCorrect = question.correct_option === optionLabel;
      const isSelected = selectedOption === optionLabel;
      
      if (isCorrect) {
        return t('quiz.correctAnswer', { option: optionLabel, text: optionText });
      }
      if (isSelected && !isCorrect) {
        return t('quiz.incorrectAnswer', { option: optionLabel, text: optionText });
      }
    }
    
    const isSelected = selectedOption === optionLabel;
    return isSelected 
      ? t('quiz.selectedOption', { option: optionLabel, text: optionText })
      : t('quiz.option', { option: optionLabel, text: optionText });
  }, [showCorrectAnswer, question.correct_option, selectedOption, t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl" id={`question-${questionNumber}-title`}>
          {t('quiz.questionNumber', { number: questionNumber })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Text */}
        <p 
          className="text-lg font-medium" 
          id={`question-${questionNumber}-text`}
          role="heading"
          aria-level={3}
        >
          {questionText}
        </p>

        {/* Options */}
        <div 
          className="space-y-3" 
          role="radiogroup"
          aria-labelledby={`question-${questionNumber}-text`}
          aria-required={!showCorrectAnswer}
        >
          {options.map((option) => (
            <div
              key={option.label}
              onClick={() => !showCorrectAnswer && onSelectOption?.(option.label)}
              role="radio"
              aria-checked={selectedOption === option.label}
              aria-label={getOptionAriaLabel(option.label, option.text)}
              className={cn(
                'w-full cursor-pointer select-none border rounded-xl p-4 text-left flex items-start gap-3 transition-all duration-200',
                'hover:shadow-sm active:scale-[0.99]',
                showCorrectAnswer ? 'cursor-default' : '',
                getOptionClassName(option.label)
              )}
            >
              <span className="font-bold flex-shrink-0" aria-hidden="true">{option.label}.</span>
              <span className="flex-1 leading-relaxed">{option.text}</span>
              {getOptionIcon(option.label)}
            </div>
          ))}
        </div>

        {/* Explanation (shown in results mode) */}
        {showCorrectAnswer && explanation && (
          <div 
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md"
            role="region"
            aria-label={t('quiz.explanationRegion')}
          >
            <p className="text-sm font-semibold text-blue-900 mb-1">
              {t('quiz.explanation')}
            </p>
            <p className="text-sm text-blue-800">{explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
