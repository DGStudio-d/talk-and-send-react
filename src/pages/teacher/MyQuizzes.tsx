import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen, Upload, Download } from "lucide-react";
import {
  useMyQuizzes,
  useDeleteQuiz,
  useToggleQuizActive,
} from "../../hooks/useQuizzes";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import MainLayout from "../../components/layout/MainLayout";
import { Quiz } from "../../types/models";

export const MyQuizzes: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: quizzes, isLoading, isError, refetch } = useMyQuizzes();
  const deleteQuizMutation = useDeleteQuiz();
  const toggleActiveMutation = useToggleQuizActive();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/quizzes/export?format=csv', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Export failed');
      }

      // Check if response is actually a file
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export returned JSON instead of file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `quizzes-${new Date().toISOString().split('T')[0]}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(t('teacher.exportSuccess'));
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || t('teacher.exportError'));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      toast.error(t('teacher.invalidFileType'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/quizzes/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }

      // Show detailed success message
      const summary = result.data;
      toast.success(
        t('teacher.importSuccessDetails', {
          quizzes: summary.created_quizzes || 0,
          questions: summary.created_questions || 0,
          skipped: summary.skipped_rows || 0,
        })
      );
      refetch();
    } catch (error: any) {
      toast.error(error.message || t('teacher.importError'));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (quizToDelete) {
      try {
        await deleteQuizMutation.mutateAsync(quizToDelete);
        toast.success(t("teacher.quizDeletedSuccess"));
        setDeleteDialogOpen(false);
        setQuizToDelete(null);
        refetch();
      } catch (error) {
        toast.error(t("teacher.quizDeletedError"));
      }
    }
  };

  const handleToggleActive = async (quizId: number) => {
    try {
      await toggleActiveMutation.mutateAsync(quizId);
      refetch();
      toast.success(t("teacher.quizStatusUpdated"));
    } catch (error) {
      toast.error(t("teacher.quizStatusError"));
    }
  };

  const openDeleteDialog = (quizId: number) => {
    setQuizToDelete(quizId);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div>
          <Card className="p-6">
            <div className="text-center space-y-4">
              <p className="text-red-600">{t("teacher.errorLoadingQuizzes")}</p>
              <Button onClick={() => refetch()}>{t("common.retry")}</Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("teacher.myQuizzes")}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="w-4 h-4 mr-2" />
              {t("teacher.import")}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              {t("teacher.export")}
            </Button>
            <Button onClick={() => navigate("/teacher/quizzes/create")}>
              <Plus className="w-4 h-4 mr-2" />
              {t("teacher.createQuiz")}
            </Button>
          </div>
        </div>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleImport}
          className="hidden"
        />

        {quizzes?.quizzes && quizzes?.quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes?.quizzes.map((quiz: Quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">
                      {quiz.title?.en || quiz.title || t("quiz.untitled")}
                    </CardTitle>
                    <Badge variant={quiz.is_active ? "default" : "secondary"}>
                      {quiz.is_active
                        ? t("common.active")
                        : t("common.inactive")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {quiz.description?.en ||
                      quiz.description ||
                      t("common.noDescription")}
                  </p>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="outline">
                      {quiz.language?.name?.en || quiz.language?.name}
                    </Badge>
                    <Badge variant="outline">
                      {t("levels." + (quiz.level || "beginner").toLowerCase())}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">{t("quiz.questions")}</p>
                      <p className="font-semibold">
                        {quiz.questions_count || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("teacher.attempts")}</p>
                      <p className="font-semibold">
                        {quiz.attempts_count || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("quiz.duration")}</p>
                      <p className="font-semibold">
                        {quiz.duration_minutes} {t("quiz.minutes")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("quiz.passingScore")}</p>
                      <p className="font-semibold">{quiz.passing_score}%</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        navigate(`/teacher/quizzes/${quiz.id}/questions`)
                      }
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {t("teacher.manageQuestions")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(quiz.id)}
                      disabled={toggleActiveMutation.isPending}
                    >
                      {quiz.is_active ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(quiz.id)}
                      disabled={deleteQuizMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("teacher.noQuizzesYet")}
                </h3>
                <p className="text-gray-600 mt-2">
                  {t("teacher.createFirstQuizDescription")}
                </p>
              </div>
              <Button onClick={() => navigate("/teacher/quizzes/create")}>
                <Plus className="w-4 h-4 mr-2" />
                {t("teacher.createQuiz")}
              </Button>
            </div>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("teacher.deleteQuizTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("teacher.deleteQuizMessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default MyQuizzes;
