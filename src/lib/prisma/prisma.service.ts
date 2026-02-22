import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '../../../generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const accelerateUrl =
      process.env.DATABASE_URL ||
      'prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19DSVpwSlNIMXpVWmxaNE45ZDZPTHkiLCJhcGlfa2V5IjoiMDFLSjJHSk1WWUtFS0FXNllCRk0wNTJSWFkiLCJ0ZW5hbnRfaWQiOiI4YTI3NWQxY2I1MTc3NGNhMzZhMGEyMDEwMjE5M2VjNzkwNDhlZmQ0OTY4MGNhYmMyOTQ0YmY0MGM2N2I3YmM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiNWZlZWEzNWMtNWQxYy00NDE0LWI2ZjEtMTJjNjdiMmQzYTFiIn0.MXTYKRJJVpCzAU7mn-9uIicdT23Ey3FR0C32E6ef4mM'

    super({
      accelerateUrl
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
