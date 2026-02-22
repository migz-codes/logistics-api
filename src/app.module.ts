import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphqlModule } from './lib/graphql/graphql.module'
import { PrismaModule } from './lib/prisma/prisma.module'
import { PrismaService } from './lib/prisma/prisma.service'
import { WarehousesModule } from './warehouses/warehouses.module'

@Module({
  imports: [
    PrismaModule,
    GraphqlModule,
    WarehousesModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
