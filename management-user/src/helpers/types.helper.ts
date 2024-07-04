import { JWT } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authenticate: any
  }
}

export type UserPayload = {
  id: string
  email: string
  name: string
}

export interface JwtPayload {
  aud: string
  exp: number
  iat: number
  iss: string
  sub: string
  email: string
  phone: string
  app_metadata: AppMetadata
  user_metadata: UserMetadata
}

interface AppMetadata {
  provider: string
  providers: string[]
}

interface UserMetadata {
  email: string
  email_verified: boolean
  name: string
  phone_verified: boolean
  sub: string
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    result: JwtPayload
    user: UserPayload
  }
}
