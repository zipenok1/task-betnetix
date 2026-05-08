import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import type { UserPayload } from '../../../common/interfaces/user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_SECRET
    if(!secret) throw new Error('JWT_SECRET не задан')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tokenId: payload.tokenId,
    }
  }
}