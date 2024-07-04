import { FastifyInstance } from 'fastify'
import TransactionControllers from './transaction.controllers'
import { $ref } from './transaction.schema'

export default async function route(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ["Transaction"],
        description: "Create transaction to service transaction",
        headers: {
          Authorization: {
            type: "string"
          }
        },
        body: $ref('requestTransactionSchema'),
        response: {
          201: $ref('GeneralResponseSchema'),
        },
      },
    },
    TransactionControllers.transaction,
  )

  server.get(
    '/history',
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ["Transaction"],
        description: "Get all data history transaction user",
        headers: {
          Authorization: {
            type: "string"
          }
        },
        querystring: {
          action: { type: 'string', description: "TOPUP/SEND/WITHDRAW"  },
          page: { type: 'number' },
          size: { type: 'number' },
          status: { type: 'string' },
          reff_id: { type: 'string' }
        },
        response: {
          200: $ref("findAllHistoryResponseSchema")
        }
      },
    },
    TransactionControllers.getHistoryTransaction,
  )

  server.post('/callback', {
    schema: {
      tags: ["External needs"],
    }
  }, TransactionControllers.callbackMidtrans)
}
