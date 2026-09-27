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
import {
    ChangeEmailConfirmDto,
    ChangeEmailRequestDto,
    ChangePasswordRequestDto,
    ChangePasswordConfirmDto,
} from './dto/security-change.dto';
import type { Auth } from '~/types/auth';
import { AuthProvider } from '~/types/auth';
import { RegisterDto } from './dto/register.dto';
import { XAuthGuard } from './guard/x-auth.guard';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LineAuthGuard } from './guard/line-auth.guard';
import type { SigninResultDto } from './dto/signin.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { DiscordAuthGuard } from './guard/discord-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { ResponseUserDto } from '../dto/response-user.dto';
import { type ReqUserDto, UserLoginDto } from '../dto/user.dto';
import { AuthChangeService } from './service/auth-change.service';
import { AuthAccountService } from './service/auth-account.service';
import { AuthSessionService } from './service/auth-session.service';
import { AuthRegistrationService } from './service/auth-registration.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export interface AuthenticatedRequest extends FastifyRequest {
    user?: Auth;
    oauthError?: string;
}

@ApiTags('API User Auth')
@Controller('api/user/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly changeService: AuthChangeService,
        private readonly accountService: AuthAccountService,
        private readonly sessionService: AuthSessionService,
        private readonly registrationService: AuthRegistrationService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get authenticated user info' })
    async getAuth(@Req() req: AuthenticatedRequest): Promise<ResponseUserDto | null> {
        const user = req.user as Auth;
        if (!user) return null;
        const responseUser = await this.accountService.signin(user);
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
        const responseUser = await this.accountService.updateUser(user, body);
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
        const { accessToken } = await this.sessionService.login(req.user as ReqUserDto);
        if (!accessToken) throw new BadRequestException({ message: 'Login failed' });
        const result = await this.accountService.signin(req.user as ReqUserDto);
        this.sessionService.setCookie(res, accessToken, 7 * 24 * 60 * 60 * 1000);

        return {
            ...result,
            message: 'Login successful',
        };
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email/password (sends OTP, no sign-in)' })
    @ApiBody({ type: RegisterDto })
    async register(@Body() body: RegisterDto): Promise<SigninResultDto> {
        return this.registrationService.registerUser(
            body.email,
            body.password,
            body.name,
            body.nameTag,
            body.locale,
        );
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify email OTP and sign the user in' })
    @ApiBody({ type: VerifyOtpDto })
    async verifyOtp(
        @Body() body: VerifyOtpDto,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<SigninResultDto> {
        const result = await this.registrationService.verifyOtp(body.token, body.code);
        if (result.access_token) {
            this.sessionService.setCookie(res, result.access_token, 7 * 24 * 60 * 60 * 1000);
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
        return this.registrationService.resendOtp(body.email, body.locale);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Send a password-reset OTP for an existing account' })
    @ApiBody({ type: ForgotPasswordDto })
    async forgotPassword(@Body() body: ForgotPasswordDto): Promise<SigninResultDto> {
        return this.registrationService.forgotPassword(body.email, body.locale);
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
        await this.accountService.changePassword(user, body.currentPassword, body.newPassword);
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
        return this.accountService.updateAvatar(user, body.provider, body.url);
    }

    @Post('change-email/request')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Send an OTP to a new email address before changing it' })
    @ApiBody({ type: ChangeEmailRequestDto })
    async requestEmailChange(
        @Req() req: AuthenticatedRequest,
        @Body() body: ChangeEmailRequestDto,
    ): Promise<{ token: string }> {
        const user = req.user as Auth;
        if (!user) throw new UnauthorizedException('User not found');
        return this.changeService.requestEmailChange(user, body.newEmail, body.locale);
    }

    @Post('change-email/confirm')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Verify the OTP and update the account email address' })
    @ApiBody({ type: ChangeEmailConfirmDto })
    async confirmEmailChange(
        @Req() req: AuthenticatedRequest,
        @Body() body: ChangeEmailConfirmDto,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<SigninResultDto> {
        const user = req.user as Auth;
        if (!user) throw new UnauthorizedException('User not found');
        const result = await this.changeService.confirmEmailChange(user, body.token, body.code);
        if (result.access_token) {
            this.sessionService.setCookie(res, result.access_token, 7 * 24 * 60 * 60 * 1000);
        }
        return result;
    }

    @Post('change-password/request')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Verify the current password and email an OTP before changing it' })
    @ApiBody({ type: ChangePasswordRequestDto })
    async requestPasswordChange(
        @Req() req: AuthenticatedRequest,
        @Body() body: ChangePasswordRequestDto,
    ): Promise<{ token: string }> {
        const user = req.user as Auth;
        if (!user) throw new UnauthorizedException('User not found');
        return this.changeService.requestPasswordChange(user, body.currentPassword, body.locale);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Verify the OTP and replace the local password' })
    @ApiBody({ type: ChangePasswordConfirmDto })
    async confirmPasswordChange(
        @Req() req: AuthenticatedRequest,
        @Body() body: ChangePasswordConfirmDto,
    ): Promise<{ message: string }> {
        const user = req.user as Auth;
        if (!user) throw new UnauthorizedException('User not found');
        await this.changeService.confirmPasswordChange(
            user,
            body.token,
            body.code,
            body.currentPassword ?? '',
            body.newPassword,
        );
        return { message: 'Password changed successfully' };
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Verify reset OTP and set a new password, signing the user in' })
    @ApiBody({ type: ResetPasswordDto })
    async resetPassword(
        @Body() body: ResetPasswordDto,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<SigninResultDto> {
        const result = await this.registrationService.resetPassword(
            body.token,
            body.code,
            body.newPassword,
        );
        if (result.access_token) {
            this.sessionService.setCookie(res, result.access_token, 7 * 24 * 60 * 60 * 1000);
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
    @Redirect()
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Google OAuth callback handler' })
    async googleAuthCallback(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<{ url: string }> {
        return this.accountService.handleOAuthCallback(AuthProvider.GOOGLE, req, res);
    }

    @Get('discord')
    @UseGuards(DiscordAuthGuard)
    @ApiOperation({ summary: 'Initiate Discord OAuth flow' })
    async discordAuth() {
        this.logger.log('Discord OAuth initiated');
    }

    @Get('discord/callback')
    @Redirect()
    @UseGuards(DiscordAuthGuard)
    @ApiOperation({ summary: 'Discord OAuth callback handler' })
    async discordAuthCallback(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<{ url: string }> {
        return this.accountService.handleOAuthCallback(AuthProvider.DISCORD, req, res);
    }

    // ==================== LINE ====================
    @Get('line')
    @UseGuards(LineAuthGuard)
    @ApiOperation({ summary: 'Initiate LINE OAuth flow' })
    async lineAuth() {
        this.logger.log('LINE OAuth initiated');
    }

    @Get('line/callback')
    @Redirect()
    @UseGuards(LineAuthGuard)
    @ApiOperation({ summary: 'LINE OAuth callback handler' })
    async lineAuthCallback(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<{ url: string }> {
        return this.accountService.handleOAuthCallback(AuthProvider.LINE, req, res);
    }

    // ==================== X (Twitter) ====================
    @Get('x')
    @UseGuards(XAuthGuard)
    @ApiOperation({ summary: 'Initiate X OAuth flow' })
    async xAuth() {
        this.logger.log('X OAuth initiated');
    }

    @Get('x/callback')
    @Redirect()
    @UseGuards(XAuthGuard)
    @ApiOperation({ summary: 'X OAuth callback handler' })
    async xAuthCallback(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: FastifyReply,
    ): Promise<{ url: string }> {
        return this.accountService.handleOAuthCallback(AuthProvider.X, req, res);
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
        this.sessionService.clearCookie(res);
        return { message: 'Sign out successful' };
    }
}
