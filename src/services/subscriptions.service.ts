import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/lib/api-client";
import {
  Subscription,
  SubscriptionPlan,
  GroupSubscription,
  SubscriptionFilter,
  PaginatedResponse,
} from "@/types/api";

// Subscriptions Query Keys
export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all, "list"] as const,
  list: (filters: SubscriptionFilter) =>
    [...subscriptionKeys.lists(), filters] as const,
  active: () => [...subscriptionKeys.all, "active"] as const,
  details: () => [...subscriptionKeys.all, "detail"] as const,
  detail: (id: number) => [...subscriptionKeys.details(), id] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  plan: (id: number) => [...subscriptionKeys.plans(), id] as const,
  groups: () => [...subscriptionKeys.all, "groups"] as const,
  availableGroups: () => [...subscriptionKeys.groups(), "available"] as const,
  admin: () => [...subscriptionKeys.all, "admin"] as const,
  adminSubscriptions: (filters: SubscriptionFilter) =>
    [...subscriptionKeys.admin(), "subscriptions", filters] as const,
};

// Subscriptions API Functions
export const subscriptionsApi = {
  // Get user subscriptions
  getSubscriptions: async (
    filters: SubscriptionFilter = {}
  ): Promise<Subscription[]> => {
    const response = await apiClient.get("/subscriptions", { params: filters });
    return response.data;
  },

  // Get active subscription
  getActiveSubscription: async (): Promise<Subscription | null> => {
    const response = await apiClient.get("/subscriptions/active");
    return response.data;
  },

  // Get subscription by ID
  getSubscriptionById: async (id: number): Promise<Subscription> => {
    const response = await apiClient.get(`/subscriptions/${id}`);
    return response.data;
  },

  // Create subscription
  createSubscription: async (subscriptionData: {
    subscription_plan_id: number;
    teacher_id?: number;
    payment_method: string;
    payment_reference?: string;
  }): Promise<Subscription> => {
    const response = await apiClient.post("/subscriptions", subscriptionData);
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<void> => {
    await apiClient.post("/subscriptions/cancel");
  },

  // Get available group subscriptions
  getAvailableGroups: async (filters?: {
    language_id?: number;
  }): Promise<GroupSubscription[]> => {
    const response = await apiClient.get("/subscriptions/groups/available", {
      params: filters,
    });
    return response.data;
  },

  // Join group subscription
  joinGroupSubscription: async (groupSubscriptionId: number): Promise<void> => {
    await apiClient.post(`/subscriptions/groups/${groupSubscriptionId}/join`);
  },

  // Admin - Activate subscription
  activateSubscription: async (id: number): Promise<Subscription> => {
    const response = await apiClient.post(`/subscriptions/${id}/activate`);
    return response.data;
  },

  // Admin - Reject subscription
  rejectSubscription: async (id: number): Promise<Subscription> => {
    const response = await apiClient.post(`/subscriptions/${id}/reject`);
    return response.data;
  },

  // Admin - Get all subscriptions
  getAdminSubscriptions: async (
    filters: SubscriptionFilter = {}
  ): Promise<PaginatedResponse<Subscription>> => {
    const response = await apiClient.get("/subscriptions/admin/subscriptions", {
      params: filters,
    });
    return {
      data: (response.data as any)?.data ?? [],
      pagination: undefined,
    };
  },

  // Admin - Create subscription plan
  createSubscriptionPlan: async (
    planData: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan> => {
    const response = await apiClient.post(
      "/subscriptions/subscription-plans",
      planData
    );
    return (response.data as any)?.data;
  },

  // Admin - Update subscription plan
  updateSubscriptionPlan: async (
    id: number,
    planData: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan> => {
    const response = await apiClient.put(
      `/subscriptions/subscription-plans/${id}`,
      planData
    );
    return (response.data as any)?.data;
  },

  // Admin - Delete subscription plan
  deleteSubscriptionPlan: async (id: number): Promise<void> => {
    await apiClient.delete(`/subscriptions/subscription-plans/${id}`);
  },
};

// Subscription Plans API Functions
export const subscriptionPlansApi = {
  // Get subscription plans
  getSubscriptionPlans: async (filters?: {
    language_id?: number;
    type?: string;
  }): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get("/subscription-plans", {
      params: filters,
    });
    return (response.data as any)?.data ?? [];
  },

  // Get subscription plan by ID
  getSubscriptionPlanById: async (id: number): Promise<SubscriptionPlan> => {
    const response = await apiClient.get(`/subscription-plans/${id}`);
    return (response.data as any)?.data;
  },

  // Get subscription plans by language
  getSubscriptionPlansByLanguage: async (
    languageId: number
  ): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get(
      `/subscription-plans/language/${languageId}`
    );
    return (response.data as any)?.data ?? [];
  },
};

// React Query Hooks - Subscriptions

// Get Subscriptions
export const useSubscriptions = (filters: SubscriptionFilter = {}) => {
  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: () => subscriptionsApi.getSubscriptions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get Active Subscription
export const useActiveSubscription = () => {
  return useQuery({
    queryKey: subscriptionKeys.active(),
    queryFn: subscriptionsApi.getActiveSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Subscription by ID
export const useSubscription = (id: number) => {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => subscriptionsApi.getSubscriptionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Available Groups
export const useAvailableGroups = (filters?: { language_id?: number }) => {
  return useQuery({
    queryKey: subscriptionKeys.availableGroups(),
    queryFn: () => subscriptionsApi.getAvailableGroups(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// Get Admin Subscriptions
export const useAdminSubscriptions = (filters: SubscriptionFilter = {}) => {
  return useQuery({
    queryKey: subscriptionKeys.adminSubscriptions(filters),
    queryFn: () => subscriptionsApi.getAdminSubscriptions(filters),
    staleTime: 2 * 60 * 1000,
  });
};

// React Query Hooks - Subscription Plans

// Get Subscription Plans
export const useSubscriptionPlans = (filters?: {
  language_id?: number;
  type?: string;
}) => {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: () => subscriptionPlansApi.getSubscriptionPlans(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Subscription Plan by ID
export const useSubscriptionPlan = (id: number) => {
  return useQuery({
    queryKey: subscriptionKeys.plan(id),
    queryFn: () => subscriptionPlansApi.getSubscriptionPlanById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Get Subscription Plans by Language
export const useSubscriptionPlansByLanguage = (languageId: number) => {
  return useQuery({
    queryKey: [...subscriptionKeys.plans(), "language", languageId],
    queryFn: () =>
      subscriptionPlansApi.getSubscriptionPlansByLanguage(languageId),
    enabled: !!languageId,
    staleTime: 10 * 60 * 1000,
  });
};

// Subscription Mutations

// Create Subscription Mutation
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionData: {
      subscription_plan_id: number;
      teacher_id?: number;
      payment_method: string;
      payment_reference?: string;
    }) => subscriptionsApi.createSubscription(subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.active() });
    },
    onError: handleApiError,
  });
};

// Cancel Subscription Mutation
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionsApi.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.active() });
    },
    onError: handleApiError,
  });
};

// Join Group Subscription Mutation
export const useJoinGroupSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupSubscriptionId: number) =>
      subscriptionsApi.joinGroupSubscription(groupSubscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.active() });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.availableGroups(),
      });
    },
    onError: handleApiError,
  });
};

// Admin Subscription Mutations

// Activate Subscription Mutation
export const useActivateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subscriptionsApi.activateSubscription(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.admin(),
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(variables),
      });
    },
    onError: handleApiError,
  });
};

// Reject Subscription Mutation
export const useRejectSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subscriptionsApi.rejectSubscription(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.admin(),
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(variables),
      });
    },
    onError: handleApiError,
  });
};

// Subscription Plan Mutations

// Create Subscription Plan Mutation
export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planData: Partial<SubscriptionPlan>) =>
      subscriptionsApi.createSubscriptionPlan(planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans() });
    },
    onError: handleApiError,
  });
};

// Update Subscription Plan Mutation
export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      planData,
    }: {
      id: number;
      planData: Partial<SubscriptionPlan>;
    }) => subscriptionsApi.updateSubscriptionPlan(id, planData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans() });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.plan(variables.id),
      });
    },
    onError: handleApiError,
  });
};

// Delete Subscription Plan Mutation
export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subscriptionsApi.deleteSubscriptionPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans() });
    },
    onError: handleApiError,
  });
};
