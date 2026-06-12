import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import type { ApiResponse } from '@/types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Generic request function
export async function request<T = any>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });

    return {
      success: true,
      data: response.data || response,
      error: null,
      message: response.message || 'Success',
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      data: null,
      error: axiosError.message,
      message: (axiosError.response?.data as any)?.message || 'Request failed',
    };
  }
}

// GET request
export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>('GET', url, undefined, config);
}

// POST request
export async function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>('POST', url, data, config);
}

// PUT request
export async function put<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>('PUT', url, data, config);
}

// PATCH request
export async function patch<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>('PATCH', url, data, config);
}

// DELETE request
export async function deleteRequest<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>('DELETE', url, undefined, config);
}

// Upload file
export async function uploadFile(
  url: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }

  return request('POST', url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// Batch requests
export async function batchRequests<T = any>(
  requests: Array<{ method: string; url: string; data?: any }>
): Promise<ApiResponse<T[]>> {
  try {
    const promises = requests.map((req) =>
      apiClient({
        method: req.method,
        url: req.url,
        data: req.data,
      })
    );

    const responses = await Promise.all(promises);
    return {
      success: true,
      data: responses,
      error: null,
      message: 'Batch request completed',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: String(error),
      message: 'Batch request failed',
    };
  }
}

// API endpoints
export const api = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      post('/api/auth/login', { email, password }),
    register: (data: any) => post('/api/auth/register', data),
    logout: () => post('/api/auth/logout'),
    mfa: (userId: string, code: string) =>
      post('/api/auth/mfa', { userId, code }),
    refreshToken: () => post('/api/auth/refresh'),
  },

  // Tickets
  tickets: {
    list: (filters?: any) => get('/api/tickets', { params: filters }),
    get: (id: string) => get(`/api/tickets/${id}`),
    create: (data: any) => post('/api/tickets', data),
    update: (id: string, data: any) => put(`/api/tickets/${id}`, data),
    delete: (id: string) => deleteRequest(`/api/tickets/${id}`),
    search: (query: string) => get('/api/tickets/search', { params: { q: query } }),
    getMessages: (id: string) => get(`/api/tickets/${id}/messages`),
    addMessage: (id: string, data: any) => post(`/api/tickets/${id}/messages`, data),
  },

  // Specialists
  specialists: {
    list: (filters?: any) => get('/api/specialists', { params: filters }),
    get: (id: string) => get(`/api/specialists/${id}`),
    search: (query: string) => get('/api/specialists/search', { params: { q: query } }),
    rate: (id: string, data: any) => post(`/api/specialists/${id}/rate`, data),
  },

  // Payments
  payments: {
    list: () => get('/api/payments'),
    get: (id: string) => get(`/api/payments/${id}`),
    create: (data: any) => post('/api/payments', data),
    webhook: (data: any) => post('/api/payments/webhook', data),
  },

  // AI
  ai: {
    classify: (ticketData: any) => post('/api/ai/classify', ticketData),
    estimate: (ticketData: any) => post('/api/ai/estimate', ticketData),
    match: (ticketData: any) => post('/api/ai/match', ticketData),
  },

  // Chat
  chat: {
    conversations: () => get('/api/chat/conversations'),
    messages: (conversationId: string) =>
      get(`/api/chat/conversations/${conversationId}/messages`),
    sendMessage: (conversationId: string, data: any) =>
      post(`/api/chat/conversations/${conversationId}/messages`, data),
  },

  // Monitoring
  monitoring: {
    assets: () => get('/api/monitoring/assets'),
    alerts: () => get('/api/monitoring/alerts'),
    metrics: (assetId: string) => get(`/api/monitoring/assets/${assetId}/metrics`),
  },

  // Reports
  reports: {
    generate: (data: any) => post('/api/reports/generate', data),
    list: () => get('/api/reports'),
  },

  // Admin
  admin: {
    users: () => get('/api/admin/users'),
    user: (id: string) => get(`/api/admin/users/${id}`),
    updateUser: (id: string, data: any) => put(`/api/admin/users/${id}`, data),
    deleteUser: (id: string) => deleteRequest(`/api/admin/users/${id}`),
    commissions: () => get('/api/admin/commissions'),
    updateCommission: (id: string, data: any) => put(`/api/admin/commissions/${id}`, data),
  },
};

export default apiClient;
