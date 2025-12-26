import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.learnaccademy.com/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include auth token and Accept-Language header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    const locale = localStorage.getItem('locale') || 'en';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['Accept-Language'] = locale;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
};

// Quiz API functions
export const quizApi = {
  getAll: (params?: any) => apiClient.get('/quizzes', { params }),
  getById: (id: number) => apiClient.get(`/quizzes/${id}`),
  create: (data: any) => apiClient.post('/quizzes', data),
  update: (id: number, data: any) => apiClient.put(`/quizzes/${id}`, data),
  delete: (id: number) => apiClient.delete(`/quizzes/${id}`),
  toggleActive: (id: number) => apiClient.patch(`/quizzes/${id}/toggle-active`),
  import: (formData: FormData) => apiClient.post('/quizzes/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  export: () => apiClient.get('/quizzes/export', {
    responseType: 'blob',
  }),
};

// Quiz Attempt API functions
export const quizAttemptApi = {
  start: (data: { quiz_id: number }) => apiClient.post('/quiz-attempts', data),
  submit: (id: number, data: any) => apiClient.put(`/quiz-attempts/${id}/submit`, data),
  getMine: (params?: any) => apiClient.get('/quiz-attempts/me', { params }),
  getById: (id: number) => apiClient.get(`/quiz-attempts/${id}`),
  getResults: (id: number) => apiClient.get(`/quiz-attempts/${id}/results`),
};

// Language API functions
export const languageApi = {
  getAll: (params?: any) => apiClient.get('/languages', { params }),
  getById: (id: number) => apiClient.get(`/languages/${id}`),
  create: (data: FormData) => apiClient.post('/languages', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => apiClient.put(`/languages/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => apiClient.delete(`/languages/${id}`),
  toggleActive: (id: number) => apiClient.patch(`/languages/${id}/toggle-active`),
  uploadFlag: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('flag_image', file);
    return apiClient.post(`/languages/${id}/upload-flag`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Teacher API functions
export const teacherApi = {
  getAll: () => apiClient.get('/teachers'),
  getById: (id: number) => apiClient.get(`/teachers/${id}`),
  getProfile: () => apiClient.get('/teachers/profile'),
  updateProfile: (data: any) => apiClient.put('/teachers/profile', data),
  uploadImage: (data: FormData) => apiClient.post('/teachers/profile/image', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  toggleVisibility: () => apiClient.patch('/teachers/profile/visibility'),
  getQuizzes: (id: number) => apiClient.get(`/teachers/${id}/quizzes`),

  // Admin endpoints
  adminUpdateProfile: (userId: number, data: any) => apiClient.put(`/admin/teachers/${userId}/profile`, data),
  adminUploadImage: (userId: number, data: FormData) => apiClient.post(`/admin/teachers/${userId}/profile/image`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  adminToggleVisibility: (userId: number) => apiClient.patch(`/admin/teachers/${userId}/visibility`),
};

// User API functions
export const userApi = {
  getAll: (params?: any) => apiClient.get('/users', { params }),
  getById: (id: number) => apiClient.get(`/users/${id}`),
  update: (id: number, data: any) => apiClient.put(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/users/${id}`),
  updateRole: (id: number, role: string) => apiClient.patch(`/users/${id}/role`, { role }),
  activate: (id: number) => apiClient.post(`/users/${id}/activate`),
  deactivate: (id: number) => apiClient.post(`/users/${id}/deactivate`),
};

// Dashboard API functions
export const dashboardApi = {
  admin: () => apiClient.get('/dashboard/admin'),
  teacher: () => apiClient.get('/dashboard/teacher'),
  student: () => apiClient.get('/dashboard/student'),
};

// Question API functions
export const questionApi = {
  create: (quizId: number, data: any) => apiClient.post(`/quizzes/${quizId}/questions`, data),
  update: (id: number, data: any) => apiClient.put(`/questions/${id}`, data),
  delete: (id: number) => apiClient.delete(`/questions/${id}`),
  reorder: (id: number, order: number) => apiClient.patch(`/questions/${id}/reorder`, { order }),
};

// Subscription API functions
export const subscriptionApi = {
  getPlans: (params?: any) => apiClient.get('/subscription-plans', { params }),
  getPlanById: (id: number) => apiClient.get(`/subscription-plans/${id}`),
  getPlansByLanguage: (languageId: number) => apiClient.get(`/subscription-plans/language/${languageId}`),

  getMySubscriptions: (params?: any) => apiClient.get('/subscriptions', { params }),
  getSubscriptionById: (id: number) => apiClient.get(`/subscriptions/${id}`),
  subscribe: (data: any) => apiClient.post('/subscriptions', data),
  cancelSubscription: (subscriptionId: number) => apiClient.post('/subscriptions/cancel', { subscription_id: subscriptionId }),

  getAvailableGroups: (params?: any) => apiClient.get('/subscriptions/groups/available', { params }),
  joinGroup: (groupId: number) => apiClient.post(`/subscriptions/groups/${groupId}/join`),

  // Admin/Teacher
  getAllSubscriptions: (params?: any) => apiClient.get('/subscriptions/admin/subscriptions', { params }),
  activateSubscription: (id: number) => apiClient.post(`/subscriptions/${id}/activate`),
  rejectSubscription: (id: number) => apiClient.post(`/subscriptions/${id}/reject`),
};

// Group API functions
export const groupApi = {
  // Student
  getMyGroup: () => apiClient.get('/groups/my-group'),
  leaveGroup: (groupId: number) => apiClient.post(`/groups/${groupId}/leave`),

  // Admin
  getAllGroups: (params?: any) => apiClient.get('/admin/groups', { params }),
  createGroup: (data: any) => apiClient.post('/admin/groups', data),
  deleteGroup: (groupId: number) => apiClient.delete(`/admin/groups/${groupId}`),
  addMember: (groupId: number, userId: number) => apiClient.post(`/admin/groups/${groupId}/members`, { user_id: userId }),
  removeMember: (groupId: number, userId: number) => apiClient.delete(`/admin/groups/${groupId}/members/${userId}`),
  getAvailableStudents: (languageId?: number) => apiClient.get('/admin/students/available', { params: { language_id: languageId } }),
  getTeachers: () => apiClient.get('/teachers'),
};
