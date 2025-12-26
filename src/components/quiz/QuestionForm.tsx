import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { QuizQuestion } from '../../types/models';

// Validation schema
const questionSchema = z.object({
  question_text_en: z.string().min(1, 'Question text (English) is required'),
  question_text_ar: z.string().min(1, 'Question text (Arabic) is required'),
  question_text_es: z.string().min(1, 'Question text (Spanish) is required'),
  option_a_en: z.string().min(1, 'Option A (English) is required'),
  option_a_ar: z.string().min(1, 'Option A (Arabic) is required'),
  option_a_es: z.string().min(1, 'Option A (Spanish) is required'),
  option_b_en: z.string().min(1, 'Option B (English) is required'),
  option_b_ar: z.string().min(1, 'Option B (Arabic) is required'),
  option_b_es: z.string().min(1, 'Option B (Spanish) is required'),
  option_c_en: z.string().min(1, 'Option C (English) is required'),
  option_c_ar: z.string().min(1, 'Option C (Arabic) is required'),
  option_c_es: z.string().min(1, 'Option C (Spanish) is required'),
  option_d_en: z.string().min(1, 'Option D (English) is required'),
  option_d_ar: z.string().min(1, 'Option D (Arabic) is required'),
  option_d_es: z.string().min(1, 'Option D (Spanish) is required'),
  correct_option: z.enum(['A', 'B', 'C', 'D']),
  explanation_en: z.string().optional(),
  explanation_ar: z.string().optional(),
  explanation_es: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  question?: QuizQuestion;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('en');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: question
      ? {
          question_text_en: question.question_text.en,
          question_text_ar: question.question_text.ar,
          question_text_es: question.question_text.es,
          option_a_en: question.option_a.en,
          option_a_ar: question.option_a.ar,
          option_a_es: question.option_a.es,
          option_b_en: question.option_b.en,
          option_b_ar: question.option_b.ar,
          option_b_es: question.option_b.es,
          option_c_en: question.option_c.en,
          option_c_ar: question.option_c.ar,
          option_c_es: question.option_c.es,
          option_d_en: question.option_d.en,
          option_d_ar: question.option_d.ar,
          option_d_es: question.option_d.es,
          correct_option: question.correct_option,
          explanation_en: question.explanation?.en || '',
          explanation_ar: question.explanation?.ar || '',
          explanation_es: question.explanation?.es || '',
        }
      : {
          correct_option: 'A',
        },
  });

  const correctOption = watch('correct_option');

  const handleFormSubmit = (data: QuestionFormData) => {
    // Transform flat form data to nested structure
    const transformedData = {
      question_text: {
        en: data.question_text_en,
        ar: data.question_text_ar,
        es: data.question_text_es,
      },
      option_a: {
        en: data.option_a_en,
        ar: data.option_a_ar,
        es: data.option_a_es,
      },
      option_b: {
        en: data.option_b_en,
        ar: data.option_b_ar,
        es: data.option_b_es,
      },
      option_c: {
        en: data.option_c_en,
        ar: data.option_c_ar,
        es: data.option_c_es,
      },
      option_d: {
        en: data.option_d_en,
        ar: data.option_d_ar,
        es: data.option_d_es,
      },
      correct_option: data.correct_option,
      explanation: {
        en: data.explanation_en || '',
        ar: data.explanation_ar || '',
        es: data.explanation_es || '',
      },
    };

    onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
          <TabsTrigger value="es">Español</TabsTrigger>
        </TabsList>

        {/* English Tab */}
        <TabsContent value="en" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question_text_en">{t('question.questionText')}</Label>
            <Textarea
              id="question_text_en"
              {...register('question_text_en')}
              rows={3}
            />
            {errors.question_text_en && (
              <p className="text-sm text-red-600">{errors.question_text_en.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="option_a_en">{t('question.optionA')}</Label>
              <Input id="option_a_en" {...register('option_a_en')} />
              {errors.option_a_en && (
                <p className="text-sm text-red-600">{errors.option_a_en.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_b_en">{t('question.optionB')}</Label>
              <Input id="option_b_en" {...register('option_b_en')} />
              {errors.option_b_en && (
                <p className="text-sm text-red-600">{errors.option_b_en.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_c_en">{t('question.optionC')}</Label>
              <Input id="option_c_en" {...register('option_c_en')} />
              {errors.option_c_en && (
                <p className="text-sm text-red-600">{errors.option_c_en.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_d_en">{t('question.optionD')}</Label>
              <Input id="option_d_en" {...register('option_d_en')} />
              {errors.option_d_en && (
                <p className="text-sm text-red-600">{errors.option_d_en.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation_en">{t('question.explanation')} ({t('common.optional')})</Label>
            <Textarea
              id="explanation_en"
              {...register('explanation_en')}
              rows={2}
            />
          </div>
        </TabsContent>

        {/* Arabic Tab */}
        <TabsContent value="ar" className="space-y-4" dir="rtl">
          <div className="space-y-2">
            <Label htmlFor="question_text_ar">{t('question.questionText')}</Label>
            <Textarea
              id="question_text_ar"
              {...register('question_text_ar')}
              rows={3}
              dir="rtl"
            />
            {errors.question_text_ar && (
              <p className="text-sm text-red-600">{errors.question_text_ar.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="option_a_ar">{t('question.optionA')}</Label>
              <Input id="option_a_ar" {...register('option_a_ar')} dir="rtl" />
              {errors.option_a_ar && (
                <p className="text-sm text-red-600">{errors.option_a_ar.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_b_ar">{t('question.optionB')}</Label>
              <Input id="option_b_ar" {...register('option_b_ar')} dir="rtl" />
              {errors.option_b_ar && (
                <p className="text-sm text-red-600">{errors.option_b_ar.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_c_ar">{t('question.optionC')}</Label>
              <Input id="option_c_ar" {...register('option_c_ar')} dir="rtl" />
              {errors.option_c_ar && (
                <p className="text-sm text-red-600">{errors.option_c_ar.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_d_ar">{t('question.optionD')}</Label>
              <Input id="option_d_ar" {...register('option_d_ar')} dir="rtl" />
              {errors.option_d_ar && (
                <p className="text-sm text-red-600">{errors.option_d_ar.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation_ar">{t('question.explanation')} ({t('common.optional')})</Label>
            <Textarea
              id="explanation_ar"
              {...register('explanation_ar')}
              rows={2}
              dir="rtl"
            />
          </div>
        </TabsContent>

        {/* Spanish Tab */}
        <TabsContent value="es" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question_text_es">{t('question.questionText')}</Label>
            <Textarea
              id="question_text_es"
              {...register('question_text_es')}
              rows={3}
            />
            {errors.question_text_es && (
              <p className="text-sm text-red-600">{errors.question_text_es.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="option_a_es">{t('question.optionA')}</Label>
              <Input id="option_a_es" {...register('option_a_es')} />
              {errors.option_a_es && (
                <p className="text-sm text-red-600">{errors.option_a_es.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_b_es">{t('question.optionB')}</Label>
              <Input id="option_b_es" {...register('option_b_es')} />
              {errors.option_b_es && (
                <p className="text-sm text-red-600">{errors.option_b_es.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_c_es">{t('question.optionC')}</Label>
              <Input id="option_c_es" {...register('option_c_es')} />
              {errors.option_c_es && (
                <p className="text-sm text-red-600">{errors.option_c_es.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option_d_es">{t('question.optionD')}</Label>
              <Input id="option_d_es" {...register('option_d_es')} />
              {errors.option_d_es && (
                <p className="text-sm text-red-600">{errors.option_d_es.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation_es">{t('question.explanation')} ({t('common.optional')})</Label>
            <Textarea
              id="explanation_es"
              {...register('explanation_es')}
              rows={2}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Correct Answer Selection */}
      <div className="space-y-2">
        <Label>{t('question.correctAnswer')}</Label>
        <RadioGroup
          value={correctOption}
          onValueChange={(value) => setValue('correct_option', value as 'A' | 'B' | 'C' | 'D')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="A" id="correct-a" />
            <Label htmlFor="correct-a" className="cursor-pointer">
              {t('question.optionA')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="B" id="correct-b" />
            <Label htmlFor="correct-b" className="cursor-pointer">
              {t('question.optionB')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="C" id="correct-c" />
            <Label htmlFor="correct-c" className="cursor-pointer">
              {t('question.optionC')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="D" id="correct-d" />
            <Label htmlFor="correct-d" className="cursor-pointer">
              {t('question.optionD')}
            </Label>
          </div>
        </RadioGroup>
        {errors.correct_option && (
          <p className="text-sm text-red-600">{errors.correct_option.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('common.saving') : question ? t('common.update') : t('common.create')}
        </Button>
      </div>
    </form>
  );
};
