import { join } from 'node:path'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'generated/schema.gql'),
      debug: false,
      formatError: (error) => {
        const { message, extensions } = error

        return {
          message,
          code: extensions?.code,
          timestamp: extensions?.timestamp
        }
      }
    })
  ]
})
export class GraphqlModule {}
