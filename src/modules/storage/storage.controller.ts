import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '../auth/auth.guard'
import { StorageService } from './storage.service'

interface MulterFile {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

@Controller('upload')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile) {
    const uploaded = await this.storageService.upload({
      size: file.size,
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname
    })

    return uploaded
  }
}
