import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { SeedService } from './seed/seed.service';
import { ShopOwnersModule } from './modules/shop-owners/shop-owners.module';
import { ShopsModule } from './modules/shops/shops.module';
import { TerminalsModule } from './modules/terminals/terminals.module';
import { RequestsModule } from './modules/requests/requests.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    ShopOwnersModule,
    ShopsModule,
    TerminalsModule,
    RequestsModule
  ],
  providers: [SeedService]
})
export class AppModule {}
