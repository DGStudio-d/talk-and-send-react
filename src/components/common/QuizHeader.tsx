import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Search,
  ArrowLeft,
  Filter,
  BookOpen,
  Users,
  Clock,
} from "lucide-react";

interface QuizHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalQuizzes?: number;
  loading?: boolean;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  totalQuizzes = 0,
  loading = false,
}) => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  return (
    <div className="bg-white border-b" dir={dir}>
      <div className="container mx-auto px-4 py-6">
        {/* Header Navigation */}
        <div
          className={`flex items-center justify-between mb-6 ${
            dir === "rtl" ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`flex items-center gap-4 ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className={`flex items-center gap-2 ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("button.back")}
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("quiz.title")}
              </h1>
              <p className="text-gray-600 mt-1">{t("quiz.description")}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            <Button
              onClick={() => navigate("/register")}
              className="bg-academy-green hover:bg-opacity-90"
            >
              {t("button.register")}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-academy-green" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? "..." : totalQuizzes}
              </div>
              <div className="text-sm text-gray-600">
                {t("quiz.stats.totalQuizzes")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2.8K+</div>
              <div className="text-sm text-gray-600">
                {t("quiz.stats.students")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">30</div>
              <div className="text-sm text-gray-600">
                {t("quiz.stats.avgMinutes")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Filter className="h-6 w-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">6</div>
              <div className="text-sm text-gray-600">
                {t("quiz.stats.levels")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 ${
                dir === "rtl" ? "right-3" : "left-3"
              }`}
            />
            <Input
              placeholder={t("quiz.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pr-4 py-3 text-lg border-gray-300 focus:border-academy-green focus:ring-academy-green ${
                dir === "rtl" ? "pl-12" : "pr-12"
              }`}
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-center">
              <Badge variant="secondary" className="text-sm">
                {t("quiz.searchingFor")}: "{searchQuery}"
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
