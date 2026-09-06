// -Path: "src/user/auth/auth.controller.ts"
import {
    Get,
    Req,
    Res,
    Put,
    Body,
    Post,
    Logger,
    Redirect,
    UseGuards,
    Controller,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Auth } from '../../../types/auth';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import type { SigninResultDto } from './dto/signin.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { SecureService } from '../../../secure/secure.service';
import type { ResponseUserDto } from '../dto/response-user.dto';
import { type ReqUserDto, UserLoginDto } from '../dto/user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

interface AuthenticatedRequest extends FastifyRequest {
    user?: Auth;
}

@ApiTags('API User Auth')
@Controller('api/user/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly secureService: SecureService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get authenticated user info' })
    async getAuth(@Req() req: AuthenticatedRequest): Promise<ResponseUserDto | null> {
        const user = req.user as Auth;
        if (!user) return null;
        const responseUser = await this.authService.signin(user);
        return responseUser.user ?? null;
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update authenticated user info' })
    async updateAuth(
        @Req() req: AuthenticatedRequest,
        @Body() body: UpdateUserDto,
    ): Promise<ResponseUserDto | null> {
        const user = req.user as Auth;
        if (!user) throw new UnauthorizedException('User not found');
        if (!body) throw new BadRequestException('Body is required');
        const responseUser = await this.authService.updateUser(user, body);
        return responseUser;
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Login successful',
    })
    @ApiOperation({ summary: 'Login' })
    @ApiBody({
        required: true,
        type: UserLoginDto,
    })
    async login(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<SigninResultDto> {
        const { accessToken } = await this.authService.login(req.user as ReqUserDto);
        if (!accessToken) throw new BadRequestException({ message: 'Login failed' });
        const result = await this.authService.signin(req.user as ReqUserDto);
        this.authService.setCookie(res, accessToken, 7 * 24 * 60 * 60 * 1000);

        return {
            ...result,
            message: 'Login successful',
        };
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email/password' })
    @ApiBody({ type: RegisterDto })
    async register(
        @Body() body: RegisterDto,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<SigninResultDto> {
        const result = await this.authService.registerUser(body.email, body.password, body.name);
        this.authService.setCookie(res, result.access_token, 7 * 24 * 60 * 60 * 1000);
        return {
            ...result,
            message: 'Registration successful',
        };
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Initiate Google OAuth flow' })
    async googleAuth() {
        this.logger.log('Google OAuth initiated');
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @Redirect()
    @ApiOperation({ summary: 'Google OAuth callback handler' })
    async googleAuthCallback(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<{ url: string }> {
        this.logger.log('Google OAuth callback received');
        const { CLIENT_URL } = this.secureService.getEnvConfig();
        const frontendUrl = CLIENT_URL || 'http://127.0.0.1:5001';
        const redirect_uri = req.cookies?.oauth_redirect_uri || frontendUrl;
        res.clearCookie('oauth_redirect_uri', { path: '/' });
        this.logger.log('redirect_uri', redirect_uri);
        try {
            const user = req.user as Auth;
            if (!user) throw new Error('No user data received from Google');
            const result = await this.authService.signin(user);
            this.authService.setCookie(res, result.access_token, 7 * 24 * 60 * 60 * 1000);
            const redirectUrl = `${redirect_uri}?token=${result.access_token}`;
            return { url: redirectUrl };
        } catch (error) {
            this.logger.error('Error in Google callback:', error);
            const errorMessage = encodeURIComponent(
                (error instanceof Error && error.message) || 'Authentication failed',
            );
            const errorRedirect = `${redirect_uri}?error=${errorMessage}&source=google`;
            return { url: errorRedirect };
        }
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get user profile from JWT token' })
    getProfile(@Req() req: AuthenticatedRequest): { user: Auth; timestamp: string } {
        const user = req.user as Auth;
        return { user, timestamp: new Date().toISOString() };
    }

    @Get('signout')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Sign out user' })
    async signout(@Res({ passthrough: true }) res: FastifyReply): Promise<{ message: string }> {
        this.authService.clearCookie(res);
        return { message: 'Sign out successful' };
    }
}
