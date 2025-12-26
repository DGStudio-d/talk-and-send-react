import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, Phone, Calendar, User as UserIcon } from 'lucide-react';
import { useUser } from '../../hooks/useUsers';
import { useQuizzes } from '../../hooks/useQuizzes';
import { useQuizAttempts } from '../../hooks/useQuizAttempts';
import { UserRole } from '../../types/models';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { QuizCard } from '../../components/quiz/QuizCard';
import { AttemptCard } from '../../components/quiz/AttemptCard';
import MainLayout from '../../components/layout/MainLayout';

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const userId = parseInt(id || '0', 10);
  const { data: user, isLoading: userLoading, isError: userError } = useUser(userId);

  // Fetch quizzes if user is a teacher
  const { data: quizzes, isLoading: quizzesLoading } = useQuizzes(
    user?.role === UserRole.Teacher ? { created_by: userId } : undefined
  );

  // Fetch attempts if user is a student
  const { data: attempts, isLoading: attemptsLoading } = useQuizAttempts(
    user?.role === UserRole.Student ? { user_id: userId } : undefined
  );

  if (userLoading) {
    return (
      <MainLayout>
        <div>
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (userError || !user) {
    return (
      <MainLayout>
        <div>
          <Alert variant="destructive">
            <AlertDescription>{t('admin.users.userNotFound')}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/admin/users')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/users')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('common.back')}
      </Button>

      {/* User Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-6 h-6" />
              {user.name}
            </CardTitle>
            <Badge
              variant={
                user.role === UserRole.Admin
                  ? 'destructive'
                  : user.role === UserRole.Teacher
                  ? 'default'
                  : 'secondary'
              }
            >
              {t(`roles.${user.role}`)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{user.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {t('admin.users.joinedOn')}: {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t('admin.users.level')}:</span>
              <Badge variant="outline">{t(`levels.${user.level}`)}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t('admin.users.locale')}:</span>
              <Badge variant="outline">{t(`languages.${user.locale}`)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher's Quizzes */}
      {user.role === UserRole.Teacher && (
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.users.createdQuizzes')}</CardTitle>
          </CardHeader>
          <CardContent>
            {quizzesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : quizzes && quizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                {t('admin.users.noQuizzes')}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Student's Quiz Attempts */}
      {user.role === UserRole.Student && (
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.users.quizAttempts')}</CardTitle>
          </CardHeader>
          <CardContent>
            {attemptsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : attempts && attempts.length > 0 ? (
              <div className="space-y-4">
                {attempts.map((attempt) => (
                  <AttemptCard key={attempt.id} attempt={attempt} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                {t('admin.users.noAttempts')}
              </p>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </MainLayout>
  );
};

export default UserDetail;
