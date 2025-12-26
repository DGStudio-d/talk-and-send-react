import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionPlans, useSubscriptionPlansByLanguage, useSubscribe } from '@/hooks/useSubscriptions';
import { useLanguages } from '@/hooks/useLanguages';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Users, Clock, DollarSign } from 'lucide-react';
import { SubscriptionPlan } from '@/types/models';
import { getTranslatedField, getLanguageName } from '@/lib/translationHelpers';

/**
 * SubscriptionPlans page - displays available subscription plans
 * Allows filtering by language and subscribing to plans
 */
const SubscriptionPlans: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: languages, isLoading: languagesLoading } = useLanguages();
  const { data: allPlans, isLoading: allPlansLoading } = useSubscriptionPlans();
  const { data: filteredPlans, isLoading: filteredPlansLoading } = useSubscriptionPlansByLanguage(
    selectedLanguageId || 0
  );
  const subscribeMutation = useSubscribe();

  const plans = selectedLanguageId ? filteredPlans : allPlans;
  const isLoading = selectedLanguageId ? filteredPlansLoading : allPlansLoading;

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const confirmSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      const subscriptionData: any = {
        subscription_plan_id: selectedPlan.id,
        payment_method: 'bank_transfer',
      };

      // For group plans, we might need to collect group name
      // This would require a modal or form to collect the group name
      // For now, we'll just use a placeholder
      if (selectedPlan.type === 'group') {
        subscriptionData.group_name = 'My Study Group'; // This should be collected from user input
      }

      await subscribeMutation.mutateAsync(subscriptionData);
      
      toast.success(t('subscription.subscribeSuccess'));
      setShowConfirmDialog(false);
      navigate('/subscriptions/my-subscriptions');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('subscription.subscribeError'));
    }
  };

  // Generate a descriptive name for the subscription plan
  const getPlanName = (plan: SubscriptionPlan) => {
    const languageName = getLanguageName(plan.language, i18n.language);
    
    return `${t(`subscription.${plan.type}`)} - ${languageName}`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('subscription.plans')}</h1>
          <p className="text-muted-foreground mt-2">{t('subscription.plansDescription')}</p>
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

        {/* Plans Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{getPlanName(plan)}</CardTitle>
                    <Badge variant={plan.type === 'individual' ? 'default' : 'secondary'}>
                      {t(`subscription.${plan.type}`)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {t('subscription.planDescription', { 
                      type: t(`subscription.${plan.type}`),
                      language: getLanguageName(plan.language, i18n.language)
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">{plan.price}</span>
                    {/* <span className="text-muted-foreground">{plan.currency}</span> */}
                  </div>

                  {/* Sessions */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {plan.sessions_per_month} {t('subscription.sessions')} × {plan.session_duration_minutes}{' '}
                      {t('subscription.minutes')}
                    </span>
                  </div>

                  {/* Max Members (for group plans) */}
                  {plan.type === 'group' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {t('subscription.maxMembers')}: {plan.max_group_members}
                      </span>
                    </div>
                  )}

                  {/* Language */}
                  <div className="text-sm text-muted-foreground">
                    {t('common.language')}: {getLanguageName(plan.language, i18n.language)}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? t('common.loading') : t('subscription.subscribe')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{t('subscription.noPlansAvailable')}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('subscription.confirmSubscription')}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPlan && (
                <div className="space-y-2 mt-4">
                  <p>
                    <strong>{t('subscription.plan')}:</strong>{' '}
                    {getPlanName(selectedPlan)}
                  </p>
                  <p>
                    <strong>{t('subscription.price')}:</strong> {selectedPlan.price}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    {t('subscription.confirmSubscriptionMessage')}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubscribe} disabled={subscribeMutation.isPending}>
              {subscribeMutation.isPending ? t('common.loading') : t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default SubscriptionPlans;