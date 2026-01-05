import React, { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useLanguages,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
  useToggleLanguageActive,
  useUploadLanguageFlag,
} from "@/services";
import type { Language } from "@/types/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Upload } from "lucide-react";

const AdminLanguagesPage: React.FC = () => {
  const { t, dir, language } = useLanguage();

  const [search, setSearch] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Language | null>(null);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameEs, setNameEs] = useState("");
  const [code, setCode] = useState("");
  const [order, setOrder] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const [deleteTarget, setDeleteTarget] = useState<Language | null>(null);
  const [uploadTarget, setUploadTarget] = useState<Language | null>(null);

  const filters = useMemo(() => {
    const f: any = { active_only: false };
    if (search.trim()) f.search = search.trim();
    return f;
  }, [search]);

  const languagesQuery = useLanguages(filters);

  const createMutation = useCreateLanguage();
  const updateMutation = useUpdateLanguage();
  const deleteMutation = useDeleteLanguage();
  const toggleMutation = useToggleLanguageActive();
  const uploadFlagMutation = useUploadLanguageFlag();

  const rows = languagesQuery.data ?? [];

  const localName = (l: Language) =>
    language === "ar" ? l.name_ar : language === "es" ? l.name_es : l.name_en;

  const openCreate = () => {
    setEditing(null);
    setNameEn("");
    setNameAr("");
    setNameEs("");
    setCode("");
    setOrder("");
    setIsActive(true);
    setDialogOpen(true);
  };

  const openEdit = (l: Language) => {
    setEditing(l);
    setNameEn(l.name_en ?? "");
    setNameAr(l.name_ar ?? "");
    setNameEs(l.name_es ?? "");
    setCode(l.code ?? "");
    setOrder(l.order != null ? String(l.order) : "");
    setIsActive(!!l.is_active);
    setDialogOpen(true);
  };

  const save = async () => {
    const payload: any = {
      name_en: nameEn,
      name_ar: nameAr,
      name_es: nameEs,
      code,
      is_active: isActive,
      order: order !== "" ? Number(order) : undefined,
    };

    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        languageData: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setDialogOpen(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const onUploadFlag = async (file: File) => {
    if (!uploadTarget) return;
    await uploadFlagMutation.mutateAsync({ id: uploadTarget.id, file });
    setUploadTarget(null);
  };

  return (
    <div dir={dir}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("admin.nav.languages")}</h1>
        <p className="text-muted-foreground">
          {t("admin.languages.description")}
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>{t("admin.nav.languages")}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => languagesQuery.refetch()}
              >
                {t("admin.users.refresh")}
              </Button>
              <Button onClick={openCreate}>
                {t("admin.actions.addLanguage")}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("admin.languages.searchPlaceholder")}
              className="w-full md:w-96"
            />
          </div>
        </CardHeader>

        <CardContent>
          {languagesQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">
              {t("button.loading")}
            </div>
          ) : languagesQuery.error ? (
            <div className="text-sm text-red-600">{t("error.general")}</div>
          ) : (
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t("admin.languages.title")}</TableHead>
                    <TableHead>{t("admin.languages.code")}</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>{t("admin.users.table.status")}</TableHead>
                    <TableHead>Flag</TableHead>
                    <TableHead>{t("admin.users.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-sm text-muted-foreground"
                      >
                        {t("admin.users.noUsers")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell>{l.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{localName(l)}</div>
                          <div className="text-xs text-muted-foreground">
                            {l.name_en}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{l.code}</Badge>
                        </TableCell>
                        <TableCell>{l.order ?? "-"}</TableCell>
                        <TableCell>
                          {l.is_active ? (
                            <Badge className="bg-green-600">active</Badge>
                          ) : (
                            <Badge variant="outline">inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {l.flag_url ? (
                            <a
                              href={l.flag_url}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align={dir === "rtl" ? "end" : "start"}
                            >
                              <DropdownMenuItem onClick={() => openEdit(l)}>
                                {t("button.edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleMutation.mutate(l.id)}
                              >
                                {l.is_active ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setUploadTarget(l)}
                              >
                                <Upload className="h-4 w-4 me-2" />
                                Upload flag
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteTarget(l)}
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
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? t("button.edit") : t("admin.actions.addLanguage")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Name (EN)</div>
              <Input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Name (AR)</div>
              <Input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Name (ES)</div>
              <Input
                value={nameEs}
                onChange={(e) => setNameEs(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Code</div>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="en"
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Order</div>
              <Input
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Active</div>
              <select
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={isActive ? "1" : "0"}
                onChange={(e) => setIsActive(e.target.value === "1")}
              >
                <option value="1">true</option>
                <option value="0">false</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEditing(null);
              }}
            >
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
              Delete language {deleteTarget?.code}?
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

      <Dialog
        open={!!uploadTarget}
        onOpenChange={(o) => (!o ? setUploadTarget(null) : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload flag</DialogTitle>
          </DialogHeader>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadFlag(file);
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadTarget(null)}>
              {t("button.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLanguagesPage;
