import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { CreateUserInput } from '../users/dtos'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { AuthResponse, IAuthenticatedRequest, LoginInput, LogoutResponse } from './dtos'

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

  @Mutation(() => AuthResponse)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken)
  }

  @Mutation(() => LogoutResponse)
  async logout(@Args('refreshToken') refreshToken: string) {
    const success = await this.authService.logout(refreshToken)
    return { success }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => LogoutResponse)
  async logoutAll(@Context('req') req: IAuthenticatedRequest) {
    const success = await this.authService.logoutAll(req.user.id)
    return { success }
  }
}
