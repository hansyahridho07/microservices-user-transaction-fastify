import { FastifyReply, FastifyRequest } from 'fastify'
import { RequestCreateWalletRabbitMQ, RequestGetWallet } from './wallet.schema'
import WalletServices from './wallet.services'

class WalletController {
  async createWallet(payload: RequestCreateWalletRabbitMQ): Promise<void> {
    await WalletServices.createWallet(payload)
  }

  async getWallet(request: FastifyRequest, reply: FastifyReply) {
    const jwt = request.user
    try {
      const output = await WalletServices.getWallet(jwt)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }
}

export default new WalletController()
