//-Path: 'client/app/services/avatar.ts'
import type { AxiosResponse } from 'axios';
import serverRest from './axios';

/** Uploads/removes profile pictures stored in the dedicated avatar store. */
const avatarAPI = {
    upload: async (file: File): Promise<AxiosResponse> => {
        const form = new FormData();
        form.append('file', file);
        return serverRest.post(`/avatar`, form, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
        });
    },
    remove: (id: string) => serverRest.delete(`/avatar/${id}`),
};

export default avatarAPI;