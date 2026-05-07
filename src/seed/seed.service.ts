import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../common/utils/password.utils';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const root = await this.prisma.admin.findFirst({
      where: { role: 'root' }
    })

    if (!root) {
      const hashedPassword = await hashPassword('root123')
      
      await this.prisma.admin.create({
        data: {
          name: 'Global Admin',
          email: 'root@example.com',
          password: hashedPassword,
          role: 'root'
        }
      })
      
      console.log('root создан: root@example.com');
    } else{
      console.log('root существует');
    }

  }
}