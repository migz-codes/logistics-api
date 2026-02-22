import { GraphQLError } from 'graphql'

export function throwGraphQLError(
  message: string,
  code: string,
  error?: any,
  context?: Record<string, any>
): never {
  throw new GraphQLError(message, {
    extensions: {
      code,
      originalError: error?.message,
      timestamp: new Date().toISOString(),
      ...context
    }
  })
}
