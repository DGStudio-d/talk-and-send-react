import React, { useCallback } from "react";
import { TeacherProfile } from "@/types/models";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfessorCardProps {
  professor: TeacherProfile;
}

const ProfessorCard = React.memo(({ professor }: ProfessorCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dir, locale } = useLanguage();

  const handleClick = useCallback(() => {
    navigate(`/professors/${professor.user_id}`);
  }, [navigate, professor.user_id]);

  // Get bio in current language
  const getBio = () => {
    if (!professor.bio) return '';
    if (locale === 'ar') return professor.bio.ar || professor.bio.en || '';
    if (locale === 'es') return professor.bio.es || professor.bio.en || '';
    return professor.bio.en || '';
  };

  // Get teacher name from user object
  const teacherName = professor.user?.name || t('professors.anonymous');
  
  // Get profile image
  const profileImage = professor.profile_image_url || '/placeholder-avatar.png';

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg" dir={dir}>
      <div className="aspect-square overflow-hidden">
        <img 
          src={profileImage} 
          alt={teacherName} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardContent className="p-5 rtl">
        <h3 className="text-xl font-bold text-center mb-2">{teacherName}</h3>
        <p className="text-academy-green text-center mb-4 line-clamp-2">{getBio()}</p>
        <Button 
          onClick={handleClick} 
          className="w-full bg-academy-green hover:bg-opacity-90"
        >
          {t('professors.meetButton')}
        </Button>
      </CardContent>
    </Card>
  );
});

export default ProfessorCard;
