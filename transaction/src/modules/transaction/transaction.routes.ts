import { FastifyInstance } from 'fastify'
import TransactionControllers from './transaction.controllers'
import { $ref } from './transaction.schema'
export default async function route(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.check_trx],
      schema: {
        body: $ref("requestPaymentSchema"),
        tags: ["Transaction"],
        headers: {
          Authorization: {
            type: "string"
          }
        },
        response: {
          201: $ref("responseMidransSchema")
        }
      }
    },
    TransactionControllers.createTransaction,
  )

  server.get(
    '/history',
    {
      preHandler: [server.authenticate],
      schema: {
        querystring: {
          action: { type: 'string', description: "TOPUP/SEND/WITHDRAW",  },
          page: { type: 'number' },
          size: { type: 'number' },
          status: { type: 'string' },
          reff_id: { type: 'string' }
        },
        tags: ["Transaction"],
        headers: {
          Authorization: {
            type: "string"
          }
        },
        response: {
          200: $ref("findAllDataResponseSchema")
        }
      }
    },
    TransactionControllers.getHistoryTransaction,
  )
}
