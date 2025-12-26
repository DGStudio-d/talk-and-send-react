import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { QuizCard } from "../../components/quiz/QuizCard";
import { QuizFilters } from "../../components/quiz/QuizFilters";
import { useQuizzes } from "../../hooks/useQuizzes";
import { useLanguages } from "../../hooks/useLanguages";
import { useAuth } from "../../hooks/useAuth";
import { QuizLevel } from "../../types/models";
import { useLanguage } from "../../contexts/LanguageContext";
import MainLayout from "../../components/layout/MainLayout";

export const BrowseQuizzes: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const { user } = useAuth();
  const [filters, setFilters] = useState<{
    languageId?: number;
    level?: QuizLevel;
    search?: string;
  }>({});

  // Auto-set language filter to student's preferred language on mount
  useEffect(() => {
    if (user?.preferred_language_id && filters.languageId === undefined) {
      setFilters((prev) => ({
        ...prev,
        languageId: user.preferred_language_id,
      }));
    }
  }, [user?.preferred_language_id, filters.languageId]);

  // Fetch quizzes with is_active=true filter and student's preferred language
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useQuizzes({ 
    is_active: true,
    language_id: filters.languageId 
  });
  const { data: languages } = useLanguages();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Flatten all pages into single array
  const quizzes = useMemo(() => {
    return data?.pages.flatMap((page) => page.quizzes) || [];
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

  // Prepare languages for filter dropdown
  const languageOptions = useMemo(() => {
    if (!languages) return [];
    return languages.map((lang) => ({
      id: lang.id,
      name: lang.name, // Use localized name from API
    }));
  }, [languages, locale]);

  // Filter quizzes based on selected filters
  const filteredQuizzes = useMemo(() => {
    if (!quizzes || quizzes.length === 0) return [];

    return quizzes.filter((quiz: any) => {
      // Filter by language
      if (filters.languageId && quiz.language_id !== filters.languageId) {
        return false;
      }

      // Filter by level
      if (filters.level && quiz.level !== filters.level) {
        return false;
      }

      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const title = quiz.title[locale] || quiz.title.en;
        const description =
          quiz.description?.[locale] || quiz.description?.en || "";

        if (
          !title.toLowerCase().includes(searchLower) &&
          !description.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [quizzes, filters, locale]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{t("quiz.browseQuizzes")}</h1>

          {/* Filters Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>

          {/* Quiz Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
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
          <h1 className="text-3xl font-bold">{t("quiz.browseQuizzes")}</h1>
          <Card className="p-6">
            <div className="text-center space-y-4">
              <p className="text-red-600">{t("quiz.errorLoadingQuizzes")}</p>
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
        <h1 className="text-3xl font-bold">{t("quiz.browseQuizzes")}</h1>

        {/* Filters */}
        <QuizFilters
          languageId={filters.languageId}
          level={filters.level}
          search={filters.search}
          languages={languageOptions}
          onChange={setFilters}
        />

        {/* Quiz Grid */}
        {filteredQuizzes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              )}
            </div>
          </>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700">
                {t("quiz.noQuizzesFound")}
              </h3>
              <p className="text-gray-500">
                {filters.languageId || filters.level || filters.search
                  ? t("quiz.tryDifferentFilters")
                  : t("quiz.noQuizzesAvailable")}
              </p>
              {(filters.languageId || filters.level || filters.search) && (
                <Button variant="outline" onClick={() => setFilters({})}>
                  {t("quiz.clearFilters")}
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default BrowseQuizzes;
