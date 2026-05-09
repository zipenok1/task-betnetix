import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { comparePassword, hashPassword } from '../../common/utils/password.utils';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService){}

    async changePassword(id, dto: ChangePasswordDto){
        const {newPassword, oldPassword} = dto

        const admin = await this.prisma.admin.findUnique({
            where: {id},
            select: {password: true}
        })
        if(!admin) throw new UnauthorizedException('профиль не найден')
        
        const isValid = await comparePassword(oldPassword, admin.password)
        if(!isValid) throw new UnauthorizedException('текущий пароль - неверный')

        const hashedPassword = await hashPassword(newPassword)

        await this.prisma.admin.update({
            where: { id },
            data: { password: hashedPassword }
        })

        return {message: 'пароль успешно изменен'}
    }
}
