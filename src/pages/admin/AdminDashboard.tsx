import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, BookOpen, ClipboardList, Languages } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useDashboard';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import MainLayout from '../../components/layout/MainLayout';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <MainLayout>
        <div>
        <h1 className="text-3xl font-bold mb-6">{t('admin.dashboard.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div>
        <Alert variant="destructive">
          <AlertDescription>
            {t('admin.dashboard.error')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4">
          {t('common.retry')}
        </Button>
        </div>
      </MainLayout>
    );
  }

  // Prepare user distribution data for pie chart
  const userDistributionData = stats?.user_distribution
    ? Object.entries(stats.user_distribution).map(([role, count]) => ({
        name: t(`roles.${role}`),
        value: count as number,
      }))
    : [];

  return (
    <MainLayout>
      <div>
      <h1 className="text-3xl font-bold mb-6">{t('admin.dashboard.title')}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          label={t('admin.dashboard.totalUsers')}
          value={stats?.total_users || 0}
          icon={Users}
        />
        <StatsCard
          label={t('admin.dashboard.totalQuizzes')}
          value={stats?.total_quizzes || 0}
          icon={BookOpen}
        />
        <StatsCard
          label={t('admin.dashboard.totalAttempts')}
          value={stats?.total_attempts || 0}
          icon={ClipboardList}
        />
        <StatsCard
          label={t('admin.dashboard.activeLanguages')}
          value={stats?.active_languages || 0}
          icon={Languages}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.userDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            {userDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">{t('admin.dashboard.noData')}</p>
            )}
          </CardContent>
        </Card>

        {/* Recent User Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.recentRegistrations')}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recent_registrations && stats.recent_registrations.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_registrations.map((user) => (
                  <Card key={user.id} className="bg-gray-50">
                    <CardContent className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
                          {t(`roles.${user.role}`)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">{t('admin.dashboard.noRegistrations')}</p>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
