import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Target, 
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { QuizQuestionDisplay } from '../../components/quiz/QuizQuestionDisplay';
import { useQuizAttemptResults } from '../../hooks/useQuizAttempts';
import { useStartQuizAttempt } from '../../hooks/useQuizAttempts';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';
import MainLayout from '../../components/layout/MainLayout';

export const QuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const attemptId = parseInt(id || '0');
  const { data: attempt, isLoading, isError } = useQuizAttemptResults(attemptId);
  const startAttemptMutation = useStartQuizAttempt();

  const handleRetakeQuiz = async () => {
    if (!attempt?.quiz_id) return;

    try {
      const newAttempt = await startAttemptMutation.mutateAsync(attempt.quiz_id);
      navigate(`/quizzes/${attempt.quiz_id}/take/${newAttempt.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('quiz.errorStartingQuiz'));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !attempt) {
    return (
      <MainLayout>
        <Card className="p-6">
          <div className="text-center space-y-4">
            <p className="text-red-600">{t('quiz.errorLoadingResults')}</p>
            <Button onClick={() => navigate('/attempts')}>{t('quiz.backToAttempts')}</Button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  const quizTitle = attempt.quiz?.title[locale] || attempt.quiz?.title.en || t('quiz.untitled');
  const isPassed = attempt?.attempt.is_passed;

 // Create a question list directly from answers
  const questions = attempt.answers?.map(a => a.question) || [];

  // Create map for selected answers
  const answersMap = new Map(
    attempt.answers?.map((answer) => [answer.quiz_question_id, answer]) || []
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Results Summary Card */}
      <Card className={isPassed ? 'border-green-500' : 'border-red-500'}>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-2xl">{quizTitle}</CardTitle>
            <Badge
              variant={isPassed ? 'default' : 'destructive'}
              className={isPassed ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {isPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {t('quiz.passed')}
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-1" />
                  {t('quiz.failed')}
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Visual Indicator */}
          <div className="flex justify-center mb-6">
            {isPassed ? (
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">{t('quiz.score')}</p>
                <p className="text-2xl font-bold">
                  {attempt?.attempt.correct_answers}/{attempt?.attempt.total_questions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">{t('quiz.percentage')}</p>
                <p className="text-2xl font-bold">{attempt?.attempt .percentage}%</p>
              </div>
            </div>

            {attempt.duration && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">{t('quiz.duration')}</p>
                  <p className="text-2xl font-bold">{attempt.duration}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/quizzes')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('quiz.backToQuizzes')}
            </Button>
            <Button
              onClick={handleRetakeQuiz}
              disabled={startAttemptMutation.isPending}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {startAttemptMutation.isPending ? t('quiz.starting') : t('quiz.retakeQuiz')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('quiz.reviewAnswers')}</h2>
      
      {questions.length ? (
        questions.map((question, index) => {
          const answer = answersMap.get(question.id);
          return (
            <QuizQuestionDisplay
              key={question.id}
              question={question}
              questionNumber={index + 1}
              selectedOption={answer?.selected_option}
              showCorrectAnswer
            />
          );
        })
      ) : (
        <p className="text-gray-500">{t('quiz.noQuestionsAvailable')}</p>
      )}
    </div>
      </div>
    </MainLayout>
  );
};

export default QuizResults;
