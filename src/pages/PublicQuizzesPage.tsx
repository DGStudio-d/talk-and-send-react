import React, { useMemo, useState } from "react";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useFeaturedQuizzes,
  usePopularQuizzes,
  useRecentQuizzes,
  useSearchQuizzesByFilter,
} from "@/services";
import type { Quiz } from "@/types/api";
import { Search, Play, Clock } from "lucide-react";

const PublicQuizzesPage = () => {
  const { dir } = useLanguage();
  const { t, getLocalized } = useTranslation();
  const { linkTo } = useLocaleQuery();

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);

  const searching = debouncedQ.trim().length >= 2;

  const {
    data: featured = [],
    isLoading: featuredLoading,
    error: featuredError,
  } = useFeaturedQuizzes({ limit: 6 });

  const {
    data: popular = [],
    isLoading: popularLoading,
    error: popularError,
  } = usePopularQuizzes({ limit: 6 });

  const {
    data: recent = [],
    isLoading: recentLoading,
    error: recentError,
  } = useRecentQuizzes({ limit: 6 });

  const {
    data: searchResults = [],
    isLoading: searchLoading,
    error: searchError,
  } = useSearchQuizzesByFilter({ q: debouncedQ, limit: 24 });

  const anyError = featuredError || popularError || recentError || searchError;

  const QuizCard: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {getLocalized(quiz.title)}
          </CardTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="default">{quiz.level}</Badge>
            {quiz.language?.code && (
              <Badge variant="outline">
                {quiz.language.code.toUpperCase()}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {quiz.description?.en && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {getLocalized(quiz.description)}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{quiz.duration_minutes ?? "-"}</span>
            </div>
            <div>
              <span>{quiz.questions_count ?? "-"}</span>
            </div>
          </div>

          <Button asChild className="mt-auto">
            <a href={linkTo(`/quiz/${quiz.id}`)}>
              <Play className="h-4 w-4 mr-2" />
              {t("quiz.startQuiz")}
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const Section: React.FC<{
    title: string;
    quizzes: Quiz[];
    loading: boolean;
  }> = ({ title, quizzes, loading }) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-6" />
                    <Skeleton className="h-9 w-full" />
                  </CardContent>
                </Card>
              ))
            : quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
        </div>
      </div>
    );
  };

  const filteredSearch = useMemo(() => {
    if (!searching) return [];
    return searchResults;
  }, [searchResults, searching]);

  return (
    <div>
      <Header variant="solid" />

      <div className="container mx-auto px-4 py-12 pt-28" dir={dir}>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">{t("nav.quizzes")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("quiz.description")}
          </p>
        </div>

        <Card className="mb-10">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("common.search")}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {anyError && (
          <Card className="mb-10 border-red-200">
            <CardContent className="p-6 text-red-700">
              {t("error.loading")}
            </CardContent>
          </Card>
        )}

        {searching ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {t("common.search")} ({filteredSearch.length})
            </h2>

            {searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-2/3" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-6" />
                      <Skeleton className="h-9 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredSearch.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredSearch.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-muted-foreground">
                  {t("common.noResults")}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <Section
              title={t("quiz.featuredTitle")}
              quizzes={featured}
              loading={featuredLoading}
            />
            <Section
              title={t("quiz.popularTitle")}
              quizzes={popular}
              loading={popularLoading}
            />
            <Section
              title={t("quiz.recentTitle")}
              quizzes={recent}
              loading={recentLoading}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PublicQuizzesPage;
