import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { usePublicQuizAttemptResults } from "@/services";

const PublicQuizAttemptResultsPage = () => {
  const { publicAttemptId } = useParams();
  const id = publicAttemptId ?? "";

  const navigate = useNavigate();
  const { dir } = useLanguage();
  const { linkTo } = useLocaleQuery();
  const { t } = useTranslation();

  const { data, isLoading, error } = usePublicQuizAttemptResults(id);

  const passed = (data as any)?.data?.passed ?? (data as any)?.passed;
  const attempt = (data as any)?.data?.attempt ?? (data as any)?.attempt;

  return (
    <div>
      <Header variant="solid" />

      <div className="container mx-auto px-4 py-12 pt-28" dir={dir}>
        <Card>
          <CardHeader>
            <CardTitle>{t("quizResults.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-2/3" />
              </>
            ) : error ? (
              <div className="text-red-700">{t("error.loading")}</div>
            ) : (
              <>
                <div className="text-lg">
                  {t("quizResults.performance")}:{" "}
                  <span className="font-bold">{attempt?.score ?? "-"}</span>
                </div>
                <div className={passed ? "text-green-700" : "text-red-700"}>
                  {passed ? t("quizResults.passed") : t("quizResults.failed")}
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button onClick={() => navigate(linkTo("/quizzes"))}>
                {t("nav.quizzes")}
              </Button>
              {attempt?.quiz_id && (
                <Button
                  variant="outline"
                  onClick={() => navigate(linkTo(`/quiz/${attempt.quiz_id}`))}
                >
                  {t("quizResults.tryAgain")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PublicQuizAttemptResultsPage;
