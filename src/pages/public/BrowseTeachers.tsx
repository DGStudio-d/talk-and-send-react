import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { teacherApi } from '../../lib/api';
import { TeacherCard } from '../../components/teacher/TeacherCard';

const BrowseTeachers: React.FC = () => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const response = await teacherApi.getAll();
      return response.data;
    },
  });

  const teachers = data?.profiles || [];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold">
            {t('teacher.browseTeachers', { defaultValue: 'Browse Teachers' })}
          </h1>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {t('teacher.errorLoading', { defaultValue: 'Failed to load teachers' })}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && teachers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {t('teacher.noTeachersAvailable', { defaultValue: 'No teachers available at the moment' })}
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && teachers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher: any) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BrowseTeachers;
