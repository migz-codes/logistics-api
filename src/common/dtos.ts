import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

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
