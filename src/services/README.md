# API Services Documentation

This directory contains comprehensive API services built with React Query and Axios for the Learn Academy backend.

## Setup

### 1. Configure the API Client

First, set up your environment variables in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Wrap your app with QueryProvider

In your `main.tsx` or `App.tsx`:

```tsx
import { QueryProvider } from "@/lib/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);
```

## Available Services

### 1. Authentication Service (`auth.service.ts`)

Handles user authentication, registration, and password management.

#### Hooks:

- `useLogin()` - Login user
- `useRegister()` - Register new user
- `useLogout()` - Logout user
- `useCurrentUser()` - Get current authenticated user
- `useRefreshToken()` - Refresh authentication token
- `useVerifyEmail()` - Verify email address
- `useResendVerification()` - Resend verification email
- `useForgotPassword()` - Request password reset
- `useResetPassword()` - Reset password

#### Example:

```tsx
import { useLogin } from '@/services';

const LoginComponent = () => {
  const loginMutation = useLogin();

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Your login form
  );
};
```

### 2. Users Service (`users.service.ts`)

Manages user data, roles, and permissions.

#### Hooks:

- `useUsers(filters)` - Get users list with pagination and filtering
- `useUsersByRole(role, filters)` - Get users by specific role
- `useSearchUsers(query, limit)` - Search users
- `useRecentUsers()` - Get recently added users
- `useUser(id)` - Get specific user
- `useUserStats(id)` - Get user statistics
- `useCreateUser()` - Create new user (admin only)
- `useUpdateUser()` - Update user
- `useDeleteUser()` - Delete user
- `useUpdateUserRole()` - Update user role
- `useResetUserPassword()` - Reset user password
- `useActivateUser()` - Activate user account
- `useDeactivateUser()` - Deactivate user account

#### Example:

```tsx
import { useUsers, useUpdateUser } from "@/services";

const UsersList = () => {
  const { data: users, isLoading } = useUsers({
    role: "student",
    per_page: 20,
  });

  const updateUserMutation = useUpdateUser();

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        users?.data.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onUpdate={(data) =>
              updateUserMutation.mutate({ id: user.id, userData: data })
            }
          />
        ))
      )}
    </div>
  );
};
```

### 3. Languages Service (`languages.service.ts`)

Manages language data and translations.

#### Hooks:

- `useLanguages(filters)` - Get languages list
- `usePopularLanguages(limit)` - Get popular languages
- `useRecentLanguages(limit)` - Get recent languages
- `useFeaturedLanguages(limit)` - Get featured languages
- `useLanguage(id)` - Get specific language
- `useLanguageTeachers(id)` - Get teachers for a language
- `useLanguageStudents(id)` - Get students for a language
- `useLanguageStats(id)` - Get language statistics
- `usePublicLanguages()` - Get public languages (no auth required)
- `usePublicLanguage(id)` - Get public language details
- `useCreateLanguage()` - Create language (admin only)
- `useUpdateLanguage()` - Update language (admin only)
- `useDeleteLanguage()` - Delete language (admin only)
- `useToggleLanguageActive()` - Toggle language active status
- `useUploadLanguageFlag()` - Upload language flag image

### 4. Quizzes Service (`quizzes.service.ts`)

Comprehensive quiz management with questions and media support.

#### Hooks:

- `useQuizzes(filters)` - Get quizzes list
- `useSearchQuizzes(params)` - Search quizzes
- `usePopularQuizzes(params)` - Get popular quizzes
- `useRecentQuizzes(params)` - Get recent quizzes
- `useFeaturedQuizzes(params)` - Get featured quizzes
- `useMyQuizzes()` - Get current user's quizzes
- `useQuiz(id)` - Get specific quiz
- `useQuizQuestions(id, filters)` - Get quiz questions
- `useQuizAttempts(id)` - Get quiz attempts
- `useQuizStats(id)` - Get quiz statistics
- `usePublicQuiz(id)` - Get public quiz details
- `usePublicQuizQuestions(id)` - Get public quiz questions
- `useCreateQuiz()` - Create new quiz
- `useUpdateQuiz()` - Update quiz
- `useDeleteQuiz()` - Delete quiz
- `useDuplicateQuiz()` - Duplicate quiz
- `useToggleQuizActive()` - Toggle quiz active status
- `useCreateQuestion()` - Create quiz question
- `useUpdateQuestion()` - Update quiz question
- `useDeleteQuestion()` - Delete quiz question
- `useUploadQuestionMedia()` - Upload question media
- `useReorderQuestions()` - Reorder quiz questions

#### Example:

```tsx
import { useQuizzes, useCreateQuiz } from "@/services";

const QuizManager = () => {
  const { data: quizzes, isLoading } = useQuizzes({
    is_active: true,
    per_page: 10,
  });

  const createQuizMutation = useCreateQuiz();

  const handleCreateQuiz = async (quizData) => {
    try {
      await createQuizMutation.mutateAsync(quizData);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <Button onClick={() => setShowCreateForm(true)}>Create New Quiz</Button>
      {quizzes?.data.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
};
```

### 5. Quiz Attempts Service (`quiz-attempts.service.ts`)

Handles quiz taking and attempt management.

#### Hooks:

- `useQuizAttempts(filters)` - Get quiz attempts list
- `useMyQuizAttempts(filters)` - Get current user's attempts
- `useQuizAttempt(id)` - Get specific attempt
- `useQuizAttemptResults(id)` - Get attempt results
- `usePublicQuizAttempt(publicId)` - Get public attempt
- `usePublicQuizAttemptResults(publicId)` - Get public attempt results
- `useStartQuizAttempt()` - Start new quiz attempt
- `useSubmitAnswer()` - Submit answer to question
- `useCompleteQuizAttempt()` - Complete quiz attempt
- `useDeleteQuizAttempt()` - Delete quiz attempt
- `useStartPublicQuizAttempt()` - Start public quiz attempt
- `useSubmitPublicAnswer()` - Submit answer to public attempt
- `useCompletePublicQuizAttempt()` - Complete public attempt

### 6. Dashboard Service (`dashboard.service.ts`)

Provides dashboard statistics for different user roles.

#### Hooks:

- `useAdminDashboard()` - Admin dashboard statistics
- `useTeacherDashboard()` - Teacher dashboard statistics
- `useStudentDashboard()` - Student dashboard statistics
- `usePublicDashboard()` - Public dashboard statistics

### 7. Subscriptions Service (`subscriptions.service.ts`)

Manages subscription plans and user subscriptions.

#### Hooks:

- `useSubscriptions(filters)` - Get user subscriptions
- `useActiveSubscription()` - Get active subscription
- `useSubscription(id)` - Get specific subscription
- `useAvailableGroups(filters)` - Get available group subscriptions
- `useAdminSubscriptions(filters)` - Get all subscriptions (admin)
- `useSubscriptionPlans(filters)` - Get subscription plans
- `useSubscriptionPlan(id)` - Get specific plan
- `useSubscriptionPlansByLanguage(languageId)` - Get plans by language
- `useCreateSubscription()` - Create new subscription
- `useCancelSubscription()` - Cancel subscription
- `useJoinGroupSubscription()` - Join group subscription
- `useActivateSubscription()` - Activate subscription (admin)
- `useRejectSubscription()` - Reject subscription (admin)
- `useCreateSubscriptionPlan()` - Create subscription plan (admin)
- `useUpdateSubscriptionPlan()` - Update subscription plan (admin)
- `useDeleteSubscriptionPlan()` - Delete subscription plan (admin)

### 8. Media Service (`media.service.ts`)

Handles file uploads for various media types.

#### Hooks:

- `useUploadAvatar()` - Upload user avatar
- `useUploadQuizImage()` - Upload quiz image
- `useUploadDocument()` - Upload document
- `useUploadCertificate()` - Upload certificate
- `useUploadBulkData()` - Upload bulk data
- `useEnhancedUpload()` - Enhanced media upload with metadata
- `useDeleteMedia()` - Delete media file
- `useMediaInfo(path)` - Get media file information

#### Example:

```tsx
import { useUploadAvatar } from "@/services";

const ProfileUpload = () => {
  const uploadMutation = useUploadAvatar();

  const handleFileSelect = async (file: File) => {
    try {
      await uploadMutation.mutateAsync(file);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        e.target.files?.[0] && handleFileSelect(e.target.files[0])
      }
    />
  );
};
```

### 9. Public Content Service (`public.service.ts`)

Handles public content and global search functionality.

#### Hooks:

- `usePublicDashboard()` - Public dashboard statistics
- `useBankInfo()` - Bank information
- `useAbout()` - About page content
- `useTerms()` - Terms of service
- `usePrivacy()` - Privacy policy
- `useFaq()` - FAQ content
- `useTestimonials()` - Testimonials
- `useAnnouncements()` - Announcements
- `useFeatured()` - Featured content
- `usePublicProfessors()` - Public professors list
- `usePublicProfessor(id)` - Public professor details
- `useGlobalSearch(params)` - Global search across content
- `useSearchLanguages(params)` - Search languages
- `useSearchQuizzesGlobal(params)` - Search quizzes (global)
- `useSearchTeachers(params)` - Search teachers
- `useSubmitContact()` - Submit contact form
- `useSubmitCourseRegistration()` - Submit course registration

## Query Parameters

Most query hooks support filtering and pagination parameters:

### Common Parameters:

- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 15)
- `search` or `q` - Search term
- `is_active` - Filter by active status (boolean)

### Specific Parameters:

- `role` - Filter by user role ('admin', 'teacher', 'student')
- `language_id` - Filter by language ID
- `level` - Filter by level ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')
- `status` - Filter by status
- `date_from` - Filter by start date
- `date_to` - Filter by end date

## Error Handling

All services include automatic error handling through the `handleApiError` utility. Errors are automatically handled and can be caught in mutation callbacks.

```tsx
const mutation = useSomeMutation();

mutation.mutate(data, {
  onError: (error) => {
    // error contains { message, status, data }
    console.error("API Error:", error.message);
  },
});
```

## Cache Management

React Query automatically handles caching. Query keys are structured to allow for precise cache invalidation:

```tsx
// Invalidate all user-related queries
queryClient.invalidateQueries({ queryKey: ["users"] });

// Invalidate specific user query
queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
```

## TypeScript Support

All services are fully typed with TypeScript. Types are exported from `@/types/api` and include:

- `User` - User entity
- `Quiz` - Quiz entity
- `QuizQuestion` - Quiz question entity
- `QuizAttempt` - Quiz attempt entity
- `Language` - Language entity
- `Subscription` - Subscription entity
- And many more...

## Best Practices

1. **Use enabled option**: Use the `enabled` option for conditional queries
2. **Handle loading states**: Use `isLoading` and `isFetching` states
3. **Optimistic updates**: Use `onMutate` for optimistic UI updates
4. **Error boundaries**: Wrap components in error boundaries
5. **Pagination**: Use the provided pagination parameters for large datasets

## Migration from Old API

If you're migrating from the old mock API:

```tsx
// Old way
import { fetchLanguages } from "@/services/api";
const languages = await fetchLanguages();

// New way
import { useLanguages } from "@/services";
const { data: languages, isLoading } = useLanguages();
```

The new services provide:

- Automatic caching
- Loading states
- Error handling
- Background refetching
- TypeScript support
- React DevTools integration
