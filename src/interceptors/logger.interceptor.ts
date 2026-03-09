import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable, tap } from 'rxjs'

const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m'
}

const icons = {
  query: '🔍',
  mutation: '⚡',
  subscription: '📡',
  http: '🌐'
}

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now()
    const gqlContext = GqlExecutionContext.create(context)
    const info = gqlContext.getInfo()

    if (!info || !info.operation) {
      const request = context.switchToHttp().getRequest()
      const method = request?.method || 'UNKNOWN'
      const url = request?.url || 'unknown'
      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - start
          console.log(
            `${icons.http} ${colors.cyan}${method}${colors.reset} ${url} ${colors.dim}${duration}ms${colors.reset}`
          )
        })
      )
    }

    const operationType = info.operation.operation
    const fieldName = info.fieldName
    const icon = icons[operationType as keyof typeof icons] || '📦'

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start
        const durationColor = duration > 500 ? colors.yellow : colors.green
        console.log(
          `${icon} ${colors.magenta}${fieldName}${colors.reset} ${durationColor}${duration}ms${colors.reset}`
        )
      })
    )
  }
}
