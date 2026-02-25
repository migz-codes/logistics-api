import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CreateUserInput } from '../users/dtos'
import { AuthService } from './auth.service'
import { AuthResponse, LoginInput } from './dtos'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    return await this.authService.login(input)
  }

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: CreateUserInput) {
    return await this.authService.register(input)
  }
}
