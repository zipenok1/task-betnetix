import { Controller } from '@nestjs/common';
import { ShopOwnersService } from './shop-owners.service';

@Controller('shop-owners')
export class ShopOwnersController {
  constructor(private readonly shopOwnersService: ShopOwnersService) {}
}
