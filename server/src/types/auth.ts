// -Path: "src/types/auth.ts"
import type { ReqUserDto } from '../api/user/dto/user.dto';

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    DISCORD = 'discord',
    LINE = 'line',
    X = 'x',
}

export type Auth = ReqUserDto | null;
