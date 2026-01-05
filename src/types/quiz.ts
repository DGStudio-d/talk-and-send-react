// Quiz Type Enums
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_IN_BLANK = 'fill_in_blank',
  ESSAY = 'essay',
  IMAGE_BASED = 'image_based',
  AUDIO_BASED = 'audio_based',
  VIDEO_BASED = 'video_based',
}

export enum QuizLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum QuizStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum AttemptStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

// Question Type Configuration
export interface QuestionTypeConfig {
  value: QuestionType;
  label: string;
  description: string;
  requiresOptions: boolean;
  requiresMedia: boolean;
  allowsMultipleAnswers: boolean;
  mediaTypes?: string[];
  maxFileSize?: number; // in MB
}

export const QUESTION_TYPE_CONFIGS: Record<QuestionType, QuestionTypeConfig> = {
  [QuestionType.MULTIPLE_CHOICE]: {
    value: QuestionType.MULTIPLE_CHOICE,
    label: 'Multiple Choice',
    description: 'Choose one correct answer from multiple options',
    requiresOptions: true,
    requiresMedia: false,
    allowsMultipleAnswers: false,
  },
  [QuestionType.TRUE_FALSE]: {
    value: QuestionType.TRUE_FALSE,
    label: 'True/False',
    description: 'Select True or False',
    requiresOptions: false,
    requiresMedia: false,
    allowsMultipleAnswers: false,
  },
  [QuestionType.FILL_IN_BLANK]: {
    value: QuestionType.FILL_IN_BLANK,
    label: 'Fill in the Blank',
    description: 'Fill in the missing word(s)',
    requiresOptions: false,
    requiresMedia: false,
    allowsMultipleAnswers: true,
  },
  [QuestionType.ESSAY]: {
    value: QuestionType.ESSAY,
    label: 'Essay/Open-ended',
    description: 'Write a detailed answer',
    requiresOptions: false,
    requiresMedia: false,
    allowsMultipleAnswers: false,
  },
  [QuestionType.IMAGE_BASED]: {
    value: QuestionType.IMAGE_BASED,
    label: 'Image-based Question',
    description: 'Answer based on an image',
    requiresOptions: true,
    requiresMedia: true,
    allowsMultipleAnswers: false,
    mediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize: 10, // 10MB
  },
  [QuestionType.AUDIO_BASED]: {
    value: QuestionType.AUDIO_BASED,
    label: 'Audio-based Question',
    description: 'Answer based on audio content',
    requiresOptions: false,
    requiresMedia: true,
    allowsMultipleAnswers: false,
    mediaTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
    maxFileSize: 50, // 50MB
  },
  [QuestionType.VIDEO_BASED]: {
    value: QuestionType.VIDEO_BASED,
    label: 'Video-based Question',
    description: 'Answer based on video content',
    requiresOptions: false,
    requiresMedia: true,
    allowsMultipleAnswers: false,
    mediaTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    maxFileSize: 100, // 100MB
  },
};

// Quiz Interfaces
export interface Quiz {
  id: number;
  title: LocalizedContent;
  description?: LocalizedContent;
  level: QuizLevel;
  language_id: number;
  language?: Language;
  status: QuizStatus;
  is_active: boolean;
  duration_minutes?: number;
  passing_score: number;
  created_by: number;
  questions_count: number;
  attempts_count: number;
  created_at: string;
  updated_at: string;
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
  media_type?: string;
  reading_text?: LocalizedContent;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  status: AttemptStatus;
  score?: number;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  completed_at?: string;
  time_taken?: number; // in seconds
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  answer: string | string[];
  is_correct: boolean;
  points_earned: number;
  time_taken?: number;
}

export interface LocalizedContent {
  en: string;
  ar?: string;
  es?: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  native_name: string;
  is_active: boolean;
}

// Filter Types
export interface QuizFilters {
  search?: string;
  language_id?: number;
  level?: QuizLevel;
  status?: QuizStatus;
  created_by?: number;
  is_active?: boolean;
}

export interface QuestionFilters {
  quiz_id?: number;
  type?: QuestionType;
}

export interface AttemptFilters {
  quiz_id?: number;
  user_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}

// API Request/Response Types
export interface CreateQuizRequest {
  title: LocalizedContent;
  description?: LocalizedContent;
  level: QuizLevel;
  language_id: number;
  status?: QuizStatus;
  duration_minutes?: number;
  passing_score: number;
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {
  is_active?: boolean;
}

export interface CreateQuestionRequest {
  quiz_id: number;
  type: QuestionType;
  question: LocalizedContent;
  options?: LocalizedContent[];
  correct_answer: string | string[];
  explanation?: LocalizedContent;
  points: number;
  order: number;
  reading_text?: LocalizedContent;
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {}

export interface StartQuizAttemptRequest {
  quiz_id: number;
  user_name?: string;
  user_email?: string;
}

export interface SubmitAnswerRequest {
  attempt_id: number;
  question_id: number;
  answer: string | string[];
}

export interface CompleteQuizAttemptRequest {
  attempt_id: number;
}

// Utility Functions
export const getQuestionTypeConfig = (type: QuestionType): QuestionTypeConfig => {
  return QUESTION_TYPE_CONFIGS[type];
};

export const isMediaRequired = (type: QuestionType): boolean => {
  return getQuestionTypeConfig(type).requiresMedia;
};

export const areOptionsRequired = (type: QuestionType): boolean => {
  return getQuestionTypeConfig(type).requiresOptions;
};

export const allowsMultipleAnswers = (type: QuestionType): boolean => {
  return getQuestionTypeConfig(type).allowsMultipleAnswers;
};

export const getAcceptedMediaTypes = (type: QuestionType): string[] => {
  return getQuestionTypeConfig(type).mediaTypes || [];
};

export const getMaxFileSize = (type: QuestionType): number => {
  return getQuestionTypeConfig(type).maxFileSize || 10;
};

export const validateQuestionData = (type: QuestionType, data: Partial<CreateQuestionRequest>): string[] => {
  const errors: string[] = [];
  const config = getQuestionTypeConfig(type);

  if (config.requiresOptions && (!data.options || data.options.length < 2)) {
    errors.push('At least 2 options are required for this question type');
  }

  if (config.requiresMedia && !data.quiz_id) {
    errors.push('Media file is required for this question type');
  }

  if (type === QuestionType.MULTIPLE_CHOICE && data.options && data.options.length > 8) {
    errors.push('Maximum 8 options allowed for multiple choice questions');
  }

  return errors;
};