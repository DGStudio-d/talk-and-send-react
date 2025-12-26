import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Eye, EyeOff, Plus, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAllQuizzes, useDeleteQuiz, useToggleQuizActive } from "../../hooks/useQuizzes";
import { useLanguages } from "../../hooks/useLanguages";
import { quizApi } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { QuizFilters } from "../../components/quiz/QuizFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";
import MainLayout from "../../components/layout/MainLayout";
import { useQueryClient } from "@tanstack/react-query";
import { QuizLevel } from "../../types/models";

export const ManageQuizzes: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Filter states
  const [languageId, setLanguageId] = useState<number | undefined>();
  const [level, setLevel] = useState<QuizLevel | undefined>();
  const [search, setSearch] = useState<string>("");
  const [quizToDelete, setQuizToDelete] = useState<any | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use existing hooks
  const { data: languages } = useLanguages();
  const deleteQuizMutation = useDeleteQuiz();
  const toggleActiveMutation = useToggleQuizActive();

  // Build query params
  const params = {
    ...(languageId && { language_id: languageId }),
    ...(level && { level }),
    ...(search && { search }),
  };

  // Fetch quizzes with filters using the hook
  const { data, isLoading, isError, refetch } = useAllQuizzes(params);

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    deleteQuizMutation.mutate(quizToDelete.id, {
      onSuccess: () => {
        toast.success(t("admin.quizzes.deleteSuccess"));
        setQuizToDelete(null);
        queryClient.invalidateQueries({ queryKey: ["all-quizzes"] });
      },
      onError: () => {
        toast.error(t("admin.quizzes.deleteError"));
      },
    });
  };

  const handleToggleActive = (quiz: any) => {
    toggleActiveMutation.mutate(quiz.id, {
      onSuccess: () => {
        toast.success(t("admin.quizzes.toggleSuccess"));
        queryClient.invalidateQueries({ queryKey: ["all-quizzes"] });
      },
      onError: () => {
        toast.error(t("admin.quizzes.toggleError"));
      },
    });
  };

  const handleFiltersChange = (filters: {
    languageId?: number;
    level?: QuizLevel;
    search?: string;
  }) => {
    setLanguageId(filters.languageId);
    setLevel(filters.level);
    setSearch(filters.search || "");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error(t("teacher.invalidFileType"));
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await quizApi.import(formData);
      const data = response.data.data;
      
      toast.success(
        t("teacher.importSuccessDetails", {
          quizzes: data.quizzes_imported,
          questions: data.questions_imported,
          skipped: data.rows_skipped,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("teacher.importError"));
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await quizApi.export();

      // Check if response is actually a file
      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Export returned JSON instead of file");
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = `quizzes-${new Date().toISOString().split("T")[0]}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(t("teacher.exportSuccess"));
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(error.message || t("teacher.exportError"));
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div>
          <h1 className="text-3xl font-bold mb-6">{t("admin.quizzes.title")}</h1>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div>
          <Alert variant="destructive">
            <AlertDescription>{t("admin.quizzes.error")}</AlertDescription>
          </Alert>
          <Button onClick={() => refetch()} className="mt-4">
            {t("common.retry")}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("admin.quizzes.title")}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? t("common.uploading") : t("teacher.import")}
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? t("common.loading") : t("teacher.export")}
            </Button>
            <Button onClick={() => navigate("/teacher/quizzes/create")}>
              <Plus className="w-4 h-4 mr-2" />
              {t("admin.quizzes.createQuiz")}
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

        {/* Filters - Using QuizFilters component */}
        <QuizFilters
          languageId={languageId}
          level={level}
          search={search}
          languages={languages}
          onChange={handleFiltersChange}
        />

        {/* Quizzes Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.quizzes.title")}</TableHead>
                <TableHead>{t("admin.quizzes.language")}</TableHead>
                <TableHead>{t("admin.quizzes.level")}</TableHead>
                <TableHead>{t("admin.quizzes.questions")}</TableHead>
                <TableHead>{t("admin.quizzes.active")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.quizzes.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((quiz: any) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">
                      {quiz.title?.en || quiz.title || t("quiz.untitled")}
                    </TableCell>
                    <TableCell>{quiz.language?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{quiz.level}</Badge>
                    </TableCell>
                    <TableCell>{quiz.questions_count || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={quiz.is_active ?? false}
                          onCheckedChange={() => handleToggleActive(quiz)}
                        />
                        <span className="text-sm flex items-center gap-1">
                          {quiz.is_active ? (
                            <>
                              <Eye className="w-4 h-4" />
                              {t("common.active")}
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              {t("common.inactive")}
                            </>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/teacher/quizzes/${quiz.id}/edit`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuizToDelete(quiz)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    {t("admin.quizzes.noQuizzes")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!quizToDelete}
          onOpenChange={() => setQuizToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("admin.quizzes.deleteConfirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("admin.quizzes.deleteConfirmMessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteQuiz}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default ManageQuizzes;
