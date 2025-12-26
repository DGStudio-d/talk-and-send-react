import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Eye, EyeOff, Upload } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { User, UserRole } from "../../types/models";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";
import MainLayout from "../../components/layout/MainLayout";
import { teacherApi } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export const ManageTeachers: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [uploadingImageFor, setUploadingImageFor] = useState<number | null>(null);

  // Fetch only teachers
  const params = {
    role: UserRole.Teacher,
    ...(searchQuery && { search: searchQuery }),
  };

  const { data, isLoading, isError, refetch } = useUsers(params);

  const handleToggleVisibility = async (teacher: User) => {
    try {
      await teacherApi.adminToggleVisibility(teacher.id);
      toast.success(t("admin.teachers.visibilityToggled"));
      refetch();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      toast.error(t("admin.teachers.visibilityError"));
    }
  };

  const handleImageUpload = async (teacherId: number, file: File) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error(t("admin.languages.invalidFileType"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("admin.languages.fileTooLarge"));
      return;
    }

    try {
      setUploadingImageFor(teacherId);
      const formData = new FormData();
      formData.append("profile_image", file);
      
      await teacherApi.adminUploadImage(teacherId, formData);
      toast.success(t("admin.teachers.imageUploadSuccess"));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      refetch();
    } catch (error) {
      toast.error(t("admin.teachers.imageUploadError"));
    } finally {
      setUploadingImageFor(null);
    }
  };

  const handleUpdateProfile = async (teacher: User, bioData: any) => {
    try {
      await teacherApi.adminUpdateProfile(teacher.id, bioData);
      toast.success(t("admin.teachers.profileUpdateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingTeacher(null);
    } catch (error) {
      toast.error(t("admin.teachers.profileUpdateError"));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div>
          <h1 className="text-3xl font-bold mb-6">{t("admin.teachers.title")}</h1>
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
            <AlertDescription>{t("admin.teachers.error")}</AlertDescription>
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
          <h1 className="text-3xl font-bold">{t("admin.teachers.title")}</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder={t("admin.teachers.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Teachers Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.teachers.image")}</TableHead>
                <TableHead>{t("admin.teachers.name")}</TableHead>
                <TableHead>{t("admin.teachers.email")}</TableHead>
                <TableHead>{t("admin.teachers.visibility")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.teachers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users && data.users.length > 0 ? (
                data.users.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {teacher.teacher_profile?.profile_image_url ? (
                          <img
                            src={teacher.teacher_profile.profile_image_url}
                            alt={teacher.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">
                              {teacher.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <label htmlFor={`upload-${teacher.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={uploadingImageFor === teacher.id}
                            asChild
                          >
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4" />
                            </span>
                          </Button>
                          <input
                            id={`upload-${teacher.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(teacher.id, file);
                            }}
                          />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={teacher.teacher_profile?.is_visible ?? false}
                          onCheckedChange={() => handleToggleVisibility(teacher)}
                        />
                        <span className="text-sm flex items-center gap-1">
                          {teacher.teacher_profile?.is_visible ? (
                            <>
                              <Eye className="w-4 h-4" />
                              {t("admin.teachers.public")}
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              {t("admin.teachers.hidden")}
                            </>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTeacher(teacher)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        {t("admin.teachers.editBio")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    {t("admin.teachers.noTeachers")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Edit Bio Modal */}
        {editingTeacher && (
          <EditTeacherBioModal
            teacher={editingTeacher}
            open={!!editingTeacher}
            onClose={() => setEditingTeacher(null)}
            onSave={handleUpdateProfile}
          />
        )}
      </div>
    </MainLayout>
  );
};

interface EditTeacherBioModalProps {
  teacher: User;
  open: boolean;
  onClose: () => void;
  onSave: (teacher: User, bioData: any) => void;
}

const EditTeacherBioModal: React.FC<EditTeacherBioModalProps> = ({
  teacher,
  open,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [bioEn, setBioEn] = useState(teacher.teacher_profile?.bio?.en || "");
  const [bioAr, setBioAr] = useState(teacher.teacher_profile?.bio?.ar || "");
  const [bioEs, setBioEs] = useState(teacher.teacher_profile?.bio?.es || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    await onSave(teacher, {
      bio: {
        en: bioEn,
        ar: bioAr,
        es: bioEs,
      },
    });
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t("admin.teachers.editBio")} - {teacher.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bio-en">{t("teacher.bioEnglish")}</Label>
            <Textarea
              id="bio-en"
              value={bioEn}
              onChange={(e) => setBioEn(e.target.value)}
              placeholder={t("teacher.enterBioEnglish")}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="bio-ar">{t("teacher.bioArabic")}</Label>
            <Textarea
              id="bio-ar"
              value={bioAr}
              onChange={(e) => setBioAr(e.target.value)}
              placeholder={t("teacher.enterBioArabic")}
              rows={4}
              dir="rtl"
            />
          </div>

          <div>
            <Label htmlFor="bio-es">{t("teacher.bioSpanish")}</Label>
            <Textarea
              id="bio-es"
              value={bioEs}
              onChange={(e) => setBioEs(e.target.value)}
              placeholder={t("teacher.enterBioSpanish")}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? t("common.saving") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTeachers;
