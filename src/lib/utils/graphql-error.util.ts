import { GraphQLError } from 'graphql'

export function throwGraphQLError(params: {
  message: string
  code: string
  error?: any
  context?: Record<string, any>
}): never {
  throw new GraphQLError(params.message, {
    extensions: {
      code: params.code,
      message: params.message,
      originalError: params.error?.message,
      timestamp: new Date().toISOString(),
      ...params.context
    }
  })
}
