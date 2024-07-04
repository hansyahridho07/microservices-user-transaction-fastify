import Fastify from 'fastify'
import fcors from '@fastify/cors'
import fjwt from '@fastify/jwt'
import dotenv from 'dotenv'
import walletRoutes from './modules/wallet/wallet.routes'
import transactionRoutes from './modules/transaction/transaction.routes'
import Authenticate from './middlewares/Authenticate'
import { walletSchemas } from './modules/wallet/wallet.schema'
import { transactionSchema } from './modules/transaction/transaction.schema'
import CheckTransaction from './middlewares/CheckTransaction'

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
server.decorate('check_trx', CheckTransaction)

import './helpers/MessageBroker/Consumer'
async function main() {
  const zodSchema = [...walletSchemas, ...transactionSchema]
  for (const schema of zodSchema) {
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
        title: 'API DOCUMENTATION TRANSACTION',
        description: 'This API service for every path provide in service transaction',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      // host: 'localhost:4001',
      host: 'ec2-13-211-164-22.ap-southeast-2.compute.amazonaws.com:4001',
      schemes: [
        'http',
      ],
      consumes: ['application/json'],
      produces: ['application/json'],
    }
  })
  server.register(import("@fastify/swagger-ui"), {
    prefix: "/documentation"
  })
  server.register(walletRoutes, { prefix: '/api/v1/wallet' })
  server.register(transactionRoutes, { prefix: '/api/v1/transaction' })
  // server.setErrorHandler(errorHandler)

  // try {
  //   await server.listen({
  //     port: +process.env.PORT! ?? 3001,
  //     host: '0.0.0.0'
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