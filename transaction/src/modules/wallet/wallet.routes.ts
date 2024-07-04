import { FastifyInstance } from 'fastify'
import WalletControllers from './wallet.controllers'
import { $ref } from './wallet.schema'

export default async function routes(route: FastifyInstance) {
  route.get(
    '/',
    {
      preHandler: [route.authenticate],
      schema: {
        tags: ["Wallet"],
        headers: {
          Authorization: {
            type: "string"
          }
        },
        response: {
          200: $ref('responseGetWallet'),
        },
      },
    },
    WalletControllers.getWallet,
  )
}
