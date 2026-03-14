import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Warehouse as PrismaWarehouse, WarehouseStatus } from 'generated/prisma/client'
import { Company } from '../companies/company.entity'

registerEnumType(WarehouseStatus, {
  name: 'WarehouseStatus'
})

@ObjectType()
export class Warehouse implements PrismaWarehouse {
  @Field(() => String)
  id: string

  @Field(() => String)
  accountable_id: string

  @Field(() => String)
  company_id: string

  @Field(() => String)
  title: string

  @Field(() => String)
  description: string

  @Field(() => String)
  city: string

  @Field(() => String)
  state: string

  @Field(() => String)
  price: string

  @Field(() => Float)
  area_total: number

  @Field(() => [String])
  images: string[]

  @Field(() => WarehouseStatus)
  status: WarehouseStatus

  @Field(() => String)
  address: string

  @Field(() => String)
  zip_code: string

  @Field(() => String)
  country: string

  @Field(() => String, { nullable: true })
  address_complement: string | null

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date

  @Field(() => Company, { nullable: true })
  company?: Company
}
