import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { User as PrismaUser, Role } from 'generated/prisma/client'

registerEnumType(Role, { name: 'Role' })

@ObjectType()
export class User implements PrismaUser {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  password: string

  @Field(() => Role)
  role: Role

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date
}
