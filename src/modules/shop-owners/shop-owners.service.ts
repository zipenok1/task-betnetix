import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOwnersDto } from './dto/create-shop-owners.dto';
import { UpdateOwnersDto } from './dto/update-shop-owners.dto';

@Injectable()
export class ShopOwnersService {
    constructor(private prisma: PrismaService){}

    async findAll(){
        return await this.prisma.shopOwner.findMany({
            select: {
                id: true,
                name: true,
                phone: true
            }
        })
    }

    async findById(id: string){
        const owner = await this.prisma.shopOwner.findUnique({
            where: {id: id}
        }) 
        if(!owner) throw new NotFoundException('владелец не найден')
        
        return owner
    }

    async create(dto: CreateOwnersDto){
        const {name, phone, email} = dto

        const existingPhone = await this.prisma.shopOwner.findUnique({where: {phone}})
        if(existingPhone) throw new ConflictException('владелец с таким phone уже существует')
        
        if(email) {
            const existingEmail = await this.prisma.shopOwner.findUnique({where: {email}})
            if(existingEmail) throw new ConflictException(
                'владелец с таким email уже существует'
            )
        }

        await this.prisma.shopOwner.create({
            data: {
                name,
                phone,
                email
            }
        })

        return {message: `владелец: ${dto.name} создан`}
    }

    async update(id: string, dto: UpdateOwnersDto){
        const {name, phone, email} = dto

        await this.findById(id)

        if (phone) {
            const existingPhone = await this.prisma.shopOwner.findUnique({
                where: {phone}
            })
            if (existingPhone && existingPhone.id !== id) {
                throw new ConflictException('телефон уже используется')
            }
        }

        if (email) {
            const existingEmail = await this.prisma.shopOwner.findUnique({
                where: { email }
            })
            if (existingEmail && existingEmail.id !== id) {
                throw new ConflictException('email уже используется')
            }
        }

        await this.prisma.shopOwner.update({
            where: {id},
            data: {
                name,
                phone,
                email
            }
        })

        return {message: 'данные успешно изменены'}
    }

    async delete(id: string){
        await this.findById(id)
        await this.prisma.shopOwner.delete({where: {id}})
        return {message: 'владелец удален'} 
    }
}
 