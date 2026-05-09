import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';


@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('root')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
  @Get()
  @Roles('root', 'manager')
  async findAll(){
    return this.adminService.findAll()
  }

  @Post()
  async create(@Body() dto: CreateAdminDto){
    return this.adminService.create(dto)
  }

  @Patch(':id/password')
  async change(@Param('id') id: string, @Body() dto: UpdateAdminDto){
    return this.adminService.change(id, dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string){
    return this.adminService.delete(id)
  }
}
