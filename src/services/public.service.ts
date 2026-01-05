import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, handleApiError } from "@/lib/api-client";
import {
  PublicContent,
  BankInfo,
  ContactRequest,
  CourseRegistration,
} from "@/types/api";

// Public Content Query Keys
export const publicKeys = {
  all: ["public"] as const,
  dashboard: () => [...publicKeys.all, "dashboard"] as const,
  bankInfo: () => [...publicKeys.all, "bankInfo"] as const,
  about: () => [...publicKeys.all, "about"] as const,
  terms: () => [...publicKeys.all, "terms"] as const,
  privacy: () => [...publicKeys.all, "privacy"] as const,
  faq: () => [...publicKeys.all, "faq"] as const,
  testimonials: () => [...publicKeys.all, "testimonials"] as const,
  announcements: () => [...publicKeys.all, "announcements"] as const,
  featured: () => [...publicKeys.all, "featured"] as const,
  professors: () => [...publicKeys.all, "professors"] as const,
  professor: (id: number) => [...publicKeys.professors(), id] as const,
  courseRegistrations: () =>
    [...publicKeys.all, "courseRegistrations"] as const,
};

// Search Query Keys
export const searchKeys = {
  all: ["search"] as const,
  global: (params: { q: string; type?: string; limit?: number }) =>
    [...searchKeys.all, "global", params] as const,
  languages: (params: { q: string; limit?: number }) =>
    [...searchKeys.all, "languages", params] as const,
  quizzes: (params: {
    q: string;
    language_id?: number;
    difficulty?: string;
    limit?: number;
  }) => [...searchKeys.all, "quizzes", params] as const,
  teachers: (params: { q: string; language_id?: number; limit?: number }) =>
    [...searchKeys.all, "teachers", params] as const,
};

// Public Content API Functions
export const publicApi = {
  // Get public dashboard
  getPublicDashboard: async (): Promise<PublicContent> => {
    const response = await apiClient.get("/dashboard");
    return response.data;
  },

  // Get bank information
  getBankInfo: async (): Promise<BankInfo> => {
    const response = await apiClient.get("/bank-info");
    return response.data;
  },

  // Submit contact form
  submitContact: async (data: ContactRequest): Promise<void> => {
    await apiClient.post("/contact", data);
  },

  // Get about page content
  getAbout: async (): Promise<any> => {
    const response = await apiClient.get("/about");
    return response.data;
  },

  // Get terms of service
  getTerms: async (): Promise<any> => {
    const response = await apiClient.get("/terms");
    return response.data;
  },

  // Get privacy policy
  getPrivacy: async (): Promise<any> => {
    const response = await apiClient.get("/privacy");
    return response.data;
  },

  // Get FAQ
  getFaq: async (): Promise<any> => {
    const response = await apiClient.get("/faq");
    return response.data;
  },

  // Get testimonials
  getTestimonials: async (): Promise<any> => {
    const response = await apiClient.get("/testimonials");
    return response.data;
  },

  // Get announcements
  getAnnouncements: async (): Promise<any> => {
    const response = await apiClient.get("/announcements");
    return response.data;
  },

  // Get featured content
  getFeatured: async (): Promise<any> => {
    const response = await apiClient.get("/featured");
    return response.data;
  },

  // Get public professors list
  getPublicProfessors: async (): Promise<any[]> => {
    const response = await apiClient.get("/public/professors");
    return response.data;
  },

  // Get public professor by ID
  getPublicProfessor: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/public/professors/${id}`);
    return response.data;
  },

  // Submit course registration
  submitCourseRegistration: async (
    data: Partial<CourseRegistration>
  ): Promise<CourseRegistration> => {
    const response = await apiClient.post("/course-registrations", data);
    return response.data;
  },
};

// Search API Functions
export const searchApi = {
  // Global search
  globalSearch: async (params: {
    q: string;
    type?: string;
    limit?: number;
  }): Promise<any> => {
    const response = await apiClient.get("/search", { params });
    return response.data;
  },

  // Search languages
  searchLanguages: async (params: {
    q: string;
    limit?: number;
  }): Promise<any[]> => {
    const response = await apiClient.get("/search/languages", { params });
    return response.data;
  },

  // Search quizzes
  searchQuizzes: async (params: {
    q: string;
    language_id?: number;
    difficulty?: string;
    limit?: number;
  }): Promise<any[]> => {
    const response = await apiClient.get("/search/quizzes", { params });
    return response.data;
  },

  // Search teachers
  searchTeachers: async (params: {
    q: string;
    language_id?: number;
    limit?: number;
  }): Promise<any[]> => {
    const response = await apiClient.get("/search/teachers", { params });
    return response.data;
  },
};

// React Query Hooks - Public Content

// Get Public Dashboard
export const usePublicDashboard = () => {
  return useQuery({
    queryKey: publicKeys.dashboard(),
    queryFn: publicApi.getPublicDashboard,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Bank Info
export const useBankInfo = () => {
  return useQuery({
    queryKey: publicKeys.bankInfo(),
    queryFn: publicApi.getBankInfo,
    staleTime: 60 * 60 * 1000, // 1 hour (bank info rarely changes)
  });
};

// Get About
export const useAbout = () => {
  return useQuery({
    queryKey: publicKeys.about(),
    queryFn: publicApi.getAbout,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get Terms
export const useTerms = () => {
  return useQuery({
    queryKey: publicKeys.terms(),
    queryFn: publicApi.getTerms,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Get Privacy
export const usePrivacy = () => {
  return useQuery({
    queryKey: publicKeys.privacy(),
    queryFn: publicApi.getPrivacy,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Get FAQ
export const useFaq = () => {
  return useQuery({
    queryKey: publicKeys.faq(),
    queryFn: publicApi.getFaq,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get Testimonials
export const useTestimonials = () => {
  return useQuery({
    queryKey: publicKeys.testimonials(),
    queryFn: publicApi.getTestimonials,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get Announcements
export const useAnnouncements = () => {
  return useQuery({
    queryKey: publicKeys.announcements(),
    queryFn: publicApi.getAnnouncements,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Featured Content
export const useFeatured = () => {
  return useQuery({
    queryKey: publicKeys.featured(),
    queryFn: publicApi.getFeatured,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Public Professors
export const usePublicProfessors = () => {
  return useQuery({
    queryKey: publicKeys.professors(),
    queryFn: publicApi.getPublicProfessors,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Public Professor
export const usePublicProfessor = (id: number) => {
  return useQuery({
    queryKey: publicKeys.professor(id),
    queryFn: () => publicApi.getPublicProfessor(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// React Query Hooks - Search

// Global Search
export const useGlobalSearch = (params: {
  q: string;
  type?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: searchKeys.global(params),
    queryFn: () => searchApi.globalSearch(params),
    enabled: params.q.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Search Languages
export const useSearchLanguages = (params: { q: string; limit?: number }) => {
  return useQuery({
    queryKey: searchKeys.languages(params),
    queryFn: () => searchApi.searchLanguages(params),
    enabled: params.q.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Search Quizzes
export const useSearchQuizzes = (params: {
  q: string;
  language_id?: number;
  difficulty?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: searchKeys.quizzes(params),
    queryFn: () => searchApi.searchQuizzes(params),
    enabled: params.q.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Search Teachers
export const useSearchTeachers = (params: {
  q: string;
  language_id?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: searchKeys.teachers(params),
    queryFn: () => searchApi.searchTeachers(params),
    enabled: params.q.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Public Content Mutations

// Submit Contact Mutation
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (data: ContactRequest) => publicApi.submitContact(data),
    onError: handleApiError,
  });
};

// Submit Course Registration Mutation
export const useSubmitCourseRegistration = () => {
  return useMutation({
    mutationFn: (data: Partial<CourseRegistration>) =>
      publicApi.submitCourseRegistration(data),
    onError: handleApiError,
  });
};
