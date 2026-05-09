import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TerminalsService } from './terminals.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('terminals')
export class TerminalsController {
    constructor(private readonly terminalsService: TerminalsService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
      return this.terminalsService.findAll()
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findById(@Param('id') id: string) {
      return this.terminalsService.findById(id)
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
        return this.terminalsService.updateStatus(id, dto)
    }

    @Post('alive')
    async heartbeat(@Body() dto: HeartbeatDto) {
      return this.terminalsService.heartbeat(dto)
    }
}