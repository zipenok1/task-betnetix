import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { hashPassword } from '../../common/utils/password.utils';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return await this.prisma.admin.findMany({
            select:{
                id: true,
                name: true,
                email: true,
                role: true
            }
        })
    }

    async create(dto: CreateAdminDto) {
        const {name, email, password} = dto

        const menager = await this.prisma.admin.findUnique({ where: { email } })
        if(menager) throw new ConflictException('пользователь с таким email уже существует')

        const hashedPassword = await hashPassword(password)

        await this.prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'manager'
            }
        })

        return { message: `menager ${name} создан` }
    }

    async change(id: string, dto: UpdateAdminDto) {
        const {password} = dto

        const menager = await this.prisma.admin.findUnique({where: {id: id}})
        if(!menager) throw new NotFoundException('menager не найден')

        if(menager.role === 'root') throw new ForbiddenException('нельзя изменить root')

        const hashedPassword = await hashPassword(password)

        await this.prisma.admin.update({
            where: {id: id},
            data: {password: hashedPassword}
        })

        return { message: 'пароль успешно изменен' }
    }

    async delete(id: string) {
        const menager = await this.prisma.admin.findUnique({where: {id: id}})
        if(!menager) throw new NotFoundException('menager не найден')
        
        if(menager.role === 'root') throw new ForbiddenException('нельзя удалить root')
        
        await this.prisma.admin.delete({where: {id: id}})

        return {message: `menager: ${menager.name} с email ${menager.email} удален`}
    }
}
