import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from './guards/rbac.guard';
import { Permissions } from './decorators/permissions.decorator';
import { EmailService } from '../email/email.service';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly email: EmailService,
  ) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string; name?: string }) {
    if (!body.email || !body.password || body.password.length < 8) {
      return { error: 'Email and password (min 8 chars) are required.' };
    }
    const result = await this.authService.signupWithEmail(body.email, body.password, body.name);
    if (!result) return { error: 'Account with this email already exists.' };

    this.email.sendWelcome(body.email, { name: body.name || body.email }).catch(() => {});

    return { accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.loginWithEmail(body.email, body.password);
    if (!result) return { error: 'Invalid credentials' };
    return { accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user };
  }

  @Post('magic-link')
  async requestMagicLink(@Body() body: { email: string }) {
    const token = await this.authService.requestMagicLink(body.email);
    const link = `${APP_URL}/auth/magic-link/verify?token=${token}`;

    this.email.sendMagicLink(body.email, { name: body.email, link }).catch(() => {});

    return { ok: true, message: 'Magic link sent to your email.' };
  }

  @Post('magic-link/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMagicLink(@Body() body: { token: string }) {
    const result = await this.authService.verifyMagicLink(body.token);
    if (!result) return { error: 'Invalid or expired magic link token' };
    return { accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    const rotated = await this.authService.rotateRefreshToken(body.refreshToken);
    if (!rotated) return { error: 'Invalid refresh token' };
    const accessToken = this.authService.signAccessToken(rotated.user);
    return { accessToken, refreshToken: rotated.refreshToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { refreshToken: string }) {
    await this.authService.logout(body.refreshToken);
    return { ok: true };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const token = await this.authService.requestPasswordReset(body.email);
    if (!token) return { ok: true, message: 'If this email exists, a reset link has been sent.' };

    const link = `${APP_URL}/auth/reset-password?token=${token}`;
    this.email.sendPasswordReset(body.email, { name: body.email, link }).catch(() => {});

    return { ok: true, message: 'If this email exists, a reset link has been sent.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; password: string }) {
    if (!body.password || body.password.length < 8) {
      return { error: 'Password must be at least 8 characters.' };
    }
    const result = await this.authService.resetPassword(body.token, body.password);
    if (!result) return { error: 'Invalid or expired reset token.' };
    return { ok: true, message: 'Password has been reset successfully.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Permissions('ADMIN')
  @Get('admin-check')
  async adminCheck(@Req() req: any) {
    return { ok: true, user: req.user, roles: req.userRoles || [] };
  }
}
