import api from './api';

export const capsulesService = {
    getAll: () => api.get('/capsules').then(r => r.data),
    getOne: (id: string) => api.get(`/capsules/${id}`).then(r => r.data),
    getUpcoming: (days = 7) => api.get(`/capsules/upcoming?days=${days}`).then(r => r.data),
    create: (data: any) => api.post('/capsules', data).then(r => r.data),
    update: (id: string, data: any) => api.put(`/capsules/${id}`, data).then(r => r.data),
    release: (id: string) => api.delete(`/capsules/${id}`).then(r => r.data),
};