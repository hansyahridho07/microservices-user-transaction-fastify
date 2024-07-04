import { FastifyReply, FastifyRequest } from 'fastify'
import { RequestHistory, RequestTransactionSchema } from './transaction.schema'
import TransactionServices from './transaction.services'

class TransactionController {
  async createTransaction(
    request: FastifyRequest<{
      Body: RequestTransactionSchema
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body
    const jwt = request.user
    try {
      const output = await TransactionServices.createTransaction(body, jwt)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  async getHistoryTransaction(request: FastifyRequest<{
    Querystring: RequestHistory
  }>, reply: FastifyReply) {
    const query = request.query
    const jwt = request.user
    try {
      const output = await TransactionServices.getHistoryTransaction(query, jwt)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  async callbackMidtrans(payload:any) {
    const result = await TransactionServices.callbackMidtrans(payload)
    console.log(`Callback transaction is: ${result}`)
  }
}

export default new TransactionController()
