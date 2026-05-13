import { useState, useCallback } from 'react';
import { fragmentsService } from '@/services/fragments.service';

export function useFragments() {
    const [fragments, setFragments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchFragments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fragmentsService.getAll();
            setFragments(data);
        } catch {
            setError('Could not reach the archive.');
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: any) => {
        const fragment = await fragmentsService.create(data);
        setFragments(prev => [fragment, ...prev]);
        return fragment;
    }, []);

    const update = useCallback(async (id: string, data: any) => {
        const updated = await fragmentsService.update(id, data);
        setFragments(prev => prev.map(f => f._id === id ? updated : f));
        return updated;
    }, []);

    const letGo = useCallback(async (id: string) => {
        await fragmentsService.letGo(id);
        setFragments(prev => prev.filter(f => f._id !== id));
    }, []);

    return { fragments, loading, error, fetchFragments, create, update, letGo };
}