import { Module } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { RolesModule } from '../roles/roles.module'
import { StorageModule } from '../storage'
import { WarehouseAccessGuard } from './guards/warehouse-access.guard'
import { WarehousesController } from './warehouses.controller'
import { WarehousesResolver } from './warehouses.resolver'
import { WarehousesService } from './warehouses.service'

@Module({
  imports: [AuthModule, StorageModule, RolesModule],
  controllers: [WarehousesController],
  providers: [WarehousesResolver, WarehousesService, WarehouseAccessGuard, PrismaService]
})
export class WarehousesModule {}
