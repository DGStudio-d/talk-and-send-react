import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useQuizzes,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  useToggleQuizActive,
  useExportQuizzes,
  useImportQuizzes,
  useEnhancedImportQuizzes,
  useDownloadQuizImportTemplate,
  useLanguages,
} from "@/services";
import type { Quiz, QuizFilter } from "@/types/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { downloadBlob } from "@/utils/fileUtils";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

type Level = (typeof LEVELS)[number] | "";

const quizFormSchema = z.object({
  title_en: z.string().min(1, "Title (EN) is required"),
  title_ar: z.string().optional(),
  title_es: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  description_es: z.string().optional(),
  language_id: z.string().optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  is_active: z.boolean(),
  duration_minutes: z
    .preprocess(
      (v) => (v === "" || v === undefined ? undefined : Number(v)),
      z.number().int().min(1).optional()
    )
    .optional(),
  passing_score: z
    .preprocess(
      (v) => (v === "" || v === undefined ? undefined : Number(v)),
      z.number().int().min(0).max(100).optional()
    )
    .optional(),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

const defaultQuizValues = (): QuizFormValues => ({
  title_en: "",
  title_ar: "",
  title_es: "",
  description_en: "",
  description_ar: "",
  description_es: "",
  language_id: "",
  level: "A1",
  is_active: true,
  duration_minutes: undefined,
  passing_score: undefined,
});

const AdminQuizzesPage: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [languageId, setLanguageId] = useState<string>("");
  const [level, setLevel] = useState<Level>("");
  const [active, setActive] = useState<"" | "true" | "false">("");

  const [page, setPage] = useState<number>(1);
  const perPage = 15;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Quiz | null>(null);

  const quizForm = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: defaultQuizValues(),
  });

  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null);

  const [importOpen, setImportOpen] = useState(false);
  const [importEnhanced, setImportEnhanced] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const { data: languages = [] } = useLanguages({
    is_active: true,
    active_only: true,
  });

  const filters = useMemo(() => {
    const f: QuizFilter = {
      page,
      per_page: perPage,
    };
    if (search.trim()) f.search = search.trim();
    if (languageId) f.language_id = Number(languageId);
    if (level) f.level = level;
    if (active) f.is_active = active === "true";
    return f;
  }, [active, languageId, level, page, search]);

  const quizzesQuery = useQuizzes(filters);

  const createMutation = useCreateQuiz();
  const updateMutation = useUpdateQuiz();
  const deleteMutation = useDeleteQuiz();
  const toggleMutation = useToggleQuizActive();

  const exportMutation = useExportQuizzes();
  const templateMutation = useDownloadQuizImportTemplate();
  const importMutation = useImportQuizzes();
  const enhancedImportMutation = useEnhancedImportQuizzes();

  const rows = quizzesQuery.data?.data ?? [];
  const pagination = quizzesQuery.data?.pagination;
  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext =
    (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const openCreate = () => {
    setEditing(null);
    quizForm.reset(defaultQuizValues());
    setFormOpen(true);
  };

  const openEdit = (q: Quiz) => {
    setEditing(q);
    quizForm.reset({
      title_en: q.title?.en ?? "",
      title_ar: q.title?.ar ?? "",
      title_es: q.title?.es ?? "",
      description_en: q.description?.en ?? "",
      description_ar: q.description?.ar ?? "",
      description_es: q.description?.es ?? "",
      language_id: q.language_id != null ? String(q.language_id) : "",
      level: (q.level as any) ?? "A1",
      is_active: !!q.is_active,
      duration_minutes: q.duration_minutes ?? undefined,
      passing_score: q.passing_score ?? undefined,
    });
    setFormOpen(true);
  };

  const onSubmit = async (values: QuizFormValues) => {
    const payload: any = {
      title: {
        en: values.title_en,
        ar: values.title_ar || undefined,
        es: values.title_es || undefined,
      },
      description:
        values.description_en || values.description_ar || values.description_es
          ? {
              en: values.description_en || undefined,
              ar: values.description_ar || undefined,
              es: values.description_es || undefined,
            }
          : undefined,
      language_id: values.language_id ? Number(values.language_id) : undefined,
      level: values.level,
      is_active: values.is_active,
      duration_minutes: values.duration_minutes ?? undefined,
      passing_score: values.passing_score ?? undefined,
    };

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, quizData: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const onExport = async () => {
    const blob = await exportMutation.mutateAsync(filters);
    downloadBlob(blob, `quizzes_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const onDownloadTemplate = async () => {
    const blob = await templateMutation.mutateAsync();
    downloadBlob(blob, "quiz_import_template.csv");
  };

  const onImport = async () => {
    if (!importFile) return;
    if (importEnhanced) {
      await enhancedImportMutation.mutateAsync(importFile);
    } else {
      await importMutation.mutateAsync(importFile);
    }
    setImportOpen(false);
    setImportFile(null);
  };

  const localizeLanguageName = (l: any) =>
    language === "ar" ? l.name_ar : language === "es" ? l.name_es : l.name_en;

  return (
    <div dir={dir}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("admin.quizzes.title")}</h1>
        <p className="text-muted-foreground">{t("admin.quizzes.comingSoon")}</p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>{t("admin.quizzes.title")}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => quizzesQuery.refetch()}>
                {t("admin.users.refresh")}
              </Button>
              <Button
                variant="outline"
                onClick={onExport}
                disabled={exportMutation.isPending}
              >
                Export
              </Button>
              <Button
                variant="outline"
                onClick={onDownloadTemplate}
                disabled={templateMutation.isPending}
              >
                Template
              </Button>
              <Button variant="outline" onClick={() => setImportOpen(true)}>
                Import
              </Button>
              <Button onClick={openCreate}>Create Quiz</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("admin.users.searchPlaceholder")}
            />

            <select
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
              value={languageId}
              onChange={(e) => {
                setLanguageId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All languages</option>
              {languages.map((l) => (
                <option key={l.id} value={String(l.id)}>
                  {localizeLanguageName(l)}
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value as Level);
                setPage(1);
              }}
            >
              <option value="">All levels</option>
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
              value={active}
              onChange={(e) => {
                setActive(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="">All status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {quizzesQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">
              {t("button.loading")}
            </div>
          ) : quizzesQuery.error ? (
            <div className="text-sm text-red-600">{t("error.general")}</div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Counts</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-sm text-muted-foreground"
                        >
                          No quizzes
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((q) => (
                        <TableRow key={q.id}>
                          <TableCell>{q.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {q.title?.en ?? "-"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {q.description?.en ?? ""}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {q.language?.code ?? q.language_id}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{q.level}</Badge>
                          </TableCell>
                          <TableCell>
                            {q.is_active ? (
                              <Badge className="bg-green-600">active</Badge>
                            ) : (
                              <Badge variant="outline">inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              Q: {q.questions_count ?? 0} / A:{" "}
                              {q.attempts_count ?? 0}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align={dir === "rtl" ? "end" : "start"}
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/admin/quizzes/${q.id}/questions`)
                                  }
                                >
                                  Questions
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(q)}>
                                  {t("button.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleMutation.mutate(q.id)}
                                >
                                  Toggle Active
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteTarget(q)}
                                >
                                  {t("button.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {pagination
                    ? `Page ${pagination.current_page} of ${pagination.last_page}`
                    : null}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={!canPrev}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {t("button.previous")}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!canNext}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {t("button.next")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
          </DialogHeader>

          <Form {...quizForm}>
            <form
              onSubmit={quizForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={quizForm.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (EN)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (AR)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="title_es"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (ES)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="language_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        >
                          <option value="">-</option>
                          {languages.map((l) => (
                            <option key={l.id} value={String(l.id)}>
                              {localizeLanguageName(l)}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          {LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="passing_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing score (0-100)</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (EN)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (AR)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="description_es"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (ES)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quizForm.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                          value={field.value ? "1" : "0"}
                          onChange={(e) =>
                            field.onChange(e.target.value === "1")
                          }
                        >
                          <option value="1">true</option>
                          <option value="0">false</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setEditing(null);
                  }}
                >
                  {t("button.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    quizForm.formState.isSubmitting
                  }
                >
                  {t("button.save")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => (!o ? setDeleteTarget(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("button.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              Delete quiz #{deleteTarget?.id}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("button.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t("button.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Quizzes</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Enhanced import</div>
              <Switch
                checked={importEnhanced}
                onCheckedChange={setImportEnhanced}
              />
            </div>

            <input
              type="file"
              accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
            />

            <div className="text-sm text-muted-foreground">
              {importFile
                ? `Selected: ${importFile.name}`
                : "Select a CSV/Excel file."}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImportOpen(false);
                setImportFile(null);
              }}
            >
              {t("button.cancel")}
            </Button>
            <Button
              onClick={onImport}
              disabled={
                !importFile ||
                importMutation.isPending ||
                enhancedImportMutation.isPending
              }
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuizzesPage;
