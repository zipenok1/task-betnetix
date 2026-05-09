import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { comparePassword } from '../../common/utils/password.utils';
import { UpdateStatusDto } from './dto/update-status.dto';
import { HeartbeatDto } from './dto/heartbeat.dto';

@Injectable()
export class TerminalsService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.terminal.findMany({
            select: {
                id: true,
                mac: true,
                status: true,
                lastHeartbeat: true,
                shop: {
                    select: {
                        id: true,
                        name: true,
                        login: true,
                    }
                }
            }
        })
    }

    async findById(id: string) {
        const terminal = await this.prisma.terminal.findUnique({
            where: { id },
            include: {
                shop: {
                    select: {
                        id: true,
                        name: true,
                        login: true,
                        address: true,
                    }
                }
            }
        })

        if (!terminal) throw new NotFoundException('терминал не найден')
        return terminal
    }

    async updateStatus(id: string, dto: UpdateStatusDto) {
        const {status} = dto

        await this.findById(id)

        return this.prisma.terminal.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                mac: true,
                status: true,
                updatedAt: true,
            }
        })
    }

    async heartbeat(dto: HeartbeatDto) {
        const {mac, shopLogin, shopPassword} = dto
        
        const shop = await this.prisma.shop.findUnique({
            where: { login: shopLogin },
            select: { id: true, password: true }
        })
        if (!shop) {
            throw new UnauthorizedException('неверный логин или пароль')
        }

        const isValid = await comparePassword(shopPassword, shop.password)
        if (!isValid) {
            throw new UnauthorizedException('неверный логин или пароль магазина')
        }

        const terminal = await this.prisma.terminal.findUnique({
            where: { mac }
        })

        if (!terminal) throw new NotFoundException('терминал с таким MAC не найден')

        return this.prisma.terminal.update({
            where: { mac },
            data: {
                status: 'active',
                lastHeartbeat: new Date()
            },
            select: {
                id: true,
                mac: true,
                status: true,
                lastHeartbeat: true,
            }
        })
    }
}