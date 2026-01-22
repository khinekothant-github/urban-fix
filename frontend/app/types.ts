export interface Issue {
  id: number;
  title: string;
  description: string;
  category: 'road' | 'garbage' | 'flood' | 'light';
  status: 'pending' | 'verified' | 'in_progress' | 'fixed';
  latitude: number;
  longitude: number;
  address: string;
  photo_path?: string;
  user_id: number;
  created_at: string;
  user?: User;
  updates?: IssueUpdate[];
}

export interface IssueUpdate {
  id: number;
  issue_id: number;
  old_status: string;
  new_status: string;
  updated_by: number;
  created_at: string;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ReportData {
  title: string;
  description: string;
  category: 'road' | 'garbage' | 'flood' | 'light';
  latitude: number;
  longitude: number;
  address: string;
  photo?: File;
}