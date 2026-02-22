import { Module } from '@nestjs/common'
import { PrismaService } from '../lib/prisma/prisma.service'
import { WarehousesResolver } from './warehouses.resolver'
import { WarehousesService } from './warehouses.service'

@Module({
  providers: [WarehousesResolver, WarehousesService, PrismaService]
})
export class WarehousesModule {}
