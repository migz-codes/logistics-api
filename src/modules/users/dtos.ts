import { Field, InputType, OmitType } from '@nestjs/graphql'
import { User } from './user.entity'

@InputType()
export class CreateUserInput extends OmitType(User, ['id', 'created_at', 'updated_at']) {
  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}
