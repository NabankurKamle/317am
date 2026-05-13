import { useMood as useMoodContext } from '@/providers/MoodProvider';
import { useCallback } from 'react';
import { MOODS, type MoodKey } from '@/config/moods';
import api from '@/services/api';

export function useMood() {
    const { mood, setMood, current } = useMoodContext();

    const changeMood = useCallback(async (newMood: MoodKey, log = false) => {
        setMood(newMood);
        if (log) {
            try { await api.post('/atmosphere', { mood: newMood }); } catch { }
        }
    }, [setMood]);

    return {
        mood,
        current,
        moods: MOODS,
        changeMood,
        moodKeys: Object.keys(MOODS) as MoodKey[],
    };
}