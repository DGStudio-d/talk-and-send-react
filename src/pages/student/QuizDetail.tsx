import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Clock,
  FileQuestion,
  Target,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { useQuiz } from "../../hooks/useQuizzes";
import { useStartQuizAttempt } from "../../hooks/useQuizAttempts";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "sonner";
import MainLayout from "../../components/layout/MainLayout";

export const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const quizId = parseInt(id || "0");
  const { data: quiz, isLoading, isError } = useQuiz(quizId);
  const startAttemptMutation = useStartQuizAttempt();

  const handleStartQuiz = async () => {
    try {
      const attempt = await startAttemptMutation.mutateAsync(quizId);
      navigate(`/quizzes/${quizId}/take/${attempt.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("quiz.errorStartingQuiz"));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Button variant="outline" onClick={() => navigate("/quizzes")}>
            {t("common.back")}
          </Button>

          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (isError || !quiz) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Button variant="outline" onClick={() => navigate("/quizzes")}>
            {t("common.back")}
          </Button>

          <Card className="p-6">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
              <p className="text-red-600">{t("quiz.errorLoadingQuiz")}</p>
              <Button onClick={() => navigate("/quizzes")}>
                {t("quiz.backToQuizzes")}
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Get localized content
  const title = quiz.title[locale] || quiz.title.en;
  const description = quiz.description?.[locale] || quiz.description?.en;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/quizzes")}>
          {t("common.back")}
        </Button>

        {/* Quiz Inactive Warning */}
        {!quiz.is_active && (
          <Card className="border-yellow-500 bg-yellow-50">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">{t("quiz.quizInactive")}</p>
            </CardContent>
          </Card>
        )}

        {/* Main Quiz Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{title}</CardTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  {quiz.language?.flag_url && (
                    <img
                      src={quiz.language.flag_url}
                      alt={quiz.language.code}
                      className="w-8 h-6 object-cover rounded"
                    />
                  )}
                  <Badge className="bg-primary-500 hover:bg-primary-600">
                    {quiz.level}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            {description && (
              <div>
                <h3 className="font-semibold mb-2">{t("quiz.description")}</h3>
                <p className="text-gray-700">{description}</p>
              </div>
            )}

            {/* Quiz Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FileQuestion className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">{t("quiz.questions")}</p>
                  <p className="font-semibold">{quiz.questions_count || 0}</p>
                </div>
              </div>

              {quiz.duration_minutes && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("quiz.duration")}
                    </p>
                    <p className="font-semibold">
                      {quiz.duration_minutes} {t("quiz.minutes")}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Target className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {t("quiz.passingScore")}
                  </p>
                  <p className="font-semibold">{quiz.passing_score}%</p>
                </div>
              </div>

              {quiz.creator && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t("quiz.teacher")}</p>
                    <p className="font-semibold">{quiz.creator.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Teacher Profile */}
            {quiz.creator?.teacher_profile && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {quiz.creator.teacher_profile.profile_image_url && (
                  <img
                    src={quiz.creator.teacher_profile.profile_image_url}
                    alt={quiz.creator.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{quiz.creator.name}</p>
                  <p className="text-sm text-gray-600">{t("quiz.createdBy")}</p>
                </div>
              </div>
            )}

            {/* Start Quiz Button */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleStartQuiz}
                disabled={!quiz.is_active || startAttemptMutation.isPending}
                className="bg-primary-500 hover:bg-primary-600 text-black"
              >
                {startAttemptMutation.isPending
                  ? t("quiz.starting")
                  : t("quiz.startQuiz")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Attempts */}
        {quiz.attempts && quiz.attempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("quiz.previousAttempts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quiz.attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => navigate(`/attempts/${attempt.id}/results`)}
                  >
                    <div className="flex items-center gap-4">
                      {attempt.is_passed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <div>
                        <p className="font-semibold">
                          {attempt.correct_answers}/{attempt.total_questions} (
                          {attempt.percentage}%)
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(
                            attempt.completed_at || attempt.started_at
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={attempt.is_passed ? "default" : "destructive"}
                    >
                      {attempt.is_passed ? t("quiz.passed") : t("quiz.failed")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default QuizDetail;
