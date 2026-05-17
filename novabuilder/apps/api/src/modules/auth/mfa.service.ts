import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class MfaService {
  generateSecret() {
    return speakeasy.generateSecret();
  }

  verify(token: string, secret: string) {
    return speakeasy.totp.verify({ secret, encoding: 'base32', token });
  }
}
