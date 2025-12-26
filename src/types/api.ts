import { 
  User, 
  Quiz, 
  QuizAttempt, 
  Language, 
  TeacherProfile, 
  DashboardStats,
  SubscriptionPlan,
  Subscription,
  GroupSubscription
} from './models';

// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Auth API responses
export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface AuthMeResponse {
  user: User;
}

// Quiz API responses
export interface QuizListResponse {
  quizzes: Quiz[];
}

export interface QuizDetailResponse {
  quiz: Quiz;
}

export interface QuizCreateResponse {
  quiz: Quiz;
}

export interface QuizUpdateResponse {
  quiz: Quiz;
}

// Quiz Attempt API responses
export interface QuizAttemptStartResponse {
  attempt: QuizAttempt;
}

export interface QuizAttemptSubmitResponse {
  attempt: QuizAttempt;
  results: {
    score: number;
    percentage: number;
    is_passed: boolean;
    correct_answers: number;
    total_questions: number;
  };
}

export interface QuizAttemptListResponse {
  attempts: QuizAttempt[];
}

export interface QuizAttemptResultsResponse {
  attempt: QuizAttempt;
}

// Language API responses
export interface LanguageListResponse {
  languages: Language[];
}

export interface LanguageDetailResponse {
  language: Language;
}

export interface LanguageCreateResponse {
  language: Language;
}

export interface LanguageUpdateResponse {
  language: Language;
}

// Teacher API responses
export interface TeacherListResponse {
  teachers: TeacherProfile[];
}

export interface TeacherDetailResponse {
  teacher: TeacherProfile;
  quizzes?: Quiz[];
}

export interface TeacherProfileUpdateResponse {
  profile: TeacherProfile;
}

// User API responses
export interface UserListResponse {
  users: User[];
}

export interface UserDetailResponse {
  user: User;
  attempts?: QuizAttempt[];
  created_quizzes?: Quiz[];
}

export interface UserUpdateResponse {
  user: User;
}

export interface UserActivateResponse {
  message: string;
  user: User;
}

export interface UserDeactivateResponse {
  message: string;
  user: User;
}

// Dashboard API responses
export interface DashboardResponse {
  stats: DashboardStats;
}

// Question API responses
export interface QuestionCreateResponse {
  question: any;
}

export interface QuestionUpdateResponse {
  question: any;
}

export interface QuestionReorderResponse {
  success: boolean;
}

// Error response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Request types
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
  preferred_language_id?: number;
  level: string;
  locale?: string;
}

export interface QuizCreateRequest {
  language_id: number;
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
  level: string;
  duration_minutes?: number;
  passing_score: number;
}

export interface QuizUpdateRequest extends Partial<QuizCreateRequest> {
  is_active?: boolean;
}

export interface QuizAttemptStartRequest {
  quiz_id: number;
}

export interface QuizAttemptSubmitRequest {
  answers: Array<{
    quiz_question_id: number;
    selected_option: 'A' | 'B' | 'C' | 'D';
  }>;
}

export interface QuestionCreateRequest {
  question_text: {
    en: string;
    ar: string;
    es: string;
  };
  option_a: {
    en: string;
    ar: string;
    es: string;
  };
  option_b: {
    en: string;
    ar: string;
    es: string;
  };
  option_c: {
    en: string;
    ar: string;
    es: string;
  };
  option_d: {
    en: string;
    ar: string;
    es: string;
  };
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation?: {
    en: string;
    ar: string;
    es: string;
  };
}

export interface QuestionUpdateRequest extends Partial<QuestionCreateRequest> {}

export interface LanguageCreateRequest {
  name_en: string;
  name_ar: string;
  name_es: string;
  code: string;
  flag_image?: File;
}

export interface LanguageUpdateRequest extends Partial<LanguageCreateRequest> {
  is_active?: boolean;
}

export interface TeacherProfileUpdateRequest {
  bio: {
    en: string;
    ar: string;
    es: string;
  };
  is_public?: boolean;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  level?: string;
  locale?: string;
}

export interface UserRoleUpdateRequest {
  role: string;
}

// Query parameters
export interface QuizQueryParams {
  language_id?: number;
  level?: string;
  search?: string;
  is_active?: boolean;
}

export interface UserQueryParams {
  role?: string;
  search?: string;
  level?: string;
}

export interface AttemptQueryParams {
  quiz_id?: number;
  is_passed?: boolean;
}

// Subscription API responses
export interface SubscriptionPlanListResponse {
  data: SubscriptionPlan[];
}

export interface SubscriptionPlanDetailResponse {
  data: SubscriptionPlan;
}

export interface SubscriptionListResponse {
  data: Subscription[];
}

export interface SubscriptionDetailResponse {
  data: Subscription;
}

export interface SubscriptionCreateResponse {
  data: Subscription;
  message: string;
}

export interface SubscriptionCancelResponse {
  message: string;
  data: Subscription;
}

export interface SubscriptionActivateResponse {
  message: string;
  data: Subscription;
}

export interface SubscriptionRejectResponse {
  message: string;
  data: Subscription;
}

// Group API responses
export interface GroupSubscriptionListResponse {
  data: GroupSubscription[];
}

export interface GroupSubscriptionDetailResponse {
  data: GroupSubscription;
}

export interface GroupJoinResponse {
  message: string;
  data: GroupSubscription;
}

export interface GroupLeaveResponse {
  message: string;
}

export interface GroupCreateResponse {
  message: string;
  data: GroupSubscription;
}

export interface GroupDeleteResponse {
  message: string;
}

export interface GroupMemberAddResponse {
  message: string;
}

export interface GroupMemberRemoveResponse {
  message: string;
}

export interface AvailableStudentsResponse {
  data: User[];
}

// Subscription request types
export interface SubscriptionCreateRequest {
  subscription_plan_id: number;
  teacher_id?: number;
  payment_method?: string;
  payment_reference?: string;
}

export interface GroupJoinRequest {
  group_subscription_id: number;
}

export interface GroupCreateRequest {
  subscription_plan_id: number;
  teacher_id: number;
  group_name: string;
  max_members: number;
}

export interface GroupAddMemberRequest {
  user_id: number;
}

// Subscription query parameters
export interface SubscriptionPlanQueryParams {
  language_id?: number;
  type?: 'individual' | 'group';
  is_active?: boolean;
}

export interface SubscriptionQueryParams {
  status?: 'pending' | 'active' | 'expired' | 'cancelled';
  user_id?: number;
}

export interface GroupQueryParams {
  language_id?: number;
  teacher_id?: number;
  has_available_slots?: boolean;
}
