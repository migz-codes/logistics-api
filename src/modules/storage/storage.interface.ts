export interface FileInput {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

export interface UploadedFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
}

export interface StorageProvider {
  upload(file: FileInput): Promise<UploadedFile>
  delete(filename: string): Promise<void>
  getUrl(filename: string): string
}

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER'
