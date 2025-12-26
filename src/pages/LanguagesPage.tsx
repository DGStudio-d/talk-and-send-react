
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useLanguages } from "@/hooks/useLanguages";
import { useLanguageRefetch } from "@/hooks/useLanguageRefetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";

const LanguagesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const { data: languages, isLoading, error } = useLanguages({ is_active: 1 });
  
  // Refetch languages when language changes
  useLanguageRefetch(['languages']);
  
  if (isLoading) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-12" dir={dir}>
          <h1 className="text-3xl font-bold text-center mb-12 rtl">
            {t('languages.pageTitle')}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-12 text-center" dir={dir}>
          <p className="text-red-500 mb-4">{t('languages.errorLoading')}</p>
          <Button onClick={() => window.location.reload()}>{t('common.retry')}</Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-12" dir={dir}>
        <h1 className="text-3xl font-bold text-center mb-12">
          {t('languages.pageTitle')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {languages && languages.length > 0 ? languages.map((language) => (
            <Card key={language.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-academy-green/10 flex items-center justify-center">
                {language.flag_url ? (
                  <img src={language.flag_url} alt={language.name} className="w-24 h-24 object-contain" />
                ) : (
                  <span className="text-8xl">🌐</span>
                )}
              </div>
              <CardContent className="p-6" dir={dir}>
                <h2 className="text-2xl font-bold mb-2">{language.name}</h2>
                <p className="text-gray-600 mb-4 text-sm">{language.code.toUpperCase()}</p>
                <p className="text-gray-700 mb-6">
                  {t('languages.learnWith').replace('{language}', language.name)}
                </p>
                <div className={`flex gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-academy-green hover:bg-opacity-90 flex-1"
                  >
                    {t('button.register')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/whatsapp')}
                    className="border-academy-green text-academy-green hover:bg-academy-green hover:text-white flex-1"
                  >
                    {t('button.inquiry')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              {t('languages.noLanguages')}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LanguagesPage;
