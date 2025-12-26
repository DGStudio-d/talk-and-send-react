import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../lib/api';
import { SubscriptionPlan, Subscription, GroupSubscription } from '../types/models';

/**
 * Hook for fetching all subscription plans
 */
export const useSubscriptionPlans = (params?: any) => {
  return useQuery({
    queryKey: ['subscriptionPlans', params],
    queryFn: async () => {
      const response = await subscriptionApi.getPlans(params);
      return response.data.data as SubscriptionPlan[];
    },
  });
};

/**
 * Hook for fetching subscription plans by language
 */
export const useSubscriptionPlansByLanguage = (languageId: number) => {
  return useQuery({
    queryKey: ['subscriptionPlans', 'language', languageId],
    queryFn: async () => {
      const response = await subscriptionApi.getPlansByLanguage(languageId);
      return response.data.data as SubscriptionPlan[];
    },
    enabled: !!languageId,
  });
};

/**
 * Hook for fetching a single subscription plan by ID
 */
export const useSubscriptionPlan = (id: number) => {
  return useQuery({
    queryKey: ['subscriptionPlan', id],
    queryFn: async () => {
      const response = await subscriptionApi.getPlanById(id);
      return response.data.data as SubscriptionPlan;
    },
    enabled: !!id,
  });
};

/**
 * Hook for fetching current user's subscriptions
 */
export const useMySubscriptions = (params?: any) => {
  return useQuery({
    queryKey: ['mySubscriptions', params],
    queryFn: async () => {
      const response = await subscriptionApi.getMySubscriptions(params);
      return response.data.data as Subscription[];
    },
  });
};

/**
 * Hook for fetching a single subscription by ID
 */
export const useSubscription = (id: number) => {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: async () => {
      const response = await subscriptionApi.getSubscriptionById(id);
      return response.data.data as Subscription;
    },
    enabled: !!id,
  });
};

/**
 * Hook for fetching available groups
 */
export const useAvailableGroups = (params?: any) => {
  return useQuery({
    queryKey: ['availableGroups', params],
    queryFn: async () => {
      const response = await subscriptionApi.getAvailableGroups(params);
      return response.data.data as GroupSubscription[];
    },
  });
};

/**
 * Hook for subscribing to a plan
 */
export const useSubscribe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      subscription_plan_id: number;
      teacher_id?: number;
      payment_method?: string;
      payment_reference?: string;
      group_name?: string; // For group subscriptions
    }) => {
      const response = await subscriptionApi.subscribe(data);
      return response.data.data as Subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
    },
  });
};

/**
 * Hook for joining a group subscription
 */
export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (groupId: number) => {
      const response = await subscriptionApi.joinGroup(groupId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['availableGroups'] });
    },
  });
};

/**
 * Hook for cancelling a subscription
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subscriptionId: number) => {
      const response = await subscriptionApi.cancelSubscription(subscriptionId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
    },
  });
};

/**
 * Hook for fetching all subscriptions (admin/teacher)
 */
export const useAllSubscriptions = (params?: any) => {
  return useQuery({
    queryKey: ['allSubscriptions', params],
    queryFn: async () => {
      const response = await subscriptionApi.getAllSubscriptions(params);
      return response.data.data as Subscription[];
    },
  });
};

/**
 * Hook for activating a subscription (admin)
 */
export const useActivateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await subscriptionApi.activateSubscription(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
    },
  });
};

/**
 * Hook for rejecting a subscription (admin)
 */
export const useRejectSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await subscriptionApi.rejectSubscription(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSubscriptions'] });
    },
  });
};
