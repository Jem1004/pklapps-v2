// Application Constants

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  GURU: 'GURU',
  SISWA: 'SISWA',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  DASHBOARD: '/dashboard',
  ADMIN: {
    DASHBOARD: '/dashboard/admin',
    USERS: '/dashboard/admin/users',
    ACTIVITY: '/dashboard/admin/activity',
    TEMPAT_PKL: '/dashboard/admin/tempat-pkl',
    STUDENT_MAPPING: '/dashboard/admin/student-mapping',
  },
  GURU: {
    DASHBOARD: '/dashboard/guru',
    JURNAL: '/dashboard/guru/jurnal',
    STUDENTS: '/dashboard/guru/students',
  },
  SISWA: {
    DASHBOARD: '/dashboard',
    JURNAL: '/dashboard/jurnal',
    ABSENSI: '/dashboard/absensi',
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  USERS: '/api/admin/users',
  JURNAL: '/api/jurnal',
  ABSENSI: '/api/absensi',
  GURU: {
    JURNAL: '/api/guru/jurnal',
    STUDENTS: '/api/guru/students',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    ACTIVITY: '/api/admin/activity',
    TEMPAT_PKL: '/api/admin/tempat-pkl',
  },
} as const;

// Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login berhasil',
    LOGOUT: 'Logout berhasil',
    CREATE: 'Data berhasil dibuat',
    UPDATE: 'Data berhasil diperbarui',
    DELETE: 'Data berhasil dihapus',
  },
  ERROR: {
    LOGIN: 'Username atau password salah',
    UNAUTHORIZED: 'Anda tidak memiliki akses',
    NOT_FOUND: 'Data tidak ditemukan',
    VALIDATION: 'Data tidak valid',
    SERVER: 'Terjadi kesalahan server',
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;