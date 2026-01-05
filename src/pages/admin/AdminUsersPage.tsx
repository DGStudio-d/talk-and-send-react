import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useUsers,
  useActivateUser,
  useDeactivateUser,
  useDeleteUser,
  useUpdateUser,
  useUpdateUserRole,
  useResetUserPassword,
  useLanguages,
} from "@/services";
import type { User } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

type RoleTab = "teacher" | "student";

const normalizeLevel = (value?: string) => value || "beginner";

const AdminUsersPage: React.FC = () => {
  const { t, dir, language } = useLanguage();

  const [tab, setTab] = useState<RoleTab>("teacher");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const perPage = 15;

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [editingEmail, setEditingEmail] = useState<string>("");
  const [editingPhone, setEditingPhone] = useState<string>("");
  const [editingLevel, setEditingLevel] = useState<string>("");
  const [editingPreferredLanguageId, setEditingPreferredLanguageId] =
    useState<string>("");

  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");

  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { data: languages = [] } = useLanguages({
    is_active: true,
    active_only: true,
  });

  const usersQuery = useUsers({
    role: tab,
    search,
    page,
    per_page: perPage,
  } as any);

  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();
  const deleteMutation = useDeleteUser();
  const updateMutation = useUpdateUser();
  const updateRoleMutation = useUpdateUserRole();
  const resetPasswordMutation = useResetUserPassword();

  const rows = usersQuery.data?.data ?? [];
  const pagination = usersQuery.data?.pagination;

  const canPrev = (pagination?.current_page ?? 1) > 1;
  const canNext =
    (pagination?.current_page ?? 1) < (pagination?.last_page ?? 1);

  const openEdit = (u: User) => {
    setEditingUser(u);
    setEditingName(u.name ?? "");
    setEditingEmail(u.email ?? "");
    setEditingPhone(u.phone ?? "");
    setEditingLevel(normalizeLevel(u.level));
    setEditingPreferredLanguageId(
      u.preferred_language_id ? String(u.preferred_language_id) : ""
    );
  };

  const saveEdit = async () => {
    if (!editingUser) return;

    await updateMutation.mutateAsync({
      id: editingUser.id,
      userData: {
        name: editingName,
        email: editingEmail,
        phone: editingPhone,
        level: editingLevel,
        preferred_language_id: editingPreferredLanguageId
          ? Number(editingPreferredLanguageId)
          : undefined,
      } as any,
    });

    setEditingUser(null);
  };

  const toggleActive = async (u: User) => {
    if (u.is_active) {
      await deactivateMutation.mutateAsync(u.id);
    } else {
      await activateMutation.mutateAsync(u.id);
    }
  };

  const switchRole = async (u: User, nextRole: RoleTab) => {
    await updateRoleMutation.mutateAsync({ id: u.id, role: nextRole });
  };

  const submitResetPassword = async () => {
    if (!resetPasswordUser || !newPassword) return;
    await resetPasswordMutation.mutateAsync({
      id: resetPasswordUser.id,
      password: newPassword,
    });
    setResetPasswordUser(null);
    setNewPassword("");
  };

  const confirmDelete = async () => {
    if (!deleteUser) return;
    await deleteMutation.mutateAsync(deleteUser.id);
    setDeleteUser(null);
  };

  const title =
    tab === "teacher" ? t("admin.nav.teachers") : t("admin.users.role.student");

  return (
    <div dir={dir}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("admin.nav.users")}</h1>
        <p className="text-muted-foreground">{t("admin.users.subtitle")}</p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>{title}</CardTitle>
            <div className="flex gap-2">
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t("admin.users.searchPlaceholder")}
                className="w-full md:w-80"
              />
            </div>
          </div>

          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v as RoleTab);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="teacher">
                {t("admin.users.role.teacher")}
              </TabsTrigger>
              <TabsTrigger value="student">
                {t("admin.users.role.student")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="teacher" />
            <TabsContent value="student" />
          </Tabs>
        </CardHeader>

        <CardContent>
          {usersQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">
              {t("admin.users.loading")}
            </div>
          ) : usersQuery.error ? (
            <div className="text-sm text-red-600">{t("admin.users.retry")}</div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.users.table.user")}</TableHead>
                      <TableHead>{t("admin.users.table.role")}</TableHead>
                      <TableHead>{t("admin.users.table.status")}</TableHead>
                      <TableHead>{t("admin.users.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-sm text-muted-foreground"
                        >
                          {t("admin.users.noUsers")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {u.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{u.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {u.is_active ? (
                              <Badge className="bg-green-600">active</Badge>
                            ) : (
                              <Badge variant="outline">inactive</Badge>
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
                                <DropdownMenuItem onClick={() => openEdit(u)}>
                                  {t("button.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleActive(u)}
                                >
                                  {u.is_active
                                    ? t("admin.users.actions.deactivate")
                                    : t("admin.users.actions.activate")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    switchRole(
                                      u,
                                      tab === "teacher" ? "student" : "teacher"
                                    )
                                  }
                                >
                                  {tab === "teacher"
                                    ? "Move to Students"
                                    : "Move to Teachers"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setResetPasswordUser(u)}
                                >
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteUser(u)}
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
                  {pagination ? (
                    <span>
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                  ) : null}
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

      <Dialog
        open={!!editingUser}
        onOpenChange={(o) => (!o ? setEditingUser(null) : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("button.edit")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Name</div>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Email</div>
              <Input
                value={editingEmail}
                onChange={(e) => setEditingEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Phone</div>
              <Input
                value={editingPhone}
                onChange={(e) => setEditingPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Level</div>
              <select
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={editingLevel}
                onChange={(e) => setEditingLevel(e.target.value)}
              >
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Preferred language</div>
              <select
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={editingPreferredLanguageId}
                onChange={(e) => setEditingPreferredLanguageId(e.target.value)}
              >
                <option value="">-</option>
                {languages.map((l) => (
                  <option key={l.id} value={String(l.id)}>
                    {language === "ar"
                      ? l.name_ar
                      : language === "es"
                      ? l.name_es
                      : l.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              {t("button.cancel")}
            </Button>
            <Button onClick={saveEdit} disabled={updateMutation.isPending}>
              {t("button.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!resetPasswordUser}
        onOpenChange={(o) => (!o ? setResetPasswordUser(null) : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {resetPasswordUser?.email}
            </div>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPasswordUser(null)}
            >
              {t("button.cancel")}
            </Button>
            <Button
              onClick={submitResetPassword}
              disabled={resetPasswordMutation.isPending || !newPassword}
            >
              {t("button.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteUser}
        onOpenChange={(o) => (!o ? setDeleteUser(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("button.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              Delete user {deleteUser?.email}?
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

export default AdminUsersPage;
