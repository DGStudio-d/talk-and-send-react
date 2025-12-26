import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TeacherProfile } from '../../types/models';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedString } from '../../lib/translationHelpers';

interface TeacherCardProps {
  teacher: TeacherProfile;
}

export const TeacherCard: React.FC<TeacherCardProps> = React.memo(({ teacher }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  // Get localized bio
  const bio = getLocalizedString(teacher.bio, locale, '');
  
  // Create bio excerpt (first 100 characters)
  const bioExcerpt = bio.length > 100 ? `${bio.substring(0, 100)}...` : bio;

  const handleClick = useCallback(() => {
    navigate(`/teachers/${teacher.user_id}`);
  }, [navigate, teacher.user_id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const teacherName = teacher.user?.name || t('teacher.unknownTeacher');

  return (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-primary-500"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={t('teacher.viewTeacherProfile', { name: teacherName })}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          {teacher.profile_image_url ? (
            <img 
              src={teacher.profile_image_url} 
              alt={t('teacher.profileImage', { name: teacherName })}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              role="img"
              loading="lazy"
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0"
              aria-label={t('teacher.noProfileImage')}
            >
              <User className="w-8 h-8 text-primary-600" aria-hidden="true" />
            </div>
          )}
          <CardTitle className="text-lg">{teacherName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {bioExcerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {bioExcerpt}
          </p>
        )}
        {!bioExcerpt && (
          <p className="text-sm text-muted-foreground italic">
            {t('teacher.noBio')}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

TeacherCard.displayName = 'TeacherCard';
