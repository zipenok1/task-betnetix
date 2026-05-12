import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { comparePassword } from '../../common/utils/password.utils';
import { randomUUID } from 'crypto';
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}
    
    async login(dto: LoginDto) {
        const {email, password} = dto

        const admin = await this.prisma.admin.findUnique({ where: {email: email} })
        if(!admin) throw new NotFoundException('пользователь не найден')

        const isValidPassword = await comparePassword(password, admin.password)
        if(!isValidPassword) throw new UnauthorizedException('неверный пароль')

        const tokenId = randomUUID()

        await this.prisma.admin.update({
            where: {id: admin.id},
            data: {tokenId}
        })

        const accessPayload = { 
            sub: admin.id, 
            email: admin.email, 
            role: admin.role, 
            tokenId 
        }
        const accessToken = this.jwtService.sign(accessPayload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        })

        const refreshPayload = {sub: admin.id, tokenId}
        const refreshToken = this.jwtService.sign(refreshPayload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d'
        })

        return { 
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async logout(id: string, tokenId: string) {
        const admin = await this.prisma.admin.findUnique({
            where: {
                id,
                tokenId: tokenId
            }
        })
        if(!admin) throw new UnauthorizedException('сессия уже завершена')
        
        await this.prisma.admin.update({
            where: { id },
            data: { tokenId: null }
        })

        return {message: 'сессия завершена'}
    }

    async refresh(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
        })

        const admin = await this.prisma.admin.findUnique({
            where: {id: payload.sub}
        })
        if(!admin || admin.tokenId !== payload.tokenId) {
            throw new UnauthorizedException('невалидный refresh token')
        }
        
        const newTokenId = randomUUID()

        await this.prisma.admin.update({
            where: {id: admin.id},
            data: {tokenId: newTokenId}
        })

        const newAccessToken = this.jwtService.sign({
            sub: admin.id,
            email: admin.email,
            role: admin.role,
            tokenId: newTokenId,            
        }, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        })

        const newRefreshToken = this.jwtService.sign(
            { sub: admin.id, tokenId: newTokenId },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
        )

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken  
        }
    }
}
