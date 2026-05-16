'use client';
import {
    createContext, useContext, useState, useEffect, type ReactNode,
} from 'react';
import {
    type BackgroundMode,
    DEFAULT_BACKGROUND,
    BACKGROUND_STORAGE_KEY,
} from '@/config/backgrounds';

interface BackgroundContextType {
    mode: BackgroundMode;
    setMode: (m: BackgroundMode) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
    mode: DEFAULT_BACKGROUND,
    setMode: () => { },
});

export function BackgroundProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<BackgroundMode>(DEFAULT_BACKGROUND);

    useEffect(() => {
        const saved = localStorage.getItem(BACKGROUND_STORAGE_KEY) as BackgroundMode | null;
        if (saved) setModeState(saved);
    }, []);

    const setMode = (m: BackgroundMode) => {
        setModeState(m);
        localStorage.setItem(BACKGROUND_STORAGE_KEY, m);
    };

    return (
        <BackgroundContext.Provider value={{ mode, setMode }}>
            {children}
        </BackgroundContext.Provider>
    );
}

export const useBackground = () => useContext(BackgroundContext);