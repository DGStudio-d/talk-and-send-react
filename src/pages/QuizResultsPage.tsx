import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  XCircle,
  Home,
  RotateCcw,
  Trophy,
  Clock,
  Target,
} from 'lucide-react';

import { Quiz } from '../api/types';
import { useTranslation } from '../hooks/useTranslation';

interface QuizAnswer {
  questionId: number;
  selectedOption?: string;
  answerText?: string;
  selectedOptions?: string[];
}

interface LocationState {
  quiz: Quiz;
  answers: QuizAnswer[];
  timeElapsed: number;
}

export const QuizResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, getLocalized, formatTime, formatDate } = useTranslation();
  
  const state = location.state as LocationState;
  
  if (!state || !state.quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold mb-4">{t('quizResults.notFound')}</h2>
        <Button onClick={() => navigate('/')}>
          {t('quizTake.backToHome')}
        </Button>
      </div>
    );
  }

  const { quiz, answers, timeElapsed } = state;
  
  // Calculate results (this would normally come from the API)
  const totalQuestions = 10; // This should come from the actual quiz data
  const correctAnswers = Math.floor(Math.random() * totalQuestions); // Simulate correct answers
  const score = (correctAnswers / totalQuestions) * 100;
  const passed = score >= (quiz.passing_score || 70);

  const StatCard: React.FC<{ label: string; value: string; color: string; icon: React.ReactNode }> = ({ label, value, color, icon }) => (
    <Card>
      <CardContent className="text-center p-6">
        <div className="flex justify-center mb-2">
          {icon}
        </div>
        <div className={`text-3xl font-bold mb-1 ${color}`}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground">
          {label}
        </div>
      </CardContent>
    </Card>
  );

  const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex py-2">
      <div className="min-w-24 font-medium text-sm">
        {label}:
      </div>
      <div className="ml-2 text-sm">
        {value}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{t('quizResults.title')}</h1>
        </div>

        {/* Score Card */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <Avatar className={`w-20 h-20 mx-auto mb-4 ${passed ? 'bg-green-500' : 'bg-red-500'}`}>
              <AvatarFallback>
                {passed ? <CheckCircle className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
              </AvatarFallback>
            </Avatar>
            
            <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {passed ? t('quizResults.congratulations') : t('quizResults.keepPracticing')}
            </h2>
            
            <div className={`text-6xl font-bold mb-6 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {score.toFixed(1)}%
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <StatCard
                label={t('quizResults.correct')}
                value={correctAnswers.toString()}
                color="text-green-600"
                icon={<CheckCircle className="h-6 w-6 text-green-600" />}
              />
              <StatCard
                label={t('quizResults.total')}
                value={totalQuestions.toString()}
                color="text-blue-600"
                icon={<Target className="h-6 w-6 text-blue-600" />}
              />
              <StatCard
                label={t('quizResults.wrong')}
                value={(totalQuestions - correctAnswers).toString()}
                color="text-red-600"
                icon={<XCircle className="h-6 w-6 text-red-600" />}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Quiz Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {t('quizResults.quizInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label={t('quizResults.quiz')} value={getLocalized(quiz.title)} />
              <InfoRow label={t('quizResults.level')} value={quiz.level} />
              {quiz.language && <InfoRow label={t('quizResults.language')} value={quiz.language.name} />}
              <InfoRow label={t('quizResults.timeTaken')} value={formatTime(timeElapsed)} />
              <InfoRow label={t('quizResults.completed')} value={formatDate(new Date())} />
              <InfoRow label={t('quizResults.passingScore')} value={`${quiz.passing_score || 70}%`} />
              
              <div className="mt-4">
                <Badge variant={passed ? "default" : "destructive"} className="font-bold">
                  {passed ? t('quizResults.passed') : t('quizResults.failed')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('quizResults.performance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">{t('quizResults.accuracy')}</span>
                  <span className="text-sm font-bold">{score.toFixed(1)}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {correctAnswers}
                  </div>
                  <div className="text-sm text-green-600">
                    {t('quizResults.correctAnswers')}
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {totalQuestions - correctAnswers}
                  </div>
                  <div className="text-sm text-red-600">
                    {t('quizResults.incorrectAnswers')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            size="lg"
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            {t('quizTake.backToHome')}
          </Button>
          <Button
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            size="lg"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('quizResults.tryAgain')}
          </Button>
        </div>

        {/* Motivational Message */}
        <Card className={`${passed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <CardContent className="text-center p-6">
            <p className="font-medium">
              {passed
                ? t('quizResults.successMessage')
                : t('quizResults.encouragementMessage')
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResultsPage;