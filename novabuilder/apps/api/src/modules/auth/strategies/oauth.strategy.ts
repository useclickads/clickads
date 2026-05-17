import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(GoogleStrategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return { profile, accessToken };
  }
}
