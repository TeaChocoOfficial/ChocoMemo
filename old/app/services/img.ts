// -Path: 'client/app/services/img.ts'
import serverRest from './axios';
import { type AxiosResponse } from 'axios';

const imgAPI = {
    upload: async (file: File): Promise<AxiosResponse> => {
        const form = new FormData();
        form.append('file', file);
        return serverRest.post(`/img`, form, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
        });
    },
};

export default imgAPI;
