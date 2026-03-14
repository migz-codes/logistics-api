import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { LocalStorageProvider } from './local-storage.provider'
import { StorageController } from './storage.controller'
import { STORAGE_PROVIDER } from './storage.interface'
import { StorageService } from './storage.service'

@Module({
  imports: [AuthModule],
  controllers: [StorageController],
  providers: [StorageService, { provide: STORAGE_PROVIDER, useClass: LocalStorageProvider }],
  exports: [StorageService]
})
export class StorageModule {}
