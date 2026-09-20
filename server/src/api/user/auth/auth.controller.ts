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
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import type { SigninResultDto } from './dto/signin.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { SecureService } from '../../../secure/secure.service';
import type { ResponseUserDto } from '../dto/response-user.dto';
import { type ReqUserDto, UserLoginDto } from '../dto/user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

interface AuthenticatedRequest extends FastifyRequest {
    user?: Auth;
    /** Set by GoogleAuthGuard when OAuth failed (e.g. user denied consent). */
    oauthError?: string;
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
    @ApiOperation({ summary: 'Register a new user with email/password (sends OTP, no sign-in)' })
    @ApiBody({ type: RegisterDto })
    async register(@Body() body: RegisterDto): Promise<SigninResultDto> {
        return this.authService.registerUser(body.email, body.password, body.name);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify email OTP and sign the user in' })
    @ApiBody({ type: VerifyOtpDto })
    async verifyOtp(
        @Body() body: VerifyOtpDto,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<SigninResultDto> {
        const result = await this.authService.verifyOtp(body.token, body.code);
        if (result.access_token) {
            this.authService.setCookie(res, result.access_token, 7 * 24 * 60 * 60 * 1000);
        }
        return {
            ...result,
            message: 'Email verified',
        };
    }

    @Post('resend-otp')
    @ApiOperation({ summary: 'Resend a verification OTP for an unverified account' })
    @ApiBody({ type: ResendOtpDto })
    async resendOtp(@Body() body: ResendOtpDto): Promise<SigninResultDto> {
        return this.authService.resendOtp(body.email);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Send a password-reset OTP for an existing account' })
    @ApiBody({ type: ForgotPasswordDto })
    async forgotPassword(@Body() body: ForgotPasswordDto): Promise<SigninResultDto> {
        return this.authService.forgotPassword(body.email);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Change the password for the authenticated user' })
    @ApiBody({ type: ChangePasswordDto })
    async changePassword(
        @Req() req: AuthenticatedRequest,
        @Body() body: ChangePasswordDto,
    ): Promise<{ message: string }> {
        const user = req.user as Auth;
        if (!user) throw new UnauthorizedException('User not found');
        await this.authService.changePassword(user, body.currentPassword, body.newPassword);
        return { message: 'Password changed successfully' };
    }

    @Put('avatar')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Set or activate the avatar of a linked sign-in method' })
    @ApiBody({ type: UpdateAvatarDto })
    async updateAvatar(
        @Req() req: AuthenticatedRequest,
        @Body() body: UpdateAvatarDto,
    ): Promise<ResponseUserDto | null> {
        const user = req.user as Auth;
        if (!user) throw new UnauthorizedException('User not found');
        return this.authService.updateAvatar(user, body.provider, body.url);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Verify reset OTP and set a new password, signing the user in' })
    @ApiBody({ type: ResetPasswordDto })
    async resetPassword(
        @Body() body: ResetPasswordDto,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<SigninResultDto> {
        const result = await this.authService.resetPassword(body.token, body.code, body.newPassword);
        if (result.access_token) {
            this.authService.setCookie(res, result.access_token, 7 * 24 * 60 * 60 * 1000);
        }
        return {
            ...result,
            message: 'Password reset successfully',
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
            // Prefer the OAuth-specific reason (e.g. `access_denied`) recorded by
            // the guard over the generic controller error.
            const message = req.oauthError || (error instanceof Error && error.message) || 'Authentication failed';
            const errorMessage = encodeURIComponent(message);
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
