import { ArgumentsHost, Catch } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m'
}

const errorIcons: Record<string, string> = {
  UNAUTHORIZED: '🔒',
  FORBIDDEN: '🚫',
  USER_NOT_FOUND: '👤',
  NOT_FOUND: '❓',
  BAD_REQUEST: '⚠️',
  INTERNAL_SERVER_ERROR: '💥'
}

@Catch(GraphQLError)
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: GraphQLError, _host: ArgumentsHost) {
    const code = (exception.extensions?.code as string) || 'INTERNAL_SERVER_ERROR'
    const icon = errorIcons[code] || '❌'
    const color = code === 'INTERNAL_SERVER_ERROR' ? colors.red : colors.yellow

    console.log(
      `${icon} ${color}${exception.message}${colors.reset} ${colors.dim}[${code}]${colors.reset}`
    )

    return exception
  }
}
