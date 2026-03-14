import { join } from 'node:path'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { LoggerInterceptor } from './interceptors/logger.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    credentials: true,
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  })

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' })

  app.useGlobalInterceptors(new LoggerInterceptor())

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0')
}

bootstrap()
