import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { CreateUserInput } from './dtos'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.prismaService.user.create({
      data: { name: input.name, email: input.email, password: hashedPassword }
    })

    delete user.password

    return user
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (!user) return throwGraphQLError({ message: 'User not found', code: 'USER_NOT_FOUND' })

    return user
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } })

    if (!user) return throwGraphQLError({ message: 'User not found', code: 'USER_NOT_FOUND' })

    delete user.password

    return user
  }
}
