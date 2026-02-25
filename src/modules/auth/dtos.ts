import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { User } from '../users/user.entity'

export interface IAuthenticatedRequest {
  user: {
    id: string
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
  access_token: string

  @Field(() => User)
  user: User
}
