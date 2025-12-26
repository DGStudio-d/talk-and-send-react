import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import {
  useLanguages,
  useDeleteLanguage,
  useToggleLanguageActive,
  useUploadLanguageFlag,
} from "../../hooks/useLanguages";
import { Language } from "../../types/models";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
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
import { Switch } from "../../components/ui/switch";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { LanguageFormModal } from "../../components/admin/LanguageFormModal";
import MainLayout from "../../components/layout/MainLayout";

const ManageLanguages: React.FC = () => {
  const { t } = useTranslation();
  const [languageToDelete, setLanguageToDelete] = useState<Language | null>(
    null
  );
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingFlagId, setUploadingFlagId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: languages, isLoading, isError, refetch } = useLanguages();
  const deleteLanguageMutation = useDeleteLanguage();
  const toggleActiveMutation = useToggleLanguageActive();
  const uploadFlagMutation = useUploadLanguageFlag();
  console.log(languages);

  const handleDeleteLanguage = async () => {
    if (!languageToDelete) return;

    try {
      await deleteLanguageMutation.mutateAsync(languageToDelete.id);
      toast.success(t("admin.languages.deleteSuccess"));
      setLanguageToDelete(null);
    } catch (error) {
      toast.error(t("admin.languages.deleteError"));
    }
  };

  const handleToggleActive = async (language: Language) => {
    try {
      await toggleActiveMutation.mutateAsync(language.id);
      toast.success(
        language.is_active
          ? t("admin.languages.deactivateSuccess")
          : t("admin.languages.activateSuccess")
      );
    } catch (error) {
      toast.error(t("admin.languages.toggleError"));
    }
  };

  const handleUploadFlag = (languageId: number) => {
    setUploadingFlagId(languageId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFlagId) return;

    try {
      await uploadFlagMutation.mutateAsync({ id: uploadingFlagId, file });
      toast.success(t("admin.languages.flagUploadSuccess"));
      setUploadingFlagId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(t("admin.languages.flagUploadError"));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div>
          <h1 className="text-3xl font-bold mb-6">
            {t("admin.languages.title")}
          </h1>
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
            <AlertDescription>{t("admin.languages.error")}</AlertDescription>
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
          <h1 className="text-3xl font-bold">{t("admin.languages.title")}</h1>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.languages.addLanguage")}
          </Button>
        </div>

        {/* Languages Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.languages.flag")}</TableHead>
                <TableHead>{t("admin.languages.nameEn")}</TableHead>
                <TableHead>{t("admin.languages.nameAr")}</TableHead>
                <TableHead>{t("admin.languages.nameEs")}</TableHead>
                <TableHead>{t("admin.languages.code")}</TableHead>
                <TableHead>{t("admin.languages.active")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.languages.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {languages && languages.length > 0 ? (
                languages.map((language) => (
                  <TableRow key={language.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={`${language.flag_url}}`}
                          alt={language.name_en}
                          className="w-8 h-6 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                        
                        <div
                          className={`w-8 h-6 bg-gray-200 rounded flex items-center justify-center ${
                            language.flag_url ? "hidden" : ""
                          }`}
                        >
                          <span className="text-xs text-gray-500">N/A</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUploadFlag(language.id)}
                          disabled={uploadFlagMutation.isPending}
                          title={t("admin.languages.uploadFlag")}
                        >
                          <Upload className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {language.name_en}
                    </TableCell>
                    <TableCell>{language.name_ar}</TableCell>
                    <TableCell>{language.name_es}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{language.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={language.is_active}
                        onCheckedChange={() => handleToggleActive(language)}
                        disabled={toggleActiveMutation.isPending}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingLanguage(language)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLanguageToDelete(language)}
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
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    {t("admin.languages.noLanguages")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!languageToDelete}
          onOpenChange={() => setLanguageToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("admin.languages.deleteConfirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("admin.languages.deleteConfirmMessage", {
                  name: languageToDelete?.name_en,
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteLanguage}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Language Form Modal */}
        <LanguageFormModal
          language={editingLanguage}
          open={isCreating || !!editingLanguage}
          onClose={() => {
            setIsCreating(false);
            setEditingLanguage(null);
          }}
        />

        {/* Hidden file input for flag upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpg,image/jpeg,image/svg+xml,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </MainLayout>
  );
};

export default ManageLanguages;
