import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GripVertical, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { QuizQuestion } from '../../types/models';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuestionListItemProps {
  question: QuizQuestion;
  questionNumber: number;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export const QuestionListItem: React.FC<QuestionListItemProps> = React.memo(({
  question,
  questionNumber,
  onEdit,
  onDelete,
  dragHandleProps,
}) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();

  // Get localized question text
  const questionText = useMemo(
    () => question.question_text[locale] || question.question_text.en,
    [question.question_text, locale]
  );

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex-shrink-0">
                  {t('question.number', { number: questionNumber })}
                </Badge>
                <Badge className="bg-primary-500 hover:bg-primary-600 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('question.correctAnswer')}: {question.correct_option}
                </Badge>
              </div>
            </div>
            <p className="text-sm line-clamp-2">{questionText}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-8"
            >
              <Edit className="w-4 h-4 mr-1" />
              {t('common.edit')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
