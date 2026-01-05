import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Play,
  Users,
  Target,
  Languages,
} from "lucide-react";

import { useFeaturedQuizzes } from "../../hooks/useQuiz";
import { useActiveLanguages } from "../../hooks/useLanguages";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { useTranslation } from "../../hooks/useTranslation";
import { getLocalizedLanguageName } from "../../utils/localization";
import { Quiz } from "../../api/types";

export const QuizSection: React.FC = () => {
  const navigate = useNavigate();
  const {
    t,
    getLocalized,
    formatNumber,
    language: currentLanguage,
  } = useTranslation();

  // API hooks
  const {
    data: featuredQuizzes = [],
    loading: featuredLoading,
    error: featuredError,
  } = useFeaturedQuizzes();
  const { data: languages = [], loading: languagesLoading } =
    useActiveLanguages();
  const { data: stats, loading: statsLoading } = useDashboardStats();

  // Real stats from API
  const statsData = [
    {
      label: t("quiz.stats.totalQuizzes"),
      value: formatNumber(stats?.total_quizzes || 0),
      icon: BookOpen,
    },
    {
      label: t("quiz.stats.languages"),
      value: formatNumber(stats?.total_languages || 0),
      icon: Languages,
    },
    {
      label: t("quiz.stats.students"),
      value: formatNumber(stats?.total_users || 0),
      icon: Users,
    },
    {
      label: t("quiz.stats.successRate"),
      value: "85%", // This could be calculated from quiz results later
      icon: Target,
    },
  ];

  const StatCard: React.FC<{ stat: (typeof statsData)[0] }> = ({ stat }) => {
    const IconComponent = stat.icon;
    return (
      <Card className="text-center hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <Avatar className="mx-auto mb-4 bg-primary">
            <AvatarFallback>
              <IconComponent className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="text-3xl font-bold text-primary mb-2">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </CardContent>
      </Card>
    );
  };

  const QuizCard: React.FC<{ quiz: Quiz }> = ({ quiz }) => (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="flex-grow p-6">
        <div className="flex items-center mb-4">
          <Avatar className="mr-3 bg-primary">
            <AvatarFallback>
              <BookOpen className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {getLocalized(quiz.title)}
            </h3>
            <div className="flex gap-2">
              <Badge variant="default">{quiz.level}</Badge>
              {quiz.language && (
                <Badge variant="outline">
                  {getLocalizedLanguageName(quiz.language, currentLanguage)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {quiz.description && (
          <p
            className="text-sm text-muted-foreground mb-4 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {getLocalized(quiz.description)}
          </p>
        )}

        <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
          {quiz.duration_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {quiz.duration_minutes} {t("quiz.stats.minutes")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {formatNumber(quiz.attempts_count)} {t("quiz.stats.attempts")}
            </span>
          </div>
        </div>

        <Button className="w-full" onClick={() => navigate(`/quiz/${quiz.id}`)}>
          <Play className="h-4 w-4 mr-2" />
          {t("quiz.startQuiz")}
        </Button>
      </CardContent>
    </Card>
  );

  const QuizCardSkeleton: React.FC = () => (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Skeleton className="h-12 w-12 rounded-full mr-3" />
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t("quiz.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("quiz.description")}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Featured Quizzes */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              {t("quiz.featuredTitle")}
            </h3>
            <p className="text-lg text-muted-foreground">
              {t("quiz.featuredDescription")}
            </p>
          </div>

          {featuredError && (
            <Alert className="mb-6">
              <AlertDescription>{t("error.loading")}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLoading ? (
              // Show skeletons while loading
              Array.from({ length: 3 }).map((_, index) => (
                <QuizCardSkeleton key={index} />
              ))
            ) : featuredQuizzes.length > 0 ? (
              featuredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-xl font-semibold mb-2">
                  {t("quizList.noQuizzes")}
                </h4>
                <p className="text-muted-foreground">
                  {t("quizList.noQuizzesDescription")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">
                {t("quiz.readyToStart")}
              </h3>
              <p className="text-xl mb-8 opacity-90">
                {t("quiz.joinThousands")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/quizzes")}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  {t("quiz.browseAll")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="border-white text-white hover:bg-white/10"
                >
                  {t("quiz.viewDashboard")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
