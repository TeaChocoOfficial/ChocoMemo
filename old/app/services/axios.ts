//-Path: "vite-extra-react-ssr-ts/src/services/axios.ts"
import env from '~/secure/env';
import axios, { type AxiosResponse } from 'axios';
import type { ZodType } from 'zod';

const serverRest = axios.create({
    baseURL: `${env.API_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

serverRest.interceptors.request.use(
    (config) => {
        const token = env.API_TOKEN_KEY;
        config.headers.authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error),
);

export const schemaParse = <Response extends Promise<AxiosResponse<any, any, {}, any>>>(
    schema: ZodType,
    response: Response,
): Response =>
    response.then((res) => {
        res.data = schema.parse(res.data);
        return res;
    }) as Response;

export default serverRest;
