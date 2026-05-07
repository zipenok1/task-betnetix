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

        const payload = { sub: admin.id, email: admin.email, role: admin.role, tokenId }
        const token = this.jwtService.sign(payload)

        return { access_token: token };
    }

    async logout() {}

    async refresh() {}

}
