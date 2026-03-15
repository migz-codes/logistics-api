import {
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Role } from 'generated/prisma/client'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { AuthGuard } from '../auth/auth.guard'
import { IAuthenticatedRequest } from '../auth/dtos'
import { StorageService } from '../storage'
import { WarehousesService } from './warehouses.service'

interface MulterFile {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

@Controller('warehouses')
export class WarehousesController {
  constructor(
    private readonly warehousesService: WarehousesService,
    private readonly storageService: StorageService,
    private readonly prismaService: PrismaService
  ) {}

  @Post(':id/images')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: MulterFile[],
    @Req() req: IAuthenticatedRequest
  ) {
    try {
      const userId = req.user.id

      // Get user role and companies
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          role: true,
          companies: { select: { id: true } },
          member_of: { select: { id: true } }
        }
      })

      if (!user) {
        throw new NotFoundException('User not found')
      }

      // ADMIN bypasses access check
      if (user.role !== Role.ADMIN) {
        // Get warehouse to check company
        const warehouse = await this.prismaService.warehouse.findUnique({
          where: { id },
          select: { company_id: true }
        })

        if (!warehouse) {
          throw new NotFoundException('Warehouse not found')
        }

        const ownedCompanyIds = user.companies.map((c) => c.id)
        const memberCompanyIds = user.member_of.map((c) => c.id)
        const allCompanyIds = [...new Set([...ownedCompanyIds, ...memberCompanyIds])]

        if (!allCompanyIds.includes(warehouse.company_id)) {
          throw new ForbiddenException('You do not have access to this warehouse')
        }
      }

      const uploadedUrls: string[] = []

      for (const file of files) {
        const uploaded = await this.storageService.upload({
          size: file.size,
          buffer: file.buffer,
          mimetype: file.mimetype,
          originalname: file.originalname
        })
        uploadedUrls.push(uploaded.url)
      }

      const warehouse = await this.warehousesService.addImages(id, uploadedUrls)

      return { warehouse, uploadedUrls }
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    }
  }
}
