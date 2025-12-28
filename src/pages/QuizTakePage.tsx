import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  Timer,
  CheckCircle,
} from 'lucide-react';

import { usePublicQuiz, usePublicQuizQuestions } from '../hooks/useQuiz';
import { useTranslation } from '../hooks/useTranslation';
import { QuizQuestion } from '../api/types';

interface QuizAnswer {
  questionId: number;
  selectedOption?: string;
  answerText?: string;
  selectedOptions?: string[];
}

export const QuizTakePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, getLocalized, formatTime } = useTranslation();
  
  // API hooks
  const { data: quiz, loading: quizLoading, error: quizError } = usePublicQuiz(parseInt(id || '0'));
  const { data: questions = [], loading: questionsLoading, error: questionsError } = usePublicQuizQuestions(parseInt(id || '0'));
  
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, QuizAnswer>>(new Map());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const loading = quizLoading || questionsLoading;
  const error = quizError || questionsError;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle answer change
  const handleAnswerChange = useCallback((questionId: number, answer: Partial<QuizAnswer>) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      const existingAnswer = newAnswers.get(questionId) || { questionId };
      newAnswers.set(questionId, { ...existingAnswer, ...answer });
      return newAnswers;
    });
  }, []);

  // Navigation functions
  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
    setSheetOpen(false);
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Submit quiz
  const handleSubmit = useCallback(async () => {
    if (!quiz) return;

    const unansweredCount = questions.length - answers.size;
    if (unansweredCount > 0) {
      setSubmitDialogOpen(true);
      return;
    }

    await submitQuiz();
  }, [quiz, questions.length, answers.size]);

  const submitQuiz = useCallback(async () => {
    if (!quiz) return;

    try {
      setSubmitting(true);
      
      // Convert answers to API format
      const answersArray = Array.from(answers.values());
      
      // Here you would call the API to submit the quiz
      // For now, we'll simulate the submission and navigate to results
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to results page with quiz data
      navigate(`/quiz/${quiz.id}/results`, {
        state: {
          quiz,
          answers: answersArray,
          timeElapsed,
        }
      });

    } catch (err: any) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
      setSubmitDialogOpen(false);
    }
  }, [quiz, answers, timeElapsed, navigate]);

  // Render question content based on type
  const renderQuestionContent = useCallback((question: QuizQuestion) => {
    const answer = answers.get(question.id);

    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={answer?.selectedOption || ''}
            onValueChange={(value) => handleAnswerChange(question.id, { selectedOption: value })}
            className="space-y-3"
          >
            {question.options?.map((option, index) => {
              const optionKey = String.fromCharCode(65 + index); // A, B, C, D...
              return (
                <div key={optionKey} className="flex items-center space-x-2">
                  <RadioGroupItem value={optionKey} id={`option-${optionKey}`} />
                  <Label htmlFor={`option-${optionKey}`} className="flex-1 cursor-pointer">
                    {getLocalized(option)}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        );

      case 'true_false':
        return (
          <RadioGroup
            value={answer?.selectedOption || ''}
            onValueChange={(value) => handleAnswerChange(question.id, { selectedOption: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="A" id="true-option" />
              <Label htmlFor="true-option" className="cursor-pointer">{t('option.true')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="B" id="false-option" />
              <Label htmlFor="false-option" className="cursor-pointer">{t('option.false')}</Label>
            </div>
          </RadioGroup>
        );

      case 'fill_blank':
        return (
          <Input
            placeholder={t('quizTake.enterAnswer')}
            value={answer?.answerText || ''}
            onChange={(e) => handleAnswerChange(question.id, { answerText: e.target.value })}
            className="w-full"
          />
        );

      case 'essay':
        return (
          <Textarea
            placeholder={t('quizTake.writeEssay')}
            value={answer?.answerText || ''}
            onChange={(e) => handleAnswerChange(question.id, { answerText: e.target.value })}
            className="w-full min-h-32"
          />
        );

      default:
        return <p className="text-red-500">{t('error.somethingWrong')}</p>;
    }
  }, [answers, handleAnswerChange, getLocalized, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('quizTake.loadingQuiz')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Alert className="mb-6 max-w-md">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/')}>
          {t('quizTake.backToHome')}
        </Button>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold mb-4">{t('quizTake.noQuestions')}</h2>
        <Button onClick={() => navigate('/')}>
          {t('quizTake.backToHome')}
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const unansweredCount = questions.length - answers.size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('quizTake.exitQuiz')}
            </Button>
            <h1 className="text-xl font-semibold">{getLocalized(quiz.title)}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span className="font-mono font-bold">
                {formatTime(timeElapsed)}
              </span>
            </div>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{t('quizTake.questionsOverview')}</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-2">
                  {questions.map((question, index) => {
                    const isAnswered = answers.has(question.id);
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <Button
                        key={question.id}
                        variant={isCurrent ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => goToQuestion(index)}
                      >
                        <Avatar className="h-6 w-6 mr-3">
                          <AvatarFallback className={`text-xs ${
                            isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : isAnswered
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200'
                          }`}>
                            {index + 1}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="font-medium">
                            {t('quizTake.questionOf', { current: index + 1, total: questions.length })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isAnswered ? t('quizTake.answered') : t('quizTake.notAnswered')}
                          </div>
                        </div>
                        {isAnswered && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </Button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Question Info */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <div className="font-medium">
            {t('quizTake.questionOf', { current: currentQuestionIndex + 1, total: questions.length })}
          </div>
          <div className="text-sm text-muted-foreground">
            {answers.size} {t('quizList.answered')}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 p-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              {getLocalized(currentQuestion.question)}
            </h2>
            
            {currentQuestion.reading_text && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  {t('quizTake.readingText')}
                </p>
                <p className="text-sm">
                  {getLocalized(currentQuestion.reading_text)}
                </p>
              </div>
            )}

            <div className="mt-6">
              {renderQuestionContent(currentQuestion)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-4">
          {currentQuestionIndex > 0 && (
            <Button
              variant="outline"
              onClick={previousQuestion}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('button.previous')}
            </Button>
          )}
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={nextQuestion}
              className="flex-1"
            >
              {t('button.next')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? t('quizTake.submitting') : t('quizTake.submitQuiz')}
            </Button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('quizTake.submitConfirm')}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            {t('quizTake.unansweredQuestions', { count: unansweredCount })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              {t('quizTake.continueQuiz')}
            </Button>
            <Button onClick={submitQuiz} disabled={submitting}>
              {submitting ? t('quizTake.submitting') : t('quizTake.submitAnyway')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizTakePage;