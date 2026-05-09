import { Body, Controller, Patch, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { ExpressRequest } from '../../common/interfaces/express-request.interface';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Patch('password')
    async changePassword(@Req() req: ExpressRequest, @Body() dto: ChangePasswordDto) {
      return this.profileService.changePassword(req.user.id, dto)
    }
}