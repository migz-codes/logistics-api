import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { CreateUserInput } from '../users/dtos'
import { UserService } from '../users/users.service'
import { LoginInput } from './dtos'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(input: LoginInput) {
    const user = await this.userService.findByEmail(input.email)

    if (!user)
      return throwGraphQLError({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' })

    const isPasswordValid = await compare(input.password, user.password)

    delete user.password

    if (!isPasswordValid)
      return throwGraphQLError({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' })

    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email })

    return { access_token: token, user }
  }

  async register(input: CreateUserInput) {
    const createdUser = await this.userService.create(input)

    const { access_token, user } = await this.login({
      email: createdUser.email,
      password: input.password
    })

    return { access_token, user }
  }
}
