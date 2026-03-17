import { Injectable } from '@nestjs/common'
import { PaginationInput } from '@/src/common/dtos'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import {
  CreateWarehouseInput,
  PaginatedWarehousesResponse,
  UpdateWarehouseInput,
  WarehouseFiltersInput
} from './dtos'

@Injectable()
export class WarehousesService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateCompanyAccess(userId: string, companyId: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        companies: { where: { id: companyId }, select: { id: true } },
        member_of: { where: { id: companyId }, select: { id: true } }
      }
    })

    if (!user) return false

    const hasAccess = user.companies.length > 0 || user.member_of.length > 0
    return hasAccess
  }

  async validateWarehouseAccess(userId: string, warehouseId: string): Promise<boolean> {
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: { id: warehouseId },
      select: { company_id: true }
    })

    if (!warehouse) return false

    return this.validateCompanyAccess(userId, warehouse.company_id)
  }

  async findByUserCompanies(userId: string, filters?: WarehouseFiltersInput) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        companies: { select: { id: true } },
        member_of: { select: { id: true } }
      }
    })

    if (!user) return []

    const ownedCompanyIds = user.companies.map((c) => c.id)
    const memberCompanyIds = user.member_of.map((c) => c.id)
    const allCompanyIds = [...new Set([...ownedCompanyIds, ...memberCompanyIds])]

    const where: Record<string, unknown> = {
      company_id: { in: allCompanyIds }
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters?.region) {
      where.state = filters.region
    }

    if (filters?.status) {
      where.status = filters.status
    }

    const warehouses = await this.prismaService.warehouse.findMany({
      where,
      skip: filters?.skip,
      take: filters?.take,
      orderBy: { created_at: 'desc' },
      include: { company: true }
    })

    return warehouses
  }

  async findByUserCompaniesPaginated(
    userId: string,
    filters?: WarehouseFiltersInput,
    pagination?: PaginationInput
  ): Promise<PaginatedWarehousesResponse> {
    const { page, take } = pagination ?? { page: 1, take: 10 }
    const skip = (page - 1) * take

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        companies: { select: { id: true } },
        member_of: { select: { id: true } }
      }
    })

    if (!user) {
      return {
        warehouses: [],
        info: {
          total: 0,
          page,
          take,
          total_pages: 0
        }
      }
    }

    const ownedCompanyIds = user.companies.map((c) => c.id)
    const memberCompanyIds = user.member_of.map((c) => c.id)
    const allCompanyIds = [...new Set([...ownedCompanyIds, ...memberCompanyIds])]

    const where: Record<string, unknown> = {
      company_id: { in: allCompanyIds }
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters?.region) {
      where.state = filters.region
    }

    if (filters?.status) {
      where.status = filters.status
    }

    const [warehouses, total] = await Promise.all([
      this.prismaService.warehouse.findMany({
        where,
        include: {
          company: true
        },
        skip,
        take,
        orderBy: { created_at: 'desc' }
      }),
      this.prismaService.warehouse.count({
        where
      })
    ])

    const total_pages = Math.ceil(total / take)

    return {
      warehouses,
      info: {
        total,
        page,
        take,
        total_pages
      }
    }
  }

  async create(input: CreateWarehouseInput) {
    const warehouse = await this.prismaService.warehouse.create({
      data: {
        title: input.title,
        price: input.price,
        area_total: input.area_total,
        description: input.description,
        images: input.images || [],
        status: input.status,
        city: input.city,
        state: input.state,
        address: input.address,
        country: input.country,
        zip_code: input.zip_code,
        address_complement: input.address_complement,
        accountable_id: input.accountable_id,
        company_id: input.company_id
      }
    })

    return warehouse
  }

  async findAll(filters?: WarehouseFiltersInput) {
    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters?.region) {
      where.state = filters.region
    }

    if (filters?.status) {
      where.status = filters.status
    }

    const warehouses = await this.prismaService.warehouse.findMany({
      where,
      include: {
        company: true
      },
      skip: filters?.skip,
      take: filters?.take,
      orderBy: { created_at: 'desc' }
    })

    return warehouses
  }

  async findAllPaginated(
    filters?: WarehouseFiltersInput,
    pagination?: PaginationInput
  ): Promise<PaginatedWarehousesResponse> {
    const { page, take } = pagination ?? { page: 1, take: 10 }
    const skip = (page - 1) * take

    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters?.region) {
      where.state = filters.region
    }

    if (filters?.status) {
      where.status = filters.status
    }

    const [warehouses, total] = await Promise.all([
      this.prismaService.warehouse.findMany({
        where,
        include: {
          company: true
        },
        skip,
        take,
        orderBy: { created_at: 'desc' }
      }),
      this.prismaService.warehouse.count({
        where
      })
    ])

    const total_pages = Math.ceil(total / take)

    return {
      warehouses,
      info: {
        total,
        page,
        take,
        total_pages
      }
    }
  }

  async count(filters?: WarehouseFiltersInput) {
    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters?.region) {
      where.state = filters.region
    }

    if (filters?.status) {
      where.status = filters.status
    }

    return this.prismaService.warehouse.count({ where })
  }

  async findOne(id: string) {
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: { id },
      include: { company: true }
    })

    return warehouse
  }

  async update(input: UpdateWarehouseInput) {
    const { id, ...data } = input
    const warehouse = await this.prismaService.warehouse.update({
      where: { id },
      data
    })

    return warehouse
  }

  async addImages(id: string, imageUrls: string[]) {
    // First get current images, then set the combined array
    // Using direct assignment due to Prisma Accelerate compatibility
    const current = await this.prismaService.warehouse.findUnique({
      where: { id },
      select: { images: true }
    })

    const currentImages = current?.images || []
    const newImages = [...currentImages, ...imageUrls]

    const warehouse = await this.prismaService.warehouse.update({
      where: { id },
      data: {
        images: newImages
      }
    })

    return warehouse
  }

  async removeImage(id: string, imageUrl: string) {
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: { id }
    })

    if (!warehouse) return null

    const updatedImages = warehouse.images.filter((img) => img !== imageUrl)

    return this.prismaService.warehouse.update({
      where: { id },
      data: { images: updatedImages }
    })
  }

  async remove(id: string) {
    const warehouse = await this.prismaService.warehouse.delete({
      where: { id }
    })

    return warehouse
  }
}
