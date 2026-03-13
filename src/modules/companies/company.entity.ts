import { Field, ObjectType } from '@nestjs/graphql'
import { Company as PrismaCompany } from 'generated/prisma/client'

@ObjectType()
export class Company implements PrismaCompany {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  logo: string

  @Field(() => String)
  owner_id: string

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date
}
