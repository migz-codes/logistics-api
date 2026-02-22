import { Field, ObjectType } from '@nestjs/graphql'
import { Warehouse as PrismaWarehouse } from '../../../generated/prisma/client'

@ObjectType()
export class Warehouse implements PrismaWarehouse {
  @Field(() => String)
  id: string

  @Field(() => String)
  title: string
}
