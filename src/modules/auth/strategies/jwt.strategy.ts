import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import type { UserPayload } from '../../../common/interfaces/user-payload.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET
    if(!secret) throw new Error('JWT_SECRET не задан')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    const admin = await this.prisma.admin.findUnique({
      where: {id: payload.sub},
      select: {tokenId: true}
    })

    if(!admin || admin.tokenId !== payload.tokenId){
      throw new UnauthorizedException('сессия устарела, войдите заново')
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tokenId: payload.tokenId,
    }
  }
}