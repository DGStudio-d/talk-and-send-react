import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { QuizQuestionDisplay } from '../../components/quiz/QuizQuestionDisplay';
import { QuizTimer } from '../../components/quiz/QuizTimer';
import { useQuizAttempt } from '../../hooks/useQuizAttempts';
import { useSubmitQuizAttempt } from '../../hooks/useQuizAttempts';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';
import MainLayout from '../../components/layout/MainLayout';

export const TakeQuiz: React.FC = () => {
  const { quizId, attemptId } = useParams<{ quizId: string; attemptId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const attemptIdNum = parseInt(attemptId || '0');
  const { data: attempt, isLoading, isError } = useQuizAttempt(attemptIdNum);
  const submitMutation = useSubmitQuizAttempt();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Warn user before leaving page if quiz is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitting && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers, isSubmitting]);

  const questions = attempt?.quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    if (currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: option,
      }));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmitDialog(false);

    try {
      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        quiz_question_id: parseInt(questionId),
        selected_option: selectedOption,
      }));

      await submitMutation.mutateAsync({
        id: attemptIdNum,
        answers: formattedAnswers,
      });

      toast.success(t('quiz.quizSubmitted'));
      navigate(`/attempts/${attemptIdNum}/results`);
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || t('quiz.errorSubmittingQuiz'));
    }
  };

  const handleTimeUp = useCallback(() => {
    toast.warning(t('quiz.timeUp'));
    handleConfirmSubmit();
  }, [answers, attemptIdNum]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-96 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !attempt || !attempt.quiz) {
    return (
      <MainLayout>
        <Card className="p-6">
          <div className="text-center space-y-4">
            <p className="text-red-600">{t('quiz.errorLoadingAttempt')}</p>
            <Button onClick={() => navigate('/quizzes')}>{t('quiz.backToQuizzes')}</Button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  const quizTitle = attempt.quiz.title[locale] || attempt.quiz.title.en;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <MainLayout>
      <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">{quizTitle}</h1>
              <p className="text-sm text-muted-foreground">
                {t('quiz.questionProgress', {
                  current: currentQuestionIndex + 1,
                  total: questions.length,
                })} • {t('quiz.answered')}: {answeredCount}/{questions.length}
              </p>
            </div>
            {attempt.quiz.duration_minutes && (
              <QuizTimer
                durationMinutes={attempt.quiz.duration_minutes}
                onTimeUp={handleTimeUp}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Display */}
      {currentQuestion && (
        <QuizQuestionDisplay
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedOption={answers[currentQuestion.id]}
          onSelectOption={handleSelectOption}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('quiz.previous')}
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmitClick}
            className="bg-primary-500 hover:bg-primary-600"
            disabled={isSubmitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {t('quiz.submitQuiz')}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-primary-500 hover:bg-primary-600"
          >
            {t('quiz.next')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quiz.confirmSubmit')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quiz.confirmSubmitMessage', {
                answered: answeredCount,
                total: questions.length,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              {t('quiz.submit')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </div>
    </MainLayout>
  );
};

export default TakeQuiz;
