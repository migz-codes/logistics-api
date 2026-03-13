import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql'
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
export class CreateCompanyInput extends OmitType(Company, ['id', 'created_at', 'updated_at']) {
  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  logo: string

  @Field(() => String)
  owner_id: string
}

@InputType()
export class UpdateCompanyInput extends PartialType(Company) {
  @Field(() => String)
  id: string
}
