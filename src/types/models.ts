// Enums
export enum UserRole {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student'
}

export enum UserLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced'
}

export enum QuizLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export enum Locale {
  English = 'en',
  Arabic = 'ar',
  Spanish = 'es'
}

// Interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  preferred_language_id?: number;
  level: UserLevel;
  locale: Locale;
  is_active?: boolean;
  teacher_profile?: TeacherProfile;
  created_at: string;
  updated_at: string;
}

export interface TeacherProfile {
  id: number;
  user_id: number;
  bio?: {
    en?: string;
    ar?: string;
    es?: string;
  } | null;
  profile_image?: string;
  profile_image_url?: string;
  is_visible: boolean;
  user?: User;
}

export interface Language {
  id: number;
  name: string; // Localized name based on current locale
  code: string;
  flag_url?: string;
  is_active: boolean;
  order: number;
  // Admin-only fields (present when user is admin)
  name_en?: string;
  name_ar?: string;
  name_es?: string;
}

export interface Quiz {
  id: number;
  language_id: number;
  created_by?: number;
  title: {
    en: string;
    ar: string;
    es: string;
  };
  description?: {
    en: string;
    ar: string;
    es: string;
  };
  level: QuizLevel;
  is_active: boolean;
  duration_minutes?: number;
  passing_score: number;
  language?: Language;
  creator?: User;
  questions_count?: number;
  questions?: QuizQuestion[];
  attempts?: QuizAttempt[];
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string; // Single language - quiz's target language
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation?: string | null;
  order: number;
}

export interface QuizAttempt {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  started_at: string;
  completed_at?: string;
  is_passed?: boolean;
  duration?: string;
  quiz?: Quiz;
  user?: User;
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  quiz_attempt_id: number;
  quiz_question_id: number;
  selected_option: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean;
  question?: QuizQuestion;
}

export interface DashboardStats {
  // Student
  completed_attempts?: number;
  average_score?: number;
  preferred_language_progress?: any;
  level_distribution?: any;
  recent_attempts?: QuizAttempt[];

  // Teacher
  created_quizzes?: number;
  teacher_total_attempts?: number;
  recent_quizzes?: Quiz[];
  performance_by_level?: any;

  // Admin
  total_users?: number;
  total_quizzes?: number;
  total_attempts?: number;
  active_languages?: number;
  user_distribution?: any;
  recent_registrations?: User[];
}

// Subscription Enums
export enum SubscriptionType {
  Individual = 'individual',
  Group = 'group'
}

export enum SubscriptionStatus {
  Pending = 'pending',
  Active = 'active',
  Expired = 'expired',
  Cancelled = 'cancelled'
}

// Subscription Interfaces
export interface SubscriptionPlan {
  id: number;
  language_id: number;
  type: SubscriptionType;
  price: number;
  sessions_per_month: number;
  session_duration_minutes: number;
  max_group_members?: number;
  features: string[];
  is_active: boolean;
  language?: Language;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  subscription_plan_id: number;
  teacher_id?: number;
  status: SubscriptionStatus;
  start_date?: string;
  end_date?: string;
  sessions_remaining: number;
  sessions_completed: number;
  amount_paid: number;
  payment_method?: string;
  payment_reference?: string;
  paid_at?: string;
  subscription_plan?: SubscriptionPlan;
  teacher?: User;
  group_subscription?: GroupSubscription;
  sessions?: SubscriptionSession[];
  created_at: string;
  updated_at: string;
}

export interface GroupSubscription {
  id: number;
  subscription_id: number;
  group_name: string;
  max_members: number;
  current_members: number;
  is_full: boolean;
  subscription?: Subscription;
  members?: GroupSubscriptionMember[];
  created_at: string;
  updated_at: string;
}

export interface GroupSubscriptionMember {
  id: number;
  group_subscription_id: number;
  user_id: number;
  status: 'active' | 'removed';
  joined_at: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionSession {
  id: number;
  subscription_id: number;
  teacher_id: number;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
  notes?: string;
  meeting_link?: string;
  completed_at?: string;
  teacher?: User;
  created_at: string;
  updated_at: string;
}
