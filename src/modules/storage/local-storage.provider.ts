import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { FileInput, StorageProvider, UploadedFile } from './storage.interface'

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir = join(process.cwd(), 'uploads')
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = process.env.API_URL || 'http://localhost:3001'

    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async upload(file: FileInput): Promise<UploadedFile> {
    const id = randomUUID()
    const ext = file.originalname.split('.').pop() || ''
    const filename = `${id}.${ext}`
    const filepath = join(this.uploadDir, filename)

    writeFileSync(filepath, new Uint8Array(file.buffer))

    return {
      id,
      filename,
      size: file.size,
      mimeType: file.mimetype,
      url: this.getUrl(filename),
      originalName: file.originalname
    }
  }

  async delete(filename: string): Promise<void> {
    const filepath = join(this.uploadDir, filename)

    if (existsSync(filepath)) {
      unlinkSync(filepath)
    }
  }

  getUrl(filename: string): string {
    return `${this.baseUrl}/uploads/${filename}`
  }
}
