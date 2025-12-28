import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProgressCallback } from '../types';

export interface SubscriptionPlan {
  id: number;
  language_id: number;
  language?: {
    id: number;
    name: string;
    code: string;
    flag_url?: string;
  };
  type: 'individual' | 'group';
  price: number;
  sessions_per_month: number;
  session_duration_minutes: number;
  max_group_members?: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  subscription_plan_id: number;
  teacher_id?: number;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  start_date?: string;
  end_date?: string;
  sessions_remaining: number;
  sessions_completed: number;
  amount_paid: number;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'paypal';
  payment_reference?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: {
    id: number;
    name: string;
    email: string;
  };
  subscription_plan?: SubscriptionPlan;
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
  group_subscription?: GroupSubscription;
  sessions?: SubscriptionSession[];
}

export interface GroupSubscription {
  id: number;
  subscription_id: number;
  group_name: string;
  max_members: number;
  current_members: number;
  is_full: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  subscription?: Subscription;
  members?: GroupSubscriptionMember[];
}

export interface GroupSubscriptionMember {
  id: number;
  group_subscription_id: number;
  user_id: number;
  status: 'active' | 'inactive';
  joined_at: string;
  
  // Relations
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface SubscriptionSession {
  id: number;
  subscription_id: number;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  subscription_plan_id: number;
  teacher_id?: number;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'paypal';
  payment_reference?: string;
  group_name?: string; // Required if plan type is 'group'
}

export interface SubscriptionFilters {
  status?: 'pending' | 'active' | 'cancelled' | 'expired';
  user_id?: number;
  language_id?: number;
  teacher_id?: number;
}

export class SubscriptionService {
  /**
   * Get user's subscriptions
   */
  static async getUserSubscriptions(filters?: SubscriptionFilters): Promise<Subscription[]> {
    const response = await apiClient.get<Subscription[]>('/subscriptions', {
      params: filters,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch subscriptions');
  }

  /**
   * Get user's active subscription
   */
  static async getActiveSubscription(): Promise<Subscription | null> {
    const response = await apiClient.get<Subscription>('/subscriptions/active');
    
    if (response.success) {
      return response.data || null;
    }
    
    throw new Error(response.message || 'Failed to fetch active subscription');
  }

  /**
   * Get subscription by ID
   */
  static async getById(id: number): Promise<Subscription> {
    const response = await apiClient.get<Subscription>(`/subscriptions/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch subscription');
  }

  /**
   * Create new subscription
   */
  static async create(data: CreateSubscriptionRequest): Promise<Subscription> {
    const response = await apiClient.post<Subscription>('/subscriptions', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create subscription');
  }

  /**
   * Cancel subscription
   */
  static async cancel(subscriptionId: number): Promise<Subscription> {
    const response = await apiClient.post<Subscription>('/subscriptions/cancel', {
      subscription_id: subscriptionId,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to cancel subscription');
  }

  /**
   * Admin/Teacher: Activate subscription
   */
  static async activate(id: number): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(`/subscriptions/${id}/activate`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to activate subscription');
  }

  /**
   * Admin: Reject subscription
   */
  static async reject(id: number): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(`/subscriptions/${id}/reject`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to reject subscription');
  }

  /**
   * Admin: Get all subscriptions
   */
  static async getAll(filters?: SubscriptionFilters): Promise<Subscription[]> {
    const response = await apiClient.get<Subscription[]>('/subscriptions/admin/subscriptions', {
      params: filters,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch all subscriptions');
  }

  /**
   * Get available group subscriptions
   */
  static async getAvailableGroups(languageId?: number): Promise<GroupSubscription[]> {
    const response = await apiClient.get<GroupSubscription[]>('/subscriptions/groups/available', {
      params: languageId ? { language_id: languageId } : undefined,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch available groups');
  }

  /**
   * Join group subscription
   */
  static async joinGroup(groupSubscriptionId: number): Promise<GroupSubscription> {
    const response = await apiClient.post<GroupSubscription>(`/subscriptions/groups/${groupSubscriptionId}/join`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to join group');
  }
}

export class SubscriptionPlanService {
  /**
   * Get all subscription plans
   */
  static async getAll(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<SubscriptionPlan[]>('/subscription-plans');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch subscription plans');
  }

  /**
   * Get subscription plan by ID
   */
  static async getById(id: number): Promise<SubscriptionPlan> {
    const response = await apiClient.get<SubscriptionPlan>(`/subscription-plans/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch subscription plan');
  }

  /**
   * Get subscription plans by language
   */
  static async getByLanguage(languageId: number): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<SubscriptionPlan[]>(`/subscription-plans/language/${languageId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch subscription plans by language');
  }

  /**
   * Admin: Create subscription plan
   */
  static async create(data: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan> {
    const response = await apiClient.post<SubscriptionPlan>('/subscriptions/subscription-plans', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create subscription plan');
  }

  /**
   * Admin: Update subscription plan
   */
  static async update(id: number, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await apiClient.put<SubscriptionPlan>(`/subscriptions/subscription-plans/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update subscription plan');
  }

  /**
   * Admin: Delete subscription plan
   */
  static async delete(id: number): Promise<void> {
    const response = await apiClient.delete(`/subscriptions/subscription-plans/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete subscription plan');
    }
  }
}

export default SubscriptionService;