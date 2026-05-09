import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { SeedService } from './seed/seed.service';
import { ShopOwnersModule } from './modules/shop-owners/shop-owners.module';
import { ShopsModule } from './modules/shops/shops.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    ShopOwnersModule,
    ShopsModule
  ],
  providers: [SeedService]
})
export class AppModule {}
