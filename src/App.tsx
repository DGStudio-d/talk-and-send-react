import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

// Lazy load route components
const Index = lazy(() => import("./pages/Index"));
const ProfessorsPage = lazy(() => import("./pages/ProfessorsPage"));
const ProfessorDetailPage = lazy(() => import("./pages/ProfessorDetailPage"));
const LanguagesPage = lazy(() => import("./pages/LanguagesPage"));
const WhatsAppPage = lazy(() => import("./pages/WhatsAppPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));

// Public teacher pages
const BrowseTeachers = lazy(() => import("./pages/public/BrowseTeachers"));
const TeacherDetail = lazy(() => import("./pages/public/TeacherDetail"));

// Demo pages
const LogoDemo = lazy(() => import("./pages/LogoDemo"));

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Student pages
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const BrowseQuizzes = lazy(() => import("./pages/student/BrowseQuizzes"));
const QuizDetail = lazy(() => import("./pages/student/QuizDetail"));
const TakeQuiz = lazy(() => import("./pages/student/TakeQuiz"));
const MyAttempts = lazy(() => import("./pages/student/MyAttempts"));
const QuizResults = lazy(() => import("./pages/student/QuizResults"));

// Subscription pages
const SubscriptionPlans = lazy(() => import("./pages/student/SubscriptionPlans"));
const MySubscriptions = lazy(() => import("./pages/student/MySubscriptions"));
const JoinGroup = lazy(() => import("./pages/student/JoinGroup"));

// Teacher pages
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const MyQuizzes = lazy(() => import("./pages/teacher/MyQuizzes"));
const CreateQuiz = lazy(() => import("./pages/teacher/CreateQuiz"));
const EditQuiz = lazy(() => import("./pages/teacher/EditQuiz"));
const ManageQuestions = lazy(() => import("./pages/teacher/ManageQuestions"));
const TeacherProfile = lazy(() => import("./pages/teacher/TeacherProfile"));

// Protected route component (not lazy loaded - needed immediately)
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Admin pages - lazy loaded (new structure)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageTeachers = lazy(() => import("./pages/admin/ManageTeachers"));
const ManageLanguages = lazy(() => import("./pages/admin/ManageLanguages"));
const ManageQuizzes = lazy(() => import("./pages/admin/ManageQuizzes"));
const UserDetail = lazy(() => import("./pages/admin/UserDetail"));

// Admin pages - lazy loaded (legacy/backwards compatibility)
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminDashboardOverview = lazy(() => import("./components/admin/AdminDashboardOverview"));
const AdminProfessors = lazy(() => import("./components/admin/AdminProfessors"));
const AdminLanguages = lazy(() => import("./components/admin/AdminLanguages"));
const AdminUsers = lazy(() => import("./components/admin/AdminUsers"));
const AdminCourses = lazy(() => import("./components/admin/AdminCourses"));
const AdminSettings = lazy(() => import("./components/admin/AdminSettings"));
const AddUserPage = lazy(() => import("./pages/admin/AddUserPage"));
const AddCoursePage = lazy(() => import("./pages/admin/AddCoursePage"));
const EditUserPage = lazy(() => import("./pages/admin/EditUserPage"));
const EditCoursePage = lazy(() => import("./pages/admin/EditCoursePage"));
const EditProfessorPage = lazy(() => import("./pages/admin/EditProfessorPage"));
const EditLanguagePage = lazy(() => import("./pages/admin/EditLanguagePage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
              {/* Public auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected student routes */}
              <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/quizzes" element={<ProtectedRoute allowedRoles={['student']}><BrowseQuizzes /></ProtectedRoute>} />
              <Route path="/quizzes/:id" element={<ProtectedRoute allowedRoles={['student']}><QuizDetail /></ProtectedRoute>} />
              <Route path="/quizzes/:quizId/take/:attemptId" element={<ProtectedRoute allowedRoles={['student']}><TakeQuiz /></ProtectedRoute>} />
              <Route path="/attempts" element={<ProtectedRoute allowedRoles={['student']}><MyAttempts /></ProtectedRoute>} />
              <Route path="/attempts/:id/results" element={<ProtectedRoute allowedRoles={['student']}><QuizResults /></ProtectedRoute>} />
              
              {/* Protected subscription routes */}
              <Route path="/subscriptions" element={<ProtectedRoute allowedRoles={['student']}><SubscriptionPlans /></ProtectedRoute>} />
              <Route path="/subscriptions/my" element={<ProtectedRoute allowedRoles={['student']}><MySubscriptions /></ProtectedRoute>} />
              <Route path="/subscriptions/groups" element={<ProtectedRoute allowedRoles={['student']}><JoinGroup /></ProtectedRoute>} />
              
              {/* Protected teacher routes */}
              <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/teacher/quizzes" element={<ProtectedRoute allowedRoles={['teacher']}><MyQuizzes /></ProtectedRoute>} />
              <Route path="/teacher/quizzes/create" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><CreateQuiz /></ProtectedRoute>} />
              <Route path="/teacher/quizzes/:id/edit" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><EditQuiz /></ProtectedRoute>} />
              <Route path="/teacher/quizzes/:id/questions" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><ManageQuestions /></ProtectedRoute>} />
              <Route path="/teacher/profile" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherProfile /></ProtectedRoute>} />
              
              {/* Protected admin routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
              <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={['admin']}><UserDetail /></ProtectedRoute>} />
              <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={['admin']}><ManageTeachers /></ProtectedRoute>} />
              <Route path="/admin/languages" element={<ProtectedRoute allowedRoles={['admin']}><ManageLanguages /></ProtectedRoute>} />
              <Route path="/admin/quizzes" element={<ProtectedRoute allowedRoles={['admin']}><ManageQuizzes /></ProtectedRoute>} />
              
              {/* Public teacher routes */}
              <Route path="/teachers" element={<BrowseTeachers />} />
              <Route path="/teachers/:id" element={<TeacherDetail />} />
              
              {/* Demo routes */}
              <Route path="/logo-demo" element={<LogoDemo />} />
              
              {/* Main site routes (backwards compatibility) */}
              <Route path="/" element={<Index />} />
              <Route path="/professors" element={<ProfessorsPage />} />
              <Route path="/professors/:id" element={<ProfessorDetailPage />} />
              <Route path="/languages" element={<LanguagesPage />} />
              <Route path="/whatsapp" element={<WhatsAppPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Admin login route (backwards compatibility) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboardPage />}>
                <Route index element={<AdminDashboardOverview />} />
                <Route path="professors" element={<AdminProfessors />} />
                <Route path="languages" element={<AdminLanguages />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="add-user" element={<AddUserPage />} />
                <Route path="add-course" element={<AddCoursePage />} />
                <Route path="edit-user/:id" element={<EditUserPage />} />
                <Route path="edit-course/:id" element={<EditCoursePage />} />
                <Route path="edit-professor/:id" element={<EditProfessorPage />} />
                <Route path="edit-language/:id" element={<EditLanguagePage />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
