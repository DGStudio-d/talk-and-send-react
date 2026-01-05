// Export all services with selective exports to avoid conflicts
export * from "./auth.service";
export * from "./users.service";
export * from "./languages.service";
export {
  // Quiz exports
  useQuizzes,
  useSearchQuizzes as useSearchQuizzesByFilter,
  usePopularQuizzes,
  useRecentQuizzes,
  useFeaturedQuizzes,
  useMyQuizzes,
  useQuiz,
  useQuizQuestions,
  useQuizStats,
  usePublicQuiz,
  usePublicQuizQuestions,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  useDuplicateQuiz,
  useToggleQuizActive,
  useExportQuizzes,
  useImportQuizzes,
  useEnhancedImportQuizzes,
  useDownloadQuizImportTemplate,
  // Quiz question exports
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useUploadQuestionMedia,
  useReorderQuestions,
} from "./quizzes.service";

export * from "./quiz-attempts.service";
export {
  useAdminDashboard,
  useTeacherDashboard,
  useStudentDashboard,
  usePublicDashboard as usePublicDashboardStats,
} from "./dashboard.service";
export * from "./subscriptions.service";
export * from "./media.service";
export {
  // Public content exports
  usePublicDashboard as usePublicDashboardContent,
  useBankInfo,
  useAbout,
  useTerms,
  usePrivacy,
  useFaq,
  useTestimonials,
  useAnnouncements,
  useFeatured,
  usePublicProfessors,
  usePublicProfessor,
  // Search exports
  useGlobalSearch,
  useSearchLanguages,
  useSearchQuizzes as useSearchQuizzesGlobal,
  useSearchTeachers,
  // Public mutations
  useSubmitContact,
  useSubmitCourseRegistration,
} from "./public.service";

// Re-export API client and utilities
export { apiClient, handleApiError, createQueryKey } from "@/lib/api-client";
