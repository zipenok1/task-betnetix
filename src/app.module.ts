import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule
  ],
  providers: [SeedService]
})
export class AppModule {}
