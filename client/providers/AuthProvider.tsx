'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter, usePathname } from 'next/navigation';

const PROTECTED_PREFIXES = ['/tonight', '/fragments', '/echoes', '/nightline', '/atmosphere', '/capsules'];
const PUBLIC_PATHS = ['/login', '/register', '/'];

interface AuthContextType {
    user: any;
    loading: boolean;
    logout: () => void;
    setUser: (u: any) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null, loading: true, logout: () => { }, setUser: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Cookie sent automatically — server validates and returns user
        authService.me()
            .then(u => {
                setUser(u);
                if (PUBLIC_PATHS.includes(pathname)) router.push('/tonight');
            })
            .catch(() => {
                setUser(null);
                const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
                if (isProtected) router.push('/login');
            })
            .finally(() => setLoading(false));
    }, []);

    const logout = async () => {
        await authService.logout();   // server clears httpOnly cookie
        setUser(null);
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-night-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border border-glow-violet/40 border-t-glow-violet animate-spin" />
                    <p className="text-white/20 text-xs tracking-widest">entering the archive...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);