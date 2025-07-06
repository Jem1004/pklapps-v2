// Authentication Types
export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'ADMIN' | 'GURU' | 'SISWA';
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: {
    id: string;
    username: string;
    role: 'ADMIN' | 'GURU' | 'SISWA';
    name?: string;
  };
  expires: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export type UserRole = 'ADMIN' | 'GURU' | 'SISWA';