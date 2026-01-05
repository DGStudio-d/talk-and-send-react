import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useQuiz,
  useQuizQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useUploadQuestionMedia,
  useReorderQuestions,
} from "@/services";
import type { QuizQuestion } from "@/types/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ArrowDown, ArrowUp, Upload } from "lucide-react";

const QUESTION_TYPES = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "matching",
  "ordering",
  "audio",
  "image",
  "reading",
] as const;

type QuestionType = (typeof QUESTION_TYPES)[number];

type QuestionFormState = {
  type: string;
  question_en: string;
  question_ar: string;
  question_es: string;
  optionA_en: string;
  optionB_en: string;
  optionC_en: string;
  optionD_en: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation_en: string;
  points: string;
  reading_en: string;
};

const emptyQuestionForm = (): QuestionFormState => ({
  type: "multiple_choice",
  question_en: "",
  question_ar: "",
  question_es: "",
  optionA_en: "",
  optionB_en: "",
  optionC_en: "",
  optionD_en: "",
  correct_option: "A",
  explanation_en: "",
  points: "1",
  reading_en: "",
});

const AdminQuizQuestionsPage: React.FC = () => {
  const { t, dir } = useLanguage();
  const { id } = useParams();
  const quizId = Number(id);

  const quizQuery = useQuiz(quizId);
  const questionsQuery = useQuizQuestions(quizId);

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();
  const uploadMediaMutation = useUploadQuestionMedia();
  const reorderMutation = useReorderQuestions();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  const [form, setForm] = useState<QuestionFormState>(emptyQuestionForm());

  const [deleteTarget, setDeleteTarget] = useState<QuizQuestion | null>(null);

  const [orderDraft, setOrderDraft] = useState<QuizQuestion[]>([]);
  const [dirtyOrder, setDirtyOrder] = useState(false);

  useEffect(() => {
    const list = questionsQuery.data ?? [];
    setOrderDraft(list.slice().sort((a, b) => a.order - b.order));
    setDirtyOrder(false);
  }, [questionsQuery.data]);

  const move = (index: number, direction: -1 | 1) => {
    setOrderDraft((prev) => {
      const next = prev.slice();
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = tmp;
      return next;
    });
    setDirtyOrder(true);
  };

  const saveOrder = async () => {
    const questionOrders = orderDraft.map((q, idx) => ({
      question_id: q.id,
      order: idx + 1,
    }));

    await reorderMutation.mutateAsync({ quizId, questionOrders });
    setDirtyOrder(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyQuestionForm());
    setFormOpen(true);
  };

  const openEdit = (q: QuizQuestion) => {
    setEditing(q);
    setForm({
      type: q.type,
      question_en: q.question_text?.en ?? "",
      question_ar: q.question_text?.ar ?? "",
      question_es: q.question_text?.es ?? "",
      optionA_en: q.option_a?.en ?? "",
      optionB_en: q.option_b?.en ?? "",
      optionC_en: q.option_c?.en ?? "",
      optionD_en: q.option_d?.en ?? "",
      correct_option: q.correct_option,
      explanation_en: q.explanation?.en ?? "",
      points: q.points != null ? String(q.points) : "1",
      reading_en: q.reading_text?.en ?? "",
    });
    setFormOpen(true);
  };

  const buildPayload = (): Partial<QuizQuestion> => {
    const payload: any = {
      type: form.type,
      question_text: {
        en: form.question_en,
        ar: form.question_ar || undefined,
        es: form.question_es || undefined,
      },
      points: Number(form.points || "1"),
      explanation: form.explanation_en
        ? { en: form.explanation_en }
        : undefined,
      reading_text: form.reading_en ? { en: form.reading_en } : undefined,
    };

    if (form.type === "multiple_choice") {
      payload.option_a = { en: form.optionA_en };
      payload.option_b = { en: form.optionB_en };
      payload.option_c = form.optionC_en ? { en: form.optionC_en } : undefined;
      payload.option_d = form.optionD_en ? { en: form.optionD_en } : undefined;
      payload.correct_option = form.correct_option;
    }

    return payload;
  };

  const save = async () => {
    const payload = buildPayload();

    if (editing) {
      await updateMutation.mutateAsync({
        quizId,
        questionId: editing.id,
        questionData: payload,
      });
    } else {
      await createMutation.mutateAsync({ quizId, questionData: payload });
    }

    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync({ quizId, questionId: deleteTarget.id });
    setDeleteTarget(null);
  };

  const onUploadMedia = async (q: QuizQuestion, file: File) => {
    await uploadMediaMutation.mutateAsync({
      quizId,
      questionId: q.id,
      file,
      questionType: q.type,
    });
  };

  if (!quizId) {
    return <div className="text-sm text-red-600">Invalid quiz id</div>;
  }

  return (
    <div dir={dir}>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quiz Questions</h1>
          <div className="text-sm text-muted-foreground">
            {quizQuery.data?.title?.en ?? ""}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => questionsQuery.refetch()}>
            {t("admin.users.refresh")}
          </Button>
          <Button onClick={openCreate}>Add Question</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>Questions</CardTitle>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {dirtyOrder ? "Order changed" : ""}
            </div>
            <Button
              variant="outline"
              disabled={!dirtyOrder || reorderMutation.isPending}
              onClick={saveOrder}
            >
              Save order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {questionsQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">
              {t("button.loading")}
            </div>
          ) : questionsQuery.error ? (
            <div className="text-sm text-red-600">{t("error.general")}</div>
          ) : (
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDraft.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-sm text-muted-foreground"
                      >
                        No questions
                      </TableCell>
                    </TableRow>
                  ) : (
                    orderDraft.map((q, idx) => (
                      <TableRow key={q.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => move(idx, -1)}
                              disabled={idx === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => move(idx, 1)}
                              disabled={idx === orderDraft.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">{idx + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{q.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {q.question_text?.en ?? "-"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            points: {q.points}
                          </div>
                        </TableCell>
                        <TableCell>
                          {q.media_url ? (
                            <a
                              href={q.media_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-academy-green underline"
                            >
                              view
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(q)}
                            >
                              {t("button.edit")}
                            </Button>
                            <label className="inline-flex">
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) onUploadMedia(q, file);
                                }}
                              />
                              <Button variant="outline" size="sm" asChild>
                                <span>
                                  <Upload className="h-4 w-4 me-2" />
                                  Media
                                </span>
                              </Button>
                            </label>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteTarget(q)}
                            >
                              {t("button.delete")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Type</div>
              <select
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={form.type}
                onChange={(e) =>
                  setForm((s) => ({ ...s, type: e.target.value }))
                }
              >
                {QUESTION_TYPES.map((qt) => (
                  <option key={qt} value={qt}>
                    {qt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Points</div>
              <Input
                value={form.points}
                onChange={(e) =>
                  setForm((s) => ({ ...s, points: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="text-sm font-medium">Question (EN)</div>
              <Input
                value={form.question_en}
                onChange={(e) =>
                  setForm((s) => ({ ...s, question_en: e.target.value }))
                }
              />
            </div>

            {form.type === "multiple_choice" ? (
              <>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Option A</div>
                  <Input
                    value={form.optionA_en}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, optionA_en: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Option B</div>
                  <Input
                    value={form.optionB_en}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, optionB_en: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Option C</div>
                  <Input
                    value={form.optionC_en}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, optionC_en: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Option D</div>
                  <Input
                    value={form.optionD_en}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, optionD_en: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Correct option</div>
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={form.correct_option}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        correct_option: e.target.value as any,
                      }))
                    }
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </>
            ) : null}

            <div className="space-y-1 md:col-span-2">
              <div className="text-sm font-medium">Explanation (EN)</div>
              <Input
                value={form.explanation_en}
                onChange={(e) =>
                  setForm((s) => ({ ...s, explanation_en: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="text-sm font-medium">Reading text (EN)</div>
              <Input
                value={form.reading_en}
                onChange={(e) =>
                  setForm((s) => ({ ...s, reading_en: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              {t("button.cancel")}
            </Button>
            <Button
              onClick={save}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {t("button.save")}
            </Button>
          </DialogFooter>
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
              Delete question #{deleteTarget?.id}?
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
    </div>
  );
};

export default AdminQuizQuestionsPage;
