import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('shops')
@UseGuards(JwtAuthGuard)  
export class ShopsController {
    constructor(private readonly shopsService: ShopsService) {}

    @Get()
    async findAll() {
      return this.shopsService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
      return this.shopsService.findById(id)
    }

    @Post()
    async create(@Body() dto: CreateShopDto) {
      return this.shopsService.create(dto)
    }

    @Patch(':id/credentials')
    async updateCredentials(@Param('id') id: string, @Body() dto: UpdateCredentialsDto) {
      return this.shopsService.updateCredentials(id, dto)
    }
}