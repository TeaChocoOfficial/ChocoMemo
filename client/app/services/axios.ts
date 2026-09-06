//-Path: "vite-extra-react-ssr-ts/src/services/axios.ts"
import axios from 'axios';
import env from '~/secure/env';

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

export default serverRest;
