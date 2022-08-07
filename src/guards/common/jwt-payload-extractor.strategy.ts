import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {} from 'passport-local';

@Injectable()
export class JwtPayloadExtractorStrategy extends PassportStrategy(
  Strategy,
  'payloadExtractor',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const userId = payload.userId;
    const login = payload.login;
    if (payload) return { userId, login };
    return null;
  }
}
