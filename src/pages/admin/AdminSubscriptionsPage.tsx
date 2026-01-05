import React, { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useAdminSubscriptions,
  useActivateSubscription,
  useRejectSubscription,
  useLanguages,
  useSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
} from "@/services";
import type { Subscription, SubscriptionPlan } from "@/types/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type StatusFilter = "" | "pending" | "active" | "cancelled";
type PlansTypeFilter = "" | "individual" | "group";

const AdminSubscriptionsPage: React.FC = () => {
  const { t, dir, language } = useLanguage();

  const [tab, setTab] = useState<"subscriptions" | "plans">("subscriptions");

  const [status, setStatus] = useState<StatusFilter>("pending");
  const [userId, setUserId] = useState<string>("");
  const [languageId, setLanguageId] = useState<string>("");

  const [planLanguageId, setPlanLanguageId] = useState<string>("");
  const [planType, setPlanType] = useState<PlansTypeFilter>("");

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planPrice, setPlanPrice] = useState<string>("");
  const [planSessionsPerMonth, setPlanSessionsPerMonth] = useState<string>("");
  const [planSessionDuration, setPlanSessionDuration] = useState<string>("");
  const [planMaxGroupMembers, setPlanMaxGroupMembers] = useState<string>("");
  const [planIsActive, setPlanIsActive] = useState<boolean>(true);
  const [planDialogOpen, setPlanDialogOpen] = useState<boolean>(false);

  const [deletePlan, setDeletePlan] = useState<SubscriptionPlan | null>(null);

  const [confirm, setConfirm] = useState<
    | { kind: "activate"; sub: Subscription }
    | { kind: "reject"; sub: Subscription }
    | null
  >(null);

  const { data: languages = [] } = useLanguages({
    is_active: true,
    active_only: true,
  });

  const filters = useMemo(() => {
    const f: any = {};
    if (status) f.status = status;
    if (userId) f.user_id = Number(userId);
    if (languageId) f.language_id = Number(languageId);
    return f;
  }, [status, userId, languageId]);

  const subsQuery = useAdminSubscriptions(filters);
  const activateMutation = useActivateSubscription();
  const rejectMutation = useRejectSubscription();

  const subs = subsQuery.data?.data ?? [];

  const plansQuery = useSubscriptionPlans({
    language_id: planLanguageId ? Number(planLanguageId) : undefined,
    type: planType || undefined,
  });

  const createPlanMutation = useCreateSubscriptionPlan();
  const updatePlanMutation = useUpdateSubscriptionPlan();
  const deletePlanMutation = useDeleteSubscriptionPlan();

  const localizeLanguageName = (l: any) =>
    language === "ar" ? l.name_ar : language === "es" ? l.name_es : l.name_en;

  const statusBadge = (s?: string) => {
    if (s === "active") return <Badge className="bg-green-600">active</Badge>;
    if (s === "pending") return <Badge variant="secondary">pending</Badge>;
    if (s === "cancelled") return <Badge variant="outline">cancelled</Badge>;
    return <Badge variant="outline">{s ?? "-"}</Badge>;
  };

  const confirmAction = async () => {
    if (!confirm) return;
    if (confirm.kind === "activate") {
      await activateMutation.mutateAsync(confirm.sub.id);
    } else {
      await rejectMutation.mutateAsync(confirm.sub.id);
    }
    setConfirm(null);
  };

  const openNewPlan = () => {
    setEditingPlan(null);
    setPlanLanguageId("");
    setPlanType("");
    setPlanPrice("");
    setPlanSessionsPerMonth("");
    setPlanSessionDuration("");
    setPlanMaxGroupMembers("");
    setPlanIsActive(true);
    setPlanDialogOpen(true);
  };

  const openEditPlan = (p: SubscriptionPlan) => {
    setEditingPlan(p);
    setPlanLanguageId(String(p.language_id ?? ""));
    setPlanType((p.type as any) ?? "");
    setPlanPrice(p.price != null ? String(p.price) : "");
    setPlanSessionsPerMonth(
      p.sessions_per_month != null ? String(p.sessions_per_month) : ""
    );
    setPlanSessionDuration(
      p.session_duration_minutes != null
        ? String(p.session_duration_minutes)
        : ""
    );
    setPlanMaxGroupMembers(
      p.max_group_members != null ? String(p.max_group_members) : ""
    );
    setPlanIsActive(!!p.is_active);
    setPlanDialogOpen(true);
  };

  const savePlan = async () => {
    const payload: any = {
      language_id: planLanguageId ? Number(planLanguageId) : undefined,
      type: planType || undefined,
      price: planPrice ? Number(planPrice) : undefined,
      sessions_per_month: planSessionsPerMonth
        ? Number(planSessionsPerMonth)
        : undefined,
      session_duration_minutes: planSessionDuration
        ? Number(planSessionDuration)
        : undefined,
      max_group_members: planMaxGroupMembers
        ? Number(planMaxGroupMembers)
        : undefined,
      is_active: planIsActive,
    };

    if (editingPlan) {
      await updatePlanMutation.mutateAsync({
        id: editingPlan.id,
        planData: payload,
      });
    } else {
      await createPlanMutation.mutateAsync(payload);
    }

    setEditingPlan(null);
    setPlanDialogOpen(false);
  };

  const confirmDeletePlan = async () => {
    if (!deletePlan) return;
    await deletePlanMutation.mutateAsync(deletePlan.id);
    setDeletePlan(null);
  };

  return (
    <div dir={dir}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("admin.subscriptions.title")}</h1>
        <p className="text-muted-foreground">
          {t("admin.comingSoon.subscriptions")}
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle>{t("admin.subscriptions.title")}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => subsQuery.refetch()}>
                    {t("admin.users.refresh")}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StatusFilter)}
                  >
                    <option value="">All</option>
                    <option value="pending">pending</option>
                    <option value="active">active</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">User ID</div>
                  <Input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. 12"
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Language</div>
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={languageId}
                    onChange={(e) => setLanguageId(e.target.value)}
                  >
                    <option value="">All</option>
                    {languages.map((l) => (
                      <option key={l.id} value={String(l.id)}>
                        {localizeLanguageName(l)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {subsQuery.isLoading ? (
                <div className="text-sm text-muted-foreground">
                  {t("button.loading")}
                </div>
              ) : subsQuery.error ? (
                <div className="text-sm text-red-600">{t("error.general")}</div>
              ) : (
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subs.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-sm text-muted-foreground"
                          >
                            No subscriptions
                          </TableCell>
                        </TableRow>
                      ) : (
                        subs.map((s: any) => (
                          <TableRow key={s.id}>
                            <TableCell>{s.id}</TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {s.user?.name ?? "-"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {s.user?.email ?? "-"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {s.subscription_plan?.name ??
                                  s.subscriptionPlan?.name ??
                                  "-"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {s.subscription_plan?.language?.name_en ??
                                  s.subscriptionPlan?.language?.name_en ??
                                  ""}
                              </div>
                            </TableCell>
                            <TableCell>{statusBadge(s.status)}</TableCell>
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
                                    disabled={s.status !== "pending"}
                                    onClick={() =>
                                      setConfirm({ kind: "activate", sub: s })
                                    }
                                  >
                                    Activate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    disabled={s.status !== "pending"}
                                    onClick={() =>
                                      setConfirm({ kind: "reject", sub: s })
                                    }
                                  >
                                    Reject
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
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle>Subscription Plans</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => plansQuery.refetch()}
                  >
                    {t("admin.users.refresh")}
                  </Button>
                  <Button onClick={openNewPlan}>Create Plan</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Language</div>
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={planLanguageId}
                    onChange={(e) => setPlanLanguageId(e.target.value)}
                  >
                    <option value="">All</option>
                    {languages.map((l) => (
                      <option key={l.id} value={String(l.id)}>
                        {localizeLanguageName(l)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Type</div>
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={planType}
                    onChange={(e) =>
                      setPlanType(e.target.value as PlansTypeFilter)
                    }
                  >
                    <option value="">All</option>
                    <option value="individual">individual</option>
                    <option value="group">group</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {plansQuery.isLoading ? (
                <div className="text-sm text-muted-foreground">
                  {t("button.loading")}
                </div>
              ) : plansQuery.error ? (
                <div className="text-sm text-red-600">{t("error.general")}</div>
              ) : (
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(plansQuery.data ?? []).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center text-sm text-muted-foreground"
                          >
                            No plans
                          </TableCell>
                        </TableRow>
                      ) : (
                        (plansQuery.data ?? []).map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>{p.id}</TableCell>
                            <TableCell>
                              {localizeLanguageName(p.language)}
                            </TableCell>
                            <TableCell>{p.type}</TableCell>
                            <TableCell>{p.price}</TableCell>
                            <TableCell>
                              {p.sessions_per_month ?? "-"} /{" "}
                              {p.session_duration_minutes ?? "-"}m
                            </TableCell>
                            <TableCell>
                              {p.is_active ? (
                                <Badge className="bg-green-600">yes</Badge>
                              ) : (
                                <Badge variant="outline">no</Badge>
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
                                  <DropdownMenuItem
                                    onClick={() => openEditPlan(p)}
                                  >
                                    {t("button.edit")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      openEditPlan(p);
                                      setPlanIsActive(!p.is_active);
                                    }}
                                  >
                                    Toggle Active
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => setDeletePlan(p)}
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
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!confirm}
        onOpenChange={(o) => (!o ? setConfirm(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "activate"
                ? "Activate subscription"
                : "Reject subscription"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "activate"
                ? `Activate subscription #${confirm?.sub.id}?`
                : `Reject subscription #${confirm?.sub.id}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("button.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {confirm?.kind === "activate" ? "Activate" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Plan" : "Create Plan"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Language</div>
              <select
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={planLanguageId}
                onChange={(e) => setPlanLanguageId(e.target.value)}
              >
                <option value="">-</option>
                {languages.map((l) => (
                  <option key={l.id} value={String(l.id)}>
                    {localizeLanguageName(l)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Type</div>
              <select
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={planType}
                onChange={(e) => setPlanType(e.target.value as PlansTypeFilter)}
              >
                <option value="">-</option>
                <option value="individual">individual</option>
                <option value="group">group</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Price</div>
              <Input
                value={planPrice}
                onChange={(e) => setPlanPrice(e.target.value)}
                placeholder="e.g. 199"
              />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Sessions / month</div>
              <Input
                value={planSessionsPerMonth}
                onChange={(e) => setPlanSessionsPerMonth(e.target.value)}
                placeholder="e.g. 8"
              />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">
                Session duration (minutes)
              </div>
              <Input
                value={planSessionDuration}
                onChange={(e) => setPlanSessionDuration(e.target.value)}
                placeholder="e.g. 60"
              />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Max group members</div>
              <Input
                value={planMaxGroupMembers}
                onChange={(e) => setPlanMaxGroupMembers(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Active</div>
              <select
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={planIsActive ? "1" : "0"}
                onChange={(e) => setPlanIsActive(e.target.value === "1")}
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
                setPlanDialogOpen(false);
                setEditingPlan(null);
              }}
            >
              {t("button.cancel")}
            </Button>
            <Button
              onClick={savePlan}
              disabled={
                createPlanMutation.isPending || updatePlanMutation.isPending
              }
            >
              {t("button.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletePlan}
        onOpenChange={(o) => (!o ? setDeletePlan(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("button.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              Delete plan #{deletePlan?.id}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("button.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePlan}>
              {t("button.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSubscriptionsPage;
