import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, FileQuestion, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Quiz } from '../../types/models';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuizCardProps {
  quiz: Quiz;
}

export const QuizCard: React.FC<QuizCardProps> = React.memo(({ quiz }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  // Get localized title
  const title = quiz.title[locale] || quiz.title.en;

  const handleClick = useCallback(() => {
    navigate(`/quizzes/${quiz.id}`);
  }, [navigate, quiz.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const languageName = quiz.language?.name || quiz.language?.name_en || quiz.language?.code || 'Unknown';

  return (
    <Card
  className="group relative h-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm 
             transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary-500"
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  tabIndex={0}
  role="button"
  aria-label={t('quiz.viewQuizDetails', { title, level: quiz.level, language: languageName })}
>
  {/* Header */}
  <div className="flex items-start justify-between">
    <div>
      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</CardTitle>
      <Badge
        className="mt-2 bg-primary-500/10 text-primary-700 border border-primary-200 px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wide"
        aria-label={t('quiz.levelLabel', { level: quiz.level })}
      >
        {quiz.level}
      </Badge>
    </div>

    {quiz.language?.flag_url && (
      <img
        src={quiz.language.flag_url}
        alt={t('quiz.languageFlag', { language: languageName })}
        className="w-8 h-6 object-cover rounded shadow-sm"
        loading="lazy"
      />
    )}
  </div>

  {/* Content */}
  <div className="mt-4 space-y-2 text-sm text-gray-600">
    <div className="flex items-center gap-2">
      <FileQuestion className="w-4 h-4 text-primary-500" aria-hidden="true" />
      <span>{quiz.questions_count || 0} {t('quiz.questions')}</span>
    </div>

    {quiz.duration_minutes && (
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary-500" aria-hidden="true" />
        <span>{quiz.duration_minutes} {t('quiz.minutes')}</span>
      </div>
    )}

    <div className="flex items-center gap-2">
      <Target className="w-4 h-4 text-primary-500" aria-hidden="true" />
      <span>{t('quiz.passingScore')}: <span className="font-medium">{quiz.passing_score}%</span></span>
    </div>
  </div>

  {/* Subtle hover accent */}
  <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500/0 group-hover:bg-primary-500/80 transition-all duration-300 rounded-b-2xl" />
</Card>

  );
});
