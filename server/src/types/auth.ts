// -Path: "Nest TypeScript/src/types/auth.ts"
import type { ReqUserDto } from '../api/user/dto/user.dto';

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

export type Auth = ReqUserDto | null;
