import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { QuizLevel } from '../../types/models';

interface QuizFiltersProps {
  languageId?: number;
  level?: QuizLevel;
  search?: string;
  languages?: Array<{ id: number; name: string }>;
  onChange: (filters: {
    languageId?: number;
    level?: QuizLevel;
    search?: string;
  }) => void;
}

export const QuizFilters: React.FC<QuizFiltersProps> = React.memo(({
  languageId,
  level,
  search,
  languages = [],
  onChange,
}) => {
  const { t } = useTranslation();

  const handleLanguageChange = useCallback((value: string) => {
    onChange({
      languageId: value === 'all' ? undefined : parseInt(value),
      level,
      search,
    });
  }, [onChange, level, search]);

  const handleLevelChange = useCallback((value: string) => {
    onChange({
      languageId,
      level: value === 'all' ? undefined : (value as QuizLevel),
      search,
    });
  }, [onChange, languageId, search]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      languageId,
      level,
      search: e.target.value,
    });
  }, [onChange, languageId, level]);

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      role="search"
      aria-label={t('quiz.filterQuizzes')}
    >
      {/* Language Filter */}
      <div className="space-y-2">
        <Label htmlFor="language-filter">{t('quiz.filterByLanguage')}</Label>
        <Select
          value={languageId?.toString() || 'all'}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger 
            id="language-filter"
            aria-label={t('quiz.selectLanguage')}
          >
            <SelectValue placeholder={t('quiz.allLanguages')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('quiz.allLanguages')}</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id.toString()}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Level Filter */}
      <div className="space-y-2">
        <Label htmlFor="level-filter">{t('quiz.filterByLevel')}</Label>
        <Select
          value={level || 'all'}
          onValueChange={handleLevelChange}
        >
          <SelectTrigger 
            id="level-filter"
            aria-label={t('quiz.selectLevel')}
          >
            <SelectValue placeholder={t('quiz.allLevels')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('quiz.allLevels')}</SelectItem>
            <SelectItem value={QuizLevel.A1}>A1</SelectItem>
            <SelectItem value={QuizLevel.A2}>A2</SelectItem>
            <SelectItem value={QuizLevel.B1}>B1</SelectItem>
            <SelectItem value={QuizLevel.B2}>B2</SelectItem>
            <SelectItem value={QuizLevel.C1}>C1</SelectItem>
            <SelectItem value={QuizLevel.C2}>C2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search-filter">{t('quiz.searchByTitle')}</Label>
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" 
            aria-hidden="true"
          />
          <Input
            id="search-filter"
            type="search"
            placeholder={t('quiz.searchPlaceholder')}
            value={search || ''}
            onChange={handleSearchChange}
            className="pl-10"
            aria-label={t('quiz.searchByTitle')}
          />
        </div>
      </div>
    </div>
  );
});
