import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { hashPassword } from '../../common/utils/password.utils';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ShopsService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.shop.findMany({
            select: {
                id: true,
                name: true,
                address: true,
                login: true,
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }

    async findById(id: string) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                address: true,
                login: true,
                legalDetails: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    }
                },
                terminals: {
                    select: {
                        id: true,
                        mac: true,
                        status: true,
                    }
                }
            }
        })

        if(!shop) throw new NotFoundException('магазин не найден')
        return shop
    }

    async create(dto: CreateShopDto) {
        const {address, login, name, ownerId, password, legalDetails} = dto
        
        const owner = await this.prisma.shopOwner.findUnique({
            where: { id: ownerId }
        })
        if(!owner) throw new NotFoundException('владелец не найден')

        const existingLogin = await this.prisma.shop.findUnique({where: {login}})
        if(existingLogin) throw new ConflictException('логин уже используется')

        const hashedPassword = await hashPassword(password)

        await this.prisma.shop.create({
            data: {
                name,
                address,
                login,
                password: hashedPassword,
                ownerId,
                legalDetails,
            }
        })

        return {message: `магазин ${name} создан`}
    }

    async updateCredentials(id: string, dto: UpdateCredentialsDto) {
        const {login, password} = dto

        const shop = await this.prisma.shop.findUnique({
            where: { id },
            select: { id: true, login: true }
        })
        if(!shop) throw new NotFoundException('магазин не найден')

        const data: Prisma.ShopUpdateInput = {}

        if (login) {
            const existingLogin = await this.prisma.shop.findUnique({ where: {login}})
            if (existingLogin && existingLogin.id !== id) {
                throw new ConflictException('логин уже используется')
            }
            data.login = login
        }

        if (password) {
            data.password = await hashPassword(password)
        }

        await this.prisma.shop.update({
            where: {id},
            data
        })

        return {message: 'учетные данные обновлены'}
    }
}