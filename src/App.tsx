
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import ProfessorsPage from "./pages/ProfessorsPage";
import ProfessorDetailPage from "./pages/ProfessorDetailPage";
import LanguagesPage from "./pages/LanguagesPage";
import RegistrationPage from "./pages/RegistrationPage";
import WhatsAppPage from "./pages/WhatsAppPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLoginPage";

// Quiz pages
import QuizListPage from "./pages/QuizListPage";
import QuizTakePage from "./pages/QuizTakePage";
import QuizResultsPage from "./pages/QuizResultsPage";
import DashboardPage from "./pages/DashboardPage";

// Admin pages
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDashboardOverview from "./components/admin/AdminDashboardOverview";
import AdminProfessors from "./components/admin/AdminProfessors";
import AdminLanguages from "./components/admin/AdminLanguages";
import AdminUsers from "./components/admin/AdminUsers";
import AdminCourses from "./components/admin/AdminCourses";
import AdminSettings from "./components/admin/AdminSettings";
import AddUserPage from "./pages/admin/AddUserPage";
import AddCoursePage from "./pages/admin/AddCoursePage";
import EditUserPage from "./pages/admin/EditUserPage";
import EditCoursePage from "./pages/admin/EditCoursePage";
import EditProfessorPage from "./pages/admin/EditProfessorPage";
import EditLanguagePage from "./pages/admin/EditLanguagePage";

const queryClient = new QueryClient();

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
              <Route path="/languages" element={<LanguagesPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/whatsapp" element={<WhatsAppPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Quiz routes */}
              <Route path="/quizzes" element={<QuizListPage />} />
              <Route path="/quiz/:id" element={<QuizTakePage />} />
              <Route path="/quiz/:id/results" element={<QuizResultsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Admin login route */}
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
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
