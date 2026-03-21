import { Injectable } from '@nestjs/common'
import { PaginationInput } from '@/src/common/dtos'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import {
  CompanyFiltersInput,
  CreateCompanyInput,
  PaginatedCompaniesResponse,
  UpdateCompanyInput
} from './dtos'

@Injectable()
export class CompaniesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateCompanyInput & { owner_id: string }) {
    const company = await this.prismaService.company.create({
      data: {
        name: input.name,
        logo: input.logo,
        owner_id: input.owner_id
      }
    })

    return company
  }

  async findByOwner(ownerId: string) {
    const companies = await this.prismaService.company.findMany({
      where: { owner_id: ownerId },
      orderBy: { created_at: 'desc' }
    })

    return companies
  }

  async findByOwnerPaginated(
    ownerId: string,
    pagination: PaginationInput,
    filters?: CompanyFiltersInput
  ): Promise<PaginatedCompaniesResponse> {
    const { page, take } = pagination
    const skip = (page - 1) * take

    const where: Record<string, unknown> = { owner_id: ownerId }

    if (filters?.search) {
      where.OR = [{ name: { contains: filters.search, mode: 'insensitive' } }]
    }

    const [companies, total] = await Promise.all([
      this.prismaService.company.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take
      }),
      this.prismaService.company.count({ where })
    ])

    const total_pages = Math.ceil(total / take)

    return {
      companies,
      info: {
        total,
        page,
        take,
        total_pages
      }
    }
  }

  async findAll(filters?: CompanyFiltersInput) {
    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [{ name: { contains: filters.search, mode: 'insensitive' } }]
    }

    const companies = await this.prismaService.company.findMany({
      where,
      skip: filters?.skip,
      take: filters?.take,
      orderBy: { created_at: 'desc' }
    })

    return companies
  }

  async findAllPaginated(
    pagination: PaginationInput,
    filters?: CompanyFiltersInput
  ): Promise<PaginatedCompaniesResponse> {
    const { page, take } = pagination
    const skip = (page - 1) * take

    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [{ name: { contains: filters.search, mode: 'insensitive' } }]
    }

    const [companies, total] = await Promise.all([
      this.prismaService.company.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take
      }),
      this.prismaService.company.count({ where })
    ])

    const total_pages = Math.ceil(total / take)

    return {
      companies,
      info: {
        total,
        page,
        take,
        total_pages
      }
    }
  }

  async count(filters?: CompanyFiltersInput) {
    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [{ name: { contains: filters.search, mode: 'insensitive' } }]
    }

    return this.prismaService.company.count({ where })
  }

  async findOne(id: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id },
      include: {
        owner: true,
        members: true,
        warehouses: true
      }
    })

    return company
  }

  async update(input: UpdateCompanyInput) {
    const company = await this.prismaService.company.update({
      where: { id: input.id },
      data: {
        name: input.name,
        logo: input.logo
      }
    })

    return company
  }

  async remove(id: string) {
    const company = await this.prismaService.company.delete({
      where: { id }
    })

    return company
  }

  async addMember(companyId: string, userId: string) {
    const company = await this.prismaService.company.update({
      where: { id: companyId },
      data: {
        members: {
          connect: { id: userId }
        }
      },
      include: {
        members: true
      }
    })

    return company
  }

  async removeMember(companyId: string, userId: string) {
    const company = await this.prismaService.company.update({
      where: { id: companyId },
      data: {
        members: {
          disconnect: { id: userId }
        }
      },
      include: {
        members: true
      }
    })

    return company
  }
}
