/**
 * Custom hooks index file
 * Exports all custom hooks for easy importing
 */

// Authentication
export { useAuth } from './useAuth';

// Language/Internationalization
export { useLanguage } from './useLanguage';

// Quiz management
export {
  useQuizzes,
  useQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  useToggleQuizActive,
} from './useQuizzes';

// Quiz attempts
export {
  useQuizAttempts,
  useQuizAttempt,
  useQuizAttemptResults,
  useStartQuizAttempt,
  useSubmitQuizAttempt,
} from './useQuizAttempts';

// Dashboard statistics
export {
  useAdminDashboard,
  useTeacherDashboard,
  useStudentDashboard,
} from './useDashboard';

// Languages
export {
  useLanguages,
  useLanguage as useLanguageById,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
  useToggleLanguageActive,
} from './useLanguages';

// Teachers
export {
  useTeachers,
  useTeacher,
  useTeacherProfile,
  useTeacherQuizzes,
  useUpdateTeacherProfile,
  useUploadTeacherImage,
  useToggleTeacherVisibility,
} from './useTeachers';

// UI hooks (existing)
export { useMobile } from './use-mobile';
export { useToast } from './use-toast';
