import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateQuestion, useUpdateQuestion } from '../../hooks/useQuestions';
import { QuizQuestion } from '../../types/models';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

const questionFormSchema = z.object({
  question_text_en: z.string().min(5, 'Question must be at least 5 characters'),
  question_text_ar: z.string().min(5, 'Question must be at least 5 characters'),
  question_text_es: z.string().min(5, 'Question must be at least 5 characters'),
  option_a_en: z.string().min(1, 'Option A is required'),
  option_a_ar: z.string().min(1, 'Option A is required'),
  option_a_es: z.string().min(1, 'Option A is required'),
  option_b_en: z.string().min(1, 'Option B is required'),
  option_b_ar: z.string().min(1, 'Option B is required'),
  option_b_es: z.string().min(1, 'Option B is required'),
  option_c_en: z.string().min(1, 'Option C is required'),
  option_c_ar: z.string().min(1, 'Option C is required'),
  option_c_es: z.string().min(1, 'Option C is required'),
  option_d_en: z.string().min(1, 'Option D is required'),
  option_d_ar: z.string().min(1, 'Option D is required'),
  option_d_es: z.string().min(1, 'Option D is required'),
  correct_option: z.enum(['A', 'B', 'C', 'D']),
  explanation_en: z.string().optional(),
  explanation_ar: z.string().optional(),
  explanation_es: z.string().optional(),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormModalProps {
  quizId: number;
  question?: QuizQuestion;
  open: boolean;
  onClose: () => void;
}

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  quizId,
  question,
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question_text_en: question?.question_text?.en || '',
      question_text_ar: question?.question_text?.ar || '',
      question_text_es: question?.question_text?.es || '',
      option_a_en: question?.option_a?.en || '',
      option_a_ar: question?.option_a?.ar || '',
      option_a_es: question?.option_a?.es || '',
      option_b_en: question?.option_b?.en || '',
      option_b_ar: question?.option_b?.ar || '',
      option_b_es: question?.option_b?.es || '',
      option_c_en: question?.option_c?.en || '',
      option_c_ar: question?.option_c?.ar || '',
      option_c_es: question?.option_c?.es || '',
      option_d_en: question?.option_d?.en || '',
      option_d_ar: question?.option_d?.ar || '',
      option_d_es: question?.option_d?.es || '',
      correct_option: question?.correct_option || 'A',
      explanation_en: question?.explanation?.en || '',
      explanation_ar: question?.explanation?.ar || '',
      explanation_es: question?.explanation?.es || '',
    },
  });

  const onSubmit = async (values: QuestionFormValues) => {
    try {
      const questionData = {
        question_text: {
          en: values.question_text_en,
          ar: values.question_text_ar,
          es: values.question_text_es,
        },
        option_a: {
          en: values.option_a_en,
          ar: values.option_a_ar,
          es: values.option_a_es,
        },
        option_b: {
          en: values.option_b_en,
          ar: values.option_b_ar,
          es: values.option_b_es,
        },
        option_c: {
          en: values.option_c_en,
          ar: values.option_c_ar,
          es: values.option_c_es,
        },
        option_d: {
          en: values.option_d_en,
          ar: values.option_d_ar,
          es: values.option_d_es,
        },
        correct_option: values.correct_option,
        explanation: values.explanation_en || values.explanation_ar || values.explanation_es
          ? {
              en: values.explanation_en || '',
              ar: values.explanation_ar || '',
              es: values.explanation_es || '',
            }
          : undefined,
      };

      if (question) {
        await updateQuestionMutation.mutateAsync({
          id: question.id,
          data: questionData,
          quizId,
        });
        toast.success(t('question.updateSuccess'));
      } else {
        await createQuestionMutation.mutateAsync({ quizId, data: questionData });
        toast.success(t('question.createSuccess'));
      }

      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('question.saveError'));
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = createQuestionMutation.isPending || updateQuestionMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question ? t('question.editQuestion') : t('question.addQuestion')}
          </DialogTitle>
          <DialogDescription>
            {t('question.fillAllLanguages')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  name="question_text_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('question.questionText')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('question.enterQuestion')}
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="option_a_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionA')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_b_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionB')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_c_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionC')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_d_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionD')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="explanation_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('question.explanation')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('question.enterExplanation')}
                          className="min-h-16"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{t('common.optional')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Arabic Tab */}
              <TabsContent value="ar" className="space-y-4">
                <FormField
                  control={form.control}
                  name="question_text_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('question.questionText')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('question.enterQuestion')}
                          className="min-h-20"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="option_a_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionA')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_b_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionB')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_c_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionC')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_d_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionD')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="explanation_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('question.explanation')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('question.enterExplanation')}
                          className="min-h-16"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormDescription>{t('common.optional')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Spanish Tab */}
              <TabsContent value="es" className="space-y-4">
                <FormField
                  control={form.control}
                  name="question_text_es"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('question.questionText')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('question.enterQuestion')}
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="option_a_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionA')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_b_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionB')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_c_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionC')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option_d_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('question.optionD')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('question.enterOption')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="explanation_es"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('question.explanation')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('question.enterExplanation')}
                          className="min-h-16"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{t('common.optional')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Correct Answer Selection */}
            <FormField
              control={form.control}
              name="correct_option"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('question.correctAnswer')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('question.selectCorrectAnswer')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">{t('question.optionA')}</SelectItem>
                      <SelectItem value="B">{t('question.optionB')}</SelectItem>
                      <SelectItem value="C">{t('question.optionC')}</SelectItem>
                      <SelectItem value="D">{t('question.optionD')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('common.loading') : question ? t('common.update') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
