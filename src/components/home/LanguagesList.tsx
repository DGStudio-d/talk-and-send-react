import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguages } from "@/hooks/useLanguages";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useLanguageRefetch } from "@/hooks/useLanguageRefetch";

const LanguagesList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dir } = useLanguage();

  const { data: languages, isLoading, error } = useLanguages({ is_active: 1 });

  // Refetch languages when language changes
  useLanguageRefetch(["languages"]);

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse h-8 w-64 mx-auto bg-gray-300 rounded mb-12"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="animate-pulse h-16 w-16 mx-auto rounded-full bg-gray-300 mb-4"></div>
                  <div className="animate-pulse h-6 w-32 mx-auto bg-gray-300 rounded mb-2"></div>
                  <div className="animate-pulse h-4 w-24 mx-auto bg-gray-300 rounded mb-4"></div>
                  <div className="animate-pulse h-10 w-full bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{t("languages.errorLoading")}</p>
          <Button onClick={() => window.location.reload()}>
            {t("common.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50" dir={dir}>
      <div className="container mx-auto px-4">
        <h2
          className={`text-3xl font-bold text-center mb-12 text-academy-green ${
            dir === "rtl" ? "rtl" : "ltr"
          }`}
        >
          {t("languages.title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {languages?.map((language) => (
            <Card key={language.id} className="transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">
                  {language.flag_url ? (
                    <img
                      src={language.flag_url}
                      alt={language.name}
                      className="w-16 h-16 mx-auto object-contain"
                    />
                  ) : (
                    "🌐"
                  )}
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    dir === "rtl" ? "rtl" : "ltr"
                  }`}
                >
                  {language.name}
                </h3>
                <p className="text-gray-500 mb-2 text-sm">
                  {language.code.toUpperCase()}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-academy-green text-academy-green hover:bg-academy-green hover:text-white"
                  onClick={() => navigate("/register")}
                >
                  {t("button.register")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            className="bg-academy-green hover:bg-opacity-90 px-8"
            onClick={() => navigate("/register")}
          >
            {t("languages.registerCourse")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LanguagesList;
