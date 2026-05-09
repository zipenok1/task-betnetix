import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../common/utils/password.utils';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try{
      const root = await this.prisma.admin.findFirst({
        where: { role: 'root' }
      })

      if (!root) {
        const rootPassword = process.env.ROOT_PASSWORD
        if(!rootPassword) throw new Error('ROOT_PASSWORD не задан')

        const hashedPassword = await hashPassword(rootPassword)
        
        await this.prisma.admin.create({
          data: {
            name: 'Root',
            email: 'root@example.com',
            password: hashedPassword,
            role: 'root'
          }
        })
        
        console.log('root создан')
      } else{
        console.log('root существует')
      }
    } catch(e: any){
        if (e.code === 'P2021') {
          console.warn('Seed skipped: table does not exist yet');
          return;
        }
        console.error('Seed error:', e);
      }
  }
}