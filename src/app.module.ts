import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLExceptionFilter } from './filters/graphql-exception.filter'
import { GraphqlModule } from './lib/graphql/graphql.module'
import { PrismaModule } from './lib/prisma/prisma.module'
import { PrismaService } from './lib/prisma/prisma.service'
import { AuthModule } from './modules/auth/auth.module'
import { CompaniesModule } from './modules/companies/companies.module'
import { RolesModule } from './modules/roles/roles.module'
import { StorageModule } from './modules/storage/storage.module'
import { UserModule } from './modules/users/users.module'
import { UserResolver } from './modules/users/users.resolver'
import { UserService } from './modules/users/users.service'
import { WarehousesModule } from './modules/warehouses/warehouses.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    AuthModule,
    RolesModule,
    PrismaModule,
    GraphqlModule,
    StorageModule,
    WarehousesModule,
    CompaniesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserResolver,
    UserService,
    { provide: APP_FILTER, useClass: GraphQLExceptionFilter }
  ]
})
export class AppModule {}
