import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggerInterceptor } from './interceptors/logger.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [process.env.WEB_URL, 'https://studio.apollographql.com'],
    credentials: true
  })

  app.useGlobalInterceptors(new LoggerInterceptor())

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}

bootstrap()
