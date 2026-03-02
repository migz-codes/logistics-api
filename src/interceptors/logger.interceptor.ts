import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context)
    const info = gqlContext.getInfo()

    const operationName = info.operation.operation
    const fieldName = info.fieldName

    console.log(`GraphQL ${operationName} started: ${fieldName}`)

    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        console.log(`GraphQL ${operationName} ${fieldName} finished in ${Date.now() - start}ms`)
      })
    )
  }
}
