import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: any) => req?.cookies?.refreshToken,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET || 'change-me-refresh',
      passReqToCallback: true
    } as any);
  }

  async validate(req: any, payload: any) {
    return { userId: payload.sub };
  }
}
