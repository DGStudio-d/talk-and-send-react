import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AdminPlaceholderPageProps {
  titleKey: string;
}

const AdminPlaceholderPage: React.FC<AdminPlaceholderPageProps> = ({
  titleKey,
}) => {
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-2xl font-bold">{t(titleKey)}</h1>
      <p className="text-muted-foreground">{t("admin.comingSoon")}</p>
    </div>
  );
};

export default AdminPlaceholderPage;
