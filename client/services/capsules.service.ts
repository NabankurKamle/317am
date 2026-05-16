import api from './api';

// Get the user's IANA timezone once — works in all modern browsers
const getUserTimezone = (): string => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return 'UTC';
    }
};

export const capsulesService = {
    getAll: () => api.get('/capsules').then(r => r.data),
    getOne: (id: string) => api.get(`/capsules/${id}`).then(r => r.data),
    getUpcoming: (days = 7) => api.get(`/capsules/upcoming?days=${days}`).then(r => r.data),

    create: (data: {
        title?: string;
        content: string;
        unlockAt: string;
        mood?: string;
        song?: string;
    }) =>
        api.post('/capsules', {
            ...data,
            timezone: getUserTimezone(),
        }).then(r => r.data),

    update: (id: string, data: any) => api.put(`/capsules/${id}`, data).then(r => r.data),
    release: (id: string) => api.delete(`/capsules/${id}`).then(r => r.data),
};