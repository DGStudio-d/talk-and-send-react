import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Star,
  Users,
  BookOpen,
  Globe,
  Calendar,
  MapPin,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { usePublicProfessors } from "@/services";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";

const ProfessorsPage = () => {
  const { linkTo } = useLocaleQuery();
  const { t, dir } = useLanguage();
  const { t: adminT } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterLanguage, setFilterLanguage] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Build filters
  const filters = {
    search: debouncedSearchQuery,
    sortBy,
    language: filterLanguage,
  };

  // React Query hook
  const { data: professors = [], isLoading, error } = usePublicProfessors();

  const filteredProfessors = professors.filter((professor) => {
    const matchesSearch =
      !debouncedSearchQuery ||
      professor.name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      professor.specialization
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());

    const matchesLanguage =
      !filterLanguage ||
      professor.languages?.some((lang) =>
        lang.toLowerCase().includes(filterLanguage.toLowerCase())
      );

    return matchesSearch && matchesLanguage;
  });

  const sortedProfessors = [...filteredProfessors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "students":
        return b.studentsCount - a.studentsCount;
      case "experience":
        return (b.experience || 0) - (a.experience || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">
          ({Math.floor(Math.random() * 100) + 50} reviews)
        </span>
      </div>
    );
  };

  return (
    <div>
      <Header variant="solid" />
      <div className="container mx-auto px-4 py-12 pt-28" dir={dir}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("professors.title")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("professors.subtitle")}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t("professors.searchPlaceholder")}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  className="w-full pl-10 pr-8 py-2 border border-input bg-background rounded-md"
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                >
                  <option value="">{t("professors.allLanguages")}</option>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="arabic">Arabic</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>

              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  className="w-full pl-10 pr-8 py-2 border border-input bg-background rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">
                    {t("professors.sortBy.rating")}
                  </option>
                  <option value="students">
                    {t("professors.sortBy.students")}
                  </option>
                  <option value="experience">
                    {t("professors.sortBy.experience")}
                  </option>
                  <option value="name">{t("professors.sortBy.name")}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">{t("professors.loading")}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{t("professors.error")}</p>
            <Button onClick={() => window.location.reload()}>
              {t("professors.retry")}
            </Button>
          </div>
        )}

        {/* Professors Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProfessors.map((professor) => (
              <Card
                key={professor.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={professor.profile_image}
                        alt={professor.name}
                      />
                      <AvatarFallback>
                        <Users className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {professor.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {professor.specialization}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {renderRating(professor.rating || 0)}
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Users className="h-3 w-3" />
                            <span className="text-xs">
                              {professor.students_count || 0} students
                            </span>
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-200 text-sm mt-3 line-clamp-3">
                        {professor.bio}
                      </p>

                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span>
                            {professor.languages?.join(", ") ||
                              "No languages specified"}
                          </span>
                        </div>

                        {professor.experience_years && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {professor.experience_years} years experience
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link
                          to={linkTo(`/professors/${professor.id}`)}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedProfessors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-2">
              {t("professors.noResults")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("professors.noResultsMessage")}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilterLanguage("");
                setSortBy("rating");
              }}
            >
              {t("professors.clearFilters")}
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfessorsPage;
