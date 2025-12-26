
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useTeachers } from "@/hooks/useTeachers";
import { useLanguageRefetch } from "@/hooks/useLanguageRefetch";
import ProfessorCard from "@/components/professors/ProfessorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";

const ProfessorsPage = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const { data: teachers, isLoading, error } = useTeachers();
  
  // Refetch teachers when language changes
  useLanguageRefetch(['teachers']);

  if (isLoading) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-12" dir={dir}>
          <h1 className="text-3xl font-bold text-center mb-12 rtl">
            {t('professors.title')}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
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
          <p className="text-red-500 mb-4">{t('professors.errorLoading')}</p>
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
        <h1 className="text-3xl font-bold text-center mb-12 rtl">
          {t('professors.title')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers && teachers.length > 0 ? (
            teachers.map((teacher) => (
              <ProfessorCard key={teacher.id} professor={teacher} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              {t('professors.noProfessors')}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProfessorsPage;
