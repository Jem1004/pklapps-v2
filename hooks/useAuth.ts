import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  username: string;
  role: 'ADMIN' | 'GURU' | 'SISWA';
  name?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user: AuthUser | null = session?.user ? {
    id: session.user.id as string,
    username: session.user.username as string,
    role: session.user.role as 'ADMIN' | 'GURU' | 'SISWA',
    name: session.user.name || undefined
  } : null;

  const isLoading = status === 'loading';
  const isAuthenticated = !!session;

  const login = (redirectTo?: string) => {
    router.push(`/auth/login${redirectTo ? `?callbackUrl=${redirectTo}` : ''}`);
  };

  const logout = () => {
    router.push('/auth/login');
  };

  const hasRole = (role: 'ADMIN' | 'GURU' | 'SISWA') => {
    return user?.role === role;
  };

  const isAdmin = () => hasRole('ADMIN');
  const isGuru = () => hasRole('GURU');
  const isSiswa = () => hasRole('SISWA');

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isGuru,
    isSiswa
  };
}