import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateQuiz } from "../../hooks/useQuizzes";
import { useLanguages } from "../../hooks/useLanguages";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import MainLayout from "../../components/layout/MainLayout";

const quizFormSchema = z.object({
  title_en: z.string().min(3, "Title must be at least 3 characters"),
  title_ar: z.string().optional(),
  title_es: z.string().optional(),
  description_en: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  description_ar: z.string().optional(),
  description_es: z.string().optional(),
  language_id: z.string().optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  duration_minutes: z.string().min(1, "Duration is required"),
  passing_score: z.string().min(1, "Passing score is required"),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export const CreateQuiz: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const createQuizMutation = useCreateQuiz();
  const { data: languages, isLoading: languagesLoading } = useLanguages({
    is_active: 1,
  });

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title_en: "",
      title_ar: "",
      title_es: "",
      description_en: "",
      description_ar: "",
      description_es: "",
      language_id: "",
      level: "A1",
      duration_minutes: "30",
      passing_score: "70",
    },
  });

  // Auto-populate language_id with teacher's preferred language
  useEffect(() => {
    if (user?.preferred_language_id) {
      form.setValue("language_id", user.preferred_language_id.toString());
    }
  }, [user, form]);

  const onSubmit = async (values: QuizFormValues) => {
    try {
      const quizData: any = {
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
        level: values.level,
        duration_minutes: parseInt(values.duration_minutes),
        passing_score: parseInt(values.passing_score),
        is_active: true,
      };

      // Only include language_id if explicitly set, otherwise backend will use teacher's preferred language
      if (values.language_id) {
        quizData.language_id = parseInt(values.language_id);
      }

      const quiz = await createQuizMutation.mutateAsync(quizData);
      toast.success(t("teacher.quizCreatedSuccess"));
      
      // Redirect based on user role
      if (user?.role === 'admin') {
        navigate(`/teacher/quizzes/${quiz.id}/questions`);
      } else {
        navigate(`/teacher/quizzes/${quiz.id}/questions`);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t("teacher.quizCreatedError")
      );
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("teacher.createQuiz")}</h1>
          <Button
            variant="outline"
            onClick={() => navigate(user?.role === 'admin' ? "/admin/quizzes" : "/teacher/quizzes")}
          >
            {t("common.cancel")}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("teacher.quizDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Title Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("quiz.title")}</h3>

                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("teacher.titleEnglish")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("teacher.enterTitleEnglish")}
                            {...field}
                          />
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
                        <FormLabel>{t("teacher.titleArabic")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("teacher.enterTitleArabic")}
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormDescription>
                          {t("teacher.optionalField")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("teacher.titleSpanish")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("teacher.enterTitleSpanish")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("teacher.optionalField")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {t("quiz.description")}
                  </h3>

                  <FormField
                    control={form.control}
                    name="description_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("teacher.descriptionEnglish")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("teacher.enterDescriptionEnglish")}
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
                        <FormLabel>{t("teacher.descriptionArabic")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("teacher.enterDescriptionArabic")}
                            className="min-h-24"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormDescription>
                          {t("teacher.optionalField")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("teacher.descriptionSpanish")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("teacher.enterDescriptionSpanish")}
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("teacher.optionalField")}
                        </FormDescription>
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
                        <FormLabel>{t("quiz.language")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("teacher.selectLanguage")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languagesLoading ? (
                              <SelectItem value="loading" disabled>
                                {t("common.loading")}
                              </SelectItem>
                            ) : (
                              languages?.map((language) => (
                                <SelectItem
                                  key={language.id}
                                  value={language.id.toString()}
                                >
                                  {language.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("teacher.languageAutoFill")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("quiz.level")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("teacher.selectLevel")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A1">A1</SelectItem>
                            <SelectItem value="A2">A2</SelectItem>
                            <SelectItem value="B1">B1</SelectItem>
                            <SelectItem value="B2">B2</SelectItem>
                            <SelectItem value="C1">C1</SelectItem>
                            <SelectItem value="C2">C2</SelectItem>
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
                        <FormLabel>
                          {t("quiz.duration")} ({t("quiz.minutes")})
                        </FormLabel>
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
                        <FormLabel>{t("quiz.passingScore")} (%)</FormLabel>
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
                    onClick={() => navigate(user?.role === 'admin' ? "/admin/quizzes" : "/teacher/quizzes")}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" disabled={createQuizMutation.isPending}>
                    {createQuizMutation.isPending
                      ? t("common.loading")
                      : t("teacher.createAndAddQuestions")}
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

export default CreateQuiz;
