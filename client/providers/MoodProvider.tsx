
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { MOODS, type MoodKey } from '@/config/moods';
import { useAuth } from '@/hooks/useAuth';

const MoodContext = createContext<{
    mood: MoodKey;
    setMood: (m: MoodKey) => void;
    current: typeof MOODS[MoodKey];
}>({ mood: 'calm', setMood: () => { }, current: MOODS.calm });

export function MoodProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [mood, setMood] = useState<MoodKey>('calm');

    useEffect(() => {
        if (user?.currentMood) {
            setMood(user.currentMood as MoodKey);
        }
    }, [user?.currentMood]);

    return (
        <MoodContext.Provider value={{ mood, setMood, current: MOODS[mood] }}>
            {children}
        </MoodContext.Provider>
    );
}

export const useMood = () => useContext(MoodContext);