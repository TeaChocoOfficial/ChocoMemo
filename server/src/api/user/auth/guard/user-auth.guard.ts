// -Path: "Nest TypeScript/src/user/auth/guard/user-auth.guard.ts"
import type { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import type { Auth } from '../../../../types/auth';
import { type ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<User = Auth>(err, user): User {
        if (err || !user) return null as User;
        return user as User;
    }
}
