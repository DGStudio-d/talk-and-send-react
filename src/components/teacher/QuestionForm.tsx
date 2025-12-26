import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateQuestion, useUpdateQuestion } from '../../hooks/useQuestions';
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
import { toast } from 'sonner';
import { QuizQuestion } from '../../types/models';

const questionFormSchema = z.object({
  question_text: z.string().min(5, 'Question must be at least 5 characters'),
  option_a: z.string().min(1, 'Option A is required'),
  option_b: z.string().min(1, 'Option B is required'),
  option_c: z.string().min(1, 'Option C is required'),
  option_d: z.string().min(1, 'Option D is required'),
  correct_option: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().optional(),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
  quizId: number;
  question?: QuizQuestion | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  quizId,
  question,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question_text: question?.question_text || '',
      option_a: question?.option_a || '',
      option_b: question?.option_b || '',
      option_c: question?.option_c || '',
      option_d: question?.option_d || '',
      correct_option: question?.correct_option || 'A',
      explanation: question?.explanation || '',
    },
  });

  const onSubmit = async (values: QuestionFormValues) => {
    try {
      const questionData = {
        question_text: values.question_text,
        option_a: values.option_a,
        option_b: values.option_b,
        option_c: values.option_c,
        option_d: values.option_d,
        correct_option: values.correct_option,
        explanation: values.explanation || null,
      };

      if (question) {
        await updateQuestionMutation.mutateAsync({
          id: question.id,
          data: questionData,
          quizId,
        });
        toast.success(t('teacher.questionUpdatedSuccess'));
      } else {
        await createQuestionMutation.mutateAsync({ quizId, data: questionData });
        toast.success(t('teacher.questionCreatedSuccess'));
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('teacher.questionSaveError'));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Question Text */}
        <FormField
          control={form.control}
          name="question_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('teacher.questionText')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('teacher.enterQuestionEnglish')}
                  className="min-h-20"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('teacher.questionInQuizLanguage')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('teacher.answerOptions')}</h3>
          
          <FormField
            control={form.control}
            name="option_a"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('teacher.optionA')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('teacher.enterOptionA')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="option_b"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('teacher.optionB')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('teacher.enterOptionB')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="option_c"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('teacher.optionC')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('teacher.enterOptionC')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="option_d"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('teacher.optionD')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('teacher.enterOptionD')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Correct Answer */}
        <FormField
          control={form.control}
          name="correct_option"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('teacher.correctAnswer')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('teacher.selectCorrectAnswer')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">{t('teacher.optionA')}</SelectItem>
                  <SelectItem value="B">{t('teacher.optionB')}</SelectItem>
                  <SelectItem value="C">{t('teacher.optionC')}</SelectItem>
                  <SelectItem value="D">{t('teacher.optionD')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Explanation (Optional) */}
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('teacher.explanation')} ({t('teacher.optional')})</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('teacher.enterExplanationEnglish')}
                  className="min-h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
          >
            {createQuestionMutation.isPending || updateQuestionMutation.isPending
              ? t('common.loading')
              : question
              ? t('common.update')
              : t('common.create')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
