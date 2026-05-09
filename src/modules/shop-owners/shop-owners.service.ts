import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOwnersDto } from './dto/shop-owners.dto';

@Injectable()
export class ShopOwnersService {
    constructor(private prisma: PrismaService){}

    async findAll(){
        return await this.prisma.shopOwner.findMany({
            select: {
                id: true,
                name: true
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
        
        return await this.prisma.shopOwner.create({
            data: dto
        })
        
    }
}
 