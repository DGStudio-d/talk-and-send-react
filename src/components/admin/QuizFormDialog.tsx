import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLanguages } from '@/hooks/useLanguages';
import { useQuizActions } from '@/hooks/useQuiz';
import { Quiz } from '@/api/services/quizService';

const formSchema = z.object({
  title_en: z.string().min(1, 'Title is required'),
  title_ar: z.string().optional(),
  title_es: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  description_es: z.string().optional(),
  language_id: z.string().min(1, 'Language is required'),
  level: z.string().min(1, 'Level is required'),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface QuizFormDialogProps {
  open: boolean;
  quiz?: Quiz | null;
  onClose: () => void;
  onSuccess: () => void;
}

const QuizFormDialog = ({ open, quiz, onClose, onSuccess }: QuizFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: languages } = useLanguages();
  const { createQuiz, updateQuiz } = useQuizActions();

  const levels = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
    { value: 'C2', label: 'C2' },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      title_es: '',
      description_en: '',
      description_ar: '',
      description_es: '',
      language_id: '',
      level: '',
      is_active: true,
    },
  });

  // Reset form when quiz changes
  useEffect(() => {
    if (quiz) {
      form.reset({
        title_en: quiz.title.en || '',
        title_ar: quiz.title.ar || '',
        title_es: quiz.title.es || '',
        description_en: quiz.description?.en || '',
        description_ar: quiz.description?.ar || '',
        description_es: quiz.description?.es || '',
        language_id: quiz.language_id.toString(),
        level: quiz.level,
        is_active: quiz.is_active,
      });
    } else {
      form.reset({
        title_en: '',
        title_ar: '',
        title_es: '',
        description_en: '',
        description_ar: '',
        description_es: '',
        language_id: '',
        level: '',
        is_active: true,
      });
    }
  }, [quiz, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const quizData = {
        title: {
          en: data.title_en,
          ar: data.title_ar || data.title_en,
          es: data.title_es || data.title_en,
        },
        description: data.description_en ? {
          en: data.description_en,
          ar: data.description_ar || data.description_en,
          es: data.description_es || data.description_en,
        } : undefined,
        language_id: parseInt(data.language_id),
        level: data.level,
        is_active: data.is_active,
      };

      let success = false;
      if (quiz) {
        // Update existing quiz
        const result = await updateQuiz(quiz.id, quizData);
        success = !!result;
      } else {
        // Create new quiz
        const result = await createQuiz(quizData);
        success = !!result;
      }

      if (success) {
        toast({
          title: quiz ? t('quiz.form.updateSuccess') : t('quiz.form.createSuccess'),
          description: quiz 
            ? t('quiz.form.updateSuccessMessage') 
            : t('quiz.form.createSuccessMessage'),
        });
        onSuccess();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error: any) {
      toast({
        title: t('notifications.error'),
        description: error.message || (quiz 
          ? t('quiz.form.updateError') 
          : t('quiz.form.createError')),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quiz ? t('quiz.form.editTitle') : t('quiz.form.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {quiz ? t('quiz.form.editDescription') : t('quiz.form.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('quiz.form.titleSection')}</h3>
              
              <FormField
                control={form.control}
                name="title_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('quiz.form.titleEn')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('quiz.form.titleEnPlaceholder')} {...field} />
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
                    <FormLabel>{t('quiz.form.titleAr')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('quiz.form.titleArPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title_es"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('quiz.form.titleEs')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('quiz.form.titleEsPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('quiz.form.descriptionSection')}</h3>
              
              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('quiz.form.descriptionEn')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('quiz.form.descriptionEnPlaceholder')} 
                        rows={3}
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
                    <FormLabel>{t('quiz.form.descriptionAr')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('quiz.form.descriptionArPlaceholder')} 
                        rows={3}
                        {...field} 
                      />
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
                    <FormLabel>{t('quiz.form.descriptionEs')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('quiz.form.descriptionEsPlaceholder')} 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Quiz Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="language_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('quiz.form.language')} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('quiz.form.selectLanguage')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.id} value={language.id.toString()}>
                            <div className="flex items-center gap-2">
                              {language.flag_url && (
                                <img 
                                  src={language.flag_url} 
                                  alt={language.name} 
                                  className="w-4 h-3 object-cover rounded"
                                />
                              )}
                              {language.name_en || language.name}
                            </div>
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
                    <FormLabel>{t('quiz.form.level')} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('quiz.form.selectLevel')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('quiz.form.activeStatus')}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {t('quiz.form.activeStatusDescription')}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {quiz ? t('quiz.form.updating') : t('quiz.form.creating')}
                  </>
                ) : (
                  quiz ? t('quiz.form.updateButton') : t('quiz.form.createButton')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizFormDialog;