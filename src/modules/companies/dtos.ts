import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Company } from './company.entity'

@InputType()
export class CompanyFiltersInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Int, { nullable: true })
  skip?: number

  @Field(() => Int, { nullable: true })
  take?: number
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number

  @Field(() => Int, { defaultValue: 10 })
  take: number
}

@ObjectType()
export class PaginationInfo {
  @Field(() => Int)
  total: number

  @Field(() => Int)
  page: number

  @Field(() => Int)
  take: number

  @Field(() => Int)
  total_pages: number
}

@ObjectType()
export class PaginatedCompaniesResponse {
  @Field(() => [Company])
  companies: Company[]

  @Field(() => PaginationInfo)
  info: PaginationInfo
}

@InputType()
export class CreateCompanyInput {
  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  logo?: string
}

@InputType()
export class UpdateCompanyInput {
  @Field(() => String)
  id: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  logo?: string
}
