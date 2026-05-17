import { Module, Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { GoogleOAuthStrategy } from './strategies/oauth.strategy';
import { MagicLinkService } from './magiclink.service';
import { MfaService } from './mfa.service';
import { SessionService } from './session.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RbacGuard } from './guards/rbac.guard';

const authProviders: Provider[] = [
  AuthService,
  JwtStrategy,
  RefreshStrategy,
  MagicLinkService,
  MfaService,
  SessionService,
  PrismaService,
  RbacGuard
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  authProviders.push(GoogleOAuthStrategy);
}

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: authProviders,
  controllers: [AuthController],
  exports: [AuthService, PrismaService]
})
export class AuthModule {}
