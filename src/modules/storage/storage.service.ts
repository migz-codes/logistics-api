import { Inject, Injectable } from '@nestjs/common'
import type { FileInput, StorageProvider, UploadedFile } from './storage.interface'
import { STORAGE_PROVIDER } from './storage.interface'

@Injectable()
export class StorageService {
  constructor(@Inject(STORAGE_PROVIDER) private readonly provider: StorageProvider) {}

  async upload(file: FileInput): Promise<UploadedFile> {
    return this.provider.upload(file)
  }

  async delete(filename: string): Promise<void> {
    return this.provider.delete(filename)
  }

  getUrl(filename: string): string {
    return this.provider.getUrl(filename)
  }
}
