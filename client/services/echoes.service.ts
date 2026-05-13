import api from './api';

export const echoesService = {
    getAll: () => api.get('/echoes').then(r => r.data),
    create: (data: any) => api.post('/echoes', data).then(r => r.data),
    dissolve: (id: string) => api.delete(`/echoes/${id}`).then(r => r.data),  // "dissolve" = emotional "delete"
};