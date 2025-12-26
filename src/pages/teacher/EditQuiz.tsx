import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuiz, useUpdateQuiz } from '../../hooks/useQuizzes';
import { useLanguages } from '../../hooks/useLanguages';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';
import MainLayout from '../../components/layout/MainLayout';

const quizFormSchema = z.object({
  title_en: z.string().min(3, 'Title must be at least 3 characters'),
  title_ar: z.string().optional(),
  title_es: z.string().optional(),
  description_en: z.string().min(10, 'Description must be at least 10 characters'),
  description_ar: z.string().optional(),
  description_es: z.string().optional(),
  language_id: z.string().min(1, 'Please select a language'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  duration_minutes: z.string().min(1, 'Duration is required'),
  passing_score: z.string().min(1, 'Passing score is required'),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const quizId = parseInt(id || '0');
  const { data: quiz, isLoading: quizLoading } = useQuiz(quizId);
  const updateQuizMutation = useUpdateQuiz();
  const { data: languages, isLoading: languagesLoading } = useLanguages({ is_active: 1 });

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      title_es: '',
      description_en: '',
      description_ar: '',
      description_es: '',
      language_id: '',
      level: 'Beginner',
      duration_minutes: '30',
      passing_score: '70',
    },
  });

  // Populate form when quiz data is loaded
  useEffect(() => {
    if (quiz) {
      form.reset({
        title_en: quiz.title?.en || '',
        title_ar: quiz.title?.ar || '',
        title_es: quiz.title?.es || '',
        description_en: quiz.description?.en || '',
        description_ar: quiz.description?.ar || '',
        description_es: quiz.description?.es || '',
        language_id: quiz.language_id?.toString() || '',
        level: quiz.level || 'Beginner',
        duration_minutes: quiz.duration_minutes?.toString() || '30',
        passing_score: quiz.passing_score?.toString() || '70',
      });
    }
  }, [quiz, form]);

  const onSubmit = async (values: QuizFormValues) => {
    try {
      const quizData = {
        title: {
          en: values.title_en,
          ar: values.title_ar || values.title_en,
          es: values.title_es || values.title_en,
        },
        description: {
          en: values.description_en,
          ar: values.description_ar || values.description_en,
          es: values.description_es || values.description_en,
        },
        language_id: parseInt(values.language_id),
        level: values.level,
        duration_minutes: parseInt(values.duration_minutes),
        passing_score: parseInt(values.passing_score),
      };

      await updateQuizMutation.mutateAsync({ id: quizId, data: quizData });
      toast.success(t('teacher.quizUpdatedSuccess'));
      navigate(`/teacher/quizzes/${quizId}/questions`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('teacher.quizUpdatedError'));
    }
  };

  if (quizLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!quiz) {
    return (
      <MainLayout>
        <Card className="p-6">
          <div className="text-center space-y-4">
            <p className="text-red-600">{t('teacher.quizNotFound')}</p>
            <Button onClick={() => navigate('/teacher/quizzes')}>
              {t('teacher.backToQuizzes')}
            </Button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('teacher.editQuiz')}</h1>
          <Button variant="outline" onClick={() => navigate('/teacher/quizzes')}>
            {t('common.cancel')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.quizDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('quiz.title')}</h3>
                  
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.titleEnglish')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('teacher.enterTitleEnglish')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.titleArabic')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('teacher.enterTitleArabic')} {...field} dir="rtl" />
                        </FormControl>
                        <FormDescription>{t('teacher.optionalField')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.titleSpanish')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('teacher.enterTitleSpanish')} {...field} />
                        </FormControl>
                        <FormDescription>{t('teacher.optionalField')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('quiz.description')}</h3>
                  
                  <FormField
                    control={form.control}
                    name="description_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.descriptionEnglish')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('teacher.enterDescriptionEnglish')}
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.descriptionArabic')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('teacher.enterDescriptionArabic')}
                            className="min-h-24"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormDescription>{t('teacher.optionalField')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.descriptionSpanish')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('teacher.enterDescriptionSpanish')}
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>{t('teacher.optionalField')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quiz Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="language_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('quiz.language')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('teacher.selectLanguage')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languagesLoading ? (
                              <SelectItem value="loading" disabled>
                                {t('common.loading')}
                              </SelectItem>
                            ) : (
                              languages?.map((language) => (
                                <SelectItem key={language.id} value={language.id.toString()}>
                                  {language.name?.en || language.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('quiz.level')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('teacher.selectLevel')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Beginner">{t('levels.beginner')}</SelectItem>
                            <SelectItem value="Intermediate">{t('levels.intermediate')}</SelectItem>
                            <SelectItem value="Advanced">{t('levels.advanced')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('quiz.duration')} ({t('quiz.minutes')})</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passing_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('quiz.passingScore')} (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/teacher/quizzes')}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={updateQuizMutation.isPending}>
                    {updateQuizMutation.isPending ? t('common.loading') : t('common.save')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditQuiz;
