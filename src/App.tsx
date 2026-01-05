import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/language-fixes.css";
import { queryClient } from "./lib/query-client";
import Index from "./pages/Index";
import ProfessorsPage from "./pages/ProfessorsPage";
import ProfessorDetailPage from "./pages/ProfessorDetailPage";
import RegistrationPage from "./pages/RegistrationPage";
import WhatsAppPage from "./pages/WhatsAppPage";
import ContactPage from "./pages/ContactPage";
import PublicQuizzesPage from "./pages/PublicQuizzesPage";
import QuizTakePage from "./pages/QuizTakePage";
import QuizAttemptResultsPage from "./pages/QuizAttemptResultsPage";
import PublicQuizAttemptResultsPage from "./pages/PublicQuizAttemptResultsPage";
import RequireAdmin from "./routes/RequireAdmin";
import AdminDashboardLayout from "./pages/admin/AdminDashboardLayout";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminPlaceholderPage from "./pages/admin/AdminPlaceholderPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSubscriptionsPage from "./pages/admin/AdminSubscriptionsPage";
import AdminLanguagesPage from "./pages/admin/AdminLanguagesPage";
import AdminQuizzesPage from "./pages/admin/AdminQuizzesPage";
import AdminQuizQuestionsPage from "./pages/admin/AdminQuizQuestionsPage";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main site routes */}
              <Route path="/" element={<Index />} />
              <Route path="/professors" element={<ProfessorsPage />} />
              <Route path="/professors/:id" element={<ProfessorDetailPage />} />
              <Route path="/quizzes" element={<PublicQuizzesPage />} />
              <Route path="/quiz/:id" element={<QuizTakePage />} />
              <Route
                path="/quiz/results/:attemptId"
                element={<QuizAttemptResultsPage />}
              />
              <Route
                path="/quiz/public-results/:publicAttemptId"
                element={<PublicQuizAttemptResultsPage />}
              />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/whatsapp" element={<WhatsAppPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboardLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminOverviewPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="languages" element={<AdminLanguagesPage />} />
                <Route
                  path="subscriptions"
                  element={<AdminSubscriptionsPage />}
                />

                <Route path="quizzes" element={<AdminQuizzesPage />} />
                <Route
                  path="quizzes/:id/questions"
                  element={<AdminQuizQuestionsPage />}
                />
              </Route>

              <Route path="*" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
