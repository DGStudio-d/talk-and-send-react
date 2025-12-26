import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, BookOpen } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { teacherApi } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedString } from '../../lib/translationHelpers';
import { QuizCard } from '../../components/quiz/QuizCard';

const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const { data: teacher, isLoading: teacherLoading, isError: teacherError } = useQuery({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const response = await teacherApi.getById(Number(id));
      return response.data;
    },
    enabled: !!id,
  });

  const { data: quizzesData, isLoading: quizzesLoading } = useQuery({
    queryKey: ['teacher-quizzes', id],
    queryFn: async () => {
      const response = await teacherApi.getQuizzes(Number(id));
      return response.data;
    },
    enabled: !!id && !teacherError,
  });

  if (teacherLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-8 w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (teacherError || !teacher) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <Alert variant="destructive">
            <AlertDescription>
              {t('teacher.notFound', { defaultValue: 'Teacher profile not found' })}
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  const bio = getLocalizedString(teacher.bio, locale, '');
  const teacherName = teacher.user?.name || t('teacher.unknownTeacher');
  const quizzes = quizzesData?.quizzes || [];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        {/* Teacher Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              {teacher.profile_image_url ? (
                <img 
                  src={teacher.profile_image_url} 
                  alt={t('teacher.profileImage', { name: teacherName })}
                  className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-primary-600" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl mb-2">{teacherName}</CardTitle>
                {teacher.user?.preferred_language && (
                  <p className="text-sm text-muted-foreground">
                    {t('teacher.teaches')}: {teacher.user.preferred_language.name}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {bio ? (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{bio}</p>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                {t('teacher.noBio')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Teacher's Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {t('teacher.quizzes', { defaultValue: 'Quizzes' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quizzesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : quizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz: any) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {t('teacher.noQuizzes', { defaultValue: 'No quizzes available yet' })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TeacherDetail;
