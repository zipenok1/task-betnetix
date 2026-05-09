import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}
    // Для тестирования
    @Post()
    async create(@Body() dto: CreateRequestDto) {
      return this.requestsService.create(dto)
    }

    @Get()
    async findAll() {
      return this.requestsService.findAll()
    }

    @Patch(':id/approve')
    async approve(@Param('id') id: string) {
      return this.requestsService.approve(id)
    }

    @Patch(':id/reject')
    async reject(@Param('id') id: string) {
      return this.requestsService.reject(id)
    }

    @Post(':id/comment')
    async addComment(@Param('id') id: string, @Body() dto: CommentDto) {
      return this.requestsService.addComment(id, dto)
    }
}