import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphqlModule } from './graphql/graphql.module'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaService } from './prisma/prisma.service'
import { WarehousesModule } from './warehouses/warehouses.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphqlModule,
    WarehousesModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
