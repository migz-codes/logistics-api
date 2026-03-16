import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { PaginationInfo } from '@/src/common/dtos'
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
