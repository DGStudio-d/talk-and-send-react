import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Users,
  Calendar,
} from 'lucide-react';

import { usePopularQuizzes, useRecentQuizzes } from '../hooks/useQuiz';
import { useActiveLanguages } from '../hooks/useLanguages';
import { useTranslation } from '../hooks/useTranslation';
import { Quiz, QuizLevel } from '../api/types';

const QUIZ_LEVELS: QuizLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const QuizListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalized, formatNumber } = useTranslation();
  
  // API hooks
  const { data: languages = [], loading: languagesLoading } = useActiveLanguages();
  const { data: popularQuizzes = [], loading: popularLoading, error: popularError } = usePopularQuizzes(6);
  const { data: recentQuizzes = [], loading: recentLoading, error: recentError } = useRecentQuizzes(6);
  
  // State
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | ''>('');
  const [selectedLanguage, setSelectedLanguage] = useState<number | ''>('');

  // Combine popular and recent quizzes
  useEffect(() => {
    if (!popularLoading && !recentLoading) {
      const combined = [...popularQuizzes, ...recentQuizzes];
      const unique = combined.filter((quiz, index, self) => 
        index === self.findIndex(q => q.id === quiz.id)
      );
      setAllQuizzes(unique);
      setLoading(false);
    }
  }, [popularQuizzes, recentQuizzes, popularLoading, recentLoading]);

  // Set error if any API call fails
  useEffect(() => {
    if (popularError || recentError) {
      setError(popularError?.message || recentError?.message || t('error.loading'));
      setLoading(false);
    }
  }, [popularError, recentError, t]);

  // Filter quizzes based on search and filters
  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = !searchQuery || 
      getLocalized(quiz.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description && getLocalized(quiz.description).toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = !selectedLevel || quiz.level === selectedLevel;
    const matchesLanguage = !selectedLanguage || quiz.language_id === selectedLanguage;
    
    return matchesSearch && matchesLevel && matchesLanguage;
  });

  const QuizCard: React.FC<{ quiz: Quiz; featured?: boolean }> = ({ quiz, featured = false }) => (
    <Card 
      className={`h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        featured ? 'border-2 border-primary' : ''
      }`}
      onClick={() => navigate(`/quiz/${quiz.id}`)}
    >
      <CardContent className="p-6">
        {featured && (
          <div className="flex items-center mb-4">
            <Star className="h-4 w-4 text-primary mr-2" />
            <Badge variant="default" className="text-xs font-bold">
              {t('quiz.featuredTitle').toUpperCase()}
            </Badge>
          </div>
        )}
        
        <h3 className="text-xl font-bold mb-3">
          {getLocalized(quiz.title)}
        </h3>
        
        {quiz.description && (
          <p className="text-sm text-muted-foreground mb-4 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {getLocalized(quiz.description)}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="default">{quiz.level}</Badge>
          {quiz.language && (
            <Badge variant="outline">{quiz.language.name}</Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{formatNumber(quiz.questions_count)} {t('quiz.stats.questions')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{formatNumber(quiz.attempts_count)} {t('quiz.stats.attempts')}</span>
            </div>
          </div>
        </div>
        
        {quiz.duration_minutes && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>~{quiz.duration_minutes} {t('quiz.stats.minutes')}</span>
          </div>
        )}
        
        <Button 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/quiz/${quiz.id}`);
          }}
        >
          {t('quiz.startQuiz')}
        </Button>
      </CardContent>
    </Card>
  );

  const QuizCardSkeleton: React.FC = () => (
    <Card className="h-full">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-16 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading.quizzes')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {t('quizList.title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('quizList.description')}
        </p>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('quizList.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as QuizLevel | '')}>
                <SelectTrigger>
                  <SelectValue placeholder={t('quizList.filterLevel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('quizList.filterLevel')}</SelectItem>
                  {QUIZ_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={selectedLanguage.toString()} 
                onValueChange={(value) => setSelectedLanguage(value === '' ? '' : parseInt(value))}
                disabled={languagesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('quizList.filterLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('quizList.filterLanguage')}</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id.toString()}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchQuery || selectedLevel || selectedLanguage) && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLevel('');
                  setSelectedLanguage('');
                }}
              >
                {t('quizList.clearFilters')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Quizzes Section */}
      {popularQuizzes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-bold">{t('quiz.popularTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularQuizzes.slice(0, 3).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} featured />
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      {/* Recent Quizzes Section */}
      {recentQuizzes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Calendar className="h-6 w-6 text-secondary mr-2" />
            <h2 className="text-2xl font-bold">{t('quiz.recentTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentQuizzes.slice(0, 3).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      {/* All Quizzes Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {t('quiz.allTitle')} ({formatNumber(filteredQuizzes.length)})
        </h2>
        
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16">
            <Avatar className="h-20 w-20 mx-auto mb-4 bg-muted">
              <AvatarFallback>
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-2">{t('quizList.noQuizzes')}</h3>
            <p className="text-muted-foreground">
              {t('quizList.noQuizzesDescription')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">
              {t('quizList.readyToTest')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t('quizList.chooseQuiz')}
            </p>
            <Button 
              variant="secondary"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-primary hover:bg-gray-100"
            >
              {t('quiz.browseAll')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizListPage;