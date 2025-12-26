import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Search, UserPlus } from "lucide-react";
import { useUsers, useDeleteUser, useActivateUser, useDeactivateUser } from "../../hooks/useUsers";
import { User, UserRole } from "../../types/models";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
import { Card } from "../../components/ui/card";
import { toast } from "sonner";
import { EditUserModal } from "../../components/admin/EditUserModal";
import { CreateUserModal } from "../../components/admin/CreateUserModal";
import MainLayout from "../../components/layout/MainLayout";
import { Switch } from "../../components/ui/switch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

export const ManageUsers: React.FC = () => {
  const { t } = useTranslation();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);

  // Build query params
  const params = {
    ...(roleFilter !== "all" && { role: roleFilter }),
    ...(searchQuery && { search: searchQuery }),
    page: currentPage,
    per_page: 10,
  };

  const { data, isLoading, isError, refetch } = useUsers(params);
  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      toast.success(t("admin.users.deleteSuccess"));
      setUserToDelete(null);
      // Force refetch to ensure UI updates
      await refetch();
    } catch (error) {
      toast.error(t("admin.users.deleteError"));
    }
  };

  const handleToggleActive = async (user: User) => {
    // Prevent double-clicks
    if (togglingUserId === user.id) return;
    
    setTogglingUserId(user.id);
    try {
      if (user.is_active) {
        await deactivateUserMutation.mutateAsync(user.id);
        toast.success(t("admin.users.deactivateSuccess"));
        refetch();
      } else {
        await activateUserMutation.mutateAsync(user.id);
        toast.success(t("admin.users.activateSuccess"));
      }
      // Force refresh to ensure UI is in sync
      await refetch();
    } catch (error: any) {
      const message = error.response?.data?.message || t("admin.users.toggleError");
      toast.error(message);
      console.error('Toggle active error:', error.response?.data);
      // Refresh data to show correct state
      await refetch();
    } finally {
      setTogglingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div>
          <h1 className="text-3xl font-bold mb-6">{t("admin.users.title")}</h1>
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
            <AlertDescription>{t("admin.users.error")}</AlertDescription>
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
          <h1 className="text-3xl font-bold">{t("admin.users.title")}</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            {t("admin.users.createUser")}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t("admin.users.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t("admin.users.filterByRole")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin.users.allRoles")}</SelectItem>
              <SelectItem value={UserRole.Admin}>{t("roles.admin")}</SelectItem>
              <SelectItem value={UserRole.Teacher}>
                {t("roles.teacher")}
              </SelectItem>
              <SelectItem value={UserRole.Student}>
                {t("roles.student")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.users.name")}</TableHead>
                <TableHead>{t("admin.users.email")}</TableHead>
                <TableHead>{t("admin.users.role")}</TableHead>
                <TableHead>{t("admin.users.level")}</TableHead>
                <TableHead>{t("admin.users.status")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.users.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users && data.users.length > 0 ? (
                data.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === UserRole.Admin
                            ? "destructive"
                            : user.role === UserRole.Teacher
                            ? "default"
                            : "secondary"
                        }
                      >
                        {t(`roles.${user.role}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>{t(`levels.${user.level}`)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.is_active ?? false}
                          onCheckedChange={() => handleToggleActive(user)}
                          disabled={togglingUserId === user.id}
                        />
                        <span className="text-sm">
                          {togglingUserId === user.id ? (
                            <span className="text-gray-400">{t("common.loading")}</span>
                          ) : user.is_active ? (
                            t("admin.users.active")
                          ) : (
                            t("admin.users.inactive")
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserToDelete(user)}
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
                    {t("admin.users.noUsers")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {data?.pagination && data.pagination.total > data.pagination.per_page && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: data.pagination.last_page }, (_, i) => i + 1)
                  .filter((page) => {
                    const distance = Math.abs(page - currentPage);
                    return distance === 0 || distance === 1 || page === 1 || page === data.pagination.last_page;
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <PaginationItem>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(data.pagination.last_page, p + 1))}
                    className={currentPage === data.pagination.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!userToDelete}
          onOpenChange={() => setUserToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("admin.users.deleteConfirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("admin.users.deleteConfirmMessage", {
                  name: userToDelete?.name,
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Create User Modal */}
        <CreateUserModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* Edit User Modal */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            open={!!editingUser}
            onClose={() => setEditingUser(null)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ManageUsers;
