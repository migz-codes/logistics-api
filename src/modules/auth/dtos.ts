import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { User } from '../users/user.entity'

export interface IAuthenticatedRequest {
  user: {
    id: string
    role?: string
    companyIds?: string[]
    ownedCompanyIds?: string[]
  }
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string

  @Field(() => User)
  user: User
}

@ObjectType()
export class LogoutResponse {
  @Field(() => Boolean)
  success: boolean
}
