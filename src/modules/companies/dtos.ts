import { Field, InputType, Int } from '@nestjs/graphql'

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
