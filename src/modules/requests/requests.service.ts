import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class RequestsService {
    constructor(private prisma: PrismaService) {}
    // Для тестирования
    async create(dto: CreateRequestDto) {
        const {comment, mac, shopId} = dto

        const shop = await this.prisma.shop.findUnique({where: {id: shopId}})
        if (!shop) throw new NotFoundException('магазин не найден')

        const existingTerminal = await this.prisma.terminal.findUnique({where: {mac}})
        if (existingTerminal) {
            throw new ConflictException('терминал с таким MAC уже существует')
        }

        this.prisma.connectionRequest.create({
            data: {
                mac,
                shopId,
                comment,
                status: 'pending'
            }
        })

        return {message: 'терминал создан'}
    }

    async findAll() {
        return this.prisma.connectionRequest.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                mac: true,
                status: true,
                comment: true,
                createdAt: true,
                shop: {
                    select: {
                        id: true,
                        name: true,
                        login: true,
                        address: true
                    }
                }
            }
        })
    }

    async approve(id: string) {
        const request = await this.prisma.connectionRequest.findUnique({
            where: { id },
            include: { shop: true }
        })
        if (!request) throw new NotFoundException('заявка не найдена')

        if (request.status !== 'pending') {
            throw new ConflictException('заявка уже обработана')
        }

        const existingTerminal = await this.prisma.terminal.findUnique({
            where: { mac: request.mac }
        })
        if (existingTerminal) {
            throw new ConflictException('терминал с таким MAC уже существует')
        }

        await this.prisma.terminal.create({
            data: {
                mac: request.mac,
                shopId: request.shopId,
                status: 'inactive'
            }
        })

        await this.prisma.connectionRequest.update({
            where: { id },
            data: { status: 'approved' }
        })

        return {message: 'заявка одобрена, терминал создан'}
    }

    async reject(id: string) {
        const request = await this.prisma.connectionRequest.findUnique({where: {id}})
        if (!request) throw new NotFoundException('заявка не найдена')

        if (request.status !== 'pending') {
            throw new ConflictException('заявка уже обработана')
        }

        await this.prisma.connectionRequest.update({
            where: { id },
            data: { status: 'rejected' }
        })

        return {message: 'заявка отклонена'}
    }

    async addComment(id: string, dto: CommentDto) {
        const {comment} = dto

        const request = await this.prisma.connectionRequest.findUnique({where: {id}})

        if (!request) throw new NotFoundException('заявка не найдена')

        return this.prisma.connectionRequest.update({
            where: {id},
            data: {comment},
            select: {
                id: true,
                mac: true,
                status: true,
                comment: true,
                updatedAt: true
            }
        })
    }
}