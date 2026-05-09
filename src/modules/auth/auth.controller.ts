import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RefreshDto } from './dto/refresh.dto';
import type { ExpressRequest } from '../../common/interfaces/express-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto){
    return this.authService.login(dto)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: ExpressRequest){
    return this.authService.logout(req.user.id, req.user.tokenId)
  }
  
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto){
    return this.authService.refresh(dto.refresh_token)
  }
}
