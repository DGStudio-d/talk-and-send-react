import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Filter, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { AttemptCard } from "../../components/quiz/AttemptCard";
import { useQuizAttempts } from "../../hooks/useQuizAttempts";
import { useLanguage } from "../../contexts/LanguageContext";
import MainLayout from "../../components/layout/MainLayout";

export const MyAttempts: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const [filterQuizId, setFilterQuizId] = useState<number | undefined>();
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "failed">(
    "all"
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useQuizAttempts();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Flatten all pages into single array
  const attempts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.attempts || []);
  }, [data]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  console.log("attempts", attempts);

  // Get unique quizzes from attempts for filter dropdown
  const uniqueQuizzes = useMemo(() => {
    if (!attempts || !Array.isArray(attempts)) return [];

    const quizMap = new Map();
    attempts.forEach((attempt) => {
      if (attempt.quiz && !quizMap.has(attempt.quiz.id)) {
        const title = attempt.quiz.title?.[locale] || attempt.quiz.title?.en || t('quiz.deletedQuiz');
        const isDeleted = !attempt.quiz || attempt.quiz.is_deleted;
        quizMap.set(attempt.quiz.id, {
          id: attempt.quiz.id,
          title: isDeleted ? `${title} (${t('quiz.deleted')})` : title,
        });
      }
    });

    return Array.from(quizMap.values());
  }, [attempts, locale, t]);

  // Filter attempts
  const filteredAttempts = useMemo(() => {
    if (!attempts || !Array.isArray(attempts)) return [];

    return attempts.filter((attempt) => {
      // Filter by quiz
      if (filterQuizId && attempt.quiz_id !== filterQuizId) {
        return false;
      }

      // Filter by status
      if (filterStatus === "passed" && !attempt.is_passed) {
        return false;
      }
      if (filterStatus === "failed" && attempt.is_passed) {
        return false;
      }

      return true;
    });
  }, [attempts, filterQuizId, filterStatus]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{t("quiz.myAttempts")}</h1>

          {/* Filters Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Attempts Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{t("quiz.myAttempts")}</h1>
          <Card className="p-6">
            <div className="text-center space-y-4">
              <p className="text-red-600">{t("quiz.errorLoadingAttempts")}</p>
              <Button onClick={() => refetch()}>{t("common.retry")}</Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("quiz.myAttempts")}</h1>

        {/* Filters */}
        {attempts && attempts.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold">{t("quiz.filters")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quiz Filter */}
              <div className="space-y-2">
                <Label htmlFor="quiz-filter">{t("quiz.filterByQuiz")}</Label>
                <Select
                  value={filterQuizId?.toString() || "all"}
                  onValueChange={(value) =>
                    setFilterQuizId(
                      value === "all" ? undefined : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger id="quiz-filter">
                    <SelectValue placeholder={t("quiz.allQuizzes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("quiz.allQuizzes")}</SelectItem>
                    {uniqueQuizzes.map((quiz) => (
                      <SelectItem key={quiz.id} value={quiz.id.toString()}>
                        {quiz.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status-filter">
                  {t("quiz.filterByStatus")}
                </Label>
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    setFilterStatus(value as "all" | "passed" | "failed")
                  }
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("quiz.allStatuses")}</SelectItem>
                    <SelectItem value="passed">{t("quiz.passed")}</SelectItem>
                    <SelectItem value="failed">{t("quiz.failed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {/* Attempts Grid */}
        {filteredAttempts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttempts.map((attempt) => (
                <AttemptCard key={attempt.id} attempt={attempt} />
              ))}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              )}
            </div>
          </>
        ) : attempts && attempts.length > 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700">
                {t("quiz.noAttemptsMatchFilters")}
              </h3>
              <p className="text-gray-500">{t("quiz.tryDifferentFilters")}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterQuizId(undefined);
                  setFilterStatus("all");
                }}
              >
                {t("quiz.clearFilters")}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700">
                {t("quiz.noAttempts")}
              </h3>
              <p className="text-gray-500">{t("quiz.noAttemptsDescription")}</p>
              <Button
                onClick={() => navigate("/quizzes")}
                className="bg-primary-500 hover:bg-primary-600"
              >
                {t("quiz.browseQuizzes")}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default MyAttempts;
