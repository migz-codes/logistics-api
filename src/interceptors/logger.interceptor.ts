import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable, tap } from 'rxjs'

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
      console.log(`HTTP ${method} started: ${url}`)
      return next
        .handle()
        .pipe(tap(() => console.log(`HTTP ${method} ${url} finished in ${Date.now() - start}ms`)))
    }

    const operationName = info.operation.operation
    const fieldName = info.fieldName
    console.log(`GraphQL ${operationName} started: ${fieldName}`)

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`GraphQL ${operationName} ${fieldName} finished in ${Date.now() - start}ms`)
        )
      )
  }
}
