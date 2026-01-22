import { Issue, IssueUpdate, LoginData, RegisterData, ReportData, User } from './types';

const API_BASE_URL = 'http://0.0.0.0:8000/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (data: LoginData): Promise<{ access_token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }
    return result;
  },

  register: async (data: RegisterData): Promise<{ access_token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    return result;
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  me: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    return response.json();
  },

  // Issues
  getIssues: async (filters: { category?: string; status?: string } = {}): Promise<Issue[]> => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/issues${query}`);
    if (!response.ok) {
      throw new Error('Failed to get issues');
    }
    return response.json();
  },

  getIssue: async (id: number): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`);
    if (!response.ok) {
      throw new Error('Failed to get issue');
    }
    return response.json();
  },

  createIssue: async (data: ReportData): Promise<Issue> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('latitude', data.latitude.toString());
    formData.append('longitude', data.longitude.toString());
    formData.append('address', data.address);
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create issue');
    }
    return result;
  },

  updateIssueStatus: async (id: number, status: string): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/admin/issues/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update status');
    }
    return result;
  },

  getIssueUpdates: async (id: number): Promise<IssueUpdate[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/issues/${id}/updates`);
    if (!response.ok) {
      throw new Error('Failed to get updates');
    }
    return response.json();
  },

  // Admin
  getAdminIssues: async (filters: { category?: string; status?: string } = {}): Promise<Issue[]> => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/issues${query}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to get admin issues');
    }
    return response.json();
  },
};