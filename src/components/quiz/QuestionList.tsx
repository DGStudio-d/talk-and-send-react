import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteQuestion, useReorderQuestion } from '../../hooks/useQuestions';
import { QuizQuestion } from '../../types/models';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { QuestionFormModal } from './QuestionFormModal';

interface QuestionListProps {
  quizId: number;
  questions: QuizQuestion[];
}

export const QuestionList: React.FC<QuestionListProps> = ({ quizId, questions }) => {
  const { t, i18n } = useTranslation();
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const deleteQuestionMutation = useDeleteQuestion();
  const reorderQuestionMutation = useReorderQuestion();

  const currentLanguage = i18n.language as 'en' | 'ar' | 'es';

  const handleDelete = async () => {
    if (!deletingQuestionId) return;

    try {
      await deleteQuestionMutation.mutateAsync({
        id: deletingQuestionId,
        quizId,
      });
      toast.success(t('question.deleteSuccess'));
      setDeletingQuestionId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('question.deleteError'));
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const draggedQuestion = questions[draggedIndex];
    
    try {
      // The new order is the drop index + 1 (1-based indexing)
      await reorderQuestionMutation.mutateAsync({
        id: draggedQuestion.id,
        order: dropIndex + 1,
        quizId,
      });
      toast.success(t('question.reorderSuccess'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('question.reorderError'));
    }
    
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground">{t('question.noQuestions')}</p>
        <p className="text-sm text-muted-foreground mt-2">{t('question.addFirstQuestion')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-16">{t('question.order')}</TableHead>
              <TableHead>{t('question.questionText')}</TableHead>
              <TableHead className="w-32">{t('question.correctAnswer')}</TableHead>
              <TableHead className="w-32 text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question, index) => (
              <TableRow
                key={question.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <TableCell>
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </TableCell>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="max-w-md truncate">
                    {question.question_text?.[currentLanguage] || question.question_text?.en}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {t('question.option' + question.correct_option)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingQuestion(question)}
                      title={t('common.edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingQuestionId(question.id)}
                      title={t('common.delete')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Question Modal */}
      <QuestionFormModal
        quizId={quizId}
        question={editingQuestion || undefined}
        open={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingQuestionId} onOpenChange={() => setDeletingQuestionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('question.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('question.deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteQuestionMutation.isPending ? t('common.loading') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
