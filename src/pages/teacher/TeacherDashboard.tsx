import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { useTeacherDashboard } from '../../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';
import MainLayout from '../../components/layout/MainLayout';

// Custom Tooltip Component for Chart
const CustomTooltip: React.FC<TooltipProps<number, string> & { t: (key: string) => string }> = ({ active, payload, t }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-3">
          <p className="text-sm font-medium text-gray-900">
            {payload[0].payload.title}
          </p>
          <p className="text-sm text-gray-600">
            {t('dashboard.attempts')}: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </CardContent>
      </Card>
    );
  }
  return null;
};

export const TeacherDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, refetch } = useTeacherDashboard();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{t('dashboard.teacherDashboard')}</h1>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div>
          <Card className="p-6">
            <div className="text-center space-y-4">
              <p className="text-red-600">{t('dashboard.errorLoading')}</p>
              <Button onClick={() => refetch()}>{t('common.retry')}</Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Prepare quiz performance data for chart
  const quizPerformanceData = stats?.recent_quizzes?.slice(0, 5).map((quiz: any) => ({
    title: quiz.title?.en || quiz.title || t('quiz.untitled'),
    attempts: quiz.attempts_count || 0,
  })) || [];

  // Colors for the bar chart
  const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('dashboard.teacherDashboard')}</h1>
          <Button onClick={() => navigate('/teacher/quizzes/create')}>
            {t('teacher.createQuiz')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Created Quizzes */}
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('dashboard.createdQuizzes')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.created_quizzes || 0}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Attempts */}
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('dashboard.totalAttempts')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.teacher_total_attempts || 0}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('teacher.averageStudentScore')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.teacher_average_score ? `${stats.teacher_average_score.toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Quizzes */}
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('teacher.activeQuizzes')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.active_quizzes || 0}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quiz Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.quizPerformance')}</CardTitle>
            </CardHeader>
            <CardContent>
              {quizPerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quizPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip t={t} />} />
                    <Bar dataKey="attempts" radius={[8, 8, 0, 0]}>
                      {quizPerformanceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  {t('teacher.noQuizData')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.recentQuizzes')}</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recent_quizzes && stats.recent_quizzes.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {stats.recent_quizzes.slice(0, 5).map((quiz: any) => (
                    <Card
                      key={quiz.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/teacher/quizzes/${quiz.id}/questions`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {quiz.title?.en || quiz.title || t('quiz.untitled')}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {quiz.language?.name?.en || quiz.language?.name} • {t('levels.' + (quiz.level || 'beginner').toLowerCase())}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {quiz.questions_count || 0} {t('quiz.questions')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {quiz.attempts_count || 0} {t('dashboard.attempts')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <p>{t('teacher.noRecentQuizzes')}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/teacher/quizzes/create')}
                  >
                    {t('teacher.createFirstQuiz')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;
