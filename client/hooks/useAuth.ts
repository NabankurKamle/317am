import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { setUser: setContextUser } = useAuthContext()

    useEffect(() => {
        // Cookie is sent automatically — just check if session is valid
        authService.me()
            .then(setUser)
            .catch(() => setUser(null))   // no token = no user, that's fine
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const { user } = await authService.login({ email, password });
        // Server sets cookie — we just store user state
        setUser(user);
        setContextUser(user);
        router.push('/tonight');
    }, [router]);

    const register = useCallback(async (data: { username: string; email: string; password: string }) => {
        const { user } = await authService.register(data);
        setUser(user);
        setContextUser(user);
        router.push('/tonight');
    }, [router]);

    const logout = useCallback(async () => {
        await authService.logout();     // server clears cookie
        setUser(null);
        router.push('/login');
    }, [router]);

    return { user, loading, login, register, logout, isAuthenticated: !!user };
}