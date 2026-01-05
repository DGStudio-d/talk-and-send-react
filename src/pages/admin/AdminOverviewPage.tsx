import React from "react";
import { useAdminDashboard } from "@/services";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const AdminOverviewPage: React.FC = () => {
  const { t } = useLanguage();
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-sm text-red-600">{t("error.general")}</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("admin.dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("admin.dashboard.manageSystemDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("admin.stats.totalUsers")}
          value={data.total_users ?? 0}
        />
        <StatCard
          title={t("admin.stats.totalQuizzes")}
          value={data.total_quizzes ?? 0}
        />
        <StatCard
          title={t("admin.stats.totalAttempts")}
          value={data.total_attempts ?? 0}
        />
        <StatCard
          title={t("admin.stats.activeLanguages")}
          value={data.active_languages ?? 0}
        />
      </div>
    </div>
  );
};

export default AdminOverviewPage;
