// -Path: 'client/app/services/img.ts'
import env from '~/secure/env';
import axios, { type AxiosResponse } from 'axios';
import type { ZodType } from 'zod';

const imgAPI = {
    upload: async (file: File): Promise<AxiosResponse> => {
        const form = new FormData();
        form.append('file', file);
        return axios.post(`${env.API_URL}/api/img`, form, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
        });
    },
};

export default imgAPI;