import { Module } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { WarehousesResolver } from './warehouses.resolver'
import { WarehousesService } from './warehouses.service'

@Module({
  imports: [AuthModule],
  providers: [WarehousesResolver, WarehousesService, PrismaService]
})
export class WarehousesModule {}
