//-Path: 'Vite-React-TypeScript/src/services/auth.ts'
import env from '~/secure/env';
import serverRest from './axios';
import type { User } from '~/types/auth';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface SigninResult {
    message: string;
    access_token: string;
    user: User | null;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    avatar?: string;
}

export const authAPI = {
    auth: () => serverRest.get<User | null>('/user/auth'),
    login: (data: LoginPayload) => serverRest.post<SigninResult>('/user/auth/login', data),
    register: (data: RegisterPayload) => serverRest.post<SigninResult>('/user/auth/register', data),
    logout: () => serverRest.get('/user/auth/signout'),
    googleLogin: () => {
        const redirectUri = `${window.location.origin}${env.BASE}auth`;
        window.location.href = `${env.API_URL}/api/user/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
    },
    updateUser: (data: UpdateUserPayload) => serverRest.put<User>('/user/auth', data),
};
