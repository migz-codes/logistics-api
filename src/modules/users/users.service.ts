import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { CreateUserInput } from './dtos/create-user'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10)

    return this.prismaService.user.create({
      data: { name: input.name, email: input.email, password: hashedPassword }
    })
  }
}
