import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(config => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

apiClient.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/auth/login';
  }
  return Promise.reject(error);
});

export async function request<T = any>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, data?: any, config?: AxiosRequestConfig) {
  try {
    const response = await apiClient({ method, url, data, ...config });
    return { success: true, data: response.data || response, error: null, message: 'Success' };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { success: false, data: null, error: axiosError.message, message: 'Request failed' };
  }
}

export const get = <T = any>(url: string, config?: AxiosRequestConfig) => request<T>('GET', url, undefined, config);
export const post = <T = any>(url: string, data: any, config?: AxiosRequestConfig) => request<T>('POST', url, data, config);
export const put = <T = any>(url: string, data: any, config?: AxiosRequestConfig) => request<T>('PUT', url, data, config);
export const patch = <T = any>(url: string, data: any, config?: AxiosRequestConfig) => request<T>('PATCH', url, data, config);
export const deleteRequest = <T = any>(url: string, config?: AxiosRequestConfig) => request<T>('DELETE', url, undefined, config);

export const api = {
  auth: { login: (e: string, p: string) => post('/auth/login', { email: e, password: p }), register: (e: string, p: string, n: string) => post('/auth/register', { email: e, password: p, full_name: n }), logout: () => post('/auth/logout', {}) },
  tickets: { list: (p?: any) => get('/tickets', { params: p }), get: (id: string) => get(`/tickets/${id}`), create: (d: any) => post('/tickets', d), update: (id: string, d: any) => patch(`/tickets/${id}`, d), delete: (id: string) => deleteRequest(`/tickets/${id}`) },
  specialists: { list: (p?: any) => get('/specialists', { params: p }), get: (id: string) => get(`/specialists/${id}`) },
  payments: { list: (p?: any) => get('/payments', { params: p }), create: (d: any) => post('/payments', d) },
  chat: { getConversations: () => get('/chat/conversations'), getMessages: (cid: string) => get(`/chat/conversations/${cid}/messages`), sendMessage: (cid: string, msg: string) => post(`/chat/conversations/${cid}/messages`, { message: msg }) },
  ai: { classifyTicket: (t: string, d: string) => post('/ai/classify', { title: t, description: d }) },
  reports: { getDashboard: () => get('/reports/dashboard') },
};

export default apiClient;
