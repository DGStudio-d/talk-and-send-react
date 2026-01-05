import React, { useState, useEffect, useCallback } from 'react';
import { Quiz, QuizQuestion, QuizAttempt, QuestionType } from '../../types/quiz';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { QuestionRenderer } from './QuestionRenderer';
import { QuizService } from '../../api/services/quizService';
import { toast } from 'sonner';

interface QuizTakerProps {
  quiz: Quiz;
  questions: QuizQuestion[];
  attempt?: QuizAttempt;
  onComplete: (attempt: QuizAttempt) => void;
  onExit: () => void;
  isPublic?: boolean;
  publicAttemptId?: string;
}

export const QuizTaker: React.FC<QuizTakerProps> = ({
  quiz,
  questions,
  attempt: initialAttempt,
  onComplete,
  onExit,
  isPublic = false,
  publicAttemptId,
}) => {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [attempt, setAttempt] = useState<QuizAttempt | null>(initialAttempt || null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  // Initialize timer
  useEffect(() => {
    if (quiz.duration_minutes && attempt) {
      const startTime = new Date(attempt.started_at).getTime();
      const durationMs = quiz.duration_minutes * 60 * 1000;
      const endTime = startTime + durationMs;

      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          handleAutoSubmit();
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [quiz.duration_minutes, attempt]);

  // Auto-save answers
  const autoSaveAnswer = useCallback(async (questionId: number, answer: string | string[]) => {
    if (!attempt) return;

    try {
      if (isPublic && publicAttemptId) {
        // For public attempts, use the public API
        await fetch(`/api/public-quiz-attempts/${publicAttemptId}/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question_id: questionId,
            answer: answer,
          }),
        });
      } else {
        // For authenticated attempts
        await QuizService.submitAnswer({
          attempt_id: attempt.id,
          question_id: questionId,
          answer: answer,
        });
      }
    } catch (error) {
      console.error('Failed to auto-save answer:', error);
      // Don't show error toast for auto-save failures to avoid spam
    }
  }, [attempt, isPublic, publicAttemptId]);

  // Handle answer change with auto-save
  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));

    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(() => {
      autoSaveAnswer(questionId, answer);
    }, 2000); // Auto-save after 2 seconds of inactivity

    setAutoSaveTimeout(timeout);
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Jump to specific question
  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Auto-submit when time runs out
  const handleAutoSubmit = async () => {
    if (!attempt) return;

    try {
      setIsSubmitting(true);
      
      let completedAttempt: QuizAttempt;
      if (isPublic && publicAttemptId) {
        const response = await fetch(`/api/public-quiz-attempts/${publicAttemptId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        completedAttempt = await response.json();
      } else {
        completedAttempt = await QuizService.completeAttempt({
          attempt_id: attempt.id,
        });
      }

      toast.success(t('quiz.autoSubmitted'));
      onComplete(completedAttempt);
    } catch (error) {
      console.error('Failed to auto-submit quiz:', error);
      toast.error(t('quiz.autoSubmitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual submit
  const handleSubmit = async () => {
    if (!attempt) return;

    // Check if all questions are answered (optional validation)
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      const confirmed = window.confirm(
        t('quiz.confirmSubmitIncomplete', { count: unansweredQuestions.length })
      );
      if (!confirmed) return;
    }

    try {
      setIsSubmitting(true);
      
      let completedAttempt: QuizAttempt;
      if (isPublic && publicAttemptId) {
        const response = await fetch(`/api/public-quiz-attempts/${publicAttemptId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        completedAttempt = await response.json();
      } else {
        completedAttempt = await QuizService.completeAttempt({
          attempt_id: attempt.id,
        });
      }

      toast.success(t('quiz.submitted'));
      onComplete(completedAttempt);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast.error(t('quiz.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time remaining
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('quiz.noQuestions')}</h3>
        <p className="text-muted-foreground mb-4">{t('quiz.noQuestionsDescription')}</p>
        <Button onClick={onExit}>{t('common.goBack')}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{quiz.title.en}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {quiz.description?.en}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {timeRemaining !== null && (
                <div className={`flex items-center space-x-2 ${
                  timeRemaining < 300000 ? 'text-red-500' : 'text-muted-foreground'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-lg">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              <Button variant="outline" onClick={onExit}>
                {t('quiz.exit')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>{t('quiz.progress')}</span>
              <span>{answeredQuestions} / {questions.length} {t('quiz.answered')}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => (
              <Button
                key={question.id}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuestionJump(index)}
                className={`relative ${
                  answers[question.id] ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {index + 1}
                {answers[question.id] && (
                  <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-500 bg-white rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <QuestionRenderer
        question={currentQuestion}
        userAnswer={answers[currentQuestion.id]}
        onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />

      {/* Navigation Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('quiz.previous')}</span>
            </Button>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                {currentQuestionIndex + 1} / {questions.length}
              </Badge>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {isSubmitting ? t('quiz.submitting') : t('quiz.submit')}
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex items-center space-x-2"
                >
                  <span>{t('quiz.next')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning for time running out */}
      {timeRemaining !== null && timeRemaining < 300000 && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                {t('quiz.timeWarning', { time: formatTime(timeRemaining) })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizTaker;