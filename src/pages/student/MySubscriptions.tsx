import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMySubscriptions, useCancelSubscription } from '@/hooks/useSubscriptions';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Calendar, Clock, Users, XCircle } from 'lucide-react';
import { Subscription } from '@/types/models';
import { getTranslatedField, getLanguageName } from '@/lib/translationHelpers';

/**
 * MySubscriptions page - displays user's active subscriptions
 * Allows viewing subscription details and canceling subscriptions
 */
const MySubscriptions: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: subscriptions, isLoading } = useMySubscriptions();
  const cancelMutation = useCancelSubscription();

  const handleCancelClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (!selectedSubscription) return;

    try {
      await cancelMutation.mutateAsync(selectedSubscription.id);
      toast.success(t('subscription.cancelSuccess'));
      setShowCancelDialog(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('subscription.cancelError'));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      pending: 'secondary',
      expired: 'outline',
      cancelled: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {t(`subscription.status.${status}`)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Generate a descriptive name for the subscription plan
  const getPlanDescription = (subscription: Subscription) => {
    const plan = subscription.subscription_plan;
    if (!plan) return '';
    
    const languageName = getLanguageName(plan.language, i18n.language);
    
    return `${t(`subscription.${plan.type}`)} - ${languageName}`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('subscription.mySubscriptions')}</h1>
            <p className="text-muted-foreground mt-2">{t('subscription.mySubscriptionsDescription')}</p>
          </div>
          <Button onClick={() => navigate('/subscriptions/plans')}>
            {t('subscription.browsePlans')}
          </Button>
        </div>

        {/* Subscriptions List */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : subscriptions && subscriptions.length > 0 ? (
          <div className="space-y-6">
            {/* Desktop View - Table */}
            <Card className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('subscription.plan')}</TableHead>
                    <TableHead>{t('subscription.type')}</TableHead>
                    <TableHead>{t('subscription.status')}</TableHead>
                    <TableHead>{t('subscription.startDate')}</TableHead>
                    <TableHead>{t('subscription.endDate')}</TableHead>
                    <TableHead>{t('subscription.sessionsRemaining')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        {getPlanDescription(subscription)}
                      </TableCell>
                      <TableCell>
                        {subscription.subscription_plan ? t(`subscription.${subscription.subscription_plan.type}`) : ''}
                      </TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>{subscription.start_date ? formatDate(subscription.start_date) : '-'}</TableCell>
                      <TableCell>{subscription.end_date ? formatDate(subscription.end_date) : '-'}</TableCell>
                      <TableCell>
                        {subscription.sessions_remaining} / {subscription.subscription_plan?.sessions_per_month}
                      </TableCell>
                      <TableCell className="text-right">
                        {subscription.status === 'active' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelClick(subscription)}
                            disabled={cancelMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            {t('subscription.cancel')}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {getPlanDescription(subscription)}
                      </CardTitle>
                      {getStatusBadge(subscription.status)}
                    </div>
                    <CardDescription>
                      {subscription.subscription_plan ? t(`subscription.${subscription.subscription_plan.type}`) : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {subscription.start_date ? formatDate(subscription.start_date) : '-'} - {subscription.end_date ? formatDate(subscription.end_date) : '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {subscription.sessions_remaining} / {subscription.subscription_plan?.sessions_per_month}{' '}
                        {t('subscription.sessionsRemaining')}
                      </span>
                    </div>
                    {subscription.subscription_plan?.type === 'group' && subscription.group_subscription && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {t('subscription.group')}: {subscription.group_subscription.group_name}
                        </span>
                      </div>
                    )}
                    {subscription.status === 'active' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => handleCancelClick(subscription)}
                        disabled={cancelMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {t('subscription.cancel')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-muted-foreground">{t('subscription.noSubscriptions')}</p>
              <Button onClick={() => navigate('/subscriptions/plans')}>
                {t('subscription.browsePlans')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('subscription.cancelSubscription')}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedSubscription && (
                <div className="space-y-2 mt-4">
                  <p>{t('subscription.cancelConfirmMessage')}</p>
                  <p className="font-medium">
                    {getPlanDescription(selectedSubscription)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              disabled={cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? t('common.loading') : t('subscription.confirmCancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default MySubscriptions;