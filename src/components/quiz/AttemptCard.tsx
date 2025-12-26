import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Target, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { QuizAttempt } from '../../types/models';
import { useLanguage } from '../../contexts/LanguageContext';

interface AttemptCardProps {
  attempt: QuizAttempt;
}

export const AttemptCard: React.FC<AttemptCardProps> = React.memo(({ attempt }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  // Get localized quiz title
  const quizTitle = useMemo(() => {
    if (!attempt.quiz) {
      return t('quiz.deletedQuiz');
    }
    return attempt.quiz.title?.[locale] || attempt.quiz.title?.en || t('quiz.untitled');
  }, [attempt.quiz, locale, t]);

  // Check if quiz is deleted
  const isQuizDeleted = useMemo(
    () => !attempt.quiz || attempt.quiz.is_deleted,
    [attempt.quiz]
  );

  // Format date
  const formattedDate = useMemo(() => {
    const dateString = attempt.completed_at || attempt.started_at;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, [attempt.completed_at, attempt.started_at, locale]);

  const handleClick = useCallback(() => {
    navigate(`/attempts/${attempt.id}/results`);
  }, [navigate, attempt.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const statusText = attempt.is_passed ? t('quiz.passed') : t('quiz.failed');

  return (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-primary-500"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={t('quiz.viewAttemptResults', { 
        title: quizTitle, 
        status: statusText,
        score: attempt.percentage 
      })}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">
            {quizTitle}
            {isQuizDeleted && (
              <span className="text-sm text-gray-500 ml-2">({t('quiz.deleted')})</span>
            )}
          </CardTitle>
          {attempt.is_passed ? (
            <Badge 
              className="bg-green-500 hover:bg-green-600 flex-shrink-0"
              aria-label={t('quiz.passedStatus')}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" />
              {t('quiz.passed')}
            </Badge>
          ) : (
            <Badge 
              variant="destructive" 
              className="flex-shrink-0"
              aria-label={t('quiz.failedStatus')}
            >
              <XCircle className="w-3 h-3 mr-1" aria-hidden="true" />
              {t('quiz.failed')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" aria-hidden="true" />
            <span>
              {t('quiz.score')}: {attempt.correct_answers}/{attempt.total_questions} ({attempt.percentage}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
