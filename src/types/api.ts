// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "teacher" | "student";
  preferred_language_id?: number;
  level: "beginner" | "intermediate" | "advanced";
  locale?: string;
  is_active: boolean;
  activated_at?: string;
  created_at: string;
  updated_at: string;
  preferred_language?: Language;
  teacher_profile?: TeacherProfile;
}

export interface TeacherProfile {
  id: number;
  user_id: number;
  bio?: string;
  specialization?: string;
  experience_years?: number;
  education?: string;
  is_visible: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

// Language Types
export interface Language {
  id: number;
  name_en: string;
  name_ar: string;
  name_es: string;
  code: string;
  flag_image?: string;
  is_active: boolean;
  order?: number;
  created_at: string;
  updated_at: string;
  flag_url?: string;
  quizzes_count?: number;
}

// Quiz Types (extended from quiz.ts)
export interface Quiz {
  id: number;
  title: {
    en: string;
    ar?: string;
    es?: string;
  };
  description?: {
    en: string;
    ar?: string;
    es?: string;
  };
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  language_id: number;
  language?: Language;
  is_active: boolean;
  duration_minutes?: number;
  passing_score?: number;
  created_by: number;
  creator?: User;
  questions_count?: number;
  attempts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  type: string;
  question_text: {
    en: string;
    ar?: string;
    es?: string;
  };
  option_a?: {
    en: string;
    ar?: string;
    es?: string;
  };
  option_b?: {
    en: string;
    ar?: string;
    es?: string;
  };
  option_c?: {
    en: string;
    ar?: string;
    es?: string;
  };
  option_d?: {
    en: string;
    ar?: string;
    es?: string;
  };
  correct_option: "A" | "B" | "C" | "D";
  explanation?: {
    en: string;
    ar?: string;
    es?: string;
  };
  points: number;
  order: number;
  media_url?: string;
  media_type?: string;
  reading_text?: {
    en: string;
    ar?: string;
    es?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  status: "in_progress" | "completed" | "abandoned";
  score?: number;
  percentage?: number;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  completed_at?: string;
  time_taken?: number;
  public_attempt_id?: string;
  quiz?: Quiz;
  user?: User;
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
  points_earned: number;
  time_taken?: number;
}

// Subscription Types
export interface SubscriptionPlan {
  id: number;
  language_id: number;
  language?: Language;
  type: "individual" | "group";
  // Legacy fields (kept for compatibility with older UI)
  name?: string;
  description?: string;
  duration_months?: number;
  max_students?: number;

  // Backend fields (SubscriptionPlanController)
  price: number;
  sessions_per_month?: number;
  session_duration_minutes?: number;
  max_group_members?: number;
  features?: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  subscription_plan_id: number;
  subscription_plan?: SubscriptionPlan;
  teacher_id?: number;
  teacher?: User;
  status: "pending" | "active" | "cancelled" | "expired";
  start_date?: string;
  end_date?: string;
  payment_method: "cash" | "bank_transfer" | "credit_card" | "paypal";
  payment_reference?: string;
  created_at: string;
  updated_at: string;
  group_subscription?: GroupSubscription;
  sessions?: Session[];
}

export interface GroupSubscription {
  id: number;
  subscription_id: number;
  name: string;
  max_students: number;
  is_full: boolean;
  created_at: string;
  updated_at: string;
  members?: GroupSubscriptionMember[];
}

export interface GroupSubscriptionMember {
  id: number;
  group_subscription_id: number;
  user_id: number;
  user?: User;
  status: "active" | "inactive";
  joined_at: string;
}

export interface Session {
  id: number;
  subscription_id: number;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Question Types
export interface QuestionType {
  value: string;
  label: string;
  description: string;
  requires_options: boolean;
  requires_media: boolean;
  allows_multiple_answers: boolean;
  media_types?: string[];
  max_file_size?: number;
}

// Dashboard Types
export interface DashboardStats {
  total_users?: number;
  total_quizzes?: number;
  total_attempts?: number;
  active_languages?: number;
  users_by_role?: Record<string, number>;
  users_by_level?: Record<string, number>;
  completed_attempts?: number;
  created_quizzes?: number;
  teacher_total_attempts?: number;
  teacher_average_score?: number;
  active_quizzes?: number;
  recent_quizzes?: Quiz[];
  quizzes_by_language?: Array<{
    language: string;
    code: string;
    count: number;
  }>;
  quizzes_by_level?: Record<string, number>;
}

// Public Content Types
export interface PublicContent {
  total_languages: number;
  total_quizzes: number;
  total_teachers: number;
  total_students: number;
  featured_languages: Language[];
  popular_quizzes: Quiz[];
}

export interface BankInfo {
  bank_name: string;
  account_number: string;
  routing_number: string;
  swift_code: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CourseRegistration {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  age: string;
  level: string;
  language: string;
  class_type: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

// Media Upload Types
export interface MediaUpload {
  path: string;
  url: string;
  filename: string;
  original_name?: string;
  size?: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  preferred_language_id: number;
  level: "beginner" | "intermediate" | "advanced";
  locale?: string;
  subscription_plan_id: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Filter and Query Types
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface SearchParams {
  q?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface LanguageFilter extends PaginationParams {
  is_active?: boolean;
  active_only?: boolean;
}

export interface QuizFilter extends PaginationParams, SearchParams {
  language_id?: number;
  level?: string;
  is_active?: boolean;
  created_by?: number;
}

export interface UserFilter extends PaginationParams, SearchParams {
  role?: "admin" | "teacher" | "student";
  level?: string;
  preferred_language?: number;
}

export interface AttemptFilter extends PaginationParams {
  quiz_id?: number;
  user_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export interface SubscriptionFilter extends PaginationParams {
  status?: string;
  user_id?: number;
  language_id?: number;
}
