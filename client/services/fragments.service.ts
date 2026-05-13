import api from './api';

export const fragmentsService = {
    getAll: () => api.get('/fragments').then(r => r.data),
    create: (data: any) => api.post('/fragments', data).then(r => r.data),
    update: (id: string, data: any) => api.put(`/fragments/${id}`, data).then(r => r.data),
    letGo: (id: string) => api.delete(`/fragments/${id}`).then(r => r.data),
};