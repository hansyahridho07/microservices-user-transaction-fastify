import Fastify from 'fastify'
import fcors from '@fastify/cors'
import fjwt from '@fastify/jwt'
import dotenv from 'dotenv'
import userRoutes from './modules/user/user.routes'
import accountRoutes from './modules/account/account.routes'
import transactionRoutes from './modules/transaction/transaction.routes'
import errorHandler from './middlewares/errorHandler'
import { userSchemas } from './modules/user/user.schemas'
import { accountSchema } from './modules/account/account.schemas'
import Authenticate from './middlewares/Authenticate'
import { transactionSchema } from './modules/transaction/transaction.schema'

dotenv.config()
const envToLogger: any = {
  development: {
    transport: {
      target: 'pino-pretty',
    },
  },
  production: true,
  test: false,
}

const server = Fastify({
  logger: true
})

server.register(fcors, {
  origin: '*',
  
})

// add jwt function to request
server.addHook('preHandler', (req, res, next) => {
  req.jwt = server.jwt
  return next()
})

// middleware for jwt
server.decorate('authenticate', Authenticate)

async function main() {
  // const zodSchema =
  for (const schema of [
    ...userSchemas,
    ...accountSchema,
    ...transactionSchema,
  ]) {
    server.addSchema(schema)
  }

  server.register(fjwt, {
    secret: process.env.SECRET_JWT ?? '',
  })
  
  server.register(import("@fastify/swagger"), {
    // openapi: {
    //   openapi: '3.0.0',
    //   info: {
    //     title: 'API DOCUMENTATION USER MANAGEMENT',
    //     description: 'This API service for every path provide in service user management',
    //     version: '1.0.0',
    //   },
    //   servers: [
    //     {
    //       url: 'http://ec2-13-211-164-22.ap-southeast-2.compute.amazonaws.com:4000',
    //       description: 'Development server'
    //     }
    //   ],
      
    // }
    swagger: {
      info: {
        title: 'API DOCUMENTATION USER MANAGEMENT',
        description: 'This API service for every path provide in service user management',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      // host: 'localhost:4000',
      host: 'ec2-13-211-164-22.ap-southeast-2.compute.amazonaws.com:4000',
      schemes: [
        'http',
      ],
      consumes: ['application/json'],
      produces: ['application/json'],
      // securityDefinitions: {
      //   ApiToken: {
      //     description: 'Authorization header token, sample: "Bearer #TOKEN#"',
      //     type: 'apiKey',
      //     name: 'Authorization',
      //     in: 'header'
      //   },
      // }
    }
  })
  server.register(import("@fastify/swagger-ui"), {
    prefix: "/documentation"
  })
  server.register(userRoutes, { prefix: '/api/v1/user' })
  server.register(accountRoutes, { prefix: '/api/v1/account' })
  server.register(transactionRoutes, { prefix: '/api/v1/transaction' })
  // server.setErrorHandler(errorHandler)

  // try {
  //   await server.listen({
  //     port: +process.env.PORT! ?? 3000,
  //     host: '0.0.0.0',
  //   })
  //   console.log(`Server run in port: ${process.env.PORT}`)
  // } catch (error) {
  //   console.error(error)
  //   process.exit(1)
  // }
}

main()

server.get('/healtcheck', async function () {
  return { status: 'OK' }
})

export default server