import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuizzes';
import { useDeleteQuestion } from '../../hooks/useQuestions';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import MainLayout from '../../components/layout/MainLayout';
import { QuizQuestion } from '../../types/models';
import { QuestionForm } from '../../components/teacher/QuestionForm';

export const ManageQuestions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const quizId = parseInt(id || '0');
  const { data: quiz, isLoading, isError, refetch } = useQuiz(quizId);
  console.log('quiz', quiz);
  const deleteQuestionMutation = useDeleteQuestion();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  const handleDelete = async () => {
    if (questionToDelete) {
      try {
        await deleteQuestionMutation.mutateAsync({ id: questionToDelete, quizId });
        toast.success(t('teacher.questionDeletedSuccess'));
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);
      } catch (error) {
        toast.error(t('teacher.questionDeletedError'));
      }
    }
  };

  const openDeleteDialog = (questionId: number) => {
    setQuestionToDelete(questionId);
    setDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingQuestion(null);
    setQuestionDialogOpen(true);
  };

  const openEditDialog = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setQuestionDialogOpen(true);
  };

  const closeQuestionDialog = () => {
    setQuestionDialogOpen(false);
    setEditingQuestion(null);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (isError || !quiz) {
    return (
      <MainLayout>
        <Card className="p-6">
          <div className="text-center space-y-4">
            <p className="text-red-600">{t('teacher.errorLoadingQuiz')}</p>
            <Button onClick={() => refetch()}>{t('common.retry')}</Button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  const questions = quiz.questions || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{quiz.title?.en || quiz.title}</h1>
            <p className="text-gray-600 mt-1">{t('teacher.manageQuestions')}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">
                {quiz.language?.name?.en || quiz.language?.name}
              </Badge>
              <Badge variant="outline">
                {t('levels.' + (quiz.level || 'beginner').toLowerCase())}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/teacher/quizzes')}>
              {t('teacher.backToQuizzes')}
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              {t('teacher.addQuestion')}
            </Button>
          </div>
        </div>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('teacher.questions')} ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {questions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>{t('teacher.questionText')}</TableHead>
                    <TableHead>{t('teacher.correctAnswer')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question: QuizQuestion, index: number) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                          <span className="font-medium">{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2">
                          {question.question_text}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {t('teacher.option')} {question.correct_option}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(question.id)}
                            disabled={deleteQuestionMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">{t('teacher.noQuestionsYet')}</p>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('teacher.addFirstQuestion')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question Form Dialog */}
        <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? t('teacher.editQuestion') : t('teacher.addQuestion')}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion
                  ? t('teacher.editQuestionDescription')
                  : t('teacher.addQuestionDescription')}
              </DialogDescription>
            </DialogHeader>
            <QuestionForm
              quizId={quizId}
              question={editingQuestion}
              onSuccess={closeQuestionDialog}
              onCancel={closeQuestionDialog}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('teacher.deleteQuestionTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('teacher.deleteQuestionMessage')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default ManageQuestions;
