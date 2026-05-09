import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ShopOwnersService } from './shop-owners.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateOwnersDto } from './dto/create-shop-owners.dto';
import { UpdateOwnersDto } from './dto/update-shop-owners.dto';

@Controller('shop-owners')
@UseGuards(JwtAuthGuard)
export class ShopOwnersController {
  constructor(private readonly shopOwnersService: ShopOwnersService) {}

  @Get()
  async findAll(){
    return this.shopOwnersService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string){
    return this.shopOwnersService.findById(id)
  }

  @Post()
  async create(@Body() dto: CreateOwnersDto){
    return this.shopOwnersService.create(dto)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOwnersDto){
    return this.shopOwnersService.update(id, dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string){
    return this.shopOwnersService.delete(id)
  }
}
