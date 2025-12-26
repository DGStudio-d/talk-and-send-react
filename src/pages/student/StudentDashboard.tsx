import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Target, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { AttemptCard } from '../../components/quiz/AttemptCard';
import { useStudentDashboard } from '../../hooks/useDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';
import MainLayout from '../../components/layout/MainLayout';

// Custom Tooltip Component for Chart
const CustomTooltip: React.FC<TooltipProps<number, string> & { t: (key: string) => string }> = ({ active, payload, t }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-3">
          <p className="text-sm font-medium text-gray-900">
            {t('levels.' + payload[0].payload.level.toLowerCase())}
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

export const StudentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError, refetch } = useStudentDashboard();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('dashboard.studentDashboard')}</h1>
        
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

  // Prepare level distribution data for chart
  const levelDistributionData = stats?.level_distribution
    ? Object.entries(stats.level_distribution).map(([level, count]) => ({
        level,
        count: count as number,
      }))
    : [];

  // Colors for the bar chart
  const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'];

  return (
    <MainLayout>
      <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('dashboard.studentDashboard')}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Completed Attempts */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('dashboard.completedAttempts')}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.completed_attempts || 0}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('dashboard.averageScore')}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.average_score ? `${stats.average_score.toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferred Language Progress */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('dashboard.languageProgress')}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.preferred_language_progress?.attempts || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.preferred_language_progress?.language_name || t('dashboard.noPreference')}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Levels Attempted */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('dashboard.levelsAttempted')}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {levelDistributionData.length}
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
        {/* Level Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.levelDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            {levelDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={levelDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip t={t} />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {levelDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                {t('dashboard.noLevelData')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Attempts */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentAttempts')}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recent_attempts && stats.recent_attempts.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {stats.recent_attempts.slice(0, 5).map((attempt) => (
                  <AttemptCard key={attempt.id} attempt={attempt} />
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                {t('dashboard.noRecentAttempts')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
