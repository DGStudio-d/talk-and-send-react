
import { useParams, useNavigate } from "react-router-dom";
import { useTeacher } from "@/hooks/useTeachers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, SendIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const ProfessorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dir, locale } = useLanguage();
  
  const { data: teacher, isLoading, error } = useTeacher(Number(id));

  // Get bio in current language
  const getBio = () => {
    if (!teacher || !teacher.bio) return '';
    if (locale === 'ar') return teacher.bio.ar || teacher.bio.en || '';
    if (locale === 'es') return teacher.bio.es || teacher.bio.en || '';
    return teacher.bio.en || '';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12" dir={dir}>
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !teacher) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" dir={dir}>
        <h2 className="text-2xl font-bold mb-4">{t('professors.notFound')}</h2>
        <Button onClick={() => navigate('/professors')}>
          {t('professors.backToList')}
        </Button>
      </div>
    );
  }

  const teacherName = teacher.user?.name || t('professors.anonymous');
  const profileImage = teacher.profile_image_url || '/placeholder-avatar.png';
  
  return (
    <div className="container mx-auto px-4 py-12" dir={dir}>
      <Button 
        variant="ghost" 
        onClick={() => navigate('/professors')}
        className="mb-6 flex gap-2"
      >
        <ArrowRight size={16} />
        {t('professors.backToList')}
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="rounded-lg overflow-hidden">
          <img 
            src={profileImage} 
            alt={teacherName} 
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-2">{teacherName}</h1>
            <p className="text-xl text-academy-green mb-4">{t('professors.teacher')}</p>
            
            <div className="border-t border-b py-4 my-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {getBio()}
              </p>
            </div>
            
            <div className="flex flex-col space-y-4 mt-6">
              <Button 
                onClick={() => navigate('/register')}
                className="w-full bg-academy-green hover:bg-opacity-90"
              >
                {t('button.register')}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/whatsapp')}
                className="w-full border-academy-green text-academy-green hover:bg-academy-green hover:text-white flex gap-2 items-center justify-center"
              >
                <SendIcon size={16} />
                {t('professors.contactViaWhatsApp')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorDetail;
