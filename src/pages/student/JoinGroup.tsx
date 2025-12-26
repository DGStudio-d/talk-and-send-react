import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAvailableGroups, useJoinGroup } from '@/hooks/useSubscriptions';
import { useLanguages } from '@/hooks/useLanguages';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Users, Clock, Calendar, User } from 'lucide-react';
import { GroupSubscription } from '@/types/models';
import { getTranslatedField, getLanguageName } from '@/lib/translationHelpers';

/**
 * JoinGroup page - displays available group subscriptions
 * Allows filtering by language and joining groups
 */
const JoinGroup: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupSubscription | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: languages, isLoading: languagesLoading } = useLanguages();
  const { data: groups, isLoading: groupsLoading } = useAvailableGroups({
    language_id: selectedLanguageId,
  });
  const joinGroupMutation = useJoinGroup();

  const handleJoinClick = (group: GroupSubscription) => {
    setSelectedGroup(group);
    setShowConfirmDialog(true);
  };

  const confirmJoin = async () => {
    if (!selectedGroup) return;

    try {
      await joinGroupMutation.mutateAsync(selectedGroup.id);
      toast.success(t('subscription.joinGroupSuccess'));
      setShowConfirmDialog(false);
      navigate('/subscriptions/my-subscriptions');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('subscription.joinGroupError'));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAvailableSlots = (group: GroupSubscription) => {
    const maxMembers = group.max_members || 0;
    const currentMembers = group.current_members || 0;
    return maxMembers - currentMembers;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('subscription.joinGroup')}</h1>
          <p className="text-muted-foreground mt-2">{t('subscription.joinGroupDescription')}</p>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-4">
          <label htmlFor="language-filter" className="text-sm font-medium">
            {t('subscription.filterByLanguage')}
          </label>
          <Select
            value={selectedLanguageId?.toString() || 'all'}
            onValueChange={(value) => setSelectedLanguageId(value === 'all' ? null : parseInt(value))}
          >
            <SelectTrigger id="language-filter" className="w-[200px]">
              <SelectValue placeholder={t('subscription.allLanguages')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('subscription.allLanguages')}</SelectItem>
              {languagesLoading ? (
                <SelectItem value="loading" disabled>
                  {t('common.loading')}
                </SelectItem>
              ) : (
                languages?.map((language) => (
                  <SelectItem key={language.id} value={language.id.toString()}>
                    {getLanguageName(language, i18n.language)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Groups Grid */}
        {groupsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => {
              const availableSlots = getAvailableSlots(group);
              const isFull = availableSlots <= 0;
              const subscriptionPlan = group.subscription?.subscription_plan;
              const teacher = group.subscription?.teacher;

              return (
                <Card key={group.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{group.group_name}</CardTitle>
                      <Badge variant={isFull ? 'destructive' : 'default'}>
                        {isFull ? t('subscription.full') : t('subscription.available')}
                      </Badge>
                    </div>
                    <CardDescription>
                      {subscriptionPlan ? t('subscription.planDescription', { 
                        type: t(`subscription.${subscriptionPlan.type}`),
                        language: getLanguageName(subscriptionPlan.language, i18n.language)
                      }) : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    {/* Teacher */}
                    {teacher && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {t('subscription.teacher')}: {teacher.name}
                        </span>
                      </div>
                    )}

                    {/* Members */}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {group.current_members || 0} / {group.max_members}{' '}
                        {t('subscription.members')}
                      </span>
                    </div>

                    {/* Available Slots */}
                    {!isFull && (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {availableSlots} {t('subscription.slotsAvailable')}
                      </div>
                    )}

                    {/* Sessions */}
                    {subscriptionPlan && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {subscriptionPlan.sessions_per_month} {t('subscription.sessions')} ×{' '}
                          {subscriptionPlan.session_duration_minutes} {t('subscription.minutes')}
                        </span>
                      </div>
                    )}

                    {/* Start Date */}
                    {group.subscription?.start_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {t('subscription.startsOn')}: {formatDate(group.subscription.start_date)}
                        </span>
                      </div>
                    )}

                    {/* Language */}
                    <div className="text-sm text-muted-foreground">
                      {t('common.language')}:{' '}
                      {getLanguageName(subscriptionPlan?.language, i18n.language)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleJoinClick(group)}
                      disabled={isFull || joinGroupMutation.isPending}
                    >
                      {joinGroupMutation.isPending
                        ? t('common.loading')
                        : isFull
                        ? t('subscription.groupFull')
                        : t('subscription.joinGroup')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-muted-foreground">{t('subscription.noGroupsAvailable')}</p>
              <Button onClick={() => navigate('/subscriptions/plans')}>
                {t('subscription.viewIndividualPlans')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Join Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('subscription.confirmJoinGroup')}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedGroup && (
                <div className="space-y-2 mt-4">
                  <p>
                    <strong>{t('subscription.group')}:</strong> {selectedGroup.group_name}
                  </p>
                  <p>
                    <strong>{t('subscription.plan')}:</strong>{' '}
                    {selectedGroup.subscription?.subscription_plan ? t('subscription.planDescription', { 
                      type: t(`subscription.${selectedGroup.subscription.subscription_plan.type}`),
                      language: getLanguageName(selectedGroup.subscription.subscription_plan.language, i18n.language)
                    }) : ''}
                  </p>
                  {selectedGroup.subscription?.teacher && (
                    <p>
                      <strong>{t('subscription.teacher')}:</strong> {selectedGroup.subscription.teacher.name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-4">
                    {t('subscription.confirmJoinGroupMessage')}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmJoin} disabled={joinGroupMutation.isPending}>
              {joinGroupMutation.isPending ? t('common.loading') : t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default JoinGroup;