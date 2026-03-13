import { Module } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'

import { RolesGuard } from './roles.guard'

@Module({
  providers: [RolesGuard, PrismaService],
  exports: [RolesGuard]
})
export class RolesModule {}
