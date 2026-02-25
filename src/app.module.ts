import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphqlModule } from './lib/graphql/graphql.module'
import { PrismaModule } from './lib/prisma/prisma.module'
import { PrismaService } from './lib/prisma/prisma.service'
import { AuthModule } from './modules/auth/auth.module'
import { AuthResolver } from './modules/auth/auth.resolver'
import { UserModule } from './modules/users/users.module'
import { UserResolver } from './modules/users/users.resolver'
import { UserService } from './modules/users/users.service'
import { WarehousesModule } from './modules/warehouses/warehouses.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PrismaModule,
    GraphqlModule,
    WarehousesModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserResolver, UserService, AuthResolver]
})
export class AppModule {}
