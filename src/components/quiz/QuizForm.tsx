import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguages } from '../../hooks/useLanguages';
import { Quiz } from '../../types/models';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const quizFormSchema = z.object({
  title_en: z.string().min(3, 'Title must be at least 3 characters'),
  title_ar: z.string().min(3, 'Title must be at least 3 characters'),
  title_es: z.string().min(3, 'Title must be at least 3 characters'),
  description_en: z.string().min(10, 'Description must be at least 10 characters'),
  description_ar: z.string().min(10, 'Description must be at least 10 characters'),
  description_es: z.string().min(10, 'Description must be at least 10 characters'),
  language_id: z.string().min(1, 'Language is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration_minutes: z.string().min(1, 'Duration is required'),
  passing_score: z.string().min(1, 'Passing score is required'),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

interface QuizFormProps {
  quiz?: Quiz;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const QuizForm: React.FC<QuizFormProps> = ({ quiz, onSubmit, isLoading = false }) => {
  const { t } = useTranslation();
  const { data: languages = [], isLoading: languagesLoading } = useLanguages();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title_en: quiz?.title?.en || '',
      title_ar: quiz?.title?.ar || '',
      title_es: quiz?.title?.es || '',
      description_en: quiz?.description?.en || '',
      description_ar: quiz?.description?.ar || '',
      description_es: quiz?.description?.es || '',
      language_id: quiz?.language_id?.toString() || '',
      level: quiz?.level || 'beginner',
      duration_minutes: quiz?.duration_minutes?.toString() || '30',
      passing_score: quiz?.passing_score?.toString() || '70',
    },
  });

  const handleFormSubmit = (values: QuizFormValues) => {
    const transformedData = {
      title: {
        en: values.title_en,
        ar: values.title_ar,
        es: values.title_es,
      },
      description: {
        en: values.description_en,
        ar: values.description_ar,
        es: values.description_es,
      },
      language_id: parseInt(values.language_id),
      level: values.level,
      duration_minutes: parseInt(values.duration_minutes),
      passing_score: parseInt(values.passing_score),
    };

    onSubmit(transformedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="es">Español</TabsTrigger>
              </TabsList>

              {/* English Tab */}
              <TabsContent value="en" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quiz.title')} (English)</FormLabel>
                      <FormControl>
                        <Input placeholder={t('quiz.enterTitle')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quiz.description')} (English)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('quiz.enterDescription')}
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Arabic Tab */}
              <TabsContent value="ar" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quiz.title')} (العربية)</FormLabel>
                      <FormControl>
                        <Input placeholder={t('quiz.enterTitle')} {...field} dir="rtl" />
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
                      <FormLabel>{t('quiz.description')} (العربية)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('quiz.enterDescription')}
                          className="min-h-24"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Spanish Tab */}
              <TabsContent value="es" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title_es"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quiz.title')} (Español)</FormLabel>
                      <FormControl>
                        <Input placeholder={t('quiz.enterTitle')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_es"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quiz.description')} (Español)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('quiz.enterDescription')}
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="language_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('quiz.language')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={languagesLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('quiz.selectLanguage')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id.toString()}>
                          {language.name.en}
                        </SelectItem>
                      ))}
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
                        <SelectValue placeholder={t('quiz.selectLevel')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">{t('quiz.beginner')}</SelectItem>
                      <SelectItem value="intermediate">{t('quiz.intermediate')}</SelectItem>
                      <SelectItem value="advanced">{t('quiz.advanced')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('quiz.duration')} ({t('quiz.minutes')})</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="30" {...field} />
                    </FormControl>
                    <FormDescription>{t('quiz.durationDescription')}</FormDescription>
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
                      <Input type="number" min="0" max="100" placeholder="70" {...field} />
                    </FormControl>
                    <FormDescription>{t('quiz.passingScoreDescription')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('common.loading') : quiz ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
