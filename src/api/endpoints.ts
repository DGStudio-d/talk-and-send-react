// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Base endpoints
  AUTH: '/auth',
  QUIZZES: '/quizzes',
  QUESTIONS: '/questions',
  ATTEMPTS: '/quiz-attempts',
  LANGUAGES: '/languages',
  USERS: '/users',
  TEACHERS: '/teachers',
  DASHBOARD: '/dashboard',
  GROUPS: '/groups',
  SEARCH: '/search',
  MEDIA: '/media',
  PUBLIC: '/public',
  PROFILE: '/profile',
  SUBSCRIPTIONS: '/subscriptions',

  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // Quiz endpoints
  QUIZZES_MINE: '/quizzes/mine',
  QUIZZES_POPULAR: '/quizzes/popular',
  QUIZZES_RECENT: '/quizzes/recent',
  QUIZZES_FEATURED: '/quizzes/featured',
  QUIZZES_SEARCH: '/quizzes/search',
  QUIZZES_IMPORT: '/quizzes/import',
  QUIZZES_EXPORT: '/quizzes/export',

  // Dynamic quiz endpoints
  quizById: (id: number) => `/quizzes/${id}`,
  quizToggleActive: (id: number) => `/quizzes/${id}/toggle-active`,
  quizDuplicate: (id: number) => `/quizzes/${id}/duplicate`,
  quizQuestions: (id: number) => `/quizzes/${id}/questions`,
  quizAttempts: (id: number) => `/quizzes/${id}/attempts`,
  quizStats: (id: number) => `/quizzes/${id}/stats`,
  quizByLanguage: (languageId: number) => `/quizzes/language/${languageId}`,

  // Question endpoints
  questionById: (id: number) => `/questions/${id}`,
  questionsByQuiz: (quizId: number) => `/quizzes/${quizId}/questions`,

  // Attempt endpoints
  attemptById: (id: number) => `/quiz-attempts/${id}`,
  attemptStart: (quizId: number) => `/quiz-attempts/start/${quizId}`,
  attemptSubmit: (id: number) => `/quiz-attempts/${id}/submit`,
  attemptAnswer: (id: number) => `/quiz-attempts/${id}/answer`,

  // Public endpoints (no auth required)
  PUBLIC_QUIZZES: '/public/quizzes',
  publicQuizById: (id: number) => `/public/quizzes/${id}`,
  publicQuizQuestions: (id: number) => `/public/quizzes/${id}/questions`,
  publicQuizAttempt: (id: number) => `/public/quizzes/${id}/attempt`,

  // Language endpoints
  languageById: (id: number) => `/languages/${id}`,

  // User endpoints
  userById: (id: number) => `/users/${id}`,

  // Teacher endpoints
  teacherById: (id: number) => `/teachers/${id}`,
  TEACHER_PROFILE: '/teachers/profile',

  // Dashboard endpoints
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_RECENT_ACTIVITY: '/dashboard/recent-activity',

  // Group endpoints
  groupById: (id: number) => `/groups/${id}`,
  groupMembers: (id: number) => `/groups/${id}/members`,
  groupQuizzes: (id: number) => `/groups/${id}/quizzes`,

  // Media endpoints
  MEDIA_UPLOAD: '/media/upload',
  mediaById: (id: number) => `/media/${id}`,

  // Profile endpoints
  PROFILE_ME: '/profile/me',
  PROFILE_UPDATE: '/profile/update',
  PROFILE_CHANGE_PASSWORD: '/profile/change-password',
} as const;