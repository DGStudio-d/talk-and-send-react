// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Error Types
export interface ApiError {
  message: string;
  status_code?: number;
  errors?: Record<string, string[]>;
  type?: 'network' | 'timeout' | 'unauthorized' | 'forbidden' | 'not_found' | 'validation' | 'server';
}

// Quiz Types
export interface Quiz {
  id: number;
  title: LocalizedContent;
  description?: LocalizedContent;
  level: QuizLevel;
  language_id?: number;
  language?: Language;
  is_active: boolean;
  duration_minutes?: number;
  passing_score: number;
  created_by: number;
  creator?: User;
  questions_count: number;
  attempts_count: number;
  created_at: string;
  updated_at: string;
}

export interface LocalizedContent {
  en: string;
  ar?: string;
  es?: string;
}

export type QuizLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Language {
  id: number;
  name: string;
  name_en?: string;
  code: string;
  flag_url?: string;
  is_active: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  preferred_language_id?: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  type: QuestionType;
  question: LocalizedContent;
  options?: LocalizedContent[];
  correct_answer: string | string[];
  explanation?: LocalizedContent;
  points: number;
  order: number;
  media_url?: string;
  reading_text?: LocalizedContent;
  created_at: string;
  updated_at: string;
}

export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'fill_blank' 
  | 'essay' 
  | 'listening' 
  | 'reading';

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id?: number;
  user?: User;
  score: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  answers: QuizAnswer[];
  // Public attempt fields
  participant_name?: string;
  participant_email?: string;
  is_public: boolean;
}

export interface QuizAnswer {
  question_id: number;
  answer: string | string[];
  is_correct: boolean;
  points_earned: number;
}

export interface QuizStats {
  total_attempts: number;
  completed_attempts: number;
  average_score: number;
  total_questions: number;
  pass_rate: number;
}

// Request Types
export interface CreateQuizRequest {
  title: LocalizedContent;
  description?: LocalizedContent;
  level: QuizLevel;
  language_id?: number;
  is_active?: boolean;
  duration_minutes?: number;
  passing_score?: number;
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {}

export interface QuizFilters {
  search?: string;
  language_id?: number;
  level?: QuizLevel;
  is_active?: boolean;
  created_by?: number;
}

export interface ImportQuizRequest {
  file: File;
  language_id?: number;
  teacher_id?: number;
}

// API Configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

// Progress Callback
export type ProgressCallback = (progress: number) => void;